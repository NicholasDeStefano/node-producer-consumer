/**
 * Generator/Producer
 */

'use strict';

var net = require('net');
var config = require('./configs/');
var generatorServer = require('./libs/generator_server');

var client = new net.Socket();

client.connect(config.evaluatorPort, config.evaluatorHost, function () {
  generatorServer(config.generatorPort, config.generatorHost, client);
});

/*
Trap connection errors, or log data from the consumer

client.on('data', function(data) {
  data.toString().split(' | ').forEach(function (item) {
    console.log(item);
  });
});
*/

