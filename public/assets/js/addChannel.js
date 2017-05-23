angular.module('app').controller("channelController", function ($scope, $state, userService,  channelService) {
    $scope.inviteUsersArray = [userService.active._id];
    $scope.invitedUserList = [userService.active.username + " (you)"];
    $scope.createChannel = function(newChannel) {
        var channels = {
            name: newChannel.channelName.charAt(0).toUpperCase() + newChannel.channelName.slice(1),
            purpose: newChannel.channelPurpose.charAt(0).toUpperCase() + newChannel.channelPurpose.slice(1),
            accessability: String($scope.publicOrPrivate).toLowerCase(),
            users: $scope.invitedUserArray,
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
        $scope.inviteUsersArray.push(user._id);
        $scope.invitedUserList.push(user.username);
    };

    $scope.removeFromChannel = function(index) {
        $scope.invitedUserList.splice(index, 1);
        $scope.inviteUsersArray.splice(index, 1);
    };

    $scope.filterInvitedUsers = function(user) {
        return ($scope.inviteUsersArray.contains(user._id)) ? "" : user._id;
    }
});

Array.prototype.contains = function contains(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
