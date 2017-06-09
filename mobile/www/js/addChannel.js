app.controller("channelController", function ($scope, $state, userService, channelService, allUsers) {
    $scope.tempArray = [];
    $scope.invitedUsers = [userService.active._id];
    $scope.users = allUsers.slice(1);
    $scope.usersWithoutBot = $scope.users;
    $scope.channelName = { text: "" };
    $scope.purpose = { text: "" };
    $scope.accessability = "public";
    console.log(userService.active.username);

    $scope.publicOrPrivate = function () {
        $scope.accessability = "private";
        console.log($scope.accessability);
    }
    //Just a test function to post channels to db
    $scope.createChannel2 = function () {

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
        console.log(channels);
    }
    // Check with jason if needed
    /*$scope.createChannel = function (newChannel) {
        var access = String($scope.publicOrPrivate).toLowerCase();
        if (access === 'public') {
            $scope.inviteUsersArray = [];
        }
        if ($scope.addChannelForm.$valid) {
            var channels = {
                name: $scope.channelName,
                purpose: $scope.channelPurpose.charAt(0).toUpperCase() + $scope.channelPurpose.slice(1),
                accessability: access,
                users: $scope.inviteUsersArray,
                timestamp: ""
            };
            channelService.post(channels).then(function (response) {
                $state.go("chat");
            });
        }

    };*/

    $scope.resetChannelname = function (name) {
        $scope.channelName.text = "";
        console.log("PÅKE");
    };

    $scope.resetPurpose = function () {
        $scope.purpose.text = "";
        console.log("PÅKE");
    };

    userService.getUsers().then(function (response) {
        $scope.users = response;
    });

    $scope.backToChat = function() {
        $state.go('chat');
    }

    $scope.addToChannel = function (user) {
           $scope.invitedUsers.push(user._id);
            console.log("Added: " + user.username + "\nid: " + user._id);
    };

     $scope.removeFromChannel = function(index) {
        $scope.invitedUsers.splice(index, 1);
        console.log("Removed");
    };

    $scope.filterInvitedUsers = function (user) {
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