var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var manager = require('./controller/index');

// Configure database

var dbConfig = require('./db');
var mongoose = require('mongoose');


// Connect to DB
mongoose.connect(dbConfig.url);

var app = express();
var hbs = require('hbs');
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));
hbs.localsAsTemplateData(app);

// View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.disable('etag');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport

var passport = require('passport');
var expressSession = require('express-session');

// TODO - Why Do we need this key ?

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport,io);
app.use('/', routes);

/// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('default/error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;

io.on('connection', function(socket){
  
  /* When user enter a conversation */
  socket.on('adduser', function(roomid) {
    socket.room = roomid;
    socket.join(roomid);
  });

  /* User disconnect */
  socket.on('disconnect', function(){
    socket.leave(socket.room);
  });

  /* User send chat message */
  socket.on('chat message', function(msg){
    
    // Get time to attach with the message
    var timestamp = (new Date).getTime();
    var message = {user_id: msg.user_id ,group_id: msg.group_id,
                   content: msg.message, time: timestamp};

    // Emit chat message event to client in that particular room
    io.sockets.in(socket.room).emit('chat message', { 
      message: msg.message,
      username: msg.username, 
      time: timestamp
    });

    // Add message to database
    manager.addMessage(message);
  });
});