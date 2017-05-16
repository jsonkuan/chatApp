angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, Upload, httpService) {
        //$scope.userData.channels = $rootScope.activeUser.channels;
        $scope.saveSettings = function (activeUser) {
            $rootScope.activeUser.password = activeUser.password;
            $rootScope.activeUser.email = activeUser.email;
            $rootScope.activeUser.username = activeUser.username;

            httpService.updateUser($rootScope.activeUser);
            $state.go("chat");
        };

    $scope.uploadPic = function(file) {
        file.upload = Upload.upload({
            url: 'public/assets/images',
            data: {file: file}
        });
    }
});
