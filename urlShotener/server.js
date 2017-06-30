
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
app.use(express.static(__dirname + '/public'));

var database  = 'mongodb://shorturl:mlab28@ds139342.mlab.com:39342/shortenurl';


//does matter if below three liens arae there or not
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });


//app.get('/new/:url(*)', (req, res, next) => WHAY GOD WHAY
// included coz, later on if its http://, it'll think its a subdirectiory --- not adding star makes the whole thing as a variable
app.get('/new/:url(*)', (req, res, next) => {

    var url = req.params.url;
    var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.‌​-]+(:[0-9]+)?|(?:www‌​.|[-;:&=\+\$,\w]+@)[‌​A-Za-z0-9.-]+)((?:\/‌​[\+~%\/.\w-_]*)?\??(‌​?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)/;
    if(re.test(url)){
        var short = Math.floor(Math.random()*100000).toString();
        var data = {
            originalurl : url,
            shorterurl : short
        };

        mongo.connect(database, function(err, db) {
            if(err) throw err;
            db.collection('urls').insert(data, (err, doc) => {
                if(err) throw err;
                db.close();
            });
        });

        return res.json(data);
    }
    else{
        var data = {
            originalurl : url,
            shorterurl : 'uh oh invalid url'
        };
        return res.json(data);
    }
});

app.get('/:urlToForward', (req, res, next) => {
    var shorterurl = req.params.urlToForward;
    console.log(shorterurl);

    mongo.connect(database, function(err, db) {
        if(err) throw err;
        db.collection('urls').find({
            'shorterurl' : shorterurl
        }, { 'originalurl' : 1, 'shorterurl' : 1 , _id : 0}).toArray((err, doc) => {
            if(err) throw err;
            console.log('doc =', doc);
            if(err) return res.send('Error in databse while fincding the encoded thingy');
            // var strToCheck = doc.originalurl;
            res.redirect(301, doc[0].originalurl);
            db.close();
        });
    });

});


app.listen(process.env.PORT || 8000, () => {
    console.log('server\'s up');
});
