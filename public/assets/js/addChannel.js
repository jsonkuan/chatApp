angular.module('app').controller("channelController", function ($scope, $state, $rootScope, channelService) {
    $scope.createChannel = function(newChannel) {

        var channels = {
            name: newChannel.channelName,
            private: false,
            user: [],
            timestamp: ""
        };

        channelService.post(channels).then(function(response) {
            console.log("Channel service completed.");
            $state.go("chat");
        });
    }
});

