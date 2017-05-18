angular.module('app').controller("settingsController", function ($scope, $state, $rootScope, userService, upload) {
    $scope.profileImage = "assets/images/defaultProfile.png";

    if($rootScope.activeUser.avatar){
        $scope.profileImage = $rootScope.activeUser.avatar;
    }else{
        $scope.profileImage = "assets/images/defaultProfile.png";
    }

    $scope.saveSettings = function (activeUser) {

        $rootScope.activeUser.password = activeUser.password;
        $rootScope.activeUser.email = activeUser.email;
        $rootScope.activeUser.username = activeUser.username;

        upload({
            url: '/upload',
            method: 'POST',
            data: {
                avatar: $scope.avatar // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
            }
        }).then(
            function (response) {
                $rootScope.activeUser.avatar = response.data.slice(7);
                userService.updateUser($rootScope.activeUser);
            },
            function (response) {
                console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
            }
        );
        $state.go("chat");
    };
});