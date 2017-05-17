angular.module('app').controller("channelController", function ($scope, $state, $rootScope, channelService) {
    $scope.createChannel = function(newChannel) {
        var channels = {
            name: newChannel.channelName,
            purpose: newChannel.channelPurpose,
            accessability: $scope.publicOrPrivate,
            users: [$rootScope.activeUser._id],
            timestamp: ""
        };

        channelService.post(channels).then(function(response) {
            console.log("Channel service completed.");
            $state.go("chat");
        });
    }
    $scope.publicOrPrivate = "Public";
    $scope.onChange = function(state) {
        $scope.privateText = "private";
        return state ? ($scope.publicOrPrivate = "Private", $scope.privateText= "private") : ($scope.publicOrPrivate = "Public", $scope.privateText= "");
    }
});
