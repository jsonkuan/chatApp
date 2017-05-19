angular.module('app').controller('chatController', function($scope, $rootScope, $state, messageService, channelService, userService, userChannels, currentChannel, userContacts) {
    $scope.userChannels = userChannels;
    $scope.currentChannel = currentChannel;
    $scope.contacts = userContacts;
    $scope.messageDb = [];
    $scope.usersDb = [];
    $scope.timestampChecker = $scope.currentChannel.timestamp;

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

        channelService.updateTimeStamp($scope.currentChannel).then(function(response){
            $scope.currentChannel = response;
        });
        console.log("End of sendMessage: 1", $scope.currentChannel.timestamp);

        console.log("timestamp: ", $scope.timestampChecker, typeof($scope.timestampChecker));
        console.log("currentchannel: ",$scope.currentChannel.timestamp, typeof($scope.currentChannel.timestamp));

        messageService.post(message);
        console.log("End of sendMessage: 2", $scope.currentChannel.timestamp);
        $scope.getMessages();

        console.log("End of sendMessage: 3", $scope.currentChannel.timestamp);

        $scope.$watch('messageDb', function f() {
            var chatContent = document.getElementById('chat-text-box-container');
            chatContent.scrollTop = chatContent.scrollHeight;
        }, true);

        console.log("End of sendMessage: 4", $scope.currentChannel.timestamp);
    };
    $scope.getUsers = function() {
        userService.getUsers().then(function(response){
            console.log(response);
        $scope.usersDb = response;
        });
    };
    $scope.getUsers();

    $scope.getMessages = function() {
        console.log("inside getMessages() 1", $scope.currentChannel.timestamp);
        $scope.messagesFromDb = messageService.getAllMessages('?channel=' + $scope.currentChannel._id).then(function(response){
            $scope.messageDb = response;
            console.log("inside getMessages() 2", $scope.currentChannel.timestamp);
            $scope.addUserToMsg($scope.usersDb, $scope.messageDb);
            console.log("inside getMessages() 3", $scope.currentChannel.timestamp);
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
        if(userA._id!==userB._id){
            console.log("userA: " + userA._id );
            console.log("userB: " + userB._id );
            channelService.get('/direct?sender=' + userA._id + '&recipient=' + userB._id).then(function(response) {
                console.log("responseData: " +response);
                if (!response) {
                    console.log("creating new chat between userA: " +userA._id+" and userB: "+ userB._id);
                    $scope.createDirectChat(userA, userB);
                } else {
                    console.log("open old chat with id: "+response._id);
                    $scope.openChat(response);
                }
            });
        }

    };

    $scope.getUserFromMsg = function (userId){
        var user = {};
        for(var y = 0; y < $scope.usersDb.length; y++){
            if($scope.usersDb[y]._id === userId) {
                user = $scope.usersDb[y];
            }
        }
    };

    $scope.createDirectChat = function(userA, userB) {
        channelService.post({
            name: userA.username +" & "+ userB.username,
            purpose: '',
            accessability: 'direct',
            users: [userA._id, userB._id],
            timestamp: ''
        }).then(function(response) {
            $scope.startDirectChat(userA, userB);
        });
    };
    
    setInterval(function(){

        if($scope.timestampChecker !== $scope.currentChannel.timestamp) {
            $scope.getMessages();
            console.log("Interval körs, getMessages() körs", $scope.timestampChecker," och ", $scope.currentChannel.timestamp);
        }
        //TODO Compare activeChannel timestamp with channel from db
        //if($scope.currentChannel.timestamp > channelService.get)
        }, 3000);
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
