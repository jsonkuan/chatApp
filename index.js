var express = require('express');
var body = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
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

app.get('/users', function (req, res) {
    database.collection('user').find().toArray(function (err, results) {

        res.send(results);
    })
});

app.post('/users', function(request, response) {
    var user = request.body;
    database.collection('user').insert({"username" : user.username, "email" : user.email,
        "password" : user.password, "avatar" : user.avatar});

    response.send();
    console.log("Hepp!");
});


app.put('/users', function(request, response) {
    var user = request;
    database.collection('user').updateOne({"_id" : user.ObjectId}, {"username" : user.username, "email" : user.email,
        "password" : user.password, "avatar" : user.avatar});
    console.log("index");
    console.log(user);
    response.send(user);

});

app.listen(3000, function() {
    console.log("Starting new server");
});