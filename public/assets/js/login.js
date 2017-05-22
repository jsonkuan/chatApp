angular.module('app').controller('loginController', function($scope, $state, $filter, $cookies, userService, session) {
    $scope.showReg = true;
    $scope.showUserName = false;
    $scope.showPasswordConfirm = false;
    $scope.showLoginButton = true;
    $scope.showRegButton = false;
    $scope.isAuthenticated = false;
    $scope.user = {};

    userService.getUsers().then(function(response) {
        $scope.user = response;
    });

    $scope.loginButtonClicked = function() {
        userService.getUsers().then(function(response) {
            $scope.user = response;
        });
        if ($scope.login($scope.email, $scope.password)) {
            userService.active.status = "online";
            userService.updateUser(userService.active);
            
            //NOTE: Store user id as cookie on login.
            $cookies.put('user', userService.active._id);

            $state.transitionTo('chat');
        } else {
            $scope.password = "";
        }
    };

    $scope.validateEmail = function(){
        for(var x = 0; x < allUsers.length; x++){
            if (allUsers[x].email === $scope.email){
                $scope.loginForm.email.$setValidity("validationError", true);
            }
        }
    };

    $scope.registerButtonClicked = function() {
        if($scope.username && $scope.email && $scope.password && $scope.confirm){
            if (Authentication.register($scope.email, $scope.password, $scope.confirm)){
                var user = { email: $filter('lowercase')($scope.email), username: $scope.username, password: $scope.password, avatar: "assets/images/defaultProfile.png", status: "offline"};
                shownElements();
                $scope.email = $scope.email.toLowerCase();
                userService.post(user).then(function(response) {
                  userService.getUsers().then(function(response) {
                    $scope.user = response;
                  });
                });
            } else {
            }
        }else{
            $scope.loginForm.username.$touched = true;
            $scope.loginForm.email.$touched = true;
            $scope.loginForm.password.$touched = true;
            $scope.loginForm.confirm.$touched = true;
        }
    };

    $scope.registerClicked = function() {
        shownElements();
    };

    var shownElements = function() {
        $scope.showReg = !$scope.showReg;
        $scope.showLoginButton = !$scope.showLoginButton;
        $scope.showRegButton = !$scope.showRegButton;
        $scope.showPasswordConfirm = !$scope.showPasswordConfirm;
        $scope.showUserName = !$scope.showUserName;
    };

    $scope.login = function(inputEmail, inputPassword) {
        console.log($scope.user.length);
        for (var i = 0; i < $scope.user.length; i++) {
            if (inputEmail === $scope.user[i].email && inputPassword === $scope.user[i].password) {
                $scope.isAuthenticated = true;
                userService.active = $scope.user[i];
                return $scope.isAuthenticated;
            }
        }
    };
  
    $scope.register = function(inputEmail, inputPassword, passwordConfirm) {
        console.log(inputPassword, passwordConfirm);
        if (inputPassword === passwordConfirm && inputPassword != undefined) {
            if ($scope.user.length > 0){
                for (var i = 0; i < $scope.user.length; i++){
                    $scope.isAuthenticated = inputEmail !== $scope.user[i].email;
                }
            } else {
                $scope.isAuthenticated = true;
            }
        }
        return $scope.isAuthenticated;
    };
});