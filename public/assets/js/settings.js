angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, Upload, userService) {

    //$scope.userData.channels = $rootScope.activeUser.channels;

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