/**
 * Evaluator/Consumer
 */

'use strict';

var net = require('net');

var config = require('./configs/');
var queue = require('./libs/queue');
var rpn = require('./libs/rpn');
var logger = require('./libs/logger');

// All connected clients
var clients = [];

var server = net.createServer(function(socket) {

  socket.name = socket.remoteAddress + ":" + socket.remotePort

  clients.push(socket);

  setInterval(function () {
    if (queue.size() > 0) {
      processJob();
    }
  }, config.pollFrequency);

  socket.on('data', function (data) {
    queue.put(data.toString());
  });

  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  });

  function processJob () {
    var jobs;

    jobs = queue.get();

    jobs.split(' = ').forEach(function(expression) {
      var result, message;

      if (expression) {
        // Resolve the expression
        result = rpn.resolve(expression);

        message = expression + ' = ' + result;

        // Tell anyone listening about it
        notify(message);

        // Log the expression
        logger.info(message, server.address());
      }
    });
  }

  function notify (message) {
    clients.forEach(function (client) {
      client.write('' + message + ' | ', 'utf8');
    });
  }

});

server.listen(config.evaluatorPort, config.evaluatorHost);

// Expose server
exports = module.exports = server;
