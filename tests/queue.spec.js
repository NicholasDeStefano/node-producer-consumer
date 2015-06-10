'use strict';

var assert = require('assert');
var queue = require('../libs/queue');

describe('queue', function () {

  beforeEach(function () {
    queue.clear();
  });

  afterEach(function () {
    queue.clear();
  });

  it('should put an item', function () {
    assert.equal(queue.size(), 0);
    queue.put('foo');
    assert.equal(queue.size(), 1);
  });

  it('should get an item', function () {
    assert.equal(queue.size(), 0);
    queue.put('foo');
    assert.equal(queue.size(), 1);
    var item = queue.get();
    assert.equal(queue.size(), 0);
    assert.equal(item, 'foo');
  });
});
