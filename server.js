var path = require('path');
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('index');
});

//If file not found send 404 page
app.get("*", function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

//Set the server to listen on the appropriate PORT
if (process.env.PORT) {
  app.listen(process.env.PORT, function(err) {
    if (err) {
      throw err;
    }
    console.log("==Server listening on port", process.env.PORT);
  });
}
else {
  app.listen(3000, function(err) {
    if (err) {
      throw err;
    }
    console.log("==Server listening on port 3000");
  });
}
