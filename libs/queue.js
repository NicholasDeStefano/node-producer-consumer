'use strict';

var _queue = [];

function Queue () {}

Queue.prototype.size = function () {
  return _queue.length;
};

Queue.prototype.put = function (data) {
  _queue.push(data);
};

Queue.prototype.get = function () {
  return _queue.shift();
}

Queue.prototype.clear = function () {
  _queue = [];
}

module.exports = new Queue();
