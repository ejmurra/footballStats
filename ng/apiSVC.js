angular.module('winston')
.service('apiSVC', function($http) {
        this.addNew = function (item) {
            return $http.post('/api/stats/add',item)
        };
        this.remove = function (item) {
            return $http.post('/api/stats/remove',item)
        };
        this.load = function() {
            return $http.get('/api/stats')
        }
    });