var express       = require('express');
var load          = require('express-load');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var flash         = require('express-flash');
var session       = require('express-session');

var app = express();
mongoose.connect('mongodb://localhost/income', function (err) {
  if (err) return console.log('Erro ao conectar com mongoDB: '+err);
  return console.log('MongoDB conectado com sucesso!!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// incluso devido ao express-flash
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat income',
                  resave: false,
                  saveUninitialized: true
                  // ,cookie: { maxAge: 60000}
                })
);
app.use(flash());

load('models').then('controllers').then('routes').into(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Página não encontrada');
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
