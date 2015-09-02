angular.module('winston')
    .controller('mainCTRL',function($scope,apiSVC,preloadObj){
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
        $scope.gameStats = preloadObj.data.data.winston;
        $scope.stats = new stats();
        $scope.Ustats = new Ustats();
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
            $scope.rated = [];
            _.forEach($scope.players, function(player) {
                accumulateStats(player,week);
                $scope.rated.push({"player":player.name,"rating":player.rating,"id":"p"+player.id})
            });
        }
    });














