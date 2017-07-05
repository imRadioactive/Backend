
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
// var mongo = require('mongodb').MongoClient;
app.use(express.static(__dirname + '/public'));
var gis = require('g-i-s');
var database  = 'mongodb://localhost:27017';

app.get('/latest', (req,res) => {
    mongo.connect(database, function(err, db) {
        if(err) throw err;
        db.collection('search_details').find({},{_id : 0}).sort({'when' : -1}).limit(3).toArray((err, doc) => {
            if(err) throw err;
            console.log('doc =', doc);
            if(err) return res.send('Error in databse while fincding the encoded thingy');
            // var strToCheck = doc.originalurl;
            res.json(doc);
            db.close();
        });
    });
});

app.get('/:image', (req, res, next) => {
    var image = req.params.image;
    var data = {
        'phrase' : image,
        'when' : new Date()
    }
    console.log(data);
    var opts = {
        searchTerm: image,
        queryStringAddition: 'callback=' + req.query.callback + '&num=' + req.query.num
    };

    gis(opts, logResults);

    function logResults(err, results) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.json(results);
        }
    }

    mongo.connect(database, function(err, db) {
        if(err) throw err;
        db.collection('search_details').insert(data, (err, doc) => {
            if(err) throw err;
            db.close();
        });
    });
});

app.listen(process.env.PORT || 8000, () => {
    console.log('server\'s up');
});
