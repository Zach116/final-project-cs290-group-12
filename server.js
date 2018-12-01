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


//==Handle incoming requests
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('index');
});

//handle adding posts to db
app.post('/message/addMessage', function (req, res, next) {
  if (req.body && req.body.user && req.body.message) {
    var allMessages = mongoDB.collection('messages');
    allMessages.insertOne({
      user: req.body.user,
      message: req.body.message
    }, function (err, result) {
      if (err) {
        res.status(500).send("Error saving message to DB");
      } else if (result.matchedCount > 0) {
        res.status(200).send("Successfully saved post in DB");
      } else {
        next();
      }
    });
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
  app.listen(port, function() {
    console.log("==Server listening on port", port);
  });
});

