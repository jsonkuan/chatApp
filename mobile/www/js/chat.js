app.controller('chatController', function($scope, $ionicSideMenuDelegate, userService) {

  $scope.users = [];

     $scope.toggleLeft = function() {
       $ionicSideMenuDelegate.toggleLeft();
     };

    userService.getUsers().then(function(result){
    $scope.users = result;
    console.log(result);
  })
});
