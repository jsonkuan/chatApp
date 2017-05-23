angular.module('app').controller("channelController", function ($scope, $state, userService,  channelService) {
    $scope.tempUserArray = [userService.active._id];
    $scope.invitedUsers = [userService.active.username + " (you)"];
    $scope.userID = userService.active._id;
    $scope.createChannel = function(newChannel) {
        var channels = {
            name: newChannel.channelName.charAt(0).toUpperCase() + newChannel.channelName.slice(1),
            purpose: newChannel.channelPurpose.charAt(0).toUpperCase() + newChannel.channelPurpose.slice(1),
            accessability: String($scope.publicOrPrivate).toLowerCase(),
            users: $scope.tempUserArray,
            timestamp: ""
        };

        channelService.post(channels).then(function(response) {
            $state.go("chat");
        });
    };

    userService.getUsers().then(function(response) {
        $scope.users = response;
    });

    $scope.publicOrPrivate = "public";
    $scope.onChange = function(state) {
        $scope.privateText = "private";
        return state ? ($scope.publicOrPrivate = "private", $scope.privateText= "private") : ($scope.publicOrPrivate = "public", $scope.privateText= "");
    };

    $scope.addToChannel = function(user) {
      $scope.tempUserArray.push(user._id);
      $scope.invitedUsers.push(user.username);
    }
});
