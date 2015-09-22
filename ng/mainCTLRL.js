angular.module('winston')
    .controller('mainCTRL',function($scope,apiSVC,preloadObj){
        $scope._showInput = false;
        $scope._showInputM = false;
        var TableHead = function() {
            return [
                {
                    key: 'week',
                    val: null
                },
                {
                    key: 'date',
                    val: null
                },
                {
                    key: 'g',
                    val: null
                },
                {
                    key: 'gs',
                    val: null
                },
                {
                    key: 'pass_comp',
                    val: null
                },
                {
                    key: 'pass_att',
                    val: null
                },
                {
                    key: 'pass_pct',
                    val: null
                },
                {
                    key: 'pass_yds',
                    val: null
                },
                {
                    key: 'pass_avg',
                    val: null
                },
                {
                    key: 'pass_td',
                    val: null
                },
                {
                    key: 'pass_int',
                    val: null
                },
                {
                    key: 'pass_sck',
                    val: null
                },
                {
                    key: 'pass_scky',
                    val: null
                },
                {
                    key: 'pass_rate',
                    val: null
                },
                {
                    key: 'rush_att',
                    val: null
                },
                {
                    key: 'rush_yds',
                    val: null
                },
                {
                    key: 'rush_avg',
                    val: null
                },
                {
                    key: 'rush_td',
                    val: null
                },
                {
                    key: 'fum',
                    val: null
                },
                {
                    key: 'fum_lost',
                    val: null
                }
            ];
        };
        var UpdateHead = function() {
            return [
                {
                    key: 'date',
                    val: null
                },
                {
                    key: 'g',
                    val: null
                },
                {
                    key: 'gs',
                    val: null
                },
                {
                    key: 'pass_comp',
                    val: null
                },
                {
                    key: 'pass_att',
                    val: null
                },
                {
                    key: 'pass_pct',
                    val: null
                },
                {
                    key: 'pass_yds',
                    val: null
                },
                {
                    key: 'pass_avg',
                    val: null
                },
                {
                    key: 'pass_td',
                    val: null
                },
                {
                    key: 'pass_int',
                    val: null
                },
                {
                    key: 'pass_sck',
                    val: null
                },
                {
                    key: 'pass_scky',
                    val: null
                },
                {
                    key: 'pass_rate',
                    val: null
                },
                {
                    key: 'rush_att',
                    val: null
                },
                {
                    key: 'rush_yds',
                    val: null
                },
                {
                    key: 'rush_avg',
                    val: null
                },
                {
                    key: 'rush_td',
                    val: null
                },
                {
                    key: 'fum',
                    val: null
                },
                {
                    key: 'fum_lost',
                    val: null
                }
            ];
        };
        if (preloadObj.data.status == 'err') console.log(preloadObj.data.message);
        $scope.gameStats = preloadObj.data.data.winston;
        $scope.mGameStats = preloadObj.data.data.mariota;
        $scope.stats = new stats();
        $scope.Ustats = new Ustats();
        $scope.Mstats = new Ustats();
        $scope.newStats = function() {
            apiSVC.addNew($scope.Ustats).success(function(result){
                if (result.status == "success") {
                    $scope.Ustats = new Ustats();
                    $scope.toggleInput();
                    apiSVC.load().success(function(data) {
                        $scope.gameStats = data.data.winston;
                    })
                } else if (result.message.constraint == 'game_pk') {
                    alert("Error: That game already exists in the database. Delete it first if you want to update it")
                }
                else {
                    alert("Error: " + JSON.stringify(result.message.detail))
                }

            });
        };
        $scope.newStatsM = function() {
            apiSVC.addNewM($scope.Mstats).success(function(result){
                if (result.status == "success") {
                    $scope.Mstats = new Ustats();
                    $scope.toggleInputM();
                    apiSVC.load().success(function(data) {
                        $scope.mGameStats = data.data.mariota;
                    })
                } else if (result.message.constraint == 'game_pk') {
                    alert("Error: That game already exists in the database. Delete it first if you want to update it")
                }
                else {
                    alert("Error: " + JSON.stringify(result.message.detail))
                }

            });
        };
        $scope.toggleInput = function() {
            $scope._showInput = !$scope._showInput;
        };
        $scope.toggleInputM = function() {
            $scope._showInputM = !$scope._showInputM;
        };
        $scope.deleteRowM = function() {
            if ($scope.mGameStats != false) {
                apiSVC.removeM().success(function(response){
                    if (response.status == 'success') {
                        apiSVC.load().success(function(data) {
                            $scope.mGameStats = data.data.mariota;
                        })
                    }
                })
            }
        };
        $scope.deleteRow = function() {
            if ($scope.gameStats != false) {
                apiSVC.remove().success(function(response){
                    if (response.status == 'success') {
                        apiSVC.load().success(function(data) {
                            $scope.gameStats = data.data.winston;
                        })
                    }
                })
            }
        };
        $scope.maxGames = function() {
            var max = 0;
            _.forEach($scope.players, function(player) {
                if (player.games.length > max) max = player.games.length;
            });
            var weeks = [];
            for (var i = 1; i < max + 1; i++) {
                weeks.push(i)
            }
            return weeks;
        };
        $scope.players = preloadObj.data.data.players;
        $scope.games = preloadObj.data.data.games;
        _.forEach($scope.players, function(player) {
            player.games = [];
            _.forEach($scope.games, function(game) {
                if (game.player === player.id) player.games.push(game);
            });
        });
        var accumulateStats = function(player, week) {
            var games = _.take(player.games, week);
            var statsCum = {
                passing_comp:0,
                passing_yds: 0,
                passing_td: 0,
                passing_att: 0,
                passing_int: 0
            };
            _.forEach(games,function(game) {
                if (game.passing_comp != null) statsCum.passing_comp += game.passing_comp;
                if (game.passing_yds != null) statsCum.passing_yds += game.passing_yds;
                if (game.passing_td != null) statsCum.passing_td += game.passing_td;
                if (game.passing_att != null) statsCum.passing_att += game.passing_att;
                if (game.passing_int != null) statsCum.passing_int += game.passing_int;
            });
            function rate(stats) {
                if (stats.passing_att != null && stats.passing_att != 0) {
                    // formula from https://en.wikipedia.org/wiki/Passer_rating
                    var a = (statsCum.passing_comp / statsCum.passing_att - .3) * 5;
                    var b = (statsCum.passing_yds / statsCum.passing_att - 3) * .25;
                    var c = (statsCum.passing_td / statsCum.passing_att) * 20;
                    var d = 2.375 - (statsCum.passing_int / statsCum.passing_att * 25);
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
            player.rating = rate(statsCum);
            return player;
        };
        $scope.ratePlayers = function() {
            $scope.chartActive = true;
            var week = $('#week2rate').val().split(' ')[1];
            var rated = [];
            $scope.rated = [];
            apiSVC.load().success(function(playersObj) {
                $scope.players = playersObj.data.players;
                $scope.games = playersObj.data.games;
                $scope.gameStates = playersObj.data.winston;
                _.forEach($scope.players, function(player) {
                    player.games = [];
                    _.forEach($scope.games, function(game) {
                        if (game.player === player.id) player.games.push(game);
                    });
                    _.sortBy(player.games, function(game) {
                        return game.week;
                    });
                });
                _.forEach($scope.players, function(player) {
                    accumulateStats(player,week);
                    rated.push({
                        "player":player.name,
                        "rating":Math.round((player.rating + 0.00001) * 100) / 100,
                        "id":"p"+player.id
                    })
                });
                var ranked = _.sortBy(rated, function(player) {
                    return player.rating;
                });
                ranked = _.filter(ranked, function(p){
                    return p.rating;
                });
                _.forEach(ranked.reverse(),function(player, index) {
                    player.rank = index + 1;
                    $scope.rated.push(player);
                });
                drawGraphics(week);
            });
        };
        function drawGraphics(week) {
            _.forEach($scope.players, function(player) {
                player.games = [];
                _.forEach($scope.games, function(game) {
                    if (game.player == player.id) player.games.push(game);
                });
                _.sortBy(player.games, function(game) {
                    return game.week;
                });
                function getRatings(player) {
                    var ratings = [];
                    var statsCum;
                    _.forEach(player.games,function(game,index) {
                        if (!statsCum && game.g == 1 && game.passing_att) {
                            statsCum = {
                                passing_comp:0,
                                passing_yds: 0,
                                passing_td: 0,
                                passing_att: 0,
                                passing_int: 0
                            };
                            if (game.passing_comp != null) statsCum.passing_comp += game.passing_comp;
                            if (game.passing_yds != null) statsCum.passing_yds += game.passing_yds;
                            if (game.passing_td != null) statsCum.passing_td += game.passing_td;
                            if (game.passing_att != null) statsCum.passing_att += game.passing_att;
                            if (game.passing_int != null) statsCum.passing_int += game.passing_int;
                            if (statsCum.passing_att != null && statsCum.passing_att != 0) {
                                // formula from https://en.wikipedia.org/wiki/Passer_rating
                                var a = (statsCum.passing_comp / statsCum.passing_att - .3) * 5;
                                var b = (statsCum.passing_yds / statsCum.passing_att - 3) * .25;
                                var c = (statsCum.passing_td / statsCum.passing_att) * 20;
                                var d = 2.375 - (statsCum.passing_int / statsCum.passing_att * 25);
                                if (a > 2.375) a = 2.375;
                                if (a < 0) a = 0;
                                if (b > 2.375) b = 2.375;
                                if (b < 0) b = 0;
                                if (c > 2.375) c = 2.375;
                                if (c < 0) c = 0;
                                if (d > 2.375) d = 2.375;
                                if (d < 0) d = 0;
                                var rating = (a+b+c+d)/6*100;
                                ratings.push({"week":index + 1, "rating":Math.round((rating + 0.00001) * 100) / 100,"pid":player.id})
                            }
                        } else if (!statsCum && !game.g) {
                            ratings.push({"week":index + 1,"rating":null,"pid":player.id})
                        } else if (!statsCum && game.g == 1 && !game.passing_att) {
                            var x = ratings[ratings.length -1];
                            var y = {"week": x.week + 1,"rating": x.rating,"pid":player.id};
                            ratings.push(y);
                        }
                        else {
                            if (game.passing_comp != null) statsCum.passing_comp += game.passing_comp;
                            if (game.passing_yds != null) statsCum.passing_yds += game.passing_yds;
                            if (game.passing_td != null) statsCum.passing_td += game.passing_td;
                            if (game.passing_att != null) statsCum.passing_att += game.passing_att;
                            if (game.passing_int != null) statsCum.passing_int += game.passing_int;
                            if (statsCum.passing_att != null && statsCum.passing_att != 0) {
                                // formula from https://en.wikipedia.org/wiki/Passer_rating
                                var a = (statsCum.passing_comp / statsCum.passing_att - .3) * 5;
                                var b = (statsCum.passing_yds / statsCum.passing_att - 3) * .25;
                                var c = (statsCum.passing_td / statsCum.passing_att) * 20;
                                var d = 2.375 - (statsCum.passing_int / statsCum.passing_att * 25);
                                if (a > 2.375) a = 2.375;
                                if (a < 0) a = 0;
                                if (b > 2.375) b = 2.375;
                                if (b < 0) b = 0;
                                if (c > 2.375) c = 2.375;
                                if (c < 0) c = 0;
                                if (d > 2.375) d = 2.375;
                                if (d < 0) d = 0;
                                var rating = (a+b+c+d)/6*100;
                                ratings.push({"week":index + 1, "rating":Math.round((rating + 0.00001) * 100) / 100,"pid":player.id})
                            }
                        }
                    });
                    var ratingObj = {};
                    _.forEach(ratings, function(rating) {
                        ratingObj[rating.week] = rating;
                    });

                    _.forEach(ratingObj, function(rating,i) {

                        if (!rating) {
                            if (i != 0) {
                                rating = ratingObj[i-1];
                                rating.week++
                            } else {
                                rating.week = 1;
                                rating.rating = null;
                                rating.pid = player.id;
                            }
                        }
                    })
                    //for (var i = 1; i < 19; i++) {
                    //    if (!ratingObj[i]) {
                    //        if (i != 1 && ratingObj[i-1]) {
                    //            ratingObj[i] = ratingObj[i-1];
                    //            ratingObj[i].week = i;
                    //        } else {
                    //            ratingObj[i] = null;
                    //        }
                    //    }
                    //}
                    return ratingObj;
                }
                var ratings = _.values(getRatings(player));
                //if (!player.id == 1) week += 3;
                player.ratings = _.take(ratings, week);
            });
            _.forEach($scope.players,function(player) {
                player.className = 'other';
                if (player.id === 1) player.className = 'jameis';
                if (player.id === 2) player.className = 'marcus';
                player.ratings.forEach(function(d,i) {
                    if (d) {
                        d.week = +d.week;
                        d.rating = d.rating;
                        d.pid = player.id;
                    } else {
                        if (i != 0 && player.ratings[i] != null) {
                            player.ratings[i] = {
                                "week":player.ratings[i].week + 1,
                                "rating":player.ratings[i].rating,
                                "pid":player.id
                            }
                        } else {
                            player.ratings[i] = {
                                "week": i + 1,
                                "rating": null,
                                "pid": player.id
                            }
                        }
                    }
                });
            });
            // This loop can be used to check if any didn't get rated
            //_.forEach($scope.players,function(player) {
            //    if (player.ratings.length < player.games.length) {
            //        for (var i = 0; i < player.ratings.length; i++) {
            //            console.log(player.name, player.ratings[i].week)
            //        }
            //    }
            //});
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = 960 - margin.right - margin.left;
            var height = 500 - margin.top - margin.bottom;
            var x = d3.scale.linear().range([0,width]);
            var y = d3.scale.linear().range([height,0]);
            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues(d3.range(1,week + 1)).tickFormat(d3.format("d"));
            var yAxis = d3.svg.axis().scale(y).orient("left");
            var line = d3.svg.line()
                .x(function(d) { return x(d.week)})
                .y(function(d) { return y(d.rating)})
                .interpolate('basis');
            var svg = d3.select("#graph").select_or_append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .select_or_append("g.container")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");
            x.domain([1, Number(week)]);
            y.domain([0,160]);

            var lines = svg.select_or_append('g.lines').selectAll('path')
                .data($scope.players.reverse(),function(d){if(d){/*console.log(d);*/return d.id;}});

            lines.enter().append('path')
            .attr("class",function(d) { return d.className})
            .attr("name",function(d){return d.name})
            .attr("d", function(d) {return line(d.ratings)});

            lines.attr("class",function(d) { return d.className})
            .attr("name",function(d){return d.name})
            .transition().attr("d", function(d) {return line(d.ratings)});

            lines.exit().remove();

            svg.select_or_append("g.x")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .select_or_append("text.xaxis")
                .attr("y",25)
                .attr("x",450)
                .style("text-anchor","end")
                .style("dy",".71em")
                .text("Week");

            svg.select_or_append("g.y")
                .attr("class", "y axis")
                .call(yAxis)
                .select_or_append("text.yaxis")
                .attr("transform","rotate(-90)")
                .attr("y",-50)
                .attr("x", -150)
                .attr("dy", ".71em")
                .style("text-anchor","end")
                .text("QB Rating (cumulative)");
        }
        $scope.chartActive = false;

    });









