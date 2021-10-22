var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var routes = require('./routes/index');
var userRoutes = require('./routes/user')
var Handlebars= require('handlebars');
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
// var MongoStore = require('connect-mongo')(session);
var app = express();
var mongoose = require('mongoose')
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs',handlebars:allowInsecurePrototypeAccess(Handlebars)}))
app.set('view engine', '.hbs');
mongoose.connect('mongodb://localhost:27017/shopping',{useNewUrlParser:true,useUnifiedTopology:true})
require('./config/passport');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret:'mysupersecret',
  resave:false,
  saveUninitialized:false,
  // store:new MongoStore({mongooseConnection:mongoose.connection}),
  cookie: {maxAge: 180* 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(csrf({ cookie: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use('/user',userRoutes);
app.use('/',routes);
app.use(function(req, res, next) {
  next(createError(404));
});
// app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
