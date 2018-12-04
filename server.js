var path = require('path');

//mongo setup
var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" + mongoUsername + ":" + mongoPassword + "@" + mongoHost +
    ":" + mongoPort + "/" + mongoDBName;

var mongoDB = null;

//express setup
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');

var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//socket.io setup
var server = require('http').Server(app);
var io = require('socket.io')(server);

//bodyParser setup
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//==Handle incoming requests
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  var allMessages = mongoDB.collection('messages');
  allMessages.find({}).toArray(function (err, messageDocs) {
    if (err) {
      res.status(500).send("Could not read data and store in array");
    }
    res.status(200).render('index', {
      messages: messageDocs
    });
  });
});

//handle adding posts to db
app.post('/message/addMessage', function (req, res, next) {
  console.log("== got message request");
  console.log("  - req.body.message:", req.body.message);
  console.log("  - req.body.username:", req.body.username);
  if (req.body && req.body.message && req.body.username) {
    var allMessages = mongoDB.collection('messages');
    allMessages.insertOne({
      username: req.body.username,
      message: req.body.message
    }, function (err, result) {
      if (err) {
        res.status(500).send("Error saving message to DB");
      } else {
        res.status(200).send("Successfully saved post in DB");
      }
    });
  } else {
    res.status(400).send("Request needs a body with the message field");
  }
});

//If file not found send 404 page
app.get('*', function (req, res) {
  res.status(404).render('404', {});
});

//Set up MongoDB Connection
MongoClient.connect(mongoURL, function(err, client) {
  if (err) {
    throw err;
  }
  mongoDB = client.db(mongoDBName);
  //Set the server to listen on the appropriate PORT
  /*app.listen(port, function () {
    console.log("==Server listening on port", port);
  });*/
  server.listen(port);
  console.log("==Server listening on port", port);
});

io.on('connection', function (socket) {
  socket.on('saved message', function (message, user) {
    console.log('client side posted message');
    socket.broadcast.emit('new post saved', message, user);
  });
});
