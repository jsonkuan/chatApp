angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, httpService) {

    $scope.profileImage = "assets/images/defaultProfile.png";
    $scope.username = $rootScope.activeUser.username;
    $scope.email = $rootScope.activeUser.email;
    $scope.password = $rootScope.activeUser.password;
    $scope.avatar = $rootScope.activeUser.avatar;
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
});

function changeImage() {
    var preview = document.querySelector('img');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}