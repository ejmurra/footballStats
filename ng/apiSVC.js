angular.module('winston')
.service('apiSVC', function($http) {
        this.add = function (params) {
            return $http.get('/api/stats/add?' + params)
        };
        this.remove = function (params) {
            return $http.get('/api/stats/remove?' + params)
        };
        this.load = function() {
            return $http.get('/api/stats')
        };
    });