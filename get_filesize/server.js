
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var multer  = require('multer');

//add destination in multer to save uploaded -> refer multer npm
var upload = multer().single('file_upload');


app.post('/get_size', upload, function (req, res, next) {
    res.json({'file size in bytes' : req.file.size});
    console.log(req.file.size);
})

app.listen(process.env.PORT || 8000, () => {
    console.log('server\'s up');
});
