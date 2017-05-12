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

app.get('/', function(request, response){
    database.collection('user').find().toArray(function(err, result) {
        console.log(result);
        response.send(result);
    });
});

app.post('/', function(request, response) {
    database.collection('user').insert({"username" : request.body.username});
    console.log("Hepp!");
    response.send("It works");
});

app.post('/messages', function(request, response) {
    database.collection('channels').updateOne({"name": request.body.name},
                                            { $push : {"messages": request.body.message}});
    console.log("Hepp!");
    response.send("It works");
});

app.get('/channel', function(request, response){
    database.collection('channels').find().toArray(function(err, result) {
        console.log(result, "channel get");
        response.send(result);
    });
});

app.post('/channel', function(request, response) {
    database.collection('channels').insert(request.body);
    console.log("Channel post works" + request.body);
    response.send("Channel post works" + request.body);
});


app.listen(3000, function() {
    console.log("Starting new server");
});