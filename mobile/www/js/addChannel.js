app.controller("channelController", function ($scope, $state, userService, channelService, allUsers) {
    $scope.tempArray = [];
    $scope.purpose = { text: "" };
    $scope.accessability = "public";
    $scope.users = allUsers.slice(1);
    $scope.channelName = { text: "" };
    $scope.usersWithoutBot = $scope.users;
    $scope.invitedUsers = [userService.active._id];

    $scope.publicOrPrivate = function() {
        $scope.accessability = "private";
    }

    $scope.createChannel = function() {
        var channels = {
            name: $scope.channelName.text,
            purpose: $scope.purpose.text,
            users: $scope.invitedUsers,
            accessability: $scope.accessability,
            timestamp: ""
        }
        channelService.post(channels).then(function (response) {
            $state.go("chat");
        });
    }

    $scope.resetChannelname = function() {
        $scope.channelName.text = "";
    };

    $scope.resetPurpose = function() {
        $scope.purpose.text = "";
    };

    userService.getUsers().then(function (response) {
        $scope.users = response;
    });

    $scope.backToChat = function() {
        $state.go('chat');
    }

    $scope.addToChannel = function(user) {
        if(!$scope.invitedUsers.contains(user.username)) {
            $scope.invitedUsers.push(user._id);
        } else {
            var index = $scope.invitedUsers.indexOf(user.username);            
            $scope.invitedUsers.splice(index, 1);
        }
    };

    $scope.removeFromChannel = function(index) {
        $scope.invitedUsers.splice(index, 1);
        console.log("Removed");
    };

    $scope.filterInvitedUsers = function(user) {
        return ($scope.invitedUsers.contains(user));
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