angular.module('app').controller('chatController', function($scope, $state, $cookies, messageService, channelService, userService, userChannels, currentChannel, userContacts) {
    $scope.userChannels = userChannels;
    $scope.currentChannel = currentChannel;
    $scope.contacts = userContacts;
    $scope.messageDb = [];
    $scope.usersDb = [];

    window.addEventListener("beforeunload", function(){
        userService.active.status = "offline";
        userService.updateUser(userService.active);
    }, false);

    $scope.openChat = function(channel) {
        channelService.current = channel;
        $state.reload();
    };

    $scope.announceClick = function(index) {
        if(index === 0){
            $state.transitionTo('settings');
        }else{
            userService.active.status = "offline";
            userService.updateUser(userService.active).then(function(response) {
                userService.active = null;
                $cookies.remove('user');
                $state.transitionTo('login');
            }
        }
    };

    $scope.sendToCreateChannel = function() {
        $state.transitionTo('addChannel');
    };

    $scope.sendMessage = function(input) {
        var message = {
            userId: userService.active._id,
            date: formatDate(), 
            text: input, 
            channel: $scope.currentChannel._id
        };

        $scope.chatInput = '';
        var button = angular.element(document.getElementById("chat-input-container"));
        button.focus();

        channelService.updateTimeStamp($scope.currentChannel);
        messageService.post(message);
        $scope.getMessages();

        $scope.$watch('messageDb', function f() {
            var chatContent = document.getElementById('chat-text-box-container');
            chatContent.scrollTop = chatContent.scrollHeight;
        }, true);
    };


    $scope.getUsers = function() {
        userService.getUsers().then(function(response){
        $scope.usersDb = response;
        });
    };

    $scope.getUsers();

    $scope.getMessages = function() {
        $scope.messagesFromDb = messageService.getAllMessages('?channel=' + $scope.currentChannel._id).then(function(response){
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
        if(userA._id!==userB._id){
            channelService.get('/direct?sender=' + userA._id + '&recipient=' + userB._id).then(function(response) {
                if (!response) {
                    $scope.createDirectChat(userA, userB);
                } else {
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
        return user;
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
