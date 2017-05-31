app.controller("channelController", function ($scope, $state, userService,  channelService, allUsers) {
    $scope.inviteUsersArray = [userService.active._id];
    $scope.invitedUserList = [userService.active.username + " (you)"];
    $scope.users = allUsers;
    $scope.counter = $scope.users.length -1;
    $scope.channelPurpose = "";
    $scope.channelName = "";
    $scope.createChannel = function(newChannel) {
        var access = String($scope.publicOrPrivate).toLowerCase();
        if (access === 'public') {
            $scope.inviteUsersArray = [];
        }
        if($scope.addChannelForm.$valid){
            var channels = {
                name: $scope.channelName,
                purpose: $scope.channelPurpose.charAt(0).toUpperCase() + $scope.channelPurpose.slice(1),
                accessability: access,
                users: $scope.inviteUsersArray,
                timestamp: ""
            };
            channelService.post(channels).then(function(response) {
                $state.go("chat");
            });
        }
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
        $scope.counter--;
    };

    $scope.removeFromChannel = function(index) {
        $scope.invitedUserList.splice(index, 1);
        $scope.inviteUsersArray.splice(index, 1);
        $scope.counter++;
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