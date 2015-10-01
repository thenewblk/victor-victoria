var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
// var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var busboy = require('connect-busboy');
var app = express();

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// if (process.env.REDISTOGO_URL) {
//   var rtg   = require("url").parse(process.env.REDISTOGO_URL);
//   var redis = require("redis").createClient(rtg.port, rtg.hostname);
//   redis.auth(rtg.auth.split(":")[1]);
//
// } else {
//     var redis = require("redis").createClient();
// }
//
// RedisStore = require('connect-redis')(session);
//
// app.use(session({ secret: "bangarang",
//     maxAge : new Date(Date.now() + 7200000),
//     store: new RedisStore({client: redis})
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboy());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ secret: 'bangarang' }));
app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./routes/staff')(app, passport);
require('./routes/instagram')(app, passport);
require('./routes/index')(app, passport);

require('./lib/instagram_polling');

var mb = require('./lib/mindbody.js');
var params = {};
mb.getStaff(params);

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

app.listen(port);
