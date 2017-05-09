angular.module('app').controller('chatController', function($scope, $rootScope, $state, $stateParams) {
    $scope.channelId = $stateParams.channelId;
    $scope.channels = ['General', 'Work', 'Afterwork', 'Crazy cat videos', 'pr0n'];
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super Jakob?', 'Nerd-Dervish', 'Killer-Christian'];

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };

    $scope.sendMessage = function() {
        var message = {user: $rootScope.activeUser.username, date: formatDate(), text: $scope.chatInput};
        $rootScope.messageDB[$scope.channelId].push(message);
        $scope.chatInput = '';
        var button = angular.element(document.getElementById("chat-input-container"));
        button.focus();
        console.log($rootScope.activeUser.username);

        $scope.$watch('messageDB', function f() {
            var chatContent = document.getElementById('chat-text-box-container');
            chatContent.scrollTop = chatContent.scrollHeight;
        }, true);
    };

    // Temp message generator
    $scope.generateMessage = function() {
        var words = ['hello', 'i', 'me', 'you', 'we', 'they', 'want', 'pr0n', 'cat', 'like', 'aaarg!', 'wtf'];
        var message = '';
        var count = 2 + rnd(6);
        for (var i = 0; i < count; i++) {
            message += (words[rnd(words.length) -1] + ' ');
        }
        return message;
    };

    if (! $rootScope.messageDB) {
        $rootScope.messageDB = {};
    }

    // Generate channel message history
    if (! $rootScope.messageDB.hasOwnProperty($scope.channelId)) {
        $rootScope.messageDB[$scope.channelId] = [];
        for (var i = 0; i < rnd(20); i ++) {
            $rootScope.messageDB[$scope.channelId].push( {
                text: $scope.generateMessage(),
                user: $scope.contacts[rnd($scope.contacts.length) -1],
                date: formatDate()
            });
        }
    }
});

// Temp randomizing function
function rnd(number) {
    return Math.floor((Math.random() * number) + 1);
}

function formatDate() {
    var d1 = new Date();
    var day = ("0" + d1.getDate()).slice(-2);
    var month = ("0" + (d1.getMonth() + 1)).slice(-2);
    var year = d1.getFullYear();
    var today = (month) + '' + (day);     
    var hour = ("0" + d1.getHours()).slice(-2);
    var minutes = ("0" + d1.getMinutes()).slice(-2);

    return (year + today + " - " + hour + ":" + minutes);
}
