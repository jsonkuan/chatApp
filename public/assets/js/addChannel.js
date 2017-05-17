angular.module('app').controller("channelController", function ($scope, $state, $rootScope, channelService) {
    $scope.createChannel = function(newChannel) {
        var channels = {
            name: newChannel.channelName,
            accessability: $scope.publicOrPrivate,
            user: [],
            timestamp: ""
        };

        channelService.post(channels).then(function(response) {
            console.log("Channel service completed.");
            $state.go("chat");
        });
    }
    $scope.publicOrPrivate = "Public";
    $scope.onChange = function(state) {
        return state ? ($scope.publicOrPrivate = "Private") : ($scope.publicOrPrivate = "Public");
    }
});
