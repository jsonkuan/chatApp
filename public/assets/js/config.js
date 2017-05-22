var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngMaterial','ngFileUpload', 'lr.upload', 'ngSanitize', 'ui.bootstrap', 'angular-smilies', 'ngMessages', 'ngCookies', 'luegg.directives']);

app.config(function($mdThemingProvider, $stateProvider, $qProvider, $urlRouterProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('login');
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $stateProvider
        .state('login', {
            url: '/login',
            controller : 'loginController',
            templateUrl: 'assets/partials/login.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                }
            }
        })
        .state('chat', {
            url:'/chat',
            controller: 'chatController',
            templateUrl: 'assets/partials/chat.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                },
                currentChannel: function(session, Resolvers) {
                    return Resolvers.getChannel();
                },
                userChannels: function(session, currentChannel, channelService) {
                    return channelService.getChannelsForUser(session._id);
                },
                userContacts: function(session, userService){
                    return userService.getUsers();
                }
            }
        })
        .state('settings', {
            url: '/settings',
            controller: 'settingsController',
            templateUrl: 'assets/partials/settings.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                }
            }
        })
        .state('addChannel', {
            url: '/addChannel',
            controller: 'channelController',
            templateUrl: 'assets/partials/addChannel.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                }
            }
        });
});

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

angular.module('app').factory('channelService', function(REST, userService) {
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

app.run(function($rootScope, $state, $cookies, Resolvers) {
    //NOTE: Uncomment below and run app to clear user cookie.
    //$cookies.remove('user');
    //Watches for state changes.
    $rootScope.$on('$stateChangeStart', function(event, to) {
        var destination = to.name;
        Resolvers.getUser().then(function(response) {
            var user = response;
            //Block access outside of login when not logged in
            if (!user && destination !== "login") {
                event.preventDefault();
                $state.go('login');
            //Block access to login when not logged in
            } else if (user && destination === "login") {
                event.preventDefault();
                //TODO: Send back to previous state instead of 'chat
                $state.go('chat');
            }
        });
    });
});