var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngMaterial']);

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
            url:'/chat/:channelId',
            controller: 'chatController',
            templateUrl: 'assets/partials/chat.html'
        })
        .state('settings', {
            url: '/settings',
            controller: "settingsController",
            templateUrl: 'assets/partials/settings.html'
    });
});

app.factory("httpService", ["$http", function ($http){
    return{
        post: function (user){
            $http.post("/", user)
                .then(function(response){

                    console.log(response.data);
                    console.log(user);
                });
        },
        getUsers: function(){
            return $http({
                method: 'GET',
                url: 'http://localhost:3000'
            }).then(function(response){


            });
        }
    };
}]);

app.factory("messageService", ["$http", function ($http){
    return{
        post: function (message){
            return $http.post("/messages", message)
                .then(function(response){
                    console.log(response.data);
                    console.log(message);
                });
        },
        get: function(){
            return $http({
                method: 'GET',
                url: 'http://localhost:3000'
            }).then(function(response){


            });
        }
    };
}]);

angular.module('app').factory('channelService', function($http) {
    return {
        post: function(channel) {
            return $http.post('/channel', channel).then(function(response) {
                console.log('Post successful', response.data);
            });
        },
        get: function() {
            return $http.get('/channel');
        }
    };
} );

app.run(function($rootScope, channelService) {
    $rootScope.channels = [];

    $rootScope.checkChannels = function() {

        console.log("Checking channels");
        var promise = Promise.resolve(channelService.get());
        promise.then(function (response) {

            if (response.data.length === 0) {

                console.log("No data found");
                $rootScope.generateChannels();
            } else {
                $rootScope.channels = response.data;
                console.log(response.data, "Channels already exists");
                console.log("Length of channels: ", $rootScope.channels.length);
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
            console.log("Post .then tjohej. Response: ", response);
            $rootScope.checkChannels();
        });
        console.log(channelService.get());

    };
    $rootScope.checkChannels();
});