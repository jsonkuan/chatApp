//TODO bug: if not registered user clicks login before registration and then register and log in = Fails to login

angular.module('app').controller('loginController', function($scope, $state, $filter, userService) {
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
            $state.transitionTo('chat');
        } else {
            /*$scope.error = '';
            $scope.email = '';
            $scope.password = '';*/
            alert("Incorrect!");
        }
    };

    $scope.registerButtonClicked = function() {
        if ($scope.register($scope.email, $scope.password, $scope.passwordConfirm)){
            var user = { email: $filter('lowercase')($scope.email), username: $scope.username, password: $scope.password, avatar: "assets/images/defaultProfile.png", status: "offline"};
            shownElements();
            userService.post(user).then(function(response) {
               userService.getUsers().then(function(response) {
                    $scope.user = response;
                });
            });

        } else {
            alert("Incorrect!");
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