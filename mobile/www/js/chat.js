app.controller('chatController', function($scope, $ionicSideMenuDelegate, userService, currentChannel, messageService, channelService) {

  $scope.messageDb = [];
  $scope.users = [];
  $scope.currentChannel = currentChannel;
  $scope.attachmentPath = "";

     $scope.toggleLeft = function() {
       $ionicSideMenuDelegate.toggleLeft();
     };

    userService.getUsers().then(function(result){
    $scope.users = result;
    console.log(result);
  });

  $scope.sendMessage = function(input) {
    var message = {
      userId: userService.active._id,
      date: formatDate(),
      text: $scope.snakkBot(input),
      channel: $scope.currentChannel._id,
      attachment: $scope.attachmentPath
    };
    /*if($scope.warning){
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
        date: formatDate(),
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
    }*/

    /*$scope.chatInput = '';
    var button = angular.element(document.getElementById("chat-input-container"));
    button.focus();*/

    channelService.updateTimeStamp($scope.currentChannel).then(function(response){
      $scope.currentChannel = response.data;
    });
    messageService.post(message).then(function(response){
      $scope.checkTimeStamp();
    });

    /*messageService.post(botMessage).then(function(response){
      $scope.checkTimeStamp();
    });*/

    /*$scope.$watch('messageDb', function f() {
      var chatContent = document.getElementById('chat-text-box-container');
      chatContent.scrollTop = chatContent.scrollHeight;
    }, true); */
  };

  $scope.getMessages = function() {
    //$scope.attachmentPath = "";
    $scope.messagesFromDb = messageService.getAllMessages('?channel=' + $scope.currentChannel._id).then(function(response){
      $scope.messageDb = response;
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
          messages[i].avatar = "assets/images/defaultProfile.png";
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
    var today = (month) + '' + (day);
    var hour = ("0" + d1.getHours()).slice(-2);
    var minutes = ("0" + d1.getMinutes()).slice(-2);

    return (year + today + " - " + hour + ":" + minutes);
  }
});
