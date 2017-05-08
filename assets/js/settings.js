angular.module('app').controller("settingsController", function ($scope, $state, $rootScope) {

    $scope.profileImage = "assets/images/defaultProfile.png";
    //userData.password = $rootScope.activeUser.password;

    $scope.saveSettings = function (userData) {

        if(userData.password !== "") {

            console.log($rootScope.activeUser.password);

            for(var i = 0; i < $rootScope.users.length; i++){
                if($rootScope.activeUser.email === $rootScope.users[i].email){

                    $rootScope.activeUser.password = userData.password;
                    $rootScope.users[i].password = userData.password;

                    console.log("Users: " + $rootScope.users[i].password);
                    console.log("ActiveUser: " + $rootScope.activeUser.password);
                }
            }
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

