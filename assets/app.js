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
            apiSVC.load().success(function(playersObj) {
                console.log(playersObj);
                $scope.players = playersObj.data.players;
                $scope.games = playersObj.data.games;
                $scope.gameStates = playersObj.data.winston;
                _.forEach($scope.players, function(player) {
                    player.games = [];
                    _.forEach($scope.games, function(game) {
                        if (game.player === player.id) player.games.push(game);
                    });
                });
                _.forEach($scope.players, function(player) {
                    accumulateStats(player,week);
                    $scope.rated.push({"player":player.name,"rating":player.rating,"id":"p"+player.id})
                });
            });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwaVNWQy5qcyIsIm1haW5DVExSTC5qcyIsInJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLFFBQUEsT0FBQSxXQUFBLENBQUE7QUNEQSxRQUFBLE9BQUE7Q0FDQSxRQUFBLG9CQUFBLFNBQUEsT0FBQTtRQUNBLEtBQUEsU0FBQSxVQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxpQkFBQTs7UUFFQSxLQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsTUFBQSxJQUFBOztRQUVBLEtBQUEsT0FBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBLElBQUE7OztBQ1RBLFFBQUEsT0FBQTtLQUNBLFdBQUEsOENBQUEsU0FBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUEsYUFBQTtRQUNBLElBQUEsUUFBQSxXQUFBO1lBQ0EsT0FBQTtnQkFDQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7OztRQUlBLElBQUEsU0FBQSxXQUFBO1lBQ0EsT0FBQTtnQkFDQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7O2dCQUVBO29CQUNBLEtBQUE7b0JBQ0EsS0FBQTs7Z0JBRUE7b0JBQ0EsS0FBQTtvQkFDQSxLQUFBOztnQkFFQTtvQkFDQSxLQUFBO29CQUNBLEtBQUE7Ozs7UUFJQSxJQUFBLFdBQUEsS0FBQSxVQUFBLE9BQUEsUUFBQSxJQUFBLFdBQUEsS0FBQTtRQUNBLE9BQUEsWUFBQSxXQUFBLEtBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxJQUFBO1FBQ0EsT0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLFdBQUEsV0FBQTtZQUNBLE9BQUEsT0FBQSxPQUFBLFFBQUEsUUFBQSxTQUFBLE9BQUE7Z0JBQ0EsSUFBQSxPQUFBLFVBQUEsV0FBQTtvQkFDQSxPQUFBLFNBQUEsSUFBQTtvQkFDQSxPQUFBO29CQUNBLE9BQUEsT0FBQSxRQUFBLFNBQUEsTUFBQTt3QkFDQSxPQUFBLFlBQUEsS0FBQSxLQUFBOzt1QkFFQSxJQUFBLE9BQUEsUUFBQSxjQUFBLFdBQUE7b0JBQ0EsTUFBQTs7cUJBRUE7b0JBQ0EsTUFBQSxZQUFBLEtBQUEsVUFBQSxPQUFBLFFBQUE7Ozs7O1FBS0EsT0FBQSxjQUFBLFdBQUE7WUFDQSxPQUFBLGFBQUEsQ0FBQSxPQUFBOztRQUVBLE9BQUEsWUFBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBLGFBQUEsT0FBQTtnQkFDQSxPQUFBLFNBQUEsUUFBQSxTQUFBLFNBQUE7b0JBQ0EsSUFBQSxTQUFBLFVBQUEsV0FBQTt3QkFDQSxPQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUE7NEJBQ0EsT0FBQSxZQUFBLEtBQUEsS0FBQTs7Ozs7O1FBTUEsT0FBQSxXQUFBLFdBQUE7WUFDQSxJQUFBLE1BQUE7WUFDQSxFQUFBLFFBQUEsT0FBQSxTQUFBLFNBQUEsUUFBQTtnQkFDQSxJQUFBLE9BQUEsTUFBQSxTQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUE7O1lBRUEsSUFBQSxRQUFBO1lBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLE1BQUEsR0FBQSxLQUFBO2dCQUNBLE1BQUEsS0FBQTs7WUFFQSxPQUFBOztRQUVBLE9BQUEsVUFBQSxXQUFBLEtBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsS0FBQTtRQUNBLEVBQUEsUUFBQSxPQUFBLFNBQUEsU0FBQSxRQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsRUFBQSxRQUFBLE9BQUEsT0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLFdBQUEsT0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBOzs7UUFHQSxJQUFBLGtCQUFBLFNBQUEsUUFBQSxNQUFBO1lBQ0EsSUFBQSxRQUFBLEVBQUEsS0FBQSxPQUFBLE9BQUE7WUFDQSxJQUFBLFdBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxhQUFBOztZQUVBLEVBQUEsUUFBQSxNQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLEtBQUEsZ0JBQUEsTUFBQSxTQUFBLGdCQUFBLEtBQUE7Z0JBQ0EsSUFBQSxLQUFBLGVBQUEsTUFBQSxTQUFBLGVBQUEsS0FBQTtnQkFDQSxJQUFBLEtBQUEsY0FBQSxNQUFBLFNBQUEsY0FBQSxLQUFBO2dCQUNBLElBQUEsS0FBQSxlQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUE7Z0JBQ0EsSUFBQSxLQUFBLGVBQUEsTUFBQSxTQUFBLGVBQUEsS0FBQTs7WUFFQSxTQUFBLEtBQUEsT0FBQTtnQkFDQSxJQUFBLE1BQUEsZUFBQSxRQUFBLE1BQUEsZUFBQSxHQUFBOztvQkFFQSxJQUFBLElBQUEsQ0FBQSxTQUFBLGVBQUEsU0FBQSxjQUFBLE1BQUE7b0JBQ0EsSUFBQSxJQUFBLENBQUEsU0FBQSxjQUFBLFNBQUEsY0FBQSxLQUFBO29CQUNBLElBQUEsSUFBQSxDQUFBLFNBQUEsYUFBQSxTQUFBLGVBQUE7b0JBQ0EsSUFBQSxJQUFBLFNBQUEsU0FBQSxjQUFBLFNBQUEsY0FBQTtvQkFDQSxJQUFBLElBQUEsT0FBQSxJQUFBO29CQUNBLElBQUEsSUFBQSxHQUFBLElBQUE7b0JBQ0EsSUFBQSxJQUFBLE9BQUEsSUFBQTtvQkFDQSxJQUFBLElBQUEsR0FBQSxJQUFBO29CQUNBLElBQUEsSUFBQSxPQUFBLElBQUE7b0JBQ0EsSUFBQSxJQUFBLEdBQUEsSUFBQTtvQkFDQSxJQUFBLElBQUEsT0FBQSxJQUFBO29CQUNBLElBQUEsSUFBQSxHQUFBLElBQUE7b0JBQ0EsT0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQTs7OztZQUlBLE9BQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQTs7UUFFQSxPQUFBLGNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQSxFQUFBLGNBQUEsTUFBQSxNQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUE7WUFDQSxPQUFBLE9BQUEsUUFBQSxTQUFBLFlBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUEsVUFBQSxXQUFBLEtBQUE7Z0JBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQTtnQkFDQSxPQUFBLGFBQUEsV0FBQSxLQUFBO2dCQUNBLEVBQUEsUUFBQSxPQUFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLE9BQUEsUUFBQTtvQkFDQSxFQUFBLFFBQUEsT0FBQSxPQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLEtBQUEsV0FBQSxPQUFBLElBQUEsT0FBQSxNQUFBLEtBQUE7OztnQkFHQSxFQUFBLFFBQUEsT0FBQSxTQUFBLFNBQUEsUUFBQTtvQkFDQSxnQkFBQSxPQUFBO29CQUNBLE9BQUEsTUFBQSxLQUFBLENBQUEsU0FBQSxPQUFBLEtBQUEsU0FBQSxPQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDblJBLFFBQUEsT0FBQTtLQUNBLE9BQUEsQ0FBQSxpQkFBQSxTQUFBLGdCQUFBLFVBQUE7O1FBRUEsZUFBQSxNQUFBLE9BQUE7WUFDQSxLQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBO2dCQUNBLHNCQUFBLFNBQUEsT0FBQTtvQkFDQSxPQUFBLE1BQUEsQ0FBQSxPQUFBLE1BQUEsSUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXNCQSxJQUFBLENBQUEsU0FBQSxTQUFBLE9BQUE7O1FBRUEsT0FBQSxHQUFBOztBQUVBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgbmVlZHMgdG8gYmUgbG9hZGVkIGZpcnN0IGJlY2F1c2UgaXQgZGVmaW5lcyB0aGUgZGVwZW5kZW5jaWVzLiBUaGUgZ3VscCB0YXNrIHdpbGwgYWx3YXlzIGNvbmNhdCB0aGlzIHRvIHRoZSB0b3Agb2YgZmlsZVxuYW5ndWxhci5tb2R1bGUoJ3dpbnN0b24nLCBbJ3VpLnJvdXRlciddKTsiLCJhbmd1bGFyLm1vZHVsZSgnd2luc3RvbicpXG4uc2VydmljZSgnYXBpU1ZDJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgdGhpcy5hZGROZXcgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc3RhdHMvYWRkJyxpdGVtKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvc3RhdHMvcmVtb3ZlJylcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3N0YXRzJylcbiAgICAgICAgfVxuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCd3aW5zdG9uJylcbiAgICAuY29udHJvbGxlcignbWFpbkNUUkwnLGZ1bmN0aW9uKCRzY29wZSxhcGlTVkMscHJlbG9hZE9iail7XG4gICAgICAgICRzY29wZS5fc2hvd0lucHV0ID0gZmFsc2U7XG4gICAgICAgIHZhciBzdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3dlZWsnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZGF0ZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdnJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2dzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfY29tcCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2F0dCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3BjdCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3lkcycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2F2ZycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3RkJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfaW50JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3Nfc2NrJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3Nfc2NreScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3JhdGUnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF9hdHQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF95ZHMnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF9hdmcnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF90ZCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdmdW0nLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZnVtX2xvc3QnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgVXN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZGF0ZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdnJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2dzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfY29tcCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2F0dCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3BjdCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3lkcycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX2F2ZycsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3RkJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3NfaW50JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3Nfc2NrJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Bhc3Nfc2NreScsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYXNzX3JhdGUnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF9hdHQnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF95ZHMnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF9hdmcnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncnVzaF90ZCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdmdW0nLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZnVtX2xvc3QnLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocHJlbG9hZE9iai5kYXRhLnN0YXR1cyA9PSAnZXJyJykgY29uc29sZS5sb2cocHJlbG9hZE9iai5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAkc2NvcGUuZ2FtZVN0YXRzID0gcHJlbG9hZE9iai5kYXRhLmRhdGEud2luc3RvbjtcbiAgICAgICAgJHNjb3BlLnN0YXRzID0gbmV3IHN0YXRzKCk7XG4gICAgICAgICRzY29wZS5Vc3RhdHMgPSBuZXcgVXN0YXRzKCk7XG4gICAgICAgICRzY29wZS5uZXdTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXBpU1ZDLmFkZE5ldygkc2NvcGUuVXN0YXRzKS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLlVzdGF0cyA9IG5ldyBVc3RhdHMoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvZ2dsZUlucHV0KCk7XG4gICAgICAgICAgICAgICAgICAgIGFwaVNWQy5sb2FkKCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZVN0YXRzID0gZGF0YS5kYXRhLndpbnN0b247XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQubWVzc2FnZS5jb25zdHJhaW50ID09ICdnYW1lX3BrJykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOiBUaGF0IGdhbWUgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGRhdGFiYXNlLiBEZWxldGUgaXQgZmlyc3QgaWYgeW91IHdhbnQgdG8gdXBkYXRlIGl0XCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KHJlc3VsdC5tZXNzYWdlLmRldGFpbCkpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnRvZ2dsZUlucHV0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuX3Nob3dJbnB1dCA9ICEkc2NvcGUuX3Nob3dJbnB1dDtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmRlbGV0ZVJvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCRzY29wZS5nYW1lU3RhdHMgIT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhcGlTVkMucmVtb3ZlKCkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlTVkMubG9hZCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5nYW1lU3RhdHMgPSBkYXRhLmRhdGEud2luc3RvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUubWF4R2FtZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtYXggPSAwO1xuICAgICAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5wbGF5ZXJzLCBmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmdhbWVzLmxlbmd0aCA+IG1heCkgbWF4ID0gcGxheWVyLmdhbWVzLmxlbmd0aDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHdlZWtzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IG1heCArIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHdlZWtzLnB1c2goaSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3ZWVrcztcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnBsYXllcnMgPSBwcmVsb2FkT2JqLmRhdGEuZGF0YS5wbGF5ZXJzO1xuICAgICAgICAkc2NvcGUuZ2FtZXMgPSBwcmVsb2FkT2JqLmRhdGEuZGF0YS5nYW1lcztcbiAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5wbGF5ZXJzLCBmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgIHBsYXllci5nYW1lcyA9IFtdO1xuICAgICAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5nYW1lcywgZnVuY3Rpb24oZ2FtZSkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lLnBsYXllciA9PT0gcGxheWVyLmlkKSBwbGF5ZXIuZ2FtZXMucHVzaChnYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGFjY3VtdWxhdGVTdGF0cyA9IGZ1bmN0aW9uKHBsYXllciwgd2Vlaykge1xuICAgICAgICAgICAgdmFyIGdhbWVzID0gXy50YWtlKHBsYXllci5nYW1lcywgd2Vlayk7XG4gICAgICAgICAgICB2YXIgc3RhdHNDdW0gPSB7XG4gICAgICAgICAgICAgICAgcGFzc2luZ19jb21wOjAsXG4gICAgICAgICAgICAgICAgcGFzc2luZ195ZHM6IDAsXG4gICAgICAgICAgICAgICAgcGFzc2luZ190ZDogMCxcbiAgICAgICAgICAgICAgICBwYXNzaW5nX2F0dDogMCxcbiAgICAgICAgICAgICAgICBwYXNzaW5nX2ludDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF8uZm9yRWFjaChnYW1lcyxmdW5jdGlvbihnYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ19jb21wICE9IG51bGwpIHN0YXRzQ3VtLnBhc3NpbmdfY29tcCArPSBnYW1lLnBhc3NpbmdfY29tcDtcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX3lkcyAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX3lkcyArPSBnYW1lLnBhc3NpbmdfeWRzO1xuICAgICAgICAgICAgICAgIGlmIChnYW1lLnBhc3NpbmdfdGQgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ190ZCArPSBnYW1lLnBhc3NpbmdfdGQ7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWUucGFzc2luZ19hdHQgIT0gbnVsbCkgc3RhdHNDdW0ucGFzc2luZ19hdHQgKz0gZ2FtZS5wYXNzaW5nX2F0dDtcbiAgICAgICAgICAgICAgICBpZiAoZ2FtZS5wYXNzaW5nX2ludCAhPSBudWxsKSBzdGF0c0N1bS5wYXNzaW5nX2ludCArPSBnYW1lLnBhc3NpbmdfaW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmdW5jdGlvbiByYXRlKHN0YXRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRzLnBhc3NpbmdfYXR0ICE9IG51bGwgJiYgc3RhdHMucGFzc2luZ19hdHQgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3JtdWxhIGZyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGFzc2VyX3JhdGluZ1xuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IChzdGF0c0N1bS5wYXNzaW5nX2NvbXAgLyBzdGF0c0N1bS5wYXNzaW5nX2F0dCAtIC4zKSAqIDU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gKHN0YXRzQ3VtLnBhc3NpbmdfeWRzIC8gc3RhdHNDdW0ucGFzc2luZ19hdHQgLSAzKSAqIC4yNTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSAoc3RhdHNDdW0ucGFzc2luZ190ZCAvIHN0YXRzQ3VtLnBhc3NpbmdfYXR0KSAqIDIwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IDIuMzc1IC0gKHN0YXRzQ3VtLnBhc3NpbmdfaW50IC8gc3RhdHNDdW0ucGFzc2luZ19hdHQgKiAyNSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhID4gMi4zNzUpIGEgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPCAwKSBhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIgPiAyLjM3NSkgYiA9IDIuMzc1O1xuICAgICAgICAgICAgICAgICAgICBpZiAoYiA8IDApIGIgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA+IDIuMzc1KSBjID0gMi4zNzU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjIDwgMCkgYyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkID4gMi4zNzUpIGQgPSAyLjM3NTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQgPCAwKSBkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhICsgYiArIGMgKyBkKSAvIDYgKiAxMDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbGF5ZXIucmF0aW5nID0gcmF0ZShzdGF0c0N1bSk7XG4gICAgICAgICAgICByZXR1cm4gcGxheWVyO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUucmF0ZVBsYXllcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gJCgnI3dlZWsycmF0ZScpLnZhbCgpLnNwbGl0KCcgJylbMV07XG4gICAgICAgICAgICAkc2NvcGUucmF0ZWQgPSBbXTtcbiAgICAgICAgICAgIGFwaVNWQy5sb2FkKCkuc3VjY2VzcyhmdW5jdGlvbihwbGF5ZXJzT2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyc09iaik7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBsYXllcnMgPSBwbGF5ZXJzT2JqLmRhdGEucGxheWVycztcbiAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZXMgPSBwbGF5ZXJzT2JqLmRhdGEuZ2FtZXM7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmdhbWVTdGF0ZXMgPSBwbGF5ZXJzT2JqLmRhdGEud2luc3RvbjtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goJHNjb3BlLnBsYXllcnMsIGZ1bmN0aW9uKHBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2FtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKCRzY29wZS5nYW1lcywgZnVuY3Rpb24oZ2FtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWUucGxheWVyID09PSBwbGF5ZXIuaWQpIHBsYXllci5nYW1lcy5wdXNoKGdhbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goJHNjb3BlLnBsYXllcnMsIGZ1bmN0aW9uKHBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICBhY2N1bXVsYXRlU3RhdHMocGxheWVyLHdlZWspO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmF0ZWQucHVzaCh7XCJwbGF5ZXJcIjpwbGF5ZXIubmFtZSxcInJhdGluZ1wiOnBsYXllci5yYXRpbmcsXCJpZFwiOlwicFwiK3BsYXllci5pZH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImFuZ3VsYXIubW9kdWxlKCd3aW5zdG9uJylcbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBzZWFyY2hTdmMpe1xuICAgICAgICAvLyBUaGVzZSBzdGF0ZXMgY29ycmVzcG9uZCB0byB0aGUgcGFnZXMgb24gdGhlIGFwcC4gSG9va3MgdXAgdGVtcGxhdGVzIGFuZCB2aWV3c1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3VwZGF0ZVN0YXRzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ21haW5DVFJMJyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBwcmVsb2FkT2JqOiBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDonR0VUJyx1cmw6Jy9hcGkvc3RhdHMnfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAgICAgLy8uc3RhdGUoJ3NlYXJjaCcse1xuICAgICAgICAgICAgLy8gICAgdXJsOiAnL3NlYXJjaCcsXG4gICAgICAgICAgICAvLyAgICB0ZW1wbGF0ZVVybDogJ3NlYXJjaC5odG1sJyxcbiAgICAgICAgICAgIC8vICAgIGNvbnRyb2xsZXI6ICdzZWFyY2hDVFJMJyxcbiAgICAgICAgICAgIC8vICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIC8vICAgICAgICAvLyBUaGlzIHF1ZXJpZXMgdGhlIHNlcnZlciBmb3IgZGlzdGluY3QgZGVwYXJ0bWVudHMgYW5kIHByZWxvYWRzIHRoZSBkZXBhcnRtZW50cyBkcm9wIGRvd25cbiAgICAgICAgICAgIC8vICAgICAgICBwcmVsb2FkT0JKOiBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDonR0VUJyx1cmw6Jy9hcGkvZGVwYXJ0bWVudHMnfSk7XG4gICAgICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgfVxuICAgICAgICAgICAgLy99KVxuICAgICAgICAgICAgLy8uc3RhdGUoJ2RldGFpbHMnLHtcbiAgICAgICAgICAgIC8vICAgIC8vIFRoZSA6aWQgaXMgdGhlIHN0cmluZyBwYXNzZWQgaW4gZnJvbSB0aGUgVVJMIGNvcnJlc3BvbmRzIHRvIHRoZSBwZXJzb25JRCBpbiB0aGUgdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAvLyAgICB1cmw6ICcvZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgLy8gICAgdGVtcGxhdGVVcmw6ICdkZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgLy8gICAgY29udHJvbGxlcjogJ2RldGFpbENUUkwnXG4gICAgICAgICAgICAvL30pXG4gICAgfV0pXG4gICAgLnJ1bihbJyRzdGF0ZScsZnVuY3Rpb24oJHN0YXRlKXtcbiAgICAgICAgLy8gRXZlcnl0aGluZyBpbnNpZGUgaGVyZSB3aWxsIGJlIHJ1biBvbmUgdGltZSBvbmNlIHRoZSBhcHAgaGFzIGxvYWRlZC4gR29vZCBwbGFjZSB0byBpbml0aWFsaXplIGFueXRoaW5nIHlvdSB3aWxsIGJlIHVzaW5nXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgIH1dKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==