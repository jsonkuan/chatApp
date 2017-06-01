app.controller('chatController', function() {

   function ContentController($scope, $ionicSideMenuDelegate) {
     $scope.toggleLeft = function() {
       $ionicSideMenuDelegate.toggleLeft();
     };
   }
});
