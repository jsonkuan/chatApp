angular.module('app').controller('chatController', function($scope, $rootScope, $state, messageService, channelService, userService, userChannels, currentChannel) {
    $scope.userChannels = userChannels;
    $scope.currentChannel = currentChannel;
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super Jakob?', 'Nerd-Dervish', 'Killer-Christian'];
    $scope.messageDb = [];
    $scope.usersDb = [];

    $scope.openChat = function(channel) {
        channelService.current = channel;
        $state.reload();
    };

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };
    $scope.sendToCreateChannel = function() {
        $state.transitionTo('addChannel');
    };

    $scope.sendMessage = function(input) {
        console.log("Activeuser: ",$rootScope.activeUser);
        var message = {
            userId: $rootScope.activeUser._id,
            date: formatDate(), 
            text: input, 
            channel: $scope.currentChannel._id
        };
        $scope.chatInput = '';
        var button = angular.element(document.getElementById("chat-input-container"));
        button.focus();

        channelService.updateTimeStamp($scope.currentChannel);
        console.log("currentchannel: ", $scope.currentChannel);
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
        $scope.messagesFromDb = messageService.getAllMessages('?channel=' + $scope.currentChannel._id).then(function(response){
            //console.log("Hepp! messageService.getAllMessages: ", response);
            $scope.messageDb = response;
            $scope.addUserToMsg($scope.usersDb, $scope.messageDb);
        });
    };
    $scope.getMessages();

    $scope.addUserToMsg = function(users, messages) {

        for(var i = 0; i < messages.length; i++) {
            for(var e = 0; e < users.length; e++){

                if(messages[i].userId === users[e]._id) {
                    messages[i].username = users[e].username;
                }
                if(messages[i].userId === users[e]._id) {
                    messages[i].avatar = users[e].avatar;
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
    
    setInterval(function(){
        //TODO Compare activeChannel timestamp with channel from db
        //if($scope.currentChannel.timestamp > channelService.get)
        $scope.getMessages(); }, 2000);
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
