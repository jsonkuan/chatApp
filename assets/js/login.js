/**
 * Created by niklasbolwede on 2017-05-03.
 */

angular.module('app').controller('loginController', function($scope, $rootScope) {
    var email= "a@a.com";
    var password = "1234";

    function loginClicked() {
        if(LoginAuthentication.login($scope.loginForm.email, $scope.loginForm.password)) {
            $scope.error = '';
            $scope.username = '';
            $scope.password = '';
            $state.transitionTo('chat');
        } else {
            alert("Incorrect!")
        }
    }
});

angular.module('app').factory('LoginAuthentication', function() {
    var email = 'a@a.com';
    var password = '1234';
    var isAuthenticated = false;

    return {
        login : function(inputEmail, inputPassword) {
            if (email === inputEmail && password === inputPassword){
                isAuthenticated = true;
            }
            return isAuthenticated;
        }
        /*isAuthenticated : function() {
         return isAuthenticated;
         }*/
    };

});