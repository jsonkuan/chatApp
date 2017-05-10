var express = require('express');
var body = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var database;
var path = require('path');

var app = express();
app.use(body.json());

app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect('mongodb://localhost:27017/test', function(error, database_){
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
        response.send(result);
    });
});

app.post('/', function(request, response) {
    database.collection('user').insert({"username" : request.body.username});
    response.send("Hejsan");
});

app.listen(3000, function() {
    console.log("Starting new server");
});