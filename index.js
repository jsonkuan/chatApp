var express = require('express');
var body = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var database;
var path = require('path');
var mime = require('mime-types');
var app = express();
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'common/img');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + mime.extension(file.mimetype));
    }
});

var upload = multer({ storage: storage });

//Taken from stackoverflow
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};
app.use(allowCrossDomain);
app.use(body.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'webb')));

MongoClient.connect('mongodb://localhost:27017/chatapp', function(error, database_){
    if(error) {
        console.error('Failed to connect to server!"');
        console.log(error);
    } else {
        console.log('Connected to MongoDB Server!');
        database = database_;
    }
});

// Adds message to channel in DB
app.post('/messages', function(request, response) {
    database.collection('messages').insert(request.body);
    response.send(request.body);
});

// Lists messages
app.get('/messages/top', function(request, response) {
    database.collection('messages').aggregate([
        {$group: {_id : "$userId", posts : {$sum:1}}},
        { $sort: {posts: -1}}
        ]).toArray(function(error, result){
        if(error){
            response.send(error);
        }else{
            response.send(result);
        }
    });

});

// fetches message from Db
app.get('/messages', function(request, response) {
    database.collection('messages').find({'channel': request.query.channel}).toArray(function (err, result) {
        response.send(result);
    });
});
app.get('/messages/new', function(request, response) {
    database.collection('messages').find({$and: [
        {'channel':request.query.channel},
        {'timestamp': {$gt: request.query.timestamp}}]}).toArray(function(err,result){
        response.send(result);
    });
});


// gets all channels for user from DB
app.get('/channels', function(request, response) {
    if (request.query.user) {
        var user = request.query.user;
        database.collection('channels').find(
            { $or: [ {'accessability' : 'public'},
                { $and: [ {'accessability' : 'private'},
                    {'users' : {$in: [user]}} ] },
                { $and: [ {'accessability' : 'direct'},
                    {'users' : {$in: [user]}} ] }
            ]})
            .toArray(function(error, result) {
                if (error) {
                    response.send(error);
                } else {
                    response.send(result);
                }
            });
    } else {
        database.collection('channels').find().toArray(function (err, result) {
            response.send(result);
        });
    }
});

// gets specific channel from Db
app.get('/channel', function(request, response){
    database.collection('channels').findOne({'_id' : ObjectId(request.query.id)}, function(err, result){
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

//updates channels timestamp
app.put('/channel', function(request,response) {
    var date = new Date();
    database.collection('channels').findOneAndUpdate({"_id": ObjectId(request.body._id)}, {$set:{"timestamp": date}}, {returnOriginal: false}, function(error, documents) {
        if(error) {
            console.log('update channel ERROR!');
            response.send(error);
        } else {
            response.send(documents.value);
        }
    });
});

app.get('/channel/direct', function(request, response) {
    var sender = request.query.sender;
    var recipient = request.query.recipient;
    database.collection('channels').findOne(
        { $and: [ {'accessability' : 'direct'},
            {'users' : {$in: [sender]}},
            {'users' : {$in: [recipient]}} ] },
        function(error, result) {
            console.log('channel/direct', result);
            response.send(result);
        });
});

app.get('/user', function(request, response) {
    var id = request.query.id;
    //TODO: account for faulty id
    if (id) {
        database.collection('users').findOne({'_id' : ObjectId(id)}, function(error, result) {
            response.send(result);
        });
    } else {
        response.send(false);
    }
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
    if(user._id === "133333333333333333333337"){
        database.collection('users').insert({"_id": ObjectId("133333333333333333333337"), "username" : user.username, "email" : user.email,
            "password" : user.password, "avatar" : user.avatar, "status" : user.status, "warnings": user.warnings});
        response.send();
        console.log("Bot created");
    }else{
        database.collection('users').insert({"username" : user.username, "email" : user.email,
            "password" : user.password, "avatar" : user.avatar, "status" : user.status, "warnings": user.warnings});
        response.send();
        console.log("User created");
    }
});

// Updates the users info in DB
app.put('/users', function(req, res) {
    var user = req.body;
    database.collection('users').update({"_id": ObjectId(user._id)}, {"username" : user.username, "email" : user.email,
        "password" : user.password, "avatar" : user.avatar, "status" : user.status, "warnings": user.warnings});
    res.send({});
});

// adds avatar image to localhost
app.post('/upload',upload.single('avatar'), function(req, res) {
    var path = (req.file.path.slice(11));
    console.log('upload image path', path);
    res.send(path);
});

//delete function
app.delete('/users:id', function(req, res) {
    database.collection('users').remove({"_id": ObjectId(req.params.id)});
    res.send({});
});

// used port
app.listen(3000, function() {
    console.log("Starting new server");
});