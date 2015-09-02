angular.module('winston')
    .config(['$stateProvider',function($stateProvider, searchSvc){
        // These states correspond to the pages on the app. Hooks up templates and views
        $stateProvider.state('home',{
            url: '/',
            templateUrl: 'updateStats.html',
            controller: 'mainCTRL',
            resolve: {
                preloadObj: function($http) {
                    return $http({method:'GET',url:'/api/stats'})
                }
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
