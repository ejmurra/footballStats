// This needs to be loaded first because it defines the dependencies. The gulp task will always concat this to the top of file
angular.module('winston', ['ui.router']);
angular.module('winston')
.service('apiSVC', ["$http", function($http) {
        this.addNew = function (item) {
            return $http.post('/api/stats/add',item)
        };
        this.remove = function () {
            return $http.get('/api/stats/remove')
        };
        this.load = function() {
            return $http.get('/api/stats')
        }
    }]);
angular.module('winston')
    .controller('mainCTRL',["$scope", "apiSVC", "preloadObj", function($scope,apiSVC,preloadObj){
        $scope._showInput = false;
        var stats = function() {
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
        var Ustats = function() {
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
        $scope.stats = new stats();
        $scope.Ustats = new Ustats();
        function initPlayers(playerObj) {

        }
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
        $scope.toggleInput = function() {
            $scope._showInput = !$scope._showInput;
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
                        if (player.id == 3) console.log(index,game);
                        if (!statsCum && game.g == 1) {
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
                    if (player.id == 3 ) {console.log(ratingObj);console.log(ratings)};
                    _.forEach(ratingObj, function(rating,i) {
                        if (player.id == 3) console.log(rating,i);
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
                if (player.id == 3) {
                    console.log(ratings);
                    console.log(player.ratings)
                }
            });
            _.forEach($scope.players,function(player) {
                player.className = 'jameis';
                if (player.id != 1) player.className = 'other';
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
            //_.forEach($scope.players,function(player) {
            //    console.log(player.name,player.ratings.length);
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
                .interpolate('step-after');
            var svg = d3.select("#graph").select_or_append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .select_or_append("g.container")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");
            x.domain([1, Number(week)]);
            y.domain([0,158.3]);


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
                .call(xAxis);

            svg.select_or_append("g.y")
                .attr("class", "y axis")
                .call(yAxis)
                .select_or_append("text.yaxis")
                .attr("transform","rotate(-90)")
                .attr("y",6)
                .attr("dy", ".71em")
                .style("text-anchor","end")
                .text("QB Rating (cumulative)");
        }

    }]);










angular.module('winston')
    .config(['$stateProvider',function($stateProvider, searchSvc){
        // These states correspond to the pages on the app. Hooks up templates and views
        $stateProvider.state('home',{
            url: '/',
            templateUrl: 'updateStats.html',
            controller: 'mainCTRL',
            resolve: {
                preloadObj: ["$http", function($http) {
                    return $http({method:'GET',url:'/api/stats'})
                }]
            }
        });
            //.state('search',{
            //    url: '/search',
            //    templateUrl: 'search.html',
            //    controller: 'searchCTRL',
            //    resolve: {
            //        // This queries the server for distinct departments and preloads the departments drop down
            //        preloadOBJ: function($http) {
            //            return $http({method:'GET',url:'/api/departments'});
            //        }
            //    }
            //})
            //.state('details',{
            //    // The :id is the string passed in from the URL corresponds to the personID in the the database
            //    url: '/details/:id',
            //    templateUrl: 'details.html',
            //    controller: 'detailCTRL'
            //})
    }])
    .run(['$state',function($state){
        // Everything inside here will be run one time once the app has loaded. Good place to initialize anything you will be using
        $state.go('home');
    }]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwaVNWQy5qcyIsIm1haW5DVExSTC5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLFFBQUEsT0FBQSxXQUFBLENBQUE7QUNEQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLG9CQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsU0FBQSxVQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTs7UUFFQSxLQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxJQUFBOztRQUVBLEtBQUEsT0FBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7OztBQ1RBLFFBQUEsT0FBQTtLQUNBLFdBQUEsOENBQUEsU0FBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUEsYUFBQTtRQUNBLElBQUEsUUFBQSxXQUFBO1lBQ0EsT0FBQTtnQkFDQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7OztRQUlBLElBQUEsU0FBQSxXQUFBO1lBQ0EsT0FBQTtnQkFDQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7Ozs7UUFJQSxJQUFBLFdBQUEsS0FBQSxVQUFBLE9BQUEsUUFBQSxJQUFBLFdBQUEsS0FBQTtRQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxJQUFBO1FBQ0EsT0FBQSxTQUFBLElBQUE7UUFDQSxTQUFBLFlBQUEsV0FBQTs7O1FBR0EsT0FBQSxXQUFBLFdBQUE7WUFDQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFFBQUEsU0FBQSxPQUFBO2dCQUNBLElBQUEsT0FBQSxVQUFBLFdBQUE7b0JBQ0EsT0FBQSxTQUFBLElBQUE7b0JBQ0EsT0FBQTtvQkFDQSxPQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7d0JBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7dUJBRUEsSUFBQSxPQUFBLFFBQUEsY0FBQSxXQUFBO29CQUNBLE1BQUE7O3FCQUVBO29CQUNBLE1BQUEsWUFBQSxLQUFBLFVBQUEsT0FBQSxRQUFBOzs7OztRQUtBLE9BQUEsY0FBQSxXQUFBO1lBQ0EsT0FBQSxhQUFBLENBQUEsT0FBQTs7UUFFQSxPQUFBLFlBQUEsV0FBQTtZQUNBLElBQUEsT0FBQSxhQUFBLE9BQUE7Z0JBQ0EsT0FBQSxTQUFBLFFBQUEsU0FBQSxTQUFBO29CQUNBLElBQUEsU0FBQSxVQUFBLFdBQUE7d0JBQ0EsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBOzRCQUNBLE9BQUEsWUFBQSxLQUFBLEtBQUE7Ozs7OztRQU1BLE9BQUEsV0FBQSxXQUFBO1lBQ0EsSUFBQSxNQUFBO1lBQ0EsRUFBQSxRQUFBLE9BQUEsU0FBQSxTQUFBLFFBQUE7Z0JBQ0EsSUFBQSxPQUFBLE1BQUEsU0FBQSxLQUFBLE1BQUEsT0FBQSxNQUFBOztZQUVBLElBQUEsUUFBQTtZQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLEdBQUEsS0FBQTtnQkFDQSxNQUFBLEtBQUE7O1lBRUEsT0FBQTs7UUFFQSxPQUFBLFVBQUEsV0FBQSxLQUFBLEtBQUE7UUFDQSxPQUFBLFFBQUEsV0FBQSxLQUFBLEtBQUE7UUFDQSxFQUFBLFFBQUEsT0FBQSxTQUFBLFNBQUEsUUFBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLEVBQUEsUUFBQSxPQUFBLE9BQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsS0FBQSxXQUFBLE9BQUEsSUFBQSxPQUFBLE1BQUEsS0FBQTs7O1FBR0EsSUFBQSxrQkFBQSxTQUFBLFFBQUEsTUFBQTtZQUNBLElBQUEsUUFBQSxFQUFBLEtBQUEsT0FBQSxPQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxZQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsYUFBQTs7WUFFQSxFQUFBLFFBQUEsTUFBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLGdCQUFBLE1BQUEsU0FBQSxnQkFBQSxLQUFBO2dCQUNBLElBQUEsS0FBQSxlQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUE7Z0JBQ0EsSUFBQSxLQUFBLGNBQUEsTUFBQSxTQUFBLGNBQUEsS0FBQTtnQkFDQSxJQUFBLEtBQUEsZUFBQSxNQUFBLFNBQUEsZUFBQSxLQUFBO2dCQUNBLElBQUEsS0FBQSxlQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUE7O1lBRUEsU0FBQSxLQUFBLE9BQUE7Z0JBQ0EsSUFBQSxNQUFBLGVBQUEsUUFBQSxNQUFBLGVBQUEsR0FBQTs7b0JBRUEsSUFBQSxJQUFBLENBQUEsU0FBQSxlQUFBLFNBQUEsY0FBQSxNQUFBO29CQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsY0FBQSxTQUFBLGNBQUEsS0FBQTtvQkFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLGFBQUEsU0FBQSxlQUFBO29CQUNBLElBQUEsSUFBQSxTQUFBLFNBQUEsY0FBQSxTQUFBLGNBQUE7b0JBQ0EsSUFBQSxJQUFBLE9BQUEsSUFBQTtvQkFDQSxJQUFBLElBQUEsR0FBQSxJQUFBO29CQUNBLElBQUEsSUFBQSxPQUFBLElBQUE7b0JBQ0EsSUFBQSxJQUFBLEdBQUEsSUFBQTtvQkFDQSxJQUFBLElBQUEsT0FBQSxJQUFBO29CQUNBLElBQUEsSUFBQSxHQUFBLElBQUE7b0JBQ0EsSUFBQSxJQUFBLE9BQUEsSUFBQTtvQkFDQSxJQUFBLElBQUEsR0FBQSxJQUFBO29CQUNBLE9BQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLElBQUE7Ozs7WUFJQSxPQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUE7O1FBRUEsT0FBQSxjQUFBLFdBQUE7WUFDQSxJQUFBLE9BQUEsRUFBQSxjQUFBLE1BQUEsTUFBQSxLQUFBO1lBQ0EsSUFBQSxRQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxPQUFBLFFBQUEsU0FBQSxZQUFBO2dCQUNBLE9BQUEsVUFBQSxXQUFBLEtBQUE7Z0JBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQTtnQkFDQSxPQUFBLGFBQUEsV0FBQSxLQUFBO2dCQUNBLEVBQUEsUUFBQSxPQUFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLE9BQUEsUUFBQTtvQkFDQSxFQUFBLFFBQUEsT0FBQSxPQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLEtBQUEsV0FBQSxPQUFBLElBQUEsT0FBQSxNQUFBLEtBQUE7O29CQUVBLEVBQUEsT0FBQSxPQUFBLE9BQUEsU0FBQSxNQUFBO3dCQUNBLE9BQUEsS0FBQTs7O2dCQUdBLEVBQUEsUUFBQSxPQUFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLGdCQUFBLE9BQUE7b0JBQ0EsTUFBQSxLQUFBO3dCQUNBLFNBQUEsT0FBQTt3QkFDQSxTQUFBLEtBQUEsTUFBQSxDQUFBLE9BQUEsU0FBQSxXQUFBLE9BQUE7d0JBQ0EsS0FBQSxJQUFBLE9BQUE7OztnQkFHQSxJQUFBLFNBQUEsRUFBQSxPQUFBLE9BQUEsU0FBQSxRQUFBO29CQUNBLE9BQUEsT0FBQTs7Z0JBRUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxTQUFBLEVBQUE7b0JBQ0EsT0FBQSxFQUFBOztnQkFFQSxFQUFBLFFBQUEsT0FBQSxVQUFBLFNBQUEsUUFBQSxPQUFBO29CQUNBLE9BQUEsT0FBQSxRQUFBO29CQUNBLE9BQUEsTUFBQSxLQUFBOztnQkFFQSxhQUFBOzs7UUFHQSxTQUFBLGFBQUEsTUFBQTtZQUNBLEVBQUEsUUFBQSxPQUFBLFNBQUEsU0FBQSxRQUFBO2dCQUNBLE9BQUEsUUFBQTtnQkFDQSxFQUFBLFFBQUEsT0FBQSxPQUFBLFNBQUEsTUFBQTtvQkFDQSxJQUFBLEtBQUEsVUFBQSxPQUFBLElBQUEsT0FBQSxNQUFBLEtBQUE7O2dCQUVBLEVBQUEsT0FBQSxPQUFBLE9BQUEsU0FBQSxNQUFBO29CQUNBLE9BQUEsS0FBQTs7Z0JBRUEsU0FBQSxXQUFBLFFBQUE7b0JBQ0EsSUFBQSxVQUFBO29CQUNBLElBQUE7b0JBQ0EsRUFBQSxRQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsT0FBQTt3QkFDQSxJQUFBLE9BQUEsTUFBQSxHQUFBLFFBQUEsSUFBQSxNQUFBO3dCQUNBLElBQUEsQ0FBQSxZQUFBLEtBQUEsS0FBQSxHQUFBOzRCQUNBLFdBQUE7Z0NBQ0EsYUFBQTtnQ0FDQSxhQUFBO2dDQUNBLFlBQUE7Z0NBQ0EsYUFBQTtnQ0FDQSxhQUFBOzs0QkFFQSxJQUFBLEtBQUEsZ0JBQUEsTUFBQSxTQUFBLGdCQUFBLEtBQUE7NEJBQ0EsSUFBQSxLQUFBLGVBQUEsTUFBQSxTQUFBLGVBQUEsS0FBQTs0QkFDQSxJQUFBLEtBQUEsY0FBQSxNQUFBLFNBQUEsY0FBQSxLQUFBOzRCQUNBLElBQUEsS0FBQSxlQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUE7NEJBQ0EsSUFBQSxLQUFBLGVBQUEsTUFBQSxTQUFBLGVBQUEsS0FBQTs0QkFDQSxJQUFBLFNBQUEsZUFBQSxRQUFBLFNBQUEsZUFBQSxHQUFBOztnQ0FFQSxJQUFBLElBQUEsQ0FBQSxTQUFBLGVBQUEsU0FBQSxjQUFBLE1BQUE7Z0NBQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxjQUFBLFNBQUEsY0FBQSxLQUFBO2dDQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsYUFBQSxTQUFBLGVBQUE7Z0NBQ0EsSUFBQSxJQUFBLFNBQUEsU0FBQSxjQUFBLFNBQUEsY0FBQTtnQ0FDQSxJQUFBLElBQUEsT0FBQSxJQUFBO2dDQUNBLElBQUEsSUFBQSxHQUFBLElBQUE7Z0NBQ0EsSUFBQSxJQUFBLE9BQUEsSUFBQTtnQ0FDQSxJQUFBLElBQUEsR0FBQSxJQUFBO2dDQUNBLElBQUEsSUFBQSxPQUFBLElBQUE7Z0NBQ0EsSUFBQSxJQUFBLEdBQUEsSUFBQTtnQ0FDQSxJQUFBLElBQUEsT0FBQSxJQUFBO2dDQUNBLElBQUEsSUFBQSxHQUFBLElBQUE7Z0NBQ0EsSUFBQSxTQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBO2dDQUNBLFFBQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxHQUFBLFNBQUEsS0FBQSxNQUFBLENBQUEsU0FBQSxXQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUE7OytCQUVBLElBQUEsQ0FBQSxZQUFBLENBQUEsS0FBQSxHQUFBOzRCQUNBLFFBQUEsS0FBQSxDQUFBLE9BQUEsUUFBQSxFQUFBLFNBQUEsS0FBQSxNQUFBLE9BQUE7OzZCQUVBOzRCQUNBLElBQUEsS0FBQSxnQkFBQSxNQUFBLFNBQUEsZ0JBQUEsS0FBQTs0QkFDQSxJQUFBLEtBQUEsZUFBQSxNQUFBLFNBQUEsZUFBQSxLQUFBOzRCQUNBLElBQUEsS0FBQSxjQUFBLE1BQUEsU0FBQSxjQUFBLEtBQUE7NEJBQ0EsSUFBQSxLQUFBLGVBQUEsTUFBQSxTQUFBLGVBQUEsS0FBQTs0QkFDQSxJQUFBLEtBQUEsZUFBQSxNQUFBLFNBQUEsZUFBQSxLQUFBOzRCQUNBLElBQUEsU0FBQSxlQUFBLFFBQUEsU0FBQSxlQUFBLEdBQUE7O2dDQUVBLElBQUEsSUFBQSxDQUFBLFNBQUEsZUFBQSxTQUFBLGNBQUEsTUFBQTtnQ0FDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLGNBQUEsU0FBQSxjQUFBLEtBQUE7Z0NBQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxhQUFBLFNBQUEsZUFBQTtnQ0FDQSxJQUFBLElBQUEsU0FBQSxTQUFBLGNBQUEsU0FBQSxjQUFBO2dDQUNBLElBQUEsSUFBQSxPQUFBLElBQUE7Z0NBQ0EsSUFBQSxJQUFBLEdBQUEsSUFBQTtnQ0FDQSxJQUFBLElBQUEsT0FBQSxJQUFBO2dDQUNBLElBQUEsSUFBQSxHQUFBLElBQUE7Z0NBQ0EsSUFBQSxJQUFBLE9BQUEsSUFBQTtnQ0FDQSxJQUFBLElBQUEsR0FBQSxJQUFBO2dDQUNBLElBQUEsSUFBQSxPQUFBLElBQUE7Z0NBQ0EsSUFBQSxJQUFBLEdBQUEsSUFBQTtnQ0FDQSxJQUFBLFNBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUE7Z0NBQ0EsUUFBQSxLQUFBLENBQUEsT0FBQSxRQUFBLEdBQUEsU0FBQSxLQUFBLE1BQUEsQ0FBQSxTQUFBLFdBQUEsT0FBQSxJQUFBLE1BQUEsT0FBQTs7OztvQkFJQSxJQUFBLFlBQUE7b0JBQ0EsRUFBQSxRQUFBLFNBQUEsU0FBQSxRQUFBO3dCQUNBLFVBQUEsT0FBQSxRQUFBOztvQkFFQSxJQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsUUFBQSxJQUFBLFdBQUEsUUFBQSxJQUFBLFNBQUE7b0JBQ0EsRUFBQSxRQUFBLFdBQUEsU0FBQSxPQUFBLEdBQUE7d0JBQ0EsSUFBQSxPQUFBLE1BQUEsR0FBQSxRQUFBLElBQUEsT0FBQTt3QkFDQSxJQUFBLENBQUEsUUFBQTs0QkFDQSxJQUFBLEtBQUEsR0FBQTtnQ0FDQSxTQUFBLFVBQUEsRUFBQTtnQ0FDQSxPQUFBO21DQUNBO2dDQUNBLE9BQUEsT0FBQTtnQ0FDQSxPQUFBLFNBQUE7Z0NBQ0EsT0FBQSxNQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7O29CQWNBLE9BQUE7O2dCQUVBLElBQUEsVUFBQSxFQUFBLE9BQUEsV0FBQTs7Z0JBRUEsT0FBQSxVQUFBLEVBQUEsS0FBQSxTQUFBO2dCQUNBLElBQUEsT0FBQSxNQUFBLEdBQUE7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLFFBQUEsSUFBQSxPQUFBOzs7WUFHQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFNBQUEsUUFBQTtnQkFDQSxPQUFBLFlBQUE7Z0JBQ0EsSUFBQSxPQUFBLE1BQUEsR0FBQSxPQUFBLFlBQUE7Z0JBQ0EsT0FBQSxRQUFBLFFBQUEsU0FBQSxFQUFBLEdBQUE7b0JBQ0EsSUFBQSxHQUFBO3dCQUNBLEVBQUEsT0FBQSxDQUFBLEVBQUE7d0JBQ0EsRUFBQSxTQUFBLEVBQUE7d0JBQ0EsRUFBQSxNQUFBLE9BQUE7MkJBQ0E7d0JBQ0EsSUFBQSxLQUFBLEtBQUEsT0FBQSxRQUFBLE1BQUEsTUFBQTs0QkFDQSxPQUFBLFFBQUEsS0FBQTtnQ0FDQSxPQUFBLE9BQUEsUUFBQSxHQUFBLE9BQUE7Z0NBQ0EsU0FBQSxPQUFBLFFBQUEsR0FBQTtnQ0FDQSxNQUFBLE9BQUE7OytCQUVBOzRCQUNBLE9BQUEsUUFBQSxLQUFBO2dDQUNBLFFBQUEsSUFBQTtnQ0FDQSxVQUFBO2dDQUNBLE9BQUEsT0FBQTs7Ozs7Ozs7OztZQVVBLElBQUEsU0FBQSxDQUFBLEtBQUEsSUFBQSxPQUFBLElBQUEsUUFBQSxJQUFBLE1BQUE7WUFDQSxJQUFBLFFBQUEsTUFBQSxPQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsU0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxFQUFBO1lBQ0EsSUFBQSxJQUFBLEdBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxPQUFBO1lBQ0EsSUFBQSxRQUFBLEdBQUEsSUFBQSxPQUFBLE1BQUEsR0FBQSxPQUFBLFVBQUEsV0FBQSxHQUFBLE1BQUEsRUFBQSxPQUFBLElBQUEsV0FBQSxHQUFBLE9BQUE7WUFDQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE9BQUEsTUFBQSxHQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUEsR0FBQSxJQUFBO2lCQUNBLEVBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEVBQUE7aUJBQ0EsRUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsRUFBQTtpQkFDQSxZQUFBO1lBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxVQUFBLGlCQUFBO2lCQUNBLEtBQUEsU0FBQSxRQUFBLE9BQUEsT0FBQSxPQUFBO2lCQUNBLEtBQUEsVUFBQSxTQUFBLE9BQUEsTUFBQSxPQUFBO2lCQUNBLGlCQUFBO2lCQUNBLEtBQUEsWUFBQSxlQUFBLE9BQUEsT0FBQSxNQUFBLE9BQUEsTUFBQTtZQUNBLEVBQUEsT0FBQSxDQUFBLEdBQUEsT0FBQTtZQUNBLEVBQUEsT0FBQSxDQUFBLEVBQUE7OztZQUdBLElBQUEsUUFBQSxJQUFBLGlCQUFBLFdBQUEsVUFBQTtpQkFDQSxLQUFBLE9BQUEsUUFBQSxVQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQSxvQkFBQSxPQUFBLEVBQUE7O1lBRUEsTUFBQSxRQUFBLE9BQUE7YUFDQSxLQUFBLFFBQUEsU0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBO2FBQ0EsS0FBQSxPQUFBLFNBQUEsRUFBQSxDQUFBLE9BQUEsRUFBQTthQUNBLEtBQUEsS0FBQSxTQUFBLEdBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTs7WUFFQSxNQUFBLEtBQUEsUUFBQSxTQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUE7YUFDQSxLQUFBLE9BQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxFQUFBO2FBQ0EsYUFBQSxLQUFBLEtBQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7O1lBRUEsTUFBQSxPQUFBOztZQUVBLElBQUEsaUJBQUE7aUJBQ0EsS0FBQSxTQUFBO2lCQUNBLEtBQUEsYUFBQSxpQkFBQSxTQUFBO2lCQUNBLEtBQUE7O1lBRUEsSUFBQSxpQkFBQTtpQkFDQSxLQUFBLFNBQUE7aUJBQ0EsS0FBQTtpQkFDQSxpQkFBQTtpQkFDQSxLQUFBLFlBQUE7aUJBQ0EsS0FBQSxJQUFBO2lCQUNBLEtBQUEsTUFBQTtpQkFDQSxNQUFBLGNBQUE7aUJBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7QUN0ZUEsUUFBQSxPQUFBO0tBQ0EsT0FBQSxDQUFBLGlCQUFBLFNBQUEsZ0JBQUEsVUFBQTs7UUFFQSxlQUFBLE1BQUEsT0FBQTtZQUNBLEtBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7Z0JBQ0Esc0JBQUEsU0FBQSxPQUFBO29CQUNBLE9BQUEsTUFBQSxDQUFBLE9BQUEsTUFBQSxJQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBc0JBLElBQUEsQ0FBQSxTQUFBLFNBQUEsT0FBQTs7UUFFQSxPQUFBLEdBQUE7O0FBRUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBuZWVkcyB0byBiZSBsb2FkZWQgZmlyc3QgYmVjYXVzZSBpdCBkZWZpbmVzIHRoZSBkZXBlbmRlbmNpZXMuIFRoZSBndWxwIHRhc2sgd2lsbCBhbHdheXMgY29uY2F0IHRoaXMgdG8gdGhlIHRvcCBvZiBmaWxlXG5hbmd1bGFyLm1vZHVsZSgnd2luc3RvbicsIFsndWkucm91dGVyJ10pOyIsImFuZ3VsYXIubW9kdWxlKCd3aW5zdG9uJylcbi5zZXJ2aWNlKCdhcGlTVkMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICB0aGlzLmFkZE5ldyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9zdGF0cy9hZGQnLGl0ZW0pXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9zdGF0cy9yZW1vdmUnKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvc3RhdHMnKVxuICAgICAgICB9XG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ3dpbnN0b24nKVxuICAgIC5jb250cm9sbGVyKCdtYWluQ1RSTCcsZnVuY3Rpb24oJHNjb3BlLGFwaVNWQyxwcmVsb2FkT2JqKXtcbiAgICAgICAgJHNjb3BlLl9zaG93SW5wdXQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnd2VlaycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2cnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZ3MnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19jb21wJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfYXR0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfcGN0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfeWRzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfYXZnJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfdGQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19pbnQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19zY2snLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19zY2t5JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfcmF0ZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX2F0dCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX3lkcycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX2F2ZycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX3RkJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2Z1bScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdmdW1fbG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH07XG4gICAgICAgIHZhciBVc3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2cnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZ3MnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19jb21wJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfYXR0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfcGN0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfeWRzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfYXZnJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfdGQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19pbnQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19zY2snLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFzc19zY2t5JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfcmF0ZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX2F0dCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX3lkcycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX2F2ZycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdydXNoX3RkJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2Z1bScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdmdW1fbG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH07XG4gICAgICAgIGlmIChwcmVsb2FkT2JqLmRhdGEuc3RhdHVzID09ICdlcnInKSBjb25zb2xlLmxvZyhwcmVsb2FkT2JqLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICRzY29wZS5nYW1lU3RhdHMgPSBwcmVsb2FkT2JqLmRhdGEuZGF0YS53aW5zdG9uO1xuICAgICAgICAkc2NvcGUuc3RhdHMgPSBuZXcgc3RhdHMoKTtcbiAgICAgICAgJHNjb3BlLlVzdGF0cyA9IG5ldyBVc3RhdHMoKTtcbiAgICAgICAgZnVuY3Rpb24gaW5pdFBsYXllcnMocGxheWVyT2JqKSB7XG5cbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUubmV3U3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFwaVNWQy5hZGROZXcoJHNjb3BlLlVzdGF0cykuc3VjY2VzcyhmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09IFwic3VjY2Vzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5Vc3RhdHMgPSBuZXcgVXN0YXRzKCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50b2dnbGVJbnB1dCgpO1xuICAgICAgICAgICAgICAgICAgICBhcGlTVkMubG9hZCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdhbWVTdGF0cyA9IGRhdGEuZGF0YS53aW5zdG9uO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lm1lc3NhZ2UuY29uc3RyYWludCA9PSAnZ2FtZV9waycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogVGhhdCBnYW1lIGFscmVhZHkgZXhpc3RzIGluIHRoZSBkYXRhYmFzZS4gRGVsZXRlIGl0IGZpcnN0IGlmIHlvdSB3YW50IHRvIHVwZGF0ZSBpdFwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQubWVzc2FnZS5kZXRhaWwpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS50b2dnbGVJbnB1dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLl9zaG93SW5wdXQgPSAhJHNjb3BlLl9zaG93SW5wdXQ7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5kZWxldGVSb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZ2FtZVN0YXRzICE9IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYXBpU1ZDLnJlbW92ZSgpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpU1ZDLmxvYWQoKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZVN0YXRzID0gZGF0YS5kYXRhLndpbnN0b247XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLm1heEdhbWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbWF4ID0gMDtcbiAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUucGxheWVycywgZnVuY3Rpb24ocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5nYW1lcy5sZW5ndGggPiBtYXgpIG1heCA9IHBsYXllci5nYW1lcy5sZW5ndGg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB3ZWVrcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBtYXggKyAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB3ZWVrcy5wdXNoKGkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gd2Vla3M7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5wbGF5ZXJzID0gcHJlbG9hZE9iai5kYXRhLmRhdGEucGxheWVycztcbiAgICAgICAgJHNjb3BlLmdhbWVzID0gcHJlbG9hZE9iai5kYXRhLmRhdGEuZ2FtZXM7XG4gICAgICAgIF8uZm9yRWFjaCgkc2NvcGUucGxheWVycywgZnVuY3Rpb24ocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIuZ2FtZXMgPSBbXTtcbiAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUuZ2FtZXMsIGZ1bmN0aW9uKGdhbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wbGF5ZXIgPT09IHBsYXllci5pZCkgcGxheWVyLmdhbWVzLnB1c2goZ2FtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBhY2N1bXVsYXRlU3RhdHMgPSBmdW5jdGlvbihwbGF5ZXIsIHdlZWspIHtcbiAgICAgICAgICAgIHZhciBnYW1lcyA9IF8udGFrZShwbGF5ZXIuZ2FtZXMsIHdlZWspO1xuICAgICAgICAgICAgdmFyIHN0YXRzQ3VtID0ge1xuICAgICAgICAgICAgICAgIHBhc3NpbmdfY29tcDowLFxuICAgICAgICAgICAgICAgIHBhc3NpbmdfeWRzOiAwLFxuICAgICAgICAgICAgICAgIHBhc3NpbmdfdGQ6IDAsXG4gICAgICAgICAgICAgICAgcGFzc2luZ19hdHQ6IDAsXG4gICAgICAgICAgICAgICAgcGFzc2luZ19pbnQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfLmZvckVhY2goZ2FtZXMsZnVuY3Rpb24oZ2FtZSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfY29tcCAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX2NvbXAgKz0gZ2FtZS5wYXNzaW5nX2NvbXA7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ195ZHMgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ195ZHMgKz0gZ2FtZS5wYXNzaW5nX3lkcztcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX3RkICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfdGQgKz0gZ2FtZS5wYXNzaW5nX3RkO1xuICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfYXR0ICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfYXR0ICs9IGdhbWUucGFzc2luZ19hdHQ7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ19pbnQgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ19pbnQgKz0gZ2FtZS5wYXNzaW5nX2ludDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnVuY3Rpb24gcmF0ZShzdGF0cykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0cy5wYXNzaW5nX2F0dCAhPSBudWxsICYmIHN0YXRzLnBhc3NpbmdfYXR0ICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9ybXVsYSBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Bhc3Nlcl9yYXRpbmdcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSAoc3RhdHNDdW0ucGFzc2luZ19jb21wIC8gc3RhdHNDdW0ucGFzc2luZ19hdHQgLSAuMykgKiA1O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IChzdGF0c0N1bS5wYXNzaW5nX3lkcyAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0IC0gMykgKiAuMjU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gKHN0YXRzQ3VtLnBhc3NpbmdfdGQgLyBzdGF0c0N1bS5wYXNzaW5nX2F0dCkgKiAyMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSAyLjM3NSAtIChzdGF0c0N1bS5wYXNzaW5nX2ludCAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0ICogMjUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA+IDIuMzc1KSBhID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhIDwgMCkgYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiID4gMi4zNzUpIGIgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIgPCAwKSBiID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPiAyLjM3NSkgYyA9IDIuMzc1O1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA8IDApIGMgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCA+IDIuMzc1KSBkID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkIDwgMCkgZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoYSArIGIgKyBjICsgZCkgLyA2ICogMTAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxheWVyLnJhdGluZyA9IHJhdGUoc3RhdHNDdW0pO1xuICAgICAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnJhdGVQbGF5ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9ICQoJyN3ZWVrMnJhdGUnKS52YWwoKS5zcGxpdCgnICcpWzFdO1xuICAgICAgICAgICAgdmFyIHJhdGVkID0gW107XG4gICAgICAgICAgICAkc2NvcGUucmF0ZWQgPSBbXTtcbiAgICAgICAgICAgIGFwaVNWQy5sb2FkKCkuc3VjY2VzcyhmdW5jdGlvbihwbGF5ZXJzT2JqKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBsYXllcnMgPSBwbGF5ZXJzT2JqLmRhdGEucGxheWVycztcbiAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZXMgPSBwbGF5ZXJzT2JqLmRhdGEuZ2FtZXM7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmdhbWVTdGF0ZXMgPSBwbGF5ZXJzT2JqLmRhdGEud2luc3RvbjtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goJHNjb3BlLnBsYXllcnMsIGZ1bmN0aW9uKHBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2FtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5nYW1lcywgZnVuY3Rpb24oZ2FtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUucGxheWVyID09PSBwbGF5ZXIuaWQpIHBsYXllci5nYW1lcy5wdXNoKGdhbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXy5zb3J0QnkocGxheWVyLmdhbWVzLCBmdW5jdGlvbihnYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2FtZS53ZWVrO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goJHNjb3BlLnBsYXllcnMsIGZ1bmN0aW9uKHBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICBhY2N1bXVsYXRlU3RhdHMocGxheWVyLHdlZWspO1xuICAgICAgICAgICAgICAgICAgICByYXRlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGxheWVyXCI6cGxheWVyLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhdGluZ1wiOk1hdGgucm91bmQoKHBsYXllci5yYXRpbmcgKyAwLjAwMDAxKSAqIDEwMCkgLyAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6XCJwXCIrcGxheWVyLmlkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHJhbmtlZCA9IF8uc29ydEJ5KHJhdGVkLCBmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsYXllci5yYXRpbmc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmFua2VkID0gXy5maWx0ZXIocmFua2VkLCBmdW5jdGlvbihwKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAucmF0aW5nO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaChyYW5rZWQucmV2ZXJzZSgpLGZ1bmN0aW9uKHBsYXllciwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJhbmsgPSBpbmRleCArIDE7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yYXRlZC5wdXNoKHBsYXllcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZHJhd0dyYXBoaWNzKHdlZWspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIGRyYXdHcmFwaGljcyh3ZWVrKSB7XG4gICAgICAgICAgICBfLmZvckVhY2goJHNjb3BlLnBsYXllcnMsIGZ1bmN0aW9uKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5nYW1lcyA9IFtdO1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUuZ2FtZXMsIGZ1bmN0aW9uKGdhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUucGxheWVyID09IHBsYXllci5pZCkgcGxheWVyLmdhbWVzLnB1c2goZ2FtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXy5zb3J0QnkocGxheWVyLmdhbWVzLCBmdW5jdGlvbihnYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnYW1lLndlZWs7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UmF0aW5ncyhwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJhdGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRzQ3VtO1xuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2gocGxheWVyLmdhbWVzLGZ1bmN0aW9uKGdhbWUsaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gMykgY29uc29sZS5sb2coaW5kZXgsZ2FtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXRzQ3VtICYmIGdhbWUuZyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHNDdW0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NpbmdfY29tcDowLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzaW5nX3lkczogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2luZ190ZDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2luZ19hdHQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NpbmdfaW50OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX2NvbXAgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ19jb21wICs9IGdhbWUucGFzc2luZ19jb21wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfeWRzICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfeWRzICs9IGdhbWUucGFzc2luZ195ZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ190ZCAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX3RkICs9IGdhbWUucGFzc2luZ190ZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX2F0dCAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX2F0dCArPSBnYW1lLnBhc3NpbmdfYXR0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfaW50ICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfaW50ICs9IGdhbWUucGFzc2luZ19pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRzQ3VtLnBhc3NpbmdfYXR0ICE9IG51bGwgJiYgc3RhdHNDdW0ucGFzc2luZ19hdHQgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3JtdWxhIGZyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGFzc2VyX3JhdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IChzdGF0c0N1bS5wYXNzaW5nX2NvbXAgLyBzdGF0c0N1bS5wYXNzaW5nX2F0dCAtIC4zKSAqIDU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiID0gKHN0YXRzQ3VtLnBhc3NpbmdfeWRzIC8gc3RhdHNDdW0ucGFzc2luZ19hdHQgLSAzKSAqIC4yNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSAoc3RhdHNDdW0ucGFzc2luZ190ZCAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0KSAqIDIwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IDIuMzc1IC0gKHN0YXRzQ3VtLnBhc3NpbmdfaW50IC8gc3RhdHNDdW0ucGFzc2luZ19hdHQgKiAyNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhID4gMi4zNzUpIGEgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEgPCAwKSBhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIgPiAyLjM3NSkgYiA9IDIuMzc1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiA8IDApIGIgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA+IDIuMzc1KSBjID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjIDwgMCkgYyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkID4gMi4zNzUpIGQgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQgPCAwKSBkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhdGluZyA9IChhK2IrYytkKS82KjEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5ncy5wdXNoKHtcIndlZWtcIjppbmRleCArIDEsIFwicmF0aW5nXCI6TWF0aC5yb3VuZCgocmF0aW5nICsgMC4wMDAwMSkgKiAxMDApIC8gMTAwLFwicGlkXCI6cGxheWVyLmlkfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFzdGF0c0N1bSAmJiAhZ2FtZS5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5ncy5wdXNoKHtcIndlZWtcIjppbmRleCArIDEsXCJyYXRpbmdcIjpudWxsLFwicGlkXCI6cGxheWVyLmlkfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfY29tcCAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX2NvbXAgKz0gZ2FtZS5wYXNzaW5nX2NvbXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ195ZHMgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ195ZHMgKz0gZ2FtZS5wYXNzaW5nX3lkcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX3RkICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfdGQgKz0gZ2FtZS5wYXNzaW5nX3RkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfYXR0ICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfYXR0ICs9IGdhbWUucGFzc2luZ19hdHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ19pbnQgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ19pbnQgKz0gZ2FtZS5wYXNzaW5nX2ludDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHNDdW0ucGFzc2luZ19hdHQgIT0gbnVsbCAmJiBzdGF0c0N1bS5wYXNzaW5nX2F0dCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvcm11bGEgZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9QYXNzZXJfcmF0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gKHN0YXRzQ3VtLnBhc3NpbmdfY29tcCAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0IC0gLjMpICogNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSAoc3RhdHNDdW0ucGFzc2luZ195ZHMgLyBzdGF0c0N1bS5wYXNzaW5nX2F0dCAtIDMpICogLjI1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IChzdGF0c0N1bS5wYXNzaW5nX3RkIC8gc3RhdHNDdW0ucGFzc2luZ19hdHQpICogMjA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gMi4zNzUgLSAoc3RhdHNDdW0ucGFzc2luZ19pbnQgLyBzdGF0c0N1bS5wYXNzaW5nX2F0dCAqIDI1KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEgPiAyLjM3NSkgYSA9IDIuMzc1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSA8IDApIGEgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYiA+IDIuMzc1KSBiID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiIDwgMCkgYiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjID4gMi4zNzUpIGMgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPCAwKSBjID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQgPiAyLjM3NSkgZCA9IDIuMzc1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZCA8IDApIGQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmF0aW5nID0gKGErYitjK2QpLzYqMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbmdzLnB1c2goe1wid2Vla1wiOmluZGV4ICsgMSwgXCJyYXRpbmdcIjpNYXRoLnJvdW5kKChyYXRpbmcgKyAwLjAwMDAxKSAqIDEwMCkgLyAxMDAsXCJwaWRcIjpwbGF5ZXIuaWR9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByYXRpbmdPYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHJhdGluZ3MsIGZ1bmN0aW9uKHJhdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nT2JqW3JhdGluZy53ZWVrXSA9IHJhdGluZztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gMyApIHtjb25zb2xlLmxvZyhyYXRpbmdPYmopO2NvbnNvbGUubG9nKHJhdGluZ3MpfTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHJhdGluZ09iaiwgZnVuY3Rpb24ocmF0aW5nLGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gMykgY29uc29sZS5sb2cocmF0aW5nLGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZyA9IHJhdGluZ09ialtpLTFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbmcud2VlaysrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nLndlZWsgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbmcucmF0aW5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nLnBpZCA9IHBsYXllci5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC8vZm9yICh2YXIgaSA9IDE7IGkgPCAxOTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGlmICghcmF0aW5nT2JqW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICBpZiAoaSAhPSAxICYmIHJhdGluZ09ialtpLTFdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgcmF0aW5nT2JqW2ldID0gcmF0aW5nT2JqW2ktMV07XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgcmF0aW5nT2JqW2ldLndlZWsgPSBpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICByYXRpbmdPYmpbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmF0aW5nT2JqO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmF0aW5ncyA9IF8udmFsdWVzKGdldFJhdGluZ3MocGxheWVyKSk7XG4gICAgICAgICAgICAgICAgLy9pZiAoIXBsYXllci5pZCA9PSAxKSB3ZWVrICs9IDM7XG4gICAgICAgICAgICAgICAgcGxheWVyLnJhdGluZ3MgPSBfLnRha2UocmF0aW5ncywgd2Vlayk7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5pZCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJhdGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIucmF0aW5ncylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF8uZm9yRWFjaCgkc2NvcGUucGxheWVycyxmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2xhc3NOYW1lID0gJ2phbWVpcyc7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5pZCAhPSAxKSBwbGF5ZXIuY2xhc3NOYW1lID0gJ290aGVyJztcbiAgICAgICAgICAgICAgICBwbGF5ZXIucmF0aW5ncy5mb3JFYWNoKGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZC53ZWVrID0gK2Qud2VlaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmF0aW5nID0gZC5yYXRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnBpZCA9IHBsYXllci5pZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9IDAgJiYgcGxheWVyLnJhdGluZ3NbaV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5yYXRpbmdzW2ldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndlZWtcIjpwbGF5ZXIucmF0aW5nc1tpXS53ZWVrICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyYXRpbmdcIjpwbGF5ZXIucmF0aW5nc1tpXS5yYXRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGlkXCI6cGxheWVyLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucmF0aW5nc1tpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3ZWVrXCI6IGkgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJhdGluZ1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBpZFwiOiBwbGF5ZXIuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9fLmZvckVhY2goJHNjb3BlLnBsYXllcnMsZnVuY3Rpb24ocGxheWVyKSB7XG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZyhwbGF5ZXIubmFtZSxwbGF5ZXIucmF0aW5ncy5sZW5ndGgpO1xuICAgICAgICAgICAgLy99KTtcblxuICAgICAgICAgICAgdmFyIG1hcmdpbiA9IHt0b3A6IDIwLCByaWdodDogMjAsIGJvdHRvbTogMzAsIGxlZnQ6IDUwfTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IDk2MCAtIG1hcmdpbi5yaWdodCAtIG1hcmdpbi5sZWZ0O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDUwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuICAgICAgICAgICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMCx3aWR0aF0pO1xuICAgICAgICAgICAgdmFyIHkgPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbaGVpZ2h0LDBdKTtcbiAgICAgICAgICAgIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoeCkub3JpZW50KFwiYm90dG9tXCIpLnRpY2tWYWx1ZXMoZDMucmFuZ2UoMSx3ZWVrICsgMSkpLnRpY2tGb3JtYXQoZDMuZm9ybWF0KFwiZFwiKSk7XG4gICAgICAgICAgICB2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHkpLm9yaWVudChcImxlZnRcIik7XG4gICAgICAgICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4KGQud2Vlayl9KVxuICAgICAgICAgICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkoZC5yYXRpbmcpfSlcbiAgICAgICAgICAgICAgICAuaW50ZXJwb2xhdGUoJ3N0ZXAtYWZ0ZXInKTtcbiAgICAgICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjZ3JhcGhcIikuc2VsZWN0X29yX2FwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcbiAgICAgICAgICAgICAgICAuc2VsZWN0X29yX2FwcGVuZChcImcuY29udGFpbmVyXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIixcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xuICAgICAgICAgICAgeC5kb21haW4oWzEsIE51bWJlcih3ZWVrKV0pO1xuICAgICAgICAgICAgeS5kb21haW4oWzAsMTU4LjNdKTtcblxuXG4gICAgICAgICAgICB2YXIgbGluZXMgPSBzdmcuc2VsZWN0X29yX2FwcGVuZCgnZy5saW5lcycpLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAgICAgICAgICAgLmRhdGEoJHNjb3BlLnBsYXllcnMucmV2ZXJzZSgpLGZ1bmN0aW9uKGQpe2lmKGQpey8qY29uc29sZS5sb2coZCk7Ki9yZXR1cm4gZC5pZDt9fSk7XG5cbiAgICAgICAgICAgIGxpbmVzLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIixmdW5jdGlvbihkKSB7IHJldHVybiBkLmNsYXNzTmFtZX0pXG4gICAgICAgICAgICAuYXR0cihcIm5hbWVcIixmdW5jdGlvbihkKXtyZXR1cm4gZC5uYW1lfSlcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbihkKSB7cmV0dXJuIGxpbmUoZC5yYXRpbmdzKX0pO1xuXG4gICAgICAgICAgICBsaW5lcy5hdHRyKFwiY2xhc3NcIixmdW5jdGlvbihkKSB7IHJldHVybiBkLmNsYXNzTmFtZX0pXG4gICAgICAgICAgICAuYXR0cihcIm5hbWVcIixmdW5jdGlvbihkKXtyZXR1cm4gZC5uYW1lfSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuYXR0cihcImRcIiwgZnVuY3Rpb24oZCkge3JldHVybiBsaW5lKGQucmF0aW5ncyl9KTtcblxuICAgICAgICAgICAgbGluZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBzdmcuc2VsZWN0X29yX2FwcGVuZChcImcueFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ4IGF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgaGVpZ2h0ICsgXCIpXCIpXG4gICAgICAgICAgICAgICAgLmNhbGwoeEF4aXMpO1xuXG4gICAgICAgICAgICBzdmcuc2VsZWN0X29yX2FwcGVuZChcImcueVwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ5IGF4aXNcIilcbiAgICAgICAgICAgICAgICAuY2FsbCh5QXhpcylcbiAgICAgICAgICAgICAgICAuc2VsZWN0X29yX2FwcGVuZChcInRleHQueWF4aXNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLFwicm90YXRlKC05MClcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiw2KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuNzFlbVwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsXCJlbmRcIilcbiAgICAgICAgICAgICAgICAudGV4dChcIlFCIFJhdGluZyAoY3VtdWxhdGl2ZSlcIik7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbnN0b24nKVxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIHNlYXJjaFN2Yyl7XG4gICAgICAgIC8vIFRoZXNlIHN0YXRlcyBjb3JyZXNwb25kIHRvIHRoZSBwYWdlcyBvbiB0aGUgYXBwLiBIb29rcyB1cCB0ZW1wbGF0ZXMgYW5kIHZpZXdzXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXBkYXRlU3RhdHMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnbWFpbkNUUkwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIHByZWxvYWRPYmo6IGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOidHRVQnLHVybDonL2FwaS9zdGF0cyd9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICAgICAvLy5zdGF0ZSgnc2VhcmNoJyx7XG4gICAgICAgICAgICAvLyAgICB1cmw6ICcvc2VhcmNoJyxcbiAgICAgICAgICAgIC8vICAgIHRlbXBsYXRlVXJsOiAnc2VhcmNoLmh0bWwnLFxuICAgICAgICAgICAgLy8gICAgY29udHJvbGxlcjogJ3NlYXJjaENUUkwnLFxuICAgICAgICAgICAgLy8gICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgLy8gICAgICAgIC8vIFRoaXMgcXVlcmllcyB0aGUgc2VydmVyIGZvciBkaXN0aW5jdCBkZXBhcnRtZW50cyBhbmQgcHJlbG9hZHMgdGhlIGRlcGFydG1lbnRzIGRyb3AgZG93blxuICAgICAgICAgICAgLy8gICAgICAgIHByZWxvYWRPQko6IGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOidHRVQnLHVybDonL2FwaS9kZXBhcnRtZW50cyd9KTtcbiAgICAgICAgICAgIC8vICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICB9XG4gICAgICAgICAgICAvL30pXG4gICAgICAgICAgICAvLy5zdGF0ZSgnZGV0YWlscycse1xuICAgICAgICAgICAgLy8gICAgLy8gVGhlIDppZCBpcyB0aGUgc3RyaW5nIHBhc3NlZCBpbiBmcm9tIHRoZSBVUkwgY29ycmVzcG9uZHMgdG8gdGhlIHBlcnNvbklEIGluIHRoZSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgIC8vICAgIHVybDogJy9kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAvLyAgICB0ZW1wbGF0ZVVybDogJ2RldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAvLyAgICBjb250cm9sbGVyOiAnZGV0YWlsQ1RSTCdcbiAgICAgICAgICAgIC8vfSlcbiAgICB9XSlcbiAgICAucnVuKFsnJHN0YXRlJyxmdW5jdGlvbigkc3RhdGUpe1xuICAgICAgICAvLyBFdmVyeXRoaW5nIGluc2lkZSBoZXJlIHdpbGwgYmUgcnVuIG9uZSB0aW1lIG9uY2UgdGhlIGFwcCBoYXMgbG9hZGVkLiBHb29kIHBsYWNlIHRvIGluaXRpYWxpemUgYW55dGhpbmcgeW91IHdpbGwgYmUgdXNpbmdcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgfV0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9