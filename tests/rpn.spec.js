'use strict';

var assert = require('assert');
var rpn = require('../libs/rpn');

describe('rpn', function () {
  it('should return a random expression', function () {
    var expression, parts;

    expression = rpn.generate();
    parts = expression.split(' ');

    assert.equal(parts.length, 3);

    assert(isInt(parts[0]));
    assert(isBetween(parts[0]));

    assert(isInt(parts[1]));
    assert(isBetween(parts[1]));

    assert(isOperator(parts[2]));
  });

  it('should generate different random expressions', function () {
    var expression1, expression2;

    expression1 = rpn.generate();
    expression2 = rpn.generate();

    assert(expression1 !== expression2);
  });

  it('should resolve a given expression', function () {
    var result;

    result = rpn.resolve('1 2 +')

    assert.equal(result, 3);
  });
});

function isBetween(n, min, max) {
  var min = min || 0, max = max || 100;
  return n >= min && n <= max;
}

function isInt (n) {
  return n % 1 === 0;
}

function isOperator(value) {
  var operators = ["+", "-", "/", "*"];
  return operators.indexOf(value) > -1;
}
