var express = require('express');
//var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');
var io = require('socket.io')();
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');

var opts =
app.set('trust proxy', 1);
app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Catfish';

app.locals.allSpeakers = dataFile.speakers;

app.use(express.static('app/public'));
app.use(session({secret: 'maxxxed', saveUninitialized: false, resave:false,cookie: { secure: false}}));
app.use(require('./routes/index'));
app.use(require('./routes/register'));
app.use(require('./routes/catfishGallery'));
app.use(require('./routes/upload_video_route'));
app.use(require('./routes/team'));
app.use(require('./routes/feedback'));
app.use(require('./routes/home'));
app.use(require('./routes/chat'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());


var server = app.listen(app.get('port'), '0.0.0.0',function() {
  console.log('Listening on port ' + app.get('port'));
});
//70.26.109.225

var numUsers = 0;
server.timeout = 900000000; //ms

io.attach(server);
io.on('connection', function(socket) {
   var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

//reload(server, app);


