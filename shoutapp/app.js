var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints : ['172.30.107.103'], keyspace: 'test', username: 'cassandra', password: 'cassandra'});

client.execute('SELECT * FROM test_table', [],

  function(err, result) {

    if (err) {
		console.log('execute failed', err);

    } else {
		for (var i = 0; i < result.rows.length; i++) {
			console.log('id=' + result.rows[i].get('id') + ' test_value=' + result.rows[i].get('test_value'));
		}
		
		process.exit(0);
    }

  }
);

client.connect(function(err, result){
    console.log('cassandra connected');
});

var routes = require('./routes/index');
var users = require('./routes/users');
var user = require('./routes/user');
var adduser = require('./routes/adduser');
var edituser = require('./routes/edituser');
var shouts = require('./routes/shouts');
var addshout = require('./routes/addshout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/user', user);
app.use('/adduser', adduser);
app.use('/edituser', edituser);
app.use('/shouts', shouts);
app.use('/addshout', addshout);

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
