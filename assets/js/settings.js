angular.module('app').controller("settingsController", function ($scope, $state, $rootScope) {

    $scope.profileImage = "assets/images/defaultProfile.png";
    $scope.userData = {email: "", password: "", username: ""};
    $scope.userData.username = $rootScope.activeUser.username;

    $scope.saveSettings = function (userData) {

        if(userData.username){
            $rootScope.activeUser.username = userData.username;
        }
        $state.go("chat");
    };


    $scope.file_changed = function(element) {

        $scope.$apply(function($scope) {
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                $scope.profileImage = e.target.result;

            };
            reader.readAsDataURL(photofile);
        });
    };

});

