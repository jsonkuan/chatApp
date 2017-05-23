angular.module('app').controller('loginController', function($scope, $state, $filter, $cookies, userService, session) {
    $scope.showReg = true;
    $scope.showUserName = false;
    $scope.showPasswordConfirm = false;
    $scope.showLoginButton = true;
    $scope.showRegButton = false;
    $scope.isAuthenticated = true;
    $scope.user = {};
    $scope.users = {};

    userService.getUsers().then(function(response) {
        $scope.user = response;
        $scope.users = response;
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
        for (var i = 0; i < $scope.users.length; i++){
            if($scope.email === $scope.users[i].email){
                //då skall error sättas
                alert("error");
            }
        }
    };

    $scope.registerButtonClicked = function() {
        $scope.validateEmail();
        if($scope.username && $scope.email && $scope.password && $scope.confirm){
            if ($scope.register($scope.email, $scope.password, $scope.confirm)){
                var user = { email: $filter('lowercase')($scope.email), username: $scope.username, password: $scope.password, avatar: "assets/images/defaultProfile.png", status: "offline"};
                shownElements();
                $scope.email = $scope.email.toLowerCase();
                userService.post(user).then(function(response) {
                  userService.getUsers().then(function(response) {
                    $scope.user = response;
                  });
                });
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
        if (inputPassword === passwordConfirm) {
            for (var i = 0; i < $scope.user.length; i++){
                if(inputEmail === $scope.user[i].email)
                {
                    $scope.isAuthenticated = false;
                }
            }
        } else {
            $scope.isAuthenticated = false;
        }
        return $scope.isAuthenticated;
    };
});