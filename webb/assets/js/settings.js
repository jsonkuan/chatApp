 app.controller("settingsController", function ($scope, $state, userService, upload) {

    $scope.password = userService.active.password ;
    $scope.email = userService.active.email;
    $scope.username = userService.active.username;
    $scope.avatar = userService.active.avatar;

    if(userService.active._id === "133333333333333333333337"){
        $scope.delete = true;
    }

    userService.getUsers().then(function(response) {
        $scope.users = response;
    });

    $scope.deleteUser = function(user) {
        userService.deleteUser(user._id);
        userService.getUsers().then(function(response) {
            $scope.users = response;
        });
    };

    $scope.saveSettings = function () {
        userService.active.password = $scope.password;
        userService.active.username = $scope.username;

        if($scope.avatar != userService.active.avatar && $scope.avatar != "") {
            upload({
                url: '/upload',
                method: 'POST',
                data: {
                    avatar: $scope.avatar
                }
            }).then(
                function (response) {
                    setTimeout(function() {
                        userService.active.avatar = "/assets" + response.data;
                        console.log(response.data);
                        console.log(userService.active.avatar);
                        $scope.avatar = userService.active.avatar;
                        userService.updateUser(userService.active).then(function() {
                            $state.go("chat");
                        });
                    }, 1000);
                }
            );
        } else {
            userService.updateUser(userService.active).then(function() {
                $state.go("chat");
            });
        }
    };
});