/**
 * Created by niklasbolwede on 2017-05-03.
 */

angular.module('app').run(function($rootScope){
    $rootScope.showReg = true;
    $rootScope.showPasswordConfirm = false;
    $rootScope.showLoginButton = true;
    $rootScope.showRegButton = false;
    $rootScope.users = [];
});

angular.module('app').controller('loginController', function($scope, $rootScope, Authentication, $state) {
    
    
    $scope.loginButtonClicked = function() {
        console.log($scope.email);
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
        console.log($scope.email);
        if(Authentication.register($scope.email, $scope.password, $scope.passwordConfirm)) {
            var user = {email: $scope.email, password: $scope.password};
            $rootScope.users.push(user);
            shownElements();

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
    }

});



angular.module('app').factory('Authentication', function($rootScope) {
    var isAuthenticated = false;
    var email= "a@a.com";
    var password = "1234";
    return {
        login : function(inputEmail, inputPassword) {
            if (inputEmail === email && inputPassword === password){
                isAuthenticated = true;
            } else {
                isAuthenticated = false;
            }
            
            return isAuthenticated;
        },
        register : function(inputEmail, inputPassword, passwordConfirm) {
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
        /*isAuthenticated : function() {
         return isAuthenticated;
         }*/
    };

});