/**
 * Created by niklasbolwede on 2017-05-03.
 */

angular.module('app').run(function($rootScope, channelService){
    $rootScope.showReg = true;
    $rootScope.showUserName = false;
    $rootScope.showPasswordConfirm = false;
    $rootScope.showLoginButton = true;
    $rootScope.showRegButton = false;
    $rootScope.users = [];
    $rootScope.activeUser = {};
    $rootScope.channels = [];

    $rootScope.checkChannels = function() {

        var promise = Promise.resolve(channelService.get());
        promise.then(function (response) {

            if (response.data.length == 0) {

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
            name: "Crazy Cat Videos",
            private: false,
            user: [],
            message: []
        }, {
            name: "pr0n",
            private: false,
            user: [],
            message: []
        }];
        channelService.post(channels);
        console.log(channelService.get());
    };
    $rootScope.checkChannels();
});

angular.module('app').controller('loginController', function($scope, $rootScope, Authentication, $state, $filter, httpService) {

    $scope.loginButtonClicked = function() {
        if(Authentication.login($scope.email, $scope.password)) {
            $state.transitionTo('chat');
        } else {
            $scope.error = '';
            $scope.email = '';
            $scope.password = '';
            alert("Incorrect!")
        }
    };

    $scope.registerButtonClicked = function() {
        if(Authentication.register($scope.email, $scope.password, $scope.passwordConfirm)) {
            var user = {email: $filter('lowercase')($scope.email), username: $scope.username, password: $scope.password, avatar:"", public: [], private: []};
            $rootScope.users.push(user);
            shownElements();
            httpService.post(user);

        } else {
            alert("Incorrect!")
        }
    };

    $scope.registerClicked = function() {
        shownElements();
    };

    var shownElements = function() {
        $rootScope.showReg = !$rootScope.showReg;
        $rootScope.showLoginButton = !$rootScope.showLoginButton;
        $rootScope.showRegButton = !$rootScope.showRegButton;
        $rootScope.showPasswordConfirm = !$rootScope.showPasswordConfirm;
        $rootScope.showUserName = !$rootScope.showUserName;
    }
});

angular.module('app').factory('Authentication', function($rootScope) {
    return {
        login : function(inputEmail, inputPassword) {
            var isAuthenticated = false;
            for (var i = 0; i < $rootScope.users.length; i++){
                if(inputEmail === $rootScope.users[i].email && inputPassword === $rootScope.users[i].password){
                    isAuthenticated = true;
                    console.log("UsersChecked: "+$rootScope.users[i].email +" "+ $rootScope.users[i].password + " valid: "+ isAuthenticated);
                    $rootScope.activeUser = {email: $rootScope.users[i].email, username: $rootScope.users[i].username, password: $rootScope.users[i].password};
                }
            }
            return isAuthenticated;
        },
        register : function(inputEmail, inputPassword, passwordConfirm) {
            var isAuthenticated = false;
            if (inputPassword === passwordConfirm){
                if($rootScope.users.length > 0){
                    for (var i = 0; i < $rootScope.users.length; i++){
                        if(inputEmail === $rootScope.users[i].email){
                            isAuthenticated = false;
                        } else {
                            isAuthenticated = true;
                        }
                    }
                } else {
                    isAuthenticated = true;
                }
            } else {
                isAuthenticated = false;
            }
            return isAuthenticated;
        }
    };
});