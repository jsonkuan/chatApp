app.controller('loginController', function($scope, $state, $filter, userService) {
  $scope.showReg = true;
  $scope.showUserName = false;
  $scope.showPasswordConfirm = false;
  $scope.showLoginButton = true;
  $scope.showRegButton = false;
  $scope.showCancel = false;
  $scope.isAuthenticated = true;
  $scope.placeHolder = "Email";
  $scope.user = {};

  userService.get('133333333333333333333337').then(function(response) {
    if (!response) {
      userService.post({
        _id: "133333333333333333333337",
        username: "SnakkBot",
        email: "bot@snakk.com",
        password: "2017",
        avatar: "img/snakk-bot.jpg",
        status: "offline"
      });
    }
  });

  $scope.loginButtonClicked = function() {
    userService.get('133333333333333333333337').then(function(response) {
        if (!response) {
            userService.post({
                _id: "133333333333333333333337",
                username: "SnakkBot",
                email: "bot@snakk.com",
                password: "2017",
                avatar: "www/img/snakk-bot.jpg",
                status: "offline"
            });
        }
    });

    userService.getUsers().then(function(response) {
        $scope.user = response;

        if ($scope.login($scope.email, $scope.password)) {
            /*if(userService.active.status === "online"){
            $scope.placeHolder = "You are already logged in";
            }else {*/
            userService.active.status = "online";
            userService.updateUser(userService.active);
            localStorage['user'] = userService.active._id;
            $state.transitionTo('chat');
            //}
        } else {
            $scope.password = "";
        }
    });
  };

  $scope.registerButtonClicked = function() {
    $scope.isAuthenticated = true;
    if($scope.username && $scope.email && $scope.password && $scope.confirm){
      if ($scope.register($scope.email, $scope.password, $scope.confirm)){
        var user = { email: $filter('lowercase')($scope.email), username: $scope.username,
          password: $scope.password, avatar: "img/defaultProfileWhite.png", status: "offline", warnings: 0};
        shownElements();
        $scope.email = $scope.email.toLowerCase();
        userService.post(user).then(function(response) {
          userService.getUsers().then(function(response) {
            $scope.user = response;
          });
        });
      }
    }else{

    }
  };

  $scope.registerClicked = function() {
    shownElements();
  };

  $scope.cancelClicked = function() {
    shownElements();
  };

  var shownElements = function() {
    $scope.showReg = !$scope.showReg;
    $scope.showLoginButton = !$scope.showLoginButton;
    $scope.showRegButton = !$scope.showRegButton;
    $scope.showPasswordConfirm = !$scope.showPasswordConfirm;
    $scope.showUserName = !$scope.showUserName;
    $scope.showCancel = !$scope.showCancel;
  };

  $scope.login = function(inputEmail, inputPassword) {
    //console.log($scope.user.length);
    for (var i = 0; i < $scope.user.length; i++) {
      if (inputEmail === $scope.user[i].email && inputPassword === $scope.user[i].password) {
        $scope.isAuthenticated = true;
        userService.active = $scope.user[i];
        return $scope.isAuthenticated;
      }
    }
  };
  $scope.register = function(inputEmail, inputPassword, passwordConfirm) {
    //console.log(inputPassword, passwordConfirm);
    if (inputPassword === passwordConfirm) {
      for (var i = 0; i < $scope.user.length; i++){
        if(inputEmail === $scope.user[i].email)
        {
          $scope.isAuthenticated = false;
          $scope.email = "";
          $scope.placeHolder = "User exists";
        }
      }
    } else {
      $scope.isAuthenticated = false;
    }
    return $scope.isAuthenticated;
  };
});
