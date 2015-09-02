var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 4567;
var server = app.listen(port);
var livereload = require('livereload');
var liveserver = livereload.createServer();
liveserver.watch(__dirname + '/assets');

app.set('env','production');
app.set('x-powered-by', false);

app.use(bodyParser.json());

app.use(require('./controllers/static'));
app.use('/api/stats', require('./controllers/api/stats'));
server;