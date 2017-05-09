angular.module('app').controller("settingsController", function ($scope, $state, $rootScope) {

    $scope.profileImage = "assets/images/defaultProfile.png";
    $scope.userData = {email: "", password: "", username: ""};
    $scope.userData.email = $rootScope.activeUser.email;
    $scope.userData.password = $rootScope.activeUser.password;

    $scope.saveSettings = function (userData) {
        if (userData.password) {
            console.log($rootScope.activeUser.password);

            for (var i = 0; i < $rootScope.users.length; i++) {
                if ($rootScope.activeUser.email === $rootScope.users[i].email) {

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
        if(userData.username){
            $rootScope.activeUser.username = userData.username;
        }
        $state.go("chat");
    }};
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