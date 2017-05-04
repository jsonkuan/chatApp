/**
 * Created by niklasbolwede on 2017-05-03.
 */
<<<<<<< HEAD
var app = angular.module('app', ["ui.router"]);



app.controller('IndexController', function($scope, $rootScope) {
    var email= "a@a.com";
    var password = "1234";
    if ($login.email === email && $login.password === password){
        alert("Success!");
    }else {
        alert("Fail!");
=======
angular.module('app').controller('loginController', function($scope, $rootScope) {
    var email= "a@a.com";
    var password = "1234";
   
    function loginClicked() {

>>>>>>> origin/login
    }
});