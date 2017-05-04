angular.module('app').controller("settingsController", function ($scope) {

$scope.saveSettings = function (userData) {
    //Import userDBData

    //DBUserEmail = userData.email;
    //DBUserPassword = userData.password;
    //DBUserProfileImage = userData.image;

    };
$scope.profileImage = "assets/images/defaultProfile.png";

    $scope.file_changed = function(element) {

        $scope.$apply(function(scope) {
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                $scope.profileImage = e.target.result;

            };
            reader.readAsDataURL(photofile);
        });
    };

});

