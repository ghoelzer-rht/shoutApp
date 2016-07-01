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

var app = express();

module.exports = app;
