var express = require('express');
var body = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var database;

var app = express();
app.use(body.json());

MongoClient.connect('mongodb://localhost:27017/test', function(error, database_){
    if(error) {
        console.error('Failed to connect to server!"');
        console.log(error);
    } else {
        console.log('Connected to server!"');
        database = database_;
    }
});
app.listen(3000, function() {
    console.log("Starting new server");
});