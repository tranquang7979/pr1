var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

/*config EXPRESS SESSION*/
var parseurl = require('parseurl');
var session = require('express-session');

var socket = require('./routes/sockets.js');
var routes = require('./routes/index');
var users = require('./routes/users');

// create and start EXPRESS app
var app = express();
// start EXPRESS app
/*app.listen(3000, function () {
  console.log('Awesome-chat app listening on port 3000!');
});*/

//config EXPRESS SESSION
//https://github.com/expressjs/session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
/* app.use(function (req, res, next) {
  var views = req.session.views;
  if (!views) views = req.session.views = {};
  // get the url pathname
  var pathname = parseurl(req).pathname;
  // count the views
  views[pathname] = (views[pathname] || 0) + 1;
  next();
})*/

// create and start socket.io
var server = http.createServer(app);
/*var io = require("socket.io").listen(server);
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});*/
socket.initialize(server);
server.listen(3000);


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', '3200');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
