
var express = require('express');
var app = express();
var url = require('url');


// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("*", function (req,res) {
  res.writeHead(200, {'Content-Type': 'application/json ; charset=utf8'});
  
  var queryDate = url.parse(req.url, true).pathname.slice(1);
  var date = queryDate.split(/%20/).join(' ');
  var unix = isValidDate(date);
  if(unix){
    var str= { "unix": unix, "natural": date };
    res.write(JSON.stringify(str));
  }
  
  else{
    var str= { "unix": null, "natural": null };
    res.write(JSON.stringify(str));
  }
  
  res.end();
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function isValidDate(date){
  console.log(date, Date.parse(date));
  if( Date.parse(date) < 0){
    return false;
  }
  return Date.parse(date);

}