angular.module('app').controller('chatController', function($scope, $state, $stateParams) {
    $scope.channelId = $stateParams.channelId;
    $scope.channels = ['General', 'Work', 'Afterwork', 'Crazy cat videos', 'pr0n'];
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super-Jakob', 'Nerd-Dervish', 'Killer-Christian'];
    $scope.message = {text: "Temp converation!"}; //TODO: MongoDB

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };

    $scope.changeChannel = function(channel) {
        var text = document.getElementById('channelContent');
        text.innerHTML = $scope.message.text //TODO: Get from in MongoDB
        console.log(text.innerHTML);
    };
    $scope.changeChannel($scope.channelId);
});


