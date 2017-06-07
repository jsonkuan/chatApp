// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'common', 'ngMessages', 'ngFileUpload', 'lr.upload']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('login');
    $stateProvider
    .state('login', {
            url: '/login',
            controller : 'loginController',
            templateUrl: 'partials/login.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                }
            }
        })
        .state('chat', {
            url:'/chat',
            controller: 'chatController',
            templateUrl: 'partials/chat.html',
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
            templateUrl: 'partials/settings.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                }
            }
        })
        .state('addChannel', {
            url: '/addChannel',
            controller: 'channelController',
            templateUrl: 'partials/addChannel.html',
            resolve: {
                session: function(Resolvers) {
                    return Resolvers.getUser();
                },
                allUsers: function(userService){
                    return userService.getUsers();
                }
            }
        });
});

app.run(function($ionicPlatform, $state, $rootScope, Resolvers) {
    $ionicPlatform.ready(function() {

        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

    });

    $rootScope.$on('$stateChangeStart', function(event, to) {
        var destination = to.name;
        Resolvers.getUser().then(function(response) {
            var user = response;
            console.log('achtung', user);
            //Block access outside of login when not logged in
            if (!user && destination !== "login") {
                console.log('nein!');
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
