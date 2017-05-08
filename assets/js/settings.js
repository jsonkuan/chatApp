angular.module('app').controller("settingsController", function ($scope, $state, $rootScope) {

    $scope.profileImage = "assets/images/defaultProfile.png";

    $scope.userData = {email: "", password: "", userData: ""};
    $scope.userData.email = $rootScope.activeUser.email;
    $scope.userData.password = $rootScope.activeUser.password;

    $scope.saveSettings = function (userData) {

        if(userData.password) {

            console.log($rootScope.activeUser.password);

            for(var i = 0; i < $rootScope.users.length; i++){
                if($rootScope.activeUser.email === $rootScope.users[i].email){

                    $rootScope.activeUser.password = userData.password;
                    $rootScope.users[i].password = userData.password;

                    console.log("Users password: " + $rootScope.users[i].password);
                    console.log("ActiveUser password: " + $rootScope.activeUser.password);
                }

            }
        }

        if(userData.email) {

            for(var i = 0; i < $rootScope.users.length; i++){
                if($rootScope.activeUser.email === $rootScope.users[i].email) {

                    $rootScope.activeUser.email = userData.email;
                    $rootScope.users[i].email = userData.email;

                    console.log("Users: email" + $rootScope.users[i].email);
                    console.log("ActiveUser: email" + $rootScope.activeUser.email);
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

