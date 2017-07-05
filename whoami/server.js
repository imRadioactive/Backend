var express = require('express');
var app = express();
var url = require('url');

//adds views to middleware calls index.html automatically on calling
// app.use(express.static('views'));
//adds public to middleware
app.use(express.static('public'));


app.get("*", function (req, res) {

  var ip = req.headers['x-forwarded-for'].split(',')[0];
  var lang = req.headers["accept-language"].split(',')[0];
  var os = req.headers["user-agent"].split(/\)|\(/)[1];
  var user = {ipaddress : ip,
              language : lang,
              software : os
             }
  
  //express will stringify user for ME
  res.send(user);
});
// listen for requests :)

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

