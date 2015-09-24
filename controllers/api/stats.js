var router = require('express').Router();
var pg = require('pg');
var connect = require('../../auth');
var _ = require('lodash');
var s3 = require('s3');
var fs = require('fs-extra');
var path = require('path');

var s3Client = s3.createClient({
    s3Options: require('../../s3_credentials.js')
});
var params = {
    localFile: path.resolve(__dirname,"../../data.json"),
    s3Params: require('../../deploy.js')
}

function makeAndUpload(data,res) {
    console.log('got data');
    fs.writeJSONSync(path.resolve(__dirname,'../../data.json'),data);
    console.log("wrote json");
    var x = s3Client.uploadFile(params);
    x.on("error", function(err) {
        console.log("error: " + err)
    });

    x.on("end", function() {
        console.log('uploaded');
        res.send({"status":"success"})
    })
}

function formatResult(players,games,teams) {
    var results = [];
    var Player = function(player) {
        console.log(player);
        this.id = player.id;
        this.games = [];
        this.rankings = [];
        this.name = player.name;
        this.year_drafted = player.year_drafted
        this.team = _.filter(teams,function(team) {
            return team.id == player.team_id;
        });
        this.colors = this.team[0].colors;
        this.team = this.team[0].name;
    };

    function rate(stats) {
        if (stats.passing_att != null && stats.passing_att != 0) {
            // formula from https://en.wikipedia.org/wiki/Passer_rating
            var a = (stats.passing_comp / stats.passing_att - .3) * 5;
            var b = (stats.passing_yds / stats.passing_att - 3) * .25;
            var c = (stats.passing_td / stats.passing_att) * 20;
            var d = 2.375 - (stats.passing_int / stats.passing_att * 25);
            if (a > 2.375) a = 2.375;
            if (a < 0) a = 0;
            if (b > 2.375) b = 2.375;
            if (b < 0) b = 0;
            if (c > 2.375) c = 2.375;
            if (c < 0) c = 0;
            if (d > 2.375) d = 2.375;
            if (d < 0) d = 0;
            return (a + b + c + d) / 6 * 100;
        }
    }

    _.forEach(players,function(player) {
        var cumulative = {
            passing_comp:0,
            passing_yds: 0,
            passing_td: 0,
            passing_att: 0,
            passing_int: 0
        };
        var g = _.filter(games,function(game) {
            return game.player == player.id;
        });
        player = new Player(player);
        _.forEach(_.sortBy(g,"week"),function(g) {
            player.games.push(g)
        });

        // Fill in bye weeks for other players
        if (player.id !== 1 && player.id !== 2) {
            var ALLWEEKS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
            var weeks = _.pluck(player.games,'week');
            var missingWeeks = _.xor(weeks,ALLWEEKS);

            _.forEach(missingWeeks,function(week) {
                player.games.push({"week":week,"passing_comp":0,"passing_yds":0,"passing_td":0,"passing_att":0,"passing_int":0});
            });

            player.games = _.sortBy(player.games,'week');
        }

        _.forEach(player.games, function(game) {
            var base = cumulative;
            var gp = game.passing_comp;
            if (game.passing_comp !== null) cumulative.passing_comp += game.passing_comp;
            if (game.passing_yds !== null) cumulative.passing_yds += game.passing_yds;
            if (game.passing_td !== null) cumulative.passing_td += game.passing_td;
            if (game.passing_att !== null) cumulative.passing_att += game.passing_att;
            if (game.passing_int !== null) cumulative.passing_int += game.passing_int;
            if (cumulative.passing_att != 0) {
                player.rankings.push({"week":game.week,"rating":Math.round((rate(cumulative) + 0.00001) * 100) / 100})
            } else {
                player.rankings.push({"week":game.week,"rating":null})
            }

        });
        results.push(player);
    });
    return _.sortBy(results,'id');
}


router.get('/', function(req,res) {
    var client = new pg.Client(connect);
    client.connect(function(err) {
        if (err) res.send({"status":"err","message":"Could not connect to db"});
        var players = [];
        var games = [];
        var teams = [];
        var q1 = client.query("select * from player");
        q1.on("row",function(row) {
            players.push(row)
        });
        q1.on("end",function() {
            var q2 = client.query("select * from game");
            q2.on("row",function(row) {
                games.push(row);
            });
            q2.on("end",function() {
                var q3 = client.query("select * from team");
                q3.on("row",function(row) {
                    var colors = {
                        primary: row.colors[0],
                        secondary: row.colors[1]
                    };
                    if (row.colors[3]) {
                        colors.accents = row.colors.slice(3);
                    }
                    teams.push(
                        {id:row.id,
                            name:row.name,
                            colors: JSON.stringify(colors)
                        });
                });
                q3.on("end",function() {
                    var data = formatResult(players,games,teams);
                    res.send({"status":"success","data": data});
                })
            })
        });
    });
});

router.get('/remove',function(req,res) {
    var player = Number(req.query.player);
    var week = Number(req.query.week);
    var client = new pg.Client(connect);
    client.connect(function(err) {
        if (err) res.send({"status":"err","message":"Could not connect to db"});
        var q = client.query({
            text: "delete from game where player = $1 and week = $2",
            values: [player, week]
        });
        q.on('end',function() {
            var players = [];
            var games = [];
            var teams = [];
            var q1 = client.query("select * from player");
            q1.on("row",function(row) {
                players.push(row)
            });
            q1.on("end",function() {
                var q2 = client.query("select * from game");
                q2.on("row",function(row) {
                    games.push(row);
                });
                q2.on("end",function() {
                    var q3 = client.query("select * from team");
                    q3.on("row",function(row) {
                        var colors = {
                            primary: row.colors[0],
                            secondary: row.colors[1]
                        };
                        if (row.colors[3]) {
                            colors.accents = row.colors.slice(3);
                        }
                        teams.push(
                            {id:row.id,
                                name:row.name,
                                colors: JSON.stringify(colors)
                            });
                    });
                    q3.on("end",function() {
                        var data = formatResult(players,games,teams);
                        makeAndUpload(data,res)
                    })
                })
            });
        })
    });
});

router.get('/add', function(req, res) {
    var client = new pg.Client(connect);
    var nums = ['player','week','g','gs','pass_comp','pass_att','pass_pct','pass_yds','pass_avg','pass_td','pass_int',
    'pass_sck','pass_scky','pass_rate','rush_att','rush_yds','rush_avg','rush_td','fum','fum_lost'];
    var nulls = [];
    _.forEach(req.query,function(val,key) {
        _.forEach(nums,function(k) {
            if (key == k && val == null) nulls.push(key)
        })
    });
    client.connect(function(err) {
        if (err) res.send({"status":"err","message":"could not connect to db"});
        var includes = [];
        var qString = function() {
            var string = 'insert into game (';
            _.forEach(req.query, function (val, key) {
                if (val !== null) includes.push(key);
            });
            string += includes.join(',');
            string += ") VALUES (";
            for (var i = 1; i <= includes.length; i++) {
                string += "$" + i + ',';
            }
            string = string.substring(0,string.length-1) + ")";
            return string;
        };
        var vals = function() {
            var values = [];
            var x = [];
            _.forEach(includes,function(item) {
                values.push({"key":item,"val":req.query[item]})
            });
            values.map(function(val) {
                var isNum = _.filter(nums,function(num) {
                    return val.key === num
                });
                if (_.isEmpty(isNum)) {
                    x.push(val.val)
                } else {
                    x.push(Number(val.val))
                }
            });
            return x
        };
        var x = qString();
        var q = client.query(x,vals());
        q.on("error",function(err) {
            res.send({"status":"err","message":err})
        });
        q.on("end",function() {
            var players = [];
            var games = [];
            var teams = [];
            var q1 = client.query("select * from player");
            q1.on("row",function(row) {
                players.push(row)
            });
            q1.on("end",function() {
                var q2 = client.query("select * from game");
                q2.on("row",function(row) {
                    games.push(row);
                });
                q2.on("end",function() {
                    var q3 = client.query("select * from team");
                    q3.on("row",function(row) {
                        var colors = {
                            primary: row.colors[0],
                            secondary: row.colors[1]
                        };
                        if (row.colors[3]) {
                            colors.accents = row.colors.slice(3);
                        }
                        teams.push(
                            {id:row.id,
                                name:row.name,
                                colors: JSON.stringify(colors)
                            });
                    });
                    q3.on("end",function() {
                        var data = formatResult(players,games,teams);
                        makeAndUpload(data,res)
                    })
                })
            });
        })
    })
});
module.exports = router;