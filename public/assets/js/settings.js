angular.module('app').controller("settingsController", function ($scope, $state, userService, upload) {


    console.log("settings ",userService.active);

    $scope.password = userService.active.password ;
    $scope.email = userService.active.email;
    $scope.username = userService.active.username;


    if(userService.active.avatar){
        $scope.profileImage = userService.active.avatar;
    }else{
        $scope.profileImage = "assets/images/defaultProfile.png";
    }

    $scope.saveSettings = function () {
        userService.active.password = $scope.password;
        userService.active.email = $scope.email;
        userService.active.username = $scope.username;

        upload({
            url: '/upload',
            method: 'POST',
            data: {
                avatar: $scope.avatar // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
            }
        }).then(
            function (response) {
                userService.active.avatar = response.data.slice(7);
                userService.updateUser(userService.active);
            },
            function (response) {
                console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
            }
        );
        $state.go("chat");
    };
});