angular.module('app').controller("channelController", function ($scope, $state, $rootScope, userService,  channelService) {
    $scope.tempUserArray = [$rootScope.activeUser._id];
    $scope.invitedUsers = [];
    $scope.createChannel = function(newChannel) {
        var channels = {
            name: newChannel.channelName,
            purpose: newChannel.channelPurpose,
            accessability: String($scope.publicOrPrivate).toLowerCase(),
            users: $scope.tempUserArray,
            timestamp: ""
        };

        channelService.post(channels).then(function(response) {
            console.log("Channel service completed.");
            $state.go("chat");
        });
    }

    userService.getUsers().then(function(response) {
        $scope.users = response;
    });

    $scope.publicOrPrivate = "Public";
    $scope.onChange = function(state) {
        $scope.privateText = "private";
        return state ? ($scope.publicOrPrivate = "Private", $scope.privateText= "private") : ($scope.publicOrPrivate = "Public", $scope.privateText= "");
    }

    $scope.addToChannel = function(user) {
      $scope.tempUserArray.push(user._id);
      $scope.invitedUsers.push(user.username);
      console.log("Added " + user.username + " to channel.");
    }
});
