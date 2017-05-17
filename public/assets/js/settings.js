angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, userService) {

    //$scope.userData.channels = $rootScope.activeUser.channels;
    $scope.profileImage = "assets/images/defaultProfile.png";

    $scope.uploadAvatar = function (avatar) {
      console.log(avatar);


      userService.postAvatar(avatar);
    };


    $scope.saveSettings = function (activeUser) {
        $rootScope.activeUser.password = activeUser.password;
        $rootScope.activeUser.email = activeUser.email;
        $rootScope.activeUser.username = activeUser.username;
        $rootScope.activeUser.avatar = activeUser.avatar;

        console.log($rootScope.activeUser);
        userService.updateUser($rootScope.activeUser);
        $state.go("chat");
    };
});