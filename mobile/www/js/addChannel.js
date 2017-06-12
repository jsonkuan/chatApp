app.controller("channelController", function ($scope, $state, userService, channelService, allUsers) {
    $scope.tempArray = [];
    $scope.purpose = { text: "" };
    $scope.accessability = "public";
    $scope.users = allUsers.slice(1);
    $scope.channelName = { text: "" };
    $scope.usersWithoutBot = $scope.users;
    $scope.invitedUsers = [userService.active._id];

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
    $scope.resetChannelname = function () {
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

    $scope.backToChat = function () {
        $state.go('chat');
    }

    $scope.addToChannel = function (user) {
        if(!$scope.invitedUsers.contains(user.username)) {
            $scope.invitedUsers.push(user.username);
            console.log("Added " + user.username);
        } else {
            var index = $scope.invitedUsers.indexOf(user.username);            
            $scope.invitedUsers.splice(index, 1);
            console.log("removed user from Index:" + index);
        }
    };

    $scope.removeFromChannel = function (index) {
        $scope.invitedUsers.splice(index, 1);
        console.log("Removed");
    };

    $scope.filterInvitedUsers = function (user) {
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