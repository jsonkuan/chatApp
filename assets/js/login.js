/**
 * Created by niklasbolwede on 2017-05-03.
 */

angular.module('app').run(function($rootScope){
    $rootScope.showReg = true;
    $rootScope.showPasswordConfirm = false;
    $rootScope.showLoginButton = true;
    $rootScope.showRegButton = false;
});

angular.module('app').controller('loginController', function($scope, $rootScope, LoginAuthentication, $state) {
    
    
    $scope.loginClicked = function() {
        console.log($scope.email);
        if(LoginAuthentication.login($scope.email, $scope.password)) {
            $state.transitionTo('chat');
        } else {
            $scope.error = '';
            $scope.email = '';
            $scope.password = '';
            alert("Incorrect!")
        }
    }

    $scope.registerClicked = function() {
        $rootScope.showReg = false;
        $rootScope.showLoginButton = false;
        $rootScope.showRegButton = true;
        $rootScope.showPasswordConfirm = true;
    }
});



angular.module('app').factory('LoginAuthentication', function() {
    var isAuthenticated = false;
    var email= "a@a.com";
    var password = "1234";
    return {
        login : function(inputEmail, inputPassword) {
            console.log(inputEmail);
            if (inputEmail === email && inputPassword === password){
                isAuthenticated = true;
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