var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngMaterial','ngFileUpload']);

app.config(function($mdThemingProvider, $stateProvider, $qProvider, $urlRouterProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('login');
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $stateProvider
        .state('login', {
            url: '/login',
            controller : 'loginController',
            //use assets folder in the search path
            templateUrl: 'assets/partials/login.html'
            //add controller
        })
        .state('chat', {
            url:'/chat/:channelName',
            controller: 'chatController',
            templateUrl: 'assets/partials/chat.html'
        })
        .state('settings', {
            url: '/settings',
            controller: 'settingsController',
            templateUrl: 'assets/partials/settings.html'
        })
        .state('addChannel', {
            url: '/addChannel',
            controller: 'channelController',
            templateUrl: 'assets/partials/addChannel.html'
        })
});

app.factory('REST', ['$http', '$q', function($http, $q) {
    return {
        get: function get(url) {
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
        }
    };
}]);

app.factory("userService", ["REST", function(REST) {
    var url = '/users';
    return{
        post: function (user){
            return REST.post(url, user);
        },
        updateUser: function (user){
            return REST.put(url, user);
        },
        getUsers: function(){
            return REST.get(url);
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
            console.log("messageService.get query: ",query);
            return REST.get(url + query);
        }

    };
}]);

angular.module('app').factory('channelService', function(REST) {
    var url = '/channel';
    return {
        post: function(channel) {
            return REST.post(url, channel);
        },
        get: function(query) {
            console.log("channelService.get Url + query", url + query);
            return REST.get(url + query);
        },
        getAll: function() {
            return REST.get('/channels');
        }
    };
});

app.run(function($rootScope, channelService) {
    $rootScope.channels = [];

    $rootScope.checkChannels = function() {
        channelService.getAll().then(function(response) {
            if (response.length === 0) {
                $rootScope.generateChannels();
            } else {
                $rootScope.channels = response;
            }
        });
    };

    $rootScope.generateChannels = function() {
        var channels = [{
            name: "General",
            private: false,
            user: [],
            message: []
        }, {
            name: "Work",
            private: false,
            user: [],
            message: []
        }, {
            name: "Afterwork",
            private: false,
            user: [],
            message: []
        }, {
            name: "Crazy cat-lady Videos",
            private: false,
            user: [],
            message: []
        }, {
            name: "pr0n",
            private: false,
            user: [],
            message: []
        }];
        channelService.post(channels).then(function(response){
            console.log("Generating new channels.", response);
            $rootScope.checkChannels();
        });
    };

    $rootScope.checkChannels();
});
