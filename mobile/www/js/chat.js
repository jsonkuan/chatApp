app.controller('chatController', function($scope, $state, $ionicSideMenuDelegate, session, userService, currentChannel, userContacts, messageService, channelService, userChannels, upload, $ionicScrollDelegate, $cordovaCamera) {
  $scope.activeUser = session;
  $scope.messageDb = [];
  $scope.users = userContacts;
  $scope.currentChannel = currentChannel;
  $scope.chatInput= {text : "", attachment : "", attachmentPath: ""};
  $scope.userInput = userService.active;
  $scope.channels = userChannels;
  $scope.tmpChannels = $scope.channels;
  $scope.tmpContacts = $scope.users;
  $scope.pictureUrl = "";

  $scope.logout = function(){
    userService.active.status = "offline";
    userService.updateUser(userService.active).then(function(response) {
      localStorage.removeItem('user');
      userService.active = null;
      channelService.current = null;
      $state.transitionTo('login');
    })
  };
  //TODO test if camera it works on device with camera
   $scope.takePhoto = function(){
     console.log("YESSS!");
    var options = {
    encodingType: Camera.EncodingType.JPEG
    };
     console.log("YESSS2!");
    $cordovaCamera.getPicture(options)
      .then(function(data){
      //$scope.pictureUrl = 'data:image/jpeg;base64,'+data;
        $scope.userInput.avatar = data;

      }, function(error){

      })
   };

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.toggleRight = function() {
      $ionicSideMenuDelegate.toggleRight();
    };

    userService.getUsers().then(function(result){
    $scope.users = result;
  });

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

	   // Filter channels for user
    $scope.filterChannels = function() {
        var contacts = $scope.tmpContacts.filter(function(user) {
            return user._id != userService.active._id;
        });
        var channels = $scope.channels.filter(function(channel) {
            return channel.accessability === 'public' || channel.accessability === 'private';
        });
        var direct = $scope.channels.filter(function(channel) {
            return channel.accessability === 'direct';
        });
        for (var i = 0; i < direct.length; i ++) {
            for (var j = 0; j < contacts.length; j ++) {
                if (direct[i].users.includes(contacts[j]._id)) {
                    contacts[j].channelId = direct[i]._id;
                }
            }
        }
        $scope.channels = channels;
        $scope.contacts = contacts;
        $scope.users = $scope.tmpContacts;
    };
    $scope.updateChannelStatus = function() {
        // Retrieve cookie based on user
        $scope.channels = $scope.tmpChannels;
        //var cookie = $cookies.get(userService.active._id);
        var storage = localStorage[userService.active._id];
        if (!storage) {
            storage = {};
        } else {
            storage = JSON.parse(storage);
        }
        // Compare timestamp between channels and storage data
        var channels = $scope.channels;
        for (var i = 0; i < channels.length; i ++) {
            var channelId = channels[i]._id;
            if (!storage[channelId]) {
                storage[channelId] = {
                    timestamp: Date(),
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
        storage[channelService.current._id].timestamp = Date();
        storage[channelService.current._id].update = false;
        $scope.channelStatus = storage;
        localStorage[userService.active._id] = JSON.stringify(storage);
        //$cookies.put(userService.active._id, JSON.stringify(storage));
    };

    $scope.updateChannelStatus();
    $scope.filterChannels();

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
        $scope.openChat = function(channel) {
        channelService.current = channel;
        $scope.toggleLeft();
        $scope.currentChannel = channel;
        $scope.getMessages();
    }

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

    $scope.sendMessage = function(input) {
    var message = {
      userId: userService.active._id,
      date: formatDate(),
      text: $scope.snakkBot(input),
      channel: $scope.currentChannel._id,
      attachment: $scope.chatInput.attachmentPath
    };

    if($scope.warning){
      var warningMessage = "";
      if(userService.active.warnings < 1){
        warningMessage = userService.active.username + " has been warned! Keep it clean.";
      }else if(userService.active.warnings < 2){
        warningMessage = "Last warning for " + userService.active.username + " before ban!";
      }else if (userService.active.warnings < 3){
        warningMessage = "Bye bye";
      }
      var botMessage = {
        userId: "133333333333333333333337",
        date: formatDate(),
        text:  warningMessage,
        channel: $scope.currentChannel._id
      };
      userService.active.warnings += 1;
      if(userService.active.warnings > 2){
        userService.updateUser(userService.active).then(function(response) {
          $cookies.remove('user');
        });
        userService.deleteUser(userService.active._id);
        window.location = "https://www.google.se/#q=low+self+esteem";
      }else {
        userService.updateUser(userService.active);
      }
      $scope.warning = false;
    }

    $scope.chatInput.text = "";

    channelService.updateTimeStamp($scope.currentChannel).then(function(response){
      $scope.currentChannel = response.data;
    });
    messageService.post(message).then(function(response){
      $scope.checkTimeStamp();
    });

    messageService.post(botMessage).then(function(response){
      $scope.checkTimeStamp();
    });

    /*$scope.$watch('messageDb', function f() {
      var chatContent = document.getElementById('chat-text-box-container');
      chatContent.scrollTop = chatContent.scrollHeight;
    }, true); */
  };

  $scope.getMessages = function() {
    $scope.chatInput.attachmentPath = "";
    $scope.messagesFromDb = messageService.getAllMessages('?channel=' + $scope.currentChannel._id).then(function(response){
      $scope.messageDb = response;
      $ionicScrollDelegate.scrollBottom();
      $scope.addUserToMsg($scope.users, $scope.messageDb);
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
        else if(messages[i].avatar === undefined){
          messages[i].avatar = "img/defaultProfile.png";
        }
      }
    }
  };
  //Watches for new messages
  $scope.checkTimeStamp = function() {
    channelService.get('?id='+$scope.currentChannel._id).then(function(response) {
      $scope.currentChannel = response;
      if($scope.timestampChecker !== $scope.currentChannel.timestamp) {
        $scope.getMessages();
        $scope.timestampChecker = $scope.currentChannel.timestamp;
      }
    });
  };
  function formatDate() {
    var d1 = new Date();
    var day = ("0" + d1.getDate()).slice(-2);
    var month = ("0" + (d1.getMonth() + 1)).slice(-2);
    var year = d1.getFullYear();
    var today = (month) + '-' + (day);
    var hour = ("0" + d1.getHours()).slice(-2);
    var minutes = ("0" + d1.getMinutes()).slice(-2);

    return (year +"-"+ today + " - " + hour + ":" + minutes);
  }
  $scope.password = userService.active.password;
  $scope.email = userService.active.email;
  $scope.username = userService.active.username;
  $scope.avatar = userService.active.avatar;

  $scope.saveSettings = function () {
    userService.active.password = $scope.userInput.password;
    userService.active.username = $scope.userInput.username;
    $scope.userInput.username = userService.active.username;
    $scope.userInput.password = userService.active.password;

    if($scope.userInput.avatar !== "") {

      upload({
        url: 'http://localhost:3000/upload',
        method: 'POST',
        data: {
          avatar: $scope.userInput.avatar
        }
      }).then(
        function (response) {
          userService.active.avatar = response.data.slice(10);
          if (userService.active.avatar[0] === "s") {
            userService.active.avatar.slice(8);
            userService.active.avatar = "img" + response.data.slice(18);
            userService.updateUser(userService.active);
            console.log(userService.active.avatar);

          }
        }
      );
    }
    userService.updateUser(userService.active);
    $scope.toggleRight();
  };

  $scope.addAttachment = function () {
    if($scope.chatInput.attachment) {
      upload({
        url: 'http://localhost:3000/upload',
        method: 'POST',
        data: {
          avatar: $scope.chatInput.attachment
        }
      }).then(
        function (response) {
          $scope.chatInput.attachmentPath = response.data.slice(10);
          if($scope.chatInput.attachmentPath[0] === "s"){
            $scope.chatInput.attachmentPath.slice(8);
            $scope.chatInput.attachmentPath = "img" + response.data.slice(18);
          }
          console.log($scope.chatInput.attachmentPath)
        }
      );
    }
  };
  	$scope.removeAttachment = function () {
  	  $scope.chatInput.attachmentPath = "";
  	};
	setInterval(function() {
   		$scope.newChannelChecker();
 	},1000);
});
