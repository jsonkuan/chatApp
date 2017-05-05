/**
 * Created by niklasbolwede on 2017-05-03.
 */

angular.module('app').controller('loginController', function($scope, LoginAuthentication, $state) {
    

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