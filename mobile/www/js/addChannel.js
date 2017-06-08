app.controller("channelController", function ($scope, $state, userService, channelService, allUsers) {
    $scope.inviteUsersArray = [userService.active._id];
    $scope.invitedUserList = [userService.active.username + " (you)"];
    $scope.users = allUsers.slice(1);
    $scope.splicedUsers = $scope.users;
    $scope.channelName = { text: "" };
    $scope.purpose = { text: "" };
    $scope.accessability = "public";
    console.log($scope.users);
    console.log($scope.splicedUsers);

    $scope.publicOrPrivate = function () {
        $scope.accessability = "private";
        console.log($scope.accessability);
    }
    //Just a test function to post channels to db
    $scope.createChannel2 = function () {

        var channels = {
            name: $scope.channelName.text,
            purpose: $scope.purpose.text,
            users: $scope.inviteUsersArray,
            accessability: $scope.accessability,
            timestamp: ""
        }
        channelService.post(channels).then(function (response) {
            $state.go("chat");
        });
        console.log(channels);
    }
    // Check with jason if needed
    $scope.createChannel = function (newChannel) {
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

    };

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

    // Check with jason if needed
    /*$scope.publicOrPrivate = "public";
    $scope.onChange = function(state) {
        $scope.privateText = "private";
        return state ? ($scope.publicOrPrivate = "private", $scope.privateText= "private") : ($scope.publicOrPrivate = "public", $scope.privateText= "");
    };*/

    $scope.addToChannel = function (user) {
        $scope.inviteUsersArray.push(user._id);
        //$scope.invitedUserList.push($scope.users);
        $scope.counter--;
    };
    // Check with jason if needed
    $scope.removeFromChannel = function (index) {
        $scope.invitedUserList.splice(index, 1);
        $scope.inviteUsersArray.splice(index, 1);
        $scope.counter++;
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