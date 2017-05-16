var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngMaterial', 'ngSanitize', 'ui.bootstrap', 'angular-smilies']);

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
    }
}]);
