angular.module('app').controller('chatController', function($scope, $rootScope, $state, $stateParams, messageService, channelService, userService, userChannels, currentChannel) {
    console.log('channel', userChannels);
    $scope.channels = userChannels;
    $scope.currentChannel = currentChannel;
    $scope.channelName = $stateParams.channelName;
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super Jakob?', 'Nerd-Dervish', 'Killer-Christian'];
    $scope.messageDb = [];
    $scope.usersDb = [];

    $scope.openChat = function(chat) {

    };

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };
    $scope.sendToCreateChannel = function() {
        $state.transitionTo('addChannel');
    };
    if(!$scope.channelName) {
        $scope.channelName = "General";
    }
    channelService.get('?channelName=' + $scope.channelName).then(function(response){
        console.log("Hepp! channelService.get: ",response);
    });
    $scope.sendMessage = function(input) {
        console.log("Activeuser: ",$rootScope.activeUser);
        var message = {
            username: $rootScope.activeUser.username,
            userId: $rootScope.activeUser._id, 
            date: formatDate(), 
            text: input, channel: 
            $scope.channelName
        };
        $scope.chatInput = '';
        var button = angular.element(document.getElementById("chat-input-container"));
        button.focus();

        messageService.post(message);
        $scope.getMessages();

        $scope.$watch('messageDb', function f() {
            var chatContent = document.getElementById('chat-text-box-container');
            chatContent.scrollTop = chatContent.scrollHeight;
        }, true);
    };
    $scope.getUsers = function() {
        userService.getUsers().then(function(response){
            console.log(response);
        $scope.usersDb = response;
        });
    };
    $scope.getUsers();

    $scope.getMessages = function() {
        $scope.messagesFromDb = messageService.getAllMessages('?channel=' + $scope.channelName).then(function(response){
            console.log("Hepp! messageService.getAllMessages: ", response);
            $scope.messageDb = response;
            $scope.addUserToMsg($scope.usersDb, $scope.messageDb);
        });
    };
    $scope.getMessages();

    $scope.addUserToMsg = function(users, messages) {

        for(var i = 0; i < messages.length; i++) {
            for(var e = 0; e < users.length; e++){

                if(messages[i].user === users[e]._id) {
                    messages[i].username = users[e].username;
                }
            }
        }

    };

    $scope.startDirectChat = function(userA, userB) {
        channelService.get('/direct?sender=' + userA + '&recipient=' + userB).then(function(response) {
            if (!response) {
                $scope.createDirectChat(userA, userB);
            } else {
                //TODO open chat with response._id
            }
        });
    };

    $scope.createDirectChat = function(userA, userB) {
        channelService.post({
            name: userA + userB,
            purpose: '',
            accessability: 'direct',
            users: [userA, userB],
            timestamp: ''
        }).then(function(response) {
            var users = response.data[0].users;
            $scope.startDirectChat(users[0], users[1]); 
        });
    };

    //Example: $scope.startDirectChat($rootScope.activeUser._id, otherPerson._id);
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
