var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var route = require('./routes/route');
var users = require('./routes/users');
var allow_origin = require('./utils/allowOrigin');
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'123456',
    resave: false,
    cookie: {maxAge: 60000},
    saveUninitialized: true,
}));
app.use('/', route);
var allow = allow_origin("http://localhost:8080");
console.log('请求源url'+allow);
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", allow);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    next();
});
app.post('/uploadFile',users.uploadFile);
// app.post('/ajaxUpload',upload.single('files1'),users.ajaxUpload);

app.post('/ajaxUpload', users.ajaxUpload)
app.post('/regist',users.regist);
app.post('/updatePwd',users.updatePwd);
app.post('/login',users.login);
app.post('/getWebsiteInfo',users.getWebsiteInfo);
app.post('/getInfo',users.getInfo);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
