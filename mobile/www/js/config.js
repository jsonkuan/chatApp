var app = angular.module('starter', ['ui.router','ionic', 'common', 'ngMessages']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('login');
    $stateProvider
        .state('login', {
            url: '/login',
            controller : 'loginController',
            templateUrl: 'partials/login.html'
        })
        .state('chat', {
            url: '/chat',
            controller : 'chatController',
            templateUrl: 'partials/chat.html'
        });
});
