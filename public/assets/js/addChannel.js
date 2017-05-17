angular.module('app').controller("channelController", function ($scope, $state, $rootScope, httpService) {
        $scope.createChannel = function(activeUser) {
            $rootScope.activeUser.channels = activeUser.channel;

            //httpService.addChannelToDB();
            $state.go("chat");
        };
});

