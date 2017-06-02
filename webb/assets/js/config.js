var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngMaterial','ngFileUpload', 'lr.upload', 'ngSanitize', 'ui.bootstrap', 'angular-smilies', 'ngMessages', 'ngCookies', 'luegg.directives', 'common']);

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
                users: function(session, currentChannel, channelService) {
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
                }, 
                allUsers: function(userService){
                    return userService.getUsers();
                }
            }
        });
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