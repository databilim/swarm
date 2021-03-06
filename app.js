var express = require('express');


var https = require('https');
//var http = require('http');
const fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const db = require('./helper/db.js')();
// ROUTERS
var swarms = require('./routes/swarm');
var index = require('./routes/index');


//MİDDLEWARE 
const  video = require("./middleware/video");

var app = express();



const options = {
  cert: fs.readFileSync("/root/swarm/ssl/certificate.crt"),
  key: fs.readFileSync("/root/swarm/ssl/private.key")
};
server = require('http').createServer(app),
io1 = require('socket.io').listen(server);
server.listen(80);
//http.createServer(app).listen(80);
server2 = require('https').createServer(options, app).listen(443),
io = require('socket.io').listen(server2);
//https.createServer(options, app).listen(443);

io.on('connection', socket => {
  console.log('User connected')
 
  socket.emit("video play",1)


  socket.on('disconnect', () => {
    console.log('user disconnected')

  })

})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//const server = http.createServer(app)
app.use (function (req, res, next) {
  if (req.secure) {
          // request was via https, so do no special handling
          req.io = io;
          //req.video = video;
          
          next();
  } else {
          // request was via http, so redirect to https
        
          res.redirect('https://' + req.headers.host + req.url);

          
         
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set up express server here
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 



app.use(video); 
app.use('/', index);

app.use("/social",swarms);





// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found BASKAN');
  err.status = 404;
  //console.log(err)
  next(err.status+" HATA SAYFA YOK YADA ULAŞILMIYOR");
});