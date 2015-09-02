var router = require('express').Router();
var pg = require('pg');
var connect = require('../../auth');
var _ = require('lodash');

router.get('/', function(req,res) {
    var client = new pg.Client(connect);
    client.connect(function(err) {
        var data = [];
        if (err) res.send({"status":"err","message":"could not connect to db"});
        var query = client.query("select * from game where player = 1");
        query.on('row',function(row) {
            data.push(row)
        });
        query.on('end',function() {
            res.send({"status":"success","data":data})
        })
    })
});

router.post('/remove',function(req,res) {
    var client = new pg.Client(connect);
    client.connect(function(err) {
        if (err) res.send({"status":"err","message":"could not connect to db"});
        var query = client.query({
            text: "delete from game where player = 1 and week = $1",
            values: [req.body.week]
        });
        query.on('end',function() {
            res.send({"status":"success"})
        });
    })
});

router.post('/add', function(req,res) {
    var client = new pg.Client(connect);
    var stats = {};
    _.forEach(req.body,function(obj) {
        stats[obj.key] = obj.val;
    });
    client.connect(function(err) {
        if (err) res.send({"status":"err","message":"could not connect to db"});
        var query = client.query({
            text: 'INSERT into game (player,season,week,date,g,gs,passing_comp,passing_att,passing_pct,passing_yds,passing_avg,' +
            'passing_td,passing_int,passing_sck,passing_scky,passing_rate,rushing_att,rushing_yds,rushing_avg,rushing_td,fumbles,' +
            'fumbles_lost) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)',
            values: [1,2015,stats.week,stats.date,stats.g,stats.gs,stats.pass_comp,stats.pass_att,stats.pass_pct,stats.pass_yds,
                stats.pass_avg,stats.pass_td,stats.pass_int,stats.pass_sck,stats.pass_scky,stats.pass_rate,stats.rush_att,stats.rush_yds,
                stats.rush_avg,stats.rush_td,stats.fum,stats.fum_lost]
        });
        query.on('error',function(err){
            res.send({"status":"err","message":err});
            client.end();
        });
        query.on('end', function(result) {
            res.send({"status":"success"});
            client.end();
        })
    });

});

module.exports = router;