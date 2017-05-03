var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $qProvider, $urlRouterProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('login');
    $stateProvider
        .state('login', {
            url: '/login',
            //use assets folder in the search path
            templateUrl: 'assets/partials/login.html',
            //add controller
        });
});