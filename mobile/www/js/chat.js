app.controller('chatController', function($scope, $ionicSideMenuDelegate) {

     $scope.toggleLeft = function() {
       $ionicSideMenuDelegate.toggleLeft();
     };



});
