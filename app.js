var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var flash = require('connect-flash');

var config = require('./config');

var localStrategy = require('passport-local').Strategy;
var RedisStore = require('connect-redis')(expressSession);

var Account = require('./models/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// redis/db/auth setup
var sessionStore = new RedisStore(); // session store
app.use(cookieParser(config.secret));
app.use(expressSession({
  secret: config.secret,
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect(config.mongoDatabaseURL, function(err) {if(err) throw err;});

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var account = require('./routes/account');

app.use('/', routes);
app.use('/user', account);

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
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
