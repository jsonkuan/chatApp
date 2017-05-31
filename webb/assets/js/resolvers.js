// Factory for handling specific/detailed promises/resolves
//angular.module('app', ['common'])

app.factory('Resolvers', function($q, $cookies, REST, channelService, userService, Generator) {
    return {
        //Makes sure a current channel is set and returns it
        getChannel: function() {
            return $q(function(resolve) { 
                if (channelService.current) {
                    resolve(channelService.current);
                } else {
                    channelService.getAll().then(function(response) {
                        if (response.length > 0) {
                            channelService.current = response[0];
                            resolve(channelService.current);
                        } else {
                            Generator.channels().then(function(response) {
                                channelService.current = response.data[0];
                                resolve(channelService.current);
                            });
                        }
                    });
                }
            });
        },
        //Checks if a user is active or saved as a cookie, and returns the user OR null if not found.
        getUser: function() {
            return $q(function(resolve) {
                if (userService.active) {
                    resolve(userService.active);
                } else {
                    var userId = $cookies.get('user');
                    if (userId) {
                        userService.get(userId).then(function(response) {
                            //TODO: account for empty response
                            userService.active = response;
                            resolve(response);
                        });
                    } else {
                        resolve(null);
                    }
                }
            });
        }
    }
});

// Factory for generating default channels
angular.module('app').factory('Generator', function(channelService) {
    return {
        channels: function() {
            var channels = [{
                name: "General",
                purpose: 'Chat about everything.',
                accessability: 'public',
                users: [],
                timestamp: ''
            }, {
                name: "Work",
                purpose: 'Keep it clean!',
                accessability: 'public',
                users: [],
                timestamp: ''
            }, {
                name: "Afterwork",
                purpose: 'NSFW is alllowed here.',
                accessability: 'public',
                users: [],
                timestamp: ''
            }, {
                name: "Crazy cat-lady Videos",
                purpose: 'Here everyone has to love cats!',
                accessability: 'public',
                users: [],
                timestamp: ''
            }, {
                name: "pr0n",
                purpose: 'A chat for funny ASCII images',
                accessability: 'public',
                users: [],
                timestamp: ''
            }];
            return channelService.post(channels);            
        }
    };
});