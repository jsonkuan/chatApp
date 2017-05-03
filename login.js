/**
 * Created by niklasbolwede on 2017-05-03.
 */
var app = angular.module('app', ["ui.router"]);



app.controller('IndexController', function($scope, $rootScope) {
    var email= "a@a.com";
    var password = "1234";
    if ($login.email === email && $login.password === password){
        alert("Success!");
    }else {
        alert("Fail!");
    }
});