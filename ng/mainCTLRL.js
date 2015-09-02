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
        $scope.gameStats = preloadObj.data.data;
        $scope.stats = new stats();
        $scope.newStats = function() {
            apiSVC.addNew($scope.stats).success(function(result){
                if (result.status == "success") {
                    $scope.stats = new stats();
                    $scope.toggleInput();
                    apiSVC.load().success(function(data) {
                        $scope.gameStats = data.data;
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
            apiSVC.remove({week: $('#row2delete').val().split(' ')[1]}).success(function(response){
                if (response.status == 'success') {
                    apiSVC.load().success(function(data) {
                        $scope.gameStats = data.data;
                    })
                }
            })
        }
    });