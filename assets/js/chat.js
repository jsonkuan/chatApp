angular.module('app').run(function($rootScope){
    $rootScope.allMessages = [];
});


angular.module('app').controller('chatController', function($scope, $state, $rootScope) {
    $scope.channels = ['General', 'Work', 'Afterwork', 'Crazy cat videos', 'pr0n'];
    $scope.contacts = ['Snygg-Kuan', 'Cool-boy-Scolari', 'Papa-Niklas', 'Super-Jakob', 'Nerd-Dervish', 'Killer-Christian'];

    $scope.sendToSettings = function(){
        $state.transitionTo('settings');
    };

    $scope.sendMessage = function(){
        var message = {user: "anv1", date: formatDate(), message: $scope.chatInput};
        $rootScope.allMessages.push(message);
        console.log($scope.allMessages.length);

        $scope.$watch('allMessages', function f() {
            var chatContent = document.getElementById('chat-text-box-container');
            chatContent.scrollTop = chatContent.scrollHeight;
        }, true);
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



