app.controller('chatController', function($scope, $ionicSideMenuDelegate, userService, currentChannel, messageService, channelService, upload, $ionicScrollDelegate) {

  $scope.messageDb = [];
  $scope.users = [];
  $scope.currentChannel = currentChannel;
  $scope.attachmentPath = "";
  $scope.chatInput= {text : ""};
  $scope.userInput = userService.active;
  $scope.localTimestamp = $scope.currentChannel.timestamp;

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.toggleRight = function() {
      $ionicSideMenuDelegate.toggleRight();
    };

    userService.getUsers().then(function(result){
    $scope.users = result;
    console.log(result);
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
      if($scope.activeUser.warnings > 2){
        userService.updateUser(userService.active).then(function(response) {
          $cookies.remove('user');
        });
        userService.deleteUser($scope.activeUser._id);
        window.location = "https://www.google.se/#q=low+self+esteem";
      }else {
        userService.updateUser(userService.active);
      }
      $scope.warning = false;
    }
    $scope.chatInput.text = "";

    channelService.updateTimeStamp($scope.currentChannel).then(function(response){
      $scope.currentChannel = response.data;
      message.timestamp = $scope.currentChannel.timestamp;

      messageService.post(message).then(function(response){
        $scope.checkTimeStamp();

        if($scope.warning) {
          botMessage.timestamp = $scope.currentChannel.timestamp;
          messageService.post(botMessage).then(function (response) {
            $scope.checkTimeStamp();
          });
        }
      });
    });

    /*$scope.$watch('messageDb', function f() {
      var chatContent = document.getElementById('chat-text-box-container');
      chatContent.scrollTop = chatContent.scrollHeight;
    }, true); */
  };
  $scope.getMessages = function() {
    $scope.attachmentPath = "";
    $scope.messagesFromDb = messageService.getAllMessages($scope.currentChannel._id).then(function(response){
      $scope.messageDb = response;
      $ionicScrollDelegate.scrollBottom();
      $scope.addUserToMsg($scope.users, $scope.messageDb);
    });

    $scope.getNewMessages = function() {
      $scope.attachmentPath = "";
      $scope.newMessages = messageService.getNewMessages($scope.currentChannel._id, $scope.localTimestamp).then(function(response){
        $scope.messageDb = $scope.messageDb.concat(response);
        $ionicScrollDelegate.scrollBottom();
        $scope.addUserToMsg($scope.users, $scope.messageDb);
      })
    }
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
      if($scope.localTimestamp !== $scope.currentChannel.timestamp) {
        $scope.getNewMessages();
        //$scope.getMessages();
        $scope.localTimestamp = $scope.currentChannel.timestamp;
      }
    });
  };
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

  $scope.password = userService.active.password;
  $scope.email = userService.active.email;
  $scope.username = userService.active.username;
  $scope.avatar = userService.active.avatar;

  $scope.saveSettings = function () {
    userService.active.password = $scope.userInput.password;
    userService.active.username = $scope.userInput.username;
    $scope.userInput.username = userService.active.username;
    $scope.userInput.password = userService.active.password;

    console.log(userService.active.username);
    console.log(userService.active.avatar);
    console.log($scope.avatar);

    if($scope.userInput.avatar != "") {
      upload({
        url: 'http://localhost:3000/upload',
        method: 'POST',
        data: {
          avatar: $scope.userInput.avatar
        }
      }).then(
        function (response) {
          userService.active.avatar = "img/" + response.data.slice(14);
          $scope.userInput.avatar = userService.active.avatar;
          userService.updateUser(userService.active);
        }
      );
    }
    userService.updateUser(userService.active);
  };

  $scope.addAttachment = function () {
    console.log($scope.attachment);

    if($scope.attachment) {
      upload({
        url: 'http://localhost:3000/upload',
        method: 'POST',
        data: {
          avatar: $scope.attachment
        }
      }).then(
        function (response) {
          $scope.attachmentPath = "img/" + response.data.slice(14);
        }
      );
    }
  };
  $scope.removeAttachment = function () {
    $scope.attachmentPath = "";
  };
});
