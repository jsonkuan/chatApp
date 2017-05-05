angular.module('app').controller("settingsController", function ($scope, $state) {

    $scope.profileImage = "assets/images/defaultProfile.png";

    $scope.saveSettings = function (userData) {

        /*var db = "get connection to db";
        db.collection('users').update({_id: "1"}, {
            email: userData.email,
            password: userData.password,
            image: userData.image
        });
        */

        $state.go("chat");

    };

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

