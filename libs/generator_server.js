'use strict';

var connect = require('connect');
var http = require('http');

var config = require('../configs/');
var rpn = require('./rpn');
var logger = require('./logger');


exports = module.exports = function (port, host, client) {

  port = port || config.generatorPort;
  host = host || config.generatorHost;

  var app = connect();

  app.use('/expression', function (req, res, next) {
    var expression;

    expression = rpn.generate();

    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    // Send the response right away
    res.end(expression);

    // FireAndForget.exe;
    client.write(expression + ' = ', 'utf8');

    // Log the expression
    logger.info(expression, {host: host, port: port});

  });

  var server = app.listen(port, host);
  return server;
};
