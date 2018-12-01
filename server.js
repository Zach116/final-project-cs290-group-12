var path = require('path');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" + mongoUsername + ":" + mongoPassword + "@" + mongoHost +
    ":" + mongoPort + "/" + mongoDBName;

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

//If file not found send 404 page
app.get('*', function (req, res) {
  res.status(404).render('404', {});
});

//Set up MongoDB Connection
MongoClient.connect(mongoURL, function(err, client) {
  if (err) {
    throw err;
  }

  //Set the server to listen on the appropriate PORT
  app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log("==Server listening on port", port);
  });
});

