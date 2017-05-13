angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, Upload, httpService)
{

    $scope.profileImage = "assets/images/defaultProfile.png";
     //$scope.userData.channels = $rootScope.activeUser.channels;

        $scope.saveSettings = function () {
            if ($scope.password) {
                $rootScope.activeUser.password = $scope.password;
            }

            if($scope.email) {
                $rootScope.activeUser.email = $scope.email;
            }

            if($scope.username){
                $rootScope.activeUser.username = $scope.username;
            }
            console.log("Settings");
            console.log($rootScope.activeUser);
            httpService.updateUser($rootScope.activeUser);
            $state.go("chat");
        };

    $scope.uploadPic = function(file) {
        file.upload = Upload.upload({
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            data: { username: $scope.username, file: file}
        });
    }
});