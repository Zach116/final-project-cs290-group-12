var express = require('express');
var app = express();

app.use(express.static('public'));

//If file not found send 404 page
app.get("*", function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

//Set the server to listen on the appropriate PORT
if (process.env.PORT) {
  server.listen(process.env.PORT, function(err) {
    if (err) {
      throw err;
    }
    console.log("==Server listening on port", process.env.PORT);
  });
}
else {
  server.listen(3000, function(err) {
    if (err) {
      throw err;
    }
    console.log("==Server listening on port 3000");
  });
}
