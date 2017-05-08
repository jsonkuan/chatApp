angular.module('app').controller('chatController', function($scope, $rootScope, $state, $stateParams) {
    $scope.channelId = $stateParams.channelId;
    $scope.channels = ['General', 'Work', 'Afterwork', 'Crazy cat videos', 'pr0n'];
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super-Jakob', 'Nerd-Dervish', 'Killer-Christian'];
    $scope.message = {text: "Temp converation!"}; //TODO: MongoDB

    if (! $rootScope.messageDB) {
        $rootScope.messageDB = {};
    }
    if (! $rootScope.messageDB.hasOwnProperty($scope.channelId)) {
        $rootScope.messageDB[$scope.channelId] = [];
        for (var i = 0; i < rnd(20); i ++) {
            $rootScope.messageDB[$scope.channelId].push( {
                text: 'Meddelande ' + i,
                user: 'Jason',
                date: new Date()
            });
        }
    }
    console.log('Content for "' + $scope.channelId + '"', $rootScope.messageDB[$scope.channelId]);

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };

    $scope.changeChannel = function(channel) {
        var text = document.getElementById('channelContent');
        text.innerHTML = $scope.message.text //TODO: Get from in MongoDB
        console.log(text.innerHTML);
    };
    //$scope.changeChannel($scope.channelId);
});

// Temp randomizing function
function rnd(number) {
    var tmp = Math.floor((Math.random() * number) + 1);
    console.log('rnd', tmp);
    return tmp;
}
