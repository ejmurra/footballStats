angular.module('winston')
.service('apiSVC', function($http) {
        this.addNew = function (item) {
            return $http.post('/api/stats/add',item)
        };
        this.remove = function () {
            return $http.get('/api/stats/remove')
        };
        this.load = function() {
            return $http.get('/api/stats')
        }
    });