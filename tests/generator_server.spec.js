'use strict';

var request = require('supertest');
var assert = require('assert');
var net = require('net');

var config = require('../configs/');
var logger = require('../libs/logger');
var evaluator = require('../server');
var generator = require('../libs/generator_server');

describe('generator server', function () {

  var generator1, generator2, client, evaluatorDone, generatorDone, times,
    concurrent, iterations;

  beforeEach(function (done) {
    times = {};
    evaluatorDone = 0;
    generatorDone = 0;
    concurrent = 2;
    iterations = 10;

    client = new net.Socket();
    client.on('data', function(data) {
      data.toString().split(' | ').forEach(function (item) {
        evaluatorDone += 1;
        addResolvedTime(item);
      });
    });

    client.connect(config.evaluatorPort, config.evaluatorHost, function () {
      generator1 = generator(8000, 'localhost', client);
      generator2 = generator(8001, 'localhost', client);
      done();
    });
  });

  afterEach(function (done) {
    times = null;
    evaluatorDone = 0;
    generatorDone = 0;
    client.destroy();
    done();
  });

  it('should process at least 1 request per second, per server', function (done) {
    var i;

    for (i = 0; i < concurrent; i += 1) {
      var generator = i & 1 ? generator1 : generator2;
      makeRequest(generator);
    }

    function makeRequest(server) {
      if (generatorDone >= iterations) {
        assertResults();
        return;
      }

      request(server)
        .get('/expression')
        .expect('Content-Type', /text/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          generatorDone += 1;

          var parts = res.text.split(' ');
          assert(parts.length, 3);

          addGeneratedTime(res.text);

          if (generatorDone < iterations) {
            makeRequest(server);
          }
        });
    }

    setInterval(function () {
      if (generatorDone >= iterations && evaluatorDone >= iterations) {
        return assertPerf(done);
      }
    }, 100);

  });

  function assertPerf(cb) {
    var expression, group;

    for (expression in times) {
      if (!times.hasOwnProperty(expression)) continue;
      group = times[expression];
      assert(group.start);
      assert(group.end);
      times[expression].time = group.end - group.start;
      assert(times[expression].time < 1000);
    }

    logger.info(times);

    cb();
  }

  function addResolvedTime (item) {
    var resolved, expression, result;

    if (!item) return;

    resolved = item.split(' = ');
    expression = resolved[0];
    result = resolved[1];

    if (!times[expression]) {
      times[expression] = {};
    }

    times[expression].end = new Date().getTime();
    times[expression].result = result;
  }

  function addGeneratedTime (expression) {
    if (!times[expression]) {
      times[expression] = {};
    }
    times[expression].start = new Date().getTime();
  }

});
