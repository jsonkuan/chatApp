angular.module('app').controller("settingsController", function ($scope, $state, userService, upload) {

    $scope.password = userService.active.password ;
    $scope.email = userService.active.email;
    $scope.username = userService.active.username;
    $scope.avatar = userService.active.avatar;

    $scope.saveSettings = function () {
        userService.active.password = $scope.password;
        userService.active.email = $scope.email;
        userService.active.username = $scope.username;

        if($scope.avatar) {
            upload({
                url: '/upload',
                method: 'POST',
                data: {
                    avatar: $scope.avatar
                }
            }).then(
                function (response) {
                    userService.active.avatar = response.data.slice(7);
                    $scope.avatar = userService.active.avatar;
                    userService.updateUser(userService.active);
                },
                function (response) {
                }
            );
        }
        userService.updateUser(userService.active);
        $state.go("chat");
    };
});