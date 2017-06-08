angular.module('app').controller('chatController', function($scope, upload, $state, messageService, channelService, userService, channels, currentChannel, userContacts, session) {
    $scope.activeUser = session;
    $scope.userChannels = channels;
    $scope.currentChannel = currentChannel;
    $scope.messageDb = [];
    $scope.contacts = userContacts;
    $scope.users = userContacts;
    $scope.localTimestamp = $scope.currentChannel.timestamp;
    $scope.glued = true;
    $scope.chatInput = "";
    $scope.channelStatus;
    $scope.tmpChannels = $scope.userChannels;
    $scope.tmpContacts = $scope.contacts;
    $scope.warning = false;

    // Filter channels for user
    $scope.filterChannels = function() {
        var contacts = $scope.tmpContacts.filter(function(user) {
            return user._id != userService.active._id;
        });
        var channels = $scope.userChannels.filter(function(channel) {
            return channel.accessability === 'public' || channel.accessability === 'private';
        });
        var direct = $scope.userChannels.filter(function(channel) {
            return channel.accessability === 'direct';
        });
        for (var i = 0; i < direct.length; i ++) {
            for (var j = 0; j < contacts.length; j ++) {
                if (direct[i].users.includes(contacts[j]._id)) {
                    contacts[j].channelId = direct[i]._id;
                }
            }
        }
        $scope.userChannels = channels;
        $scope.contacts = contacts;
        $scope.users = $scope.tmpContacts;
    };
    $scope.updateChannelStatus = function() {
        // Retrieve cookie based on user
        $scope.userChannels = $scope.tmpChannels;
        //var cookie = $cookies.get(userService.active._id);
        var storage = localStorage[userService.active._id];
        if (!storage) {
            storage = {};
        } else {
            storage = JSON.parse(storage);
        }
        // Compare timestamp between channels and storage data
        var channels = $scope.userChannels;
        for (var i = 0; i < channels.length; i ++) {
            var channelId = channels[i]._id;
            if (!storage[channelId]) {
                storage[channelId] = {
                    timestamp: channels[i].timestamp,
                    update: true
                };
            } else {
                if (channels[i].timestamp > storage[channelId].timestamp) {
                    storage[channelId].timestamp = channels[i].timestamp;
                    storage[channelId].update = true;
                }
            }
        }

        // Always mark current channel as read
        storage[channelService.current._id].timestamp = new Date().toISOString();
        storage[channelService.current._id].update = false;

        $scope.channelStatus = storage;
        //console.log('updated storage', storage);
        localStorage[userService.active._id] = JSON.stringify(storage);
        //$cookies.put(userService.active._id, JSON.stringify(storage));
    };
    
    $scope.updateChannelStatus();
    $scope.filterChannels();

    $scope.openChat = function(channel) {
        channelService.current = channel;
        $state.reload();
    };

    $scope.announceClick = function(index) {
        if(index === 0){
            $state.transitionTo('settings');
        } else {
            userService.active.status = "offline";
            userService.updateUser(userService.active).then(function(response) {
                //$cookies.remove('user');
                localStorage.removeItem('user');
                userService.active = null;
                channelService.current = null;
                $state.transitionTo('login');
            });
        }
    };

    $scope.sendToCreateChannel = function() {
        $state.transitionTo('addChannel');
    };

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    $scope.snakkBot = function(message){
        var regPattern = /[A-ZÅÄÖ]/;
        var badWords = ["dåligt", "dålig"];
        var banWords = ["trump", "fitta", "kuk", "cunt", "dick", "hora", "hoe", "faggot", "bög"];
        var uppercaseIndex = [];
        for (var j = 0; j < message.length; j++){
           if(message[j].match(regPattern)){
               uppercaseIndex.push(j);
           }
        }

        var newMessage = message.toLowerCase();
        var tempLetter = "";

        var concealedWord = "";
        for(var i = 0; i < badWords.length; i++){
            newMessage = newMessage.replace(badWords[i],"mindre bra");
        }

        var oldMessage = newMessage;
        for(var y = 0; y < banWords.length; y++){
            concealedWord = new Array(banWords[y].length+1).join('*');
            newMessage = newMessage.replaceAll(banWords[y], concealedWord);
            concealedWord = "";
        }

        if(oldMessage !== newMessage){
            $scope.warning = true;
        }

        for(var z = 0; z < uppercaseIndex.length; z++){
            tempLetter = newMessage.charAt(uppercaseIndex[z]).toUpperCase();
            newMessage = newMessage.replace(tempLetter.toLowerCase(), tempLetter);
        }

        return newMessage;
    };

    $scope.addAttachment = function () {
        if($scope.attachment) {
            upload({
                url: '/upload',
                method: 'POST',
                data: {
                    avatar: $scope.attachment
                }
            }).then(
                function (response) {
                    $scope.attachmentPath = "images" + response.data.slice(13);
                }
            );
        }
    };

    $scope.removeAttachment = function () {
        $scope.attachmentPath = "";
    };

    $scope.validMessage = function (){
        return (!$scope.chatInput && !$scope.attachment) || ($scope.chatInput.length === 0 && !$scope.attachment)
    };

    $scope.sendMessage = function(input) {
        var message = {
            userId: userService.active._id,
            timestamp: "",
            text: $scope.snakkBot(input),
            channel: $scope.currentChannel._id,
            attachment: $scope.attachmentPath
        };

        if($scope.warning){
            var warningMessage = "";
            if(userService.active.warnings < 1){
                warningMessage = $scope.activeUser.username + " has been warned! Keep it clean.";
            }else if(userService.active.warnings < 2){
                warningMessage = "Last warning for " + $scope.activeUser.username + " before ban!";
            }else if (userService.active.warnings < 3){
                warningMessage = "Bye bye";
            }
            var botMessage = {
                userId: "133333333333333333333337",
                timestamp: "",
                text:  warningMessage,
                channel: $scope.currentChannel._id
            };

            $scope.activeUser.warnings += 1;
        }

        $scope.chatInput = '';
        var button = angular.element(document.getElementById("chat-input-container"));
        button.focus();

        channelService.updateTimeStamp($scope.currentChannel).then(function (response) {
            $scope.currentChannel = response.data;
            message.timestamp = $scope.currentChannel.timestamp;

            messageService.post(message).then(function (response) {
                if (!$scope.warning) {
                    $scope.checkTimeStamp();
                } else {
                    botMessage.timestamp = $scope.currentChannel.timestamp;
                    messageService.post(botMessage).then(function (response) {
                        $scope.checkTimeStamp();
                        $scope.warning = false;
                        if ($scope.activeUser.warnings > 2) {
                            userService.updateUser(userService.active).then(function (response) {
                                //$cookies.remove('user');
                                localStorage.removeItem('user');
                            });
                            userService.deleteUser($scope.activeUser._id);
                            window.location = "https://www.google.se/#q=low+self+esteem";

                        } else {
                            userService.updateUser(userService.active);
                        }
                    });
                }
            });
        });

        $scope.$watch('messageDb', function f() {
            var chatContent = document.getElementById('chat-text-box-container');
            chatContent.scrollTop = chatContent.scrollHeight;
        }, true);
    };

    $scope.addUserToMsg = function(users, messages) {
        for(var i = 0; i < messages.length; i++) {
            for(var e = 0; e < users.length; e++){

                if(messages[i].userId === users[e]._id) {
                    messages[i].username = users[e].username;
                }
                if(messages[i].userId === users[e]._id) {
                    messages[i].avatar = users[e].avatar;
                }
                else if(messages[i].avatar === undefined){
                    messages[i].avatar = "assets/images/defaultProfile.png";
                }
            }
        }
    };

    $scope.getMessages = function() {
        $scope.attachmentPath = "";
        $scope.messagesFromDb = messageService.getAllMessages($scope.currentChannel._id).then(function(response){
            $scope.messageDb = response;
            $scope.addUserToMsg($scope.users, $scope.messageDb);
        });
    };
    $scope.getNewMessages = function() {
        $scope.attachmentPath = "";
        $scope.newMessages = messageService.getNewMessages($scope.currentChannel._id, $scope.localTimestamp).then(function(response){
            $scope.messageDb = $scope.messageDb.concat(response);
            $scope.addUserToMsg($scope.users, $scope.messageDb);
        });
    };
    $scope.getMessages();

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
        for(var y = 0; y < $scope.contacts.length; y++){
            if($scope.contacts[y]._id === userId) {
                user = $scope.contacts[y];
            }
        }
        return user;
    };
    document.getElementById("chat-input-container").focus();

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
    //Watches for new messages
    $scope.checkTimeStamp = function() {
        channelService.get('?id='+$scope.currentChannel._id).then(function(response) {
            $scope.currentChannel = response;
            if($scope.localTimestamp !== $scope.currentChannel.timestamp) {
                $scope.getNewMessages();
                $scope.localTimestamp = $scope.currentChannel.timestamp;
            }
        });
    };
    //Watches for new channels
    $scope.newChannelChecker = function() {
        channelService.getChannelsForUser($scope.activeUser._id).then(function(channelResponse) {
            $scope.tmpChannels = channelResponse;
            userService.getUsers().then(function(userResponse) {
                $scope.tmpContacts = userResponse;
                $scope.updateChannelStatus();
                $scope.filterChannels();
            });
        });
    };
    setInterval(function() {
        $scope.checkTimeStamp();
    }, 1500);

    setInterval(function() {
        $scope.newChannelChecker();
    }, 4000);
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