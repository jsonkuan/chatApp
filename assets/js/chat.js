angular.module('app').controller('chatController', function($scope, $state, $stateParams) {
    $scope.channelId = $stateParams.channelId;
    $scope.channels = ['General', 'Work', 'Afterwork', 'Crazy cat videos', 'pr0n'];
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super-Jakob', 'Nerd-Dervish', 'Killer-Christian'];

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };

});