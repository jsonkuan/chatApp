angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, httpService) {

    $scope.profileImage = "assets/images/defaultProfile.png";
    /*$scope.userData = {username: "", email: "", password: "", avatar: ""};
     $scope.userData.id = $rootScope.activeUser.id;*/
    $scope.username = $rootScope.activeUser.username;
    $scope.email = $rootScope.activeUser.email;
    $scope.password = $rootScope.activeUser.password;
    $scope.avatar = $rootScope.activeUser.avatar;
    //$scope.userData.channels = $rootScope.activeUser.channels;

    $scope.saveSettings = function () {
        if ($scope.password) {

            $rootScope.activeUser.password = $scope.password;


            /*for (var i = 0; i < $rootScope.users.length; i++) {
             if ($rootScope.activeUser.email === $rootScope.users[i].email) {

             $rootScope.activeUser.password = userData.password;
             $rootScope.users[i].password = userData.password;

             httpService.updateUser($rootScope.activeUser);

             }
             }*/
        }

        if($scope.email) {
            $rootScope.activeUser.email = $scope.email;
            /*for(var i = 0; i < $rootScope.users.length; i++){
             if($rootScope.activeUser.email === $rootScope.users[i].email) {

             $rootScope.activeUser.email = userData.email;
             $rootScope.users[i].email = userData.email;

             }
             }*/
        }

        if($scope.username){
            $rootScope.activeUser.username = $scope.username;
        }

        httpService.updateUser($rootScope.activeUser);
        console.log($rootScope.activeUser);
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