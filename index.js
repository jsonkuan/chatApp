var express = require('express');
var body = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var database;
var path = require('path');

var app = express();
app.use(body.json());

app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect('mongodb://localhost:27017/chatapp', function(error, database_){
    if(error) {
        console.error('Failed to connect to server!"');
        console.log(error);
    } else {
        console.log('Connected to server!"');
        database = database_;
    }
});

// Adds message to channel in DB
app.post('/messages', function(request, response) {
    database.collection('messages').insert(request.body);
    console.log("Message saved: " , request.body);
    response.send(request.body);
});

// Gets all channels from DB
app.get('/channels', function(request, response) {
    database.collection('channels').find().toArray(function (err, result) {
        response.send(result);
    });
});

app.get('/channel', function(request, response){
    console.log("request.query: ", request.query);
    database.collection('channels').findOne({'name' : request.query.channelName}, function(err, result){

        response.send(result);
    });

});
  
// Adds channels to DB
app.post('/channel', function(request, response) {
    database.collection('channels').insert(request.body, function(error, documents) {
        if (error) {
            response.send(error);
        } else {
            response.send(documents.ops);
        }
    });
});

app.get('/channel/direct', function(request, response) {
    var sender = request.query.sender;
    var recipient = request.query.recipient;
    console.log('sender recipient', sender, recipient);
    database.collection('channels').findOne( 
        { $and: [ {'accessability' : 'direct'}, 
                  {'users' : {$in: [sender]}}, 
                  {'users' : {$in: [recipient]}} ] },
        function(error, result) {
            console.log('channel/direct', result);
            response.send(result);
        });
});

// Gets all users from DB  
app.get('/users', function (req, res) {
    database.collection('users').find().toArray(function (err, results) {
        res.send(results);
    });
});

// Adds users to DB
  //TODO need to add avatar and channels
app.post('/users', function(request, response) {
    var user = request.body;
    database.collection('users').insert({"username" : user.username, "email" : user.email,
        "password" : user.password, "avatar" : user.avatar});
    response.send();
    console.log("User created");
});

// Updates the users info in DB
app.put('/users', function(request, response) {
    var user = request.body;
    database.collection('users').update({"_id": ObjectId(user._id)}, {"username" : user.username, "email" : user.email,
        "password" : user.password, "avatar" : user.avatar});
});

app.listen(3000, function() {
    console.log("Starting new server");
});