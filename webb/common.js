/**
 * Created by niklasbolwede on 2017-05-31.
 */
(function() {

    app.factory('REST', ['$http', '$q', function($http, $q) {
        return {
            get: function get(url) {
                //console.log('REST.get', url);
                return $q(function(resolve) {
                    $http.get(url).then(function(response) {
                        resolve(response.data);
                    });
                });
            },
            post: function post(url, body) {
                return $q(function(resolve) {
                    $http.post(url, body).then(function(response) {
                        resolve(response);
                    });
                });
            },
            put: function put(url, body) {
                return $q(function(resolve) {
                    $http.put(url, body).then(function(response) {
                        resolve(response);
                    });
                });
            },
            delete: function put(url, id) {
                return $q(function(resolve) {
                    $http.delete(url + id).then(function(response) {
                        resolve(response);
                    });
                });
            }
        };
    }]);

    app.factory("userService", ["REST", function(REST) {
        var url = '/users';
        return{
            active: null,
            post: function (user) {
                return REST.post(url, user);
            },
            updateUser: function (user) {
                return REST.put(url, user);
            },
            deleteUser: function(id) {
                return REST.delete(url, id);
            },
            getUsers: function() {
                return REST.get(url);
            },
            get: function(id) {
                return REST.get('/user?id=' + id);
            }
        };
    }]);

    app.factory("messageService", ["REST", function (REST) {
        var url = '/messages';
        return {
            post: function(message) {
                return REST.post(url, message);
            },
            getAllMessages: function(query) {
                return REST.get(url + query);
            }
        };
    }]);

    app.factory('channelService', function(REST, userService) {
        var url = '/channel';
        return {
            current: null,

            post: function(channel) {
                return REST.post(url, channel);
            },
            get: function(query) {
                return REST.get(url + query);
            },
            getAll: function() {
                return REST.get('/channels');
            },
            getChannelsForUser: function(userId) {
                return REST.get('/channels?user=' + userId);
            },
            updateTimeStamp: function(channel) {
                return REST.put(url, channel);
            }
        };
    });

})();





