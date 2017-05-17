angular.module('app').controller('chatController', function($scope, $rootScope, $state, $stateParams, messageService, channelService) {
    $scope.channelName = $stateParams.channelName;
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super Jakob?', 'Nerd-Dervish', 'Killer-Christian'];

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };
  
    $scope.sendToCreateChannel = function() {
        $state.transitionTo('addChannel');
    };

    console.log("ChannelService.get anropas med ", $scope.channelName);
    if(!$scope.channelName) {
        $scope.channelName = "General";
    }
    channelService.get('?channelName=' + $scope.channelName).then(function(response){
        console.log("Hepp, channelService.get: ",response);
    });
    var messagesFromDb = messageService.getAllMessages('?channel=' + $scope.channelName).then(function(response){
        console.log("Hepp, messageService.getAllMessages: ", response);
    });
    console.log("fetched message-object : ", messagesFromDb);

    $scope.sendMessage = function(input) {
        var message = {
            user: $rootScope.activeUser._id, 
            date: formatDate(), 
            text: input, channel: 
            $scope.channelName
        };

        $rootScope.messageDB[$scope.channelName].push(message);
        $scope.chatInput = '';
        var button = angular.element(document.getElementById("chat-input-container"));
        button.focus();

        messageService.post(message);

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
    if (! $rootScope.messageDB.hasOwnProperty($scope.channelName)) {
        $rootScope.messageDB[$scope.channelName] = [];
        for (var i = 0; i < rnd(20); i ++) {
            $rootScope.messageDB[$scope.channelName].push( {
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
