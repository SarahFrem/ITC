var path = require('path');
var morgan = require('morgan');
var express = require('express');
var app = express();

app.use(morgan('combined'));
app.use('/images', express.static('images'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/game', function (req, res) {
  res.sendFile(path.join(__dirname + '/game.html'));
});

// Provides support for using links that point to not a nodejs server
app.get('/index.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/game.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/game.html'));
});

// ---
 
var listener = app.listen(8888, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});