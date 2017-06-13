/**
 * Created by niklasbolwede on 2017-05-31.
 */
(function() {
    var app = angular.module('common', []);
    app.factory('REST', ['$http', '$q', function($http, $q) {
        // for server use: http://83.249.240.91
        var host = 'http://localhost:3000';
        return {
            get: function get(url) {
                return $q(function(resolve) {
                    $http.get(host + url).then(function(response) {
                        resolve(response.data);
                    });
                });
            },
            post: function post(url, body) {
                return $q(function(resolve) {
                    $http.post(host + url, body).then(function(response) {
                        resolve(response);
                    });
                });
            },
            put: function put(url, body) {
                return $q(function(resolve) {
                    $http.put(host + url, body).then(function(response) {
                        resolve(response);
                    });
                });
            },
            delete: function put(url, id) {
                return $q(function(resolve) {
                    $http.delete(host + url + id).then(function(response) {
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
            getAllMessages: function(channel) {
                return REST.get(url + '?channel=' + channel);
            },
            getNewMessages: function(channel, timestamp) {
                return REST.get('/messages/new' + '?channel=' + channel + '&timestamp=' + timestamp);
            },
            getTopPosters: function(){
                return REST.get('/messages');
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

    // Factory for handling specific/detailed promises/resolves
    app.factory('Resolvers', function($q, REST, channelService, userService, Generator) {
        return {
            //Makes sure a current channel is set and returns it
            getChannel: function() {
                return $q(function(resolve) { 
                    if (channelService.current) {
                        resolve(channelService.current);
                    } else {
                        channelService.getAll().then(function(response) {
                            if (response.length > 0) {
                                channelService.current = response[0];
                                resolve(channelService.current);
                            } else {
                                Generator.channels().then(function(response) {
                                    channelService.current = response.data[0];
                                    resolve(channelService.current);
                                });
                            }
                        });
                    }
                });
            },
            //Checks if a user is active or saved as a cookie, and returns the user OR null if not found.
            getUser: function() {
                return $q(function(resolve) {
                    if (userService.active) {
                        resolve(userService.active);
                    } else {
                        var userId = localStorage['user'];
                        if (userId) {
                            userService.get(userId).then(function(response) {
                                //TODO: account for empty response
                                userService.active = response;
                                resolve(response);
                            });
                        } else {
                            resolve(null);
                        }
                    }
                });
            }
        }
    });

    // Factory for generating default channels
    app.factory('Generator', function(channelService) {
        return {
            channels: function() {
                var channels = [{
                    name: "General",
                    purpose: 'Chat about everything.',
                    accessability: 'public',
                    users: [],
                    timestamp: ''
                }, {
                    name: "Work",
                    purpose: 'Keep it clean!',
                    accessability: 'public',
                    users: [],
                    timestamp: ''
                }, {
                    name: "Afterwork",
                    purpose: 'NSFW is alllowed here.',
                    accessability: 'public',
                    users: [],
                    timestamp: ''
                }, {
                    name: "Crazy cat-lady Videos",
                    purpose: 'Here everyone has to love cats!',
                    accessability: 'public',
                    users: [],
                    timestamp: ''
                }, {
                    name: "pr0n",
                    purpose: 'A chat for funny ASCII images',
                    accessability: 'public',
                    users: [],
                    timestamp: ''
                }];
                return channelService.post(channels);            
            }
        };
    });

})();





