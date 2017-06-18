app.controller('chatController', function ($scope, $state, $ionicSideMenuDelegate, REST, session, userService, currentChannel, userContacts, messageService, channelService, userChannels, upload, $ionicScrollDelegate, $cordovaCamera, topPostersList) {
  $scope.activeUser = session;
  $scope.messageDb = [];
  $scope.allUsers = userContacts;
  $scope.users = userContacts;
  $scope.currentChannel = currentChannel;
  $scope.chatInput = {text: "", attachment: "", attachmentPath: ""};
  $scope.userInput = userService.active;
  $scope.localTimestamp = $scope.currentChannel.timestamp;
  $scope.channels = userChannels;
  $scope.tmpChannels = $scope.channels;
  $scope.tmpContacts = $scope.users;
  $scope.channelStatus;
  $scope.pictureUrl = "";
  $scope.topPosters = topPostersList;
  $scope.topList = [];
  $scope.channelName = "";
  $scope.warning = false;
  $scope.intervals = [];
  $scope.host = REST.host + '/';

  $scope.addUsersToPosters = function(topList, users){
    var newTopList = [];
    for (var i = 0; i < topList.length && i < 5 ; i++) {
      for (var j = 0; j < users.length; j++) {
        if (topList[i]._id === users[j]._id) {
          var tempObject = {username: users[j].username, posts : topList[i].posts, avatar: users[j].avatar};
          newTopList.push(tempObject);
        }
      }
    }
    return newTopList;
  };

  $scope.topList = $scope.addUsersToPosters(topPostersList, userContacts);

  $scope.logout = function () {
    userService.active.status = "offline";
    userService.updateUser(userService.active).then(function (response) {
      localStorage.removeItem('user');
      userService.active = null;
      channelService.current = null;
      $scope.clearIntervals();
      $state.transitionTo('login');
    })
  };

  console.log($scope.userInput.avatar);

  //TODO test if camera it works on device with camera
  $scope.takePhoto = function () {
    console.log("YESSS!");
    var options = {
      encodingType: Camera.EncodingType.JPEG
    };
    console.log("YESSS2!");
    $cordovaCamera.getPicture(options)
      .then(function (data) {
        //$scope.pictureUrl = 'data:image/jpeg;base64,'+data;
        $scope.userInput.avatar = data;

      }, function (error) {
      })
  };

  $scope.gotToAddChannel = function () {
    $scope.clearIntervals();
    $state.go('addChannel');
  };

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.toggleRight = function () {
    $ionicSideMenuDelegate.toggleRight();
  };

  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  $scope.snakkBot = function (message) {
    var regPattern = /[A-ZÅÄÖ]/;
    var badWords = ["dåligt", "dålig"];
    var banWords = ["trump", "fitta", "kuk", "cunt", "dick", "hora", "hoe", "faggot", "bög"];
    var uppercaseIndex = [];
    for (var j = 0; j < message.length; j++) {
      if (message[j].match(regPattern)) {
        uppercaseIndex.push(j);
      }
    }

    var newMessage = message.toLowerCase();
    var tempLetter = "";

    var concealedWord = "";
    for (var i = 0; i < badWords.length; i++) {
      newMessage = newMessage.replace(badWords[i], "mindre bra");
    }

    var oldMessage = newMessage;
    for (var y = 0; y < banWords.length; y++) {
      concealedWord = new Array(banWords[y].length + 1).join('*');
      newMessage = newMessage.replaceAll(banWords[y], concealedWord);
      concealedWord = "";
    }

    if (oldMessage !== newMessage) {
      $scope.warning = true;
    }

    for (var z = 0; z < uppercaseIndex.length; z++) {
      tempLetter = newMessage.charAt(uppercaseIndex[z]).toUpperCase();
      newMessage = newMessage.replace(tempLetter.toLowerCase(), tempLetter);
    }

    return newMessage;
  };

  // Filter channels for user
  $scope.filterChannels = function () {
    var contacts = $scope.tmpContacts.filter(function (user) {
      return user._id != userService.active._id;
    });
    var channels = $scope.channels.filter(function (channel) {
      return channel.accessability === 'public' || channel.accessability === 'private';
    });
    var direct = $scope.channels.filter(function (channel) {
      return channel.accessability === 'direct';
    });
    for (var i = 0; i < direct.length; i++) {
      for (var j = 0; j < contacts.length; j++) {
        if (direct[i].users.includes(contacts[j]._id)) {
          contacts[j].channelId = direct[i]._id;
        }
      }
    }
    $scope.channels = channels;
    $scope.users = contacts;
    $scope.allUsers = $scope.tmpContacts;
  };
  $scope.updateChannelStatus = function () {
    // Retrieve storage based on user
    $scope.channels = $scope.tmpChannels;
    var storage = localStorage[userService.active._id];
    if (!storage) {
      storage = {};
    } else {
      storage = JSON.parse(storage);
    }
    // Compare timestamp between channels and storage data
    var channels = $scope.channels;
    for (var i = 0; i < channels.length; i++) {
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
    localStorage[userService.active._id] = JSON.stringify(storage);
  };

  $scope.updateChannelStatus();
  $scope.filterChannels();

  //Watches for new channels
  $scope.newChannelChecker = function () {
    channelService.getChannelsForUser($scope.activeUser._id).then(function (channelResponse) {
        userService.getUsers().then(function (userResponse) {
            if ($scope.tmpChannels.length < channelResponse.length || $scope.tmpContacts.length < userResponse.length || $scope.userChangeChecker(userResponse, $scope.tmpContacts)) {
                $scope.tmpContacts = userResponse;
                $scope.addUserToMsg(userResponse, $scope.messageDb);
            }
            $scope.tmpChannels = channelResponse;
            $scope.updateChannelStatus();
            $scope.filterChannels();
        });
    });
  };

  $scope.openChat = function (channel) {
    channelService.current = channel;
    if($ionicSideMenuDelegate.getOpenRatio()){
      $scope.toggleLeft();
    }
    $scope.currentChannel = channel;
    $scope.messageDb = [];
    $scope.localTimestamp = '';
    $scope.checkTimeStamp();
    $scope.newChannelChecker();
    $scope.channelName = $scope.getChannelName($scope.currentChannel);
  };

  $scope.startDirectChat = function (userA, userB) {
    if (userA._id !== userB._id) {
      channelService.get('/direct?sender=' + userA._id + '&recipient=' + userB._id).then(function (response) {
        if (!response) {
          $scope.createDirectChat(userA, userB);
        } else {
          $scope.openChat(response);
        }
      });
    }
  };

  $scope.createDirectChat = function (userA, userB) {
    channelService.post({
      name: userA.username + " & " + userB.username,
      purpose: '',
      accessability: 'direct',
      users: [userA._id, userB._id],
      timestamp: ''
    }).then(function (response) {
      $scope.startDirectChat(userA, userB);
    });
  };

  $scope.sendMessage = function (input) {
    var message = {
      userId: userService.active._id,
      timestamp: "",
      text: $scope.snakkBot(input),
      channel: $scope.currentChannel._id,
      attachment: $scope.chatInput.attachmentPath
    };

    if ($scope.warning) {
      var warningMessage = "";
      if (userService.active.warnings < 1) {
        warningMessage = userService.active.username + " has been warned! Keep it clean.";
      } else if (userService.active.warnings < 2) {
        warningMessage = "Last warning for " + userService.active.username + " before ban!";
      } else if (userService.active.warnings < 3) {
        warningMessage = "Bye bye";
      }
      var botMessage = {
        userId: "133333333333333333333337",
        timestamp: "",
        text: warningMessage,
        channel: $scope.currentChannel._id
      };
      userService.active.warnings += 1;
    }
    $scope.chatInput.text = "";

    channelService.updateTimeStamp($scope.currentChannel).then(function (response) {
      $scope.currentChannel = response.data;
      message.timestamp = $scope.currentChannel.timestamp;

      messageService.post(message).then(function (response) {
        if (!$scope.warning) {
          $scope.checkTimeStamp();
        } else {
          setTimeout(function() {
            botMessage.timestamp = $scope.currentChannel.timestamp;
            messageService.post(botMessage).then(function(response) {
                $scope.checkTimeStamp();
                $scope.warning = false;
                if (userService.active.warnings > 2) {
                    userService.deleteUser(userService.active._id).then(function() {
                        $scope.clearIntervals();
                        userService.active = null;
                        channelService.current = null;
                        localStorage.removeItem('user');
                        $state.go('login');
                    });
                } else {
                userService.updateUser(userService.active);
                }
            });
          }, 10);
        }
      });
    });
  };

  $scope.getChannelName = function (currentChannel) {

    if (currentChannel.accessability === "direct") {

      var channelUser = $scope.allUsers.filter(function (user) {
        return user._id != userService.active._id && currentChannel.users.includes(user._id);
      });
      return channelUser[0].username;
    } else {
      return currentChannel.name;
    }
  };

  $scope.channelName = $scope.getChannelName($scope.currentChannel);

  $scope.getMessages = function () {
    $scope.messagesFromDb = messageService.getAllMessages($scope.currentChannel._id).then(function (response) {
      $scope.chatInput.attachmentPath = "";
      $scope.messageDb = response;
      $ionicScrollDelegate.scrollBottom();
      $scope.addUserToMsg($scope.allUsers, $scope.messageDb);
    });

    $scope.getNewMessages = function () {
      $scope.chatInput.attachmentPath = "";
      $scope.newMessages = messageService.getNewMessages($scope.currentChannel._id, $scope.localTimestamp).then(function (response) {
        $scope.messageDb = $scope.messageDb.concat(response);
        $ionicScrollDelegate.scrollBottom();
        $scope.addUserToMsg($scope.allUsers, $scope.messageDb);
      });
      messageService.getTopPosters().then(function (response){
        $scope.topList = $scope.addUsersToPosters(response, userContacts);
      });
    }
  };
  $scope.getMessages();

  $scope.getUserFromMsg = function (userId) {
    var user = {};
    for (var y = 0; y < $scope.allUsers.length; y++) {
      if ($scope.allUsers[y]._id === userId) {
        user = $scope.allUsers[y];
      }
    }
    return user;
  };

  $scope.addUserToMsg = function (users, messages) {
    for (var i = 0; i < messages.length; i++) {

      messages[i].displayDate = formatDate(messages[i].timestamp);

      for (var e = 0; e < users.length; e++) {

        if (messages[i].userId === users[e]._id) {
          messages[i].username = users[e].username;
        }
        if (messages[i].userId === users[e]._id) {
          messages[i].avatar = users[e].avatar;
        }

        if(messages[i].avatar === "defaultimages/defaultProfileWhite.png"){
          messages[i].avatar = "defaultimages/defaultProfile.png";
        }
      }
    }
  };
  //Watches for new messages
  $scope.checkTimeStamp = function () {
    channelService.get('?id=' + $scope.currentChannel._id).then(function (response) {
      $scope.currentChannel = response;
      if ($scope.localTimestamp !== $scope.currentChannel.timestamp) {
        $scope.getNewMessages();
        $scope.localTimestamp = $scope.currentChannel.timestamp;
      }
    });
  };

  function formatDate(isoDate) {
    var d1 = new Date(isoDate);
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
    $scope.username = userService.active.username;
    console.log($scope.userInput.avatar);
    console.log(userService.active.avatar);
    console.log($scope.avatar);

    if ($scope.avatar != userService.active.avatar && $scope.userInput.avatar !== "") {
      upload({
        //use http://83.249.240.91/upload' for server
        url: $scope.host + 'upload',
        method: 'POST',
        data: {
          avatar: $scope.userInput.avatar
        }
      }).then(
        function (response) {
          //console.log("avar" , response.data);
          setTimeout(function() {
            userService.active.avatar = "assets/img/" + response.data;
            userService.updateUser(userService.active).then(function() {
              $scope.newChannelChecker();
              $ionicSideMenuDelegate.toggleRight();
            });
          }, 1000);
        }
      );
    } else {
      userService.updateUser(userService.active).then(function() {
        $scope.newChannelChecker();
        $ionicSideMenuDelegate.toggleRight();
      });
    }
  };

  $scope.addAttachment = function () {
    console.log($scope.chatInput.attachment);

    if ($scope.chatInput.attachment) {
      upload({
        //use http://83.249.240.91/upload' for server
        url: $scope.host + 'upload',
        method: 'POST',
        data: {
          avatar: $scope.chatInput.attachment
        }
      }).then(
        function (response) {
          $scope.chatInput.attachmentPath = "assets/img/" + response.data;
          console.log($scope.chatInput.attachmentPath);
        }
      );
    }
  };

  $scope.removeAttachment = function () {
    $scope.chatInput.attachmentPath = "";
  };

  $scope.clearIntervals = function () {
    for (var i = 0; i < $scope.intervals.length; i++) {
      clearInterval($scope.intervals[i]);
    }
  };

  $scope.setupIntervals = function () {
    var messages = setInterval(function () {
      $scope.checkTimeStamp();
    }, 1500);
    var channels = setInterval(function () {
      $scope.newChannelChecker();
    }, 4000);
    $scope.intervals.push(messages);
    $scope.intervals.push(channels);
  }();

  $scope.userChangeChecker = function (responseArray, tmpArray) {

    for (var i = 0; i < responseArray.length; i++) {
      if (responseArray[i].avatar !== tmpArray[i].avatar || responseArray[i].username !== tmpArray[i].username) {
        return true;
      }
    }
    return false;
  }
});
