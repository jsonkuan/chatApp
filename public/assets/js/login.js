angular.module('app').run(function($rootScope) {
    $rootScope.showReg = true;
    $rootScope.showUserName = false;
    $rootScope.showPasswordConfirm = false;
    $rootScope.showLoginButton = true;
    $rootScope.showRegButton = false;
    $rootScope.user = {};
    $rootScope.activeUser = {};
    $rootScope.activeChannel = 'Afterwork';
});

angular.module('app').controller('loginController', function($scope, $rootScope, Authentication, $state, $filter, userService) {
    var allUsers = userService.getUsers();
    allUsers.then(function(response) {
        console.log('allUsers', response);
        $rootScope.user = response;
    });

    $scope.loginButtonClicked = function() {
        if (Authentication.login($scope.email, $scope.password)) {
            $state.transitionTo('chat');
        } else {
            $scope.password = "";
        }
    };

    $scope.registerButtonClicked = function() {
        //TODO if database is empty on users you shouldnt have to press login 2 times
        if($scope.username && $scope.email && $scope.password && $scope.confirm){
            if (Authentication.register($scope.email, $scope.password, $scope.confirm)){
                var user = { email: $filter('lowercase')($scope.email), username: $scope.username, password: $scope.password, avatar: ""};
                shownElements();
                $scope.email = $scope.email.toLowerCase();
                userService.post(user).then(function(response) {
                    console.log('new user added');
                    var allUsers = userService.getUsers();
                    allUsers.then(function(response) {
                        $rootScope.user = response;
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
        $rootScope.showReg = !$rootScope.showReg;
        $rootScope.showLoginButton = !$rootScope.showLoginButton;
        $rootScope.showRegButton = !$rootScope.showRegButton;
        $rootScope.showPasswordConfirm = !$rootScope.showPasswordConfirm;
        $rootScope.showUserName = !$rootScope.showUserName;
    };
});

angular.module('app').factory('Authentication', function($rootScope, userService) {
    return {
        login: function(inputEmail, inputPassword) {
            var isAuthenticated = false;

            for (var i = 0; i < $rootScope.user.length; i++) {
                if (inputEmail === $rootScope.user[i].email && inputPassword === $rootScope.user[i].password) {
                    var em = $rootScope.user[i].email;
                    var pw = $rootScope.user[i].password;
                    console.log(em + " " + pw);
                    isAuthenticated = true;

                    $rootScope.activeUser = $rootScope.user[i];
                    //NOTE: Set active user in userService
                    userService.active = $rootScope.user[i];
                    console.log("input email and password  " + inputEmail + " " + "  " + inputPassword + ":::  database data  " +
                        $rootScope.user[i].email + "  " + $rootScope.user[i].password);
                }
            }
            return isAuthenticated;
        },
        register: function(inputEmail, inputPassword, passwordConfirm) {
            var isAuthenticated = true;
            if (inputPassword === passwordConfirm) {
                    for (var i = 0; i < $rootScope.user.length; i++){
                        if (inputEmail === $rootScope.user[i].email){
                            isAuthenticated = false;
                        }
                    }
            } else {
                isAuthenticated = false;
            }
            return isAuthenticated;
        }
    };
});