'use strict';

var operators = ["+", "-", "/", "*"];

module.exports = {
  generate: function () {
    return [
      rand(1, 100),
      rand(1, 100),
      operators[rand(0, 3)]
    ].join(' ');
  },
  // http://kilon.org/blog/2012/06/javascript-rpn-calculator/
  resolve: function (input) {
    var ar = input.split( /\s+/ ), st = [], token;
    while( token = ar.shift() ) {
      if ( token == +token ) {
        st.push( token );
      } else {
        var n2 = st.pop(), n1 = st.pop();
        var re = /^[\+\-\/\*]$/;
        if( n1 != +n1 || n2 != +n2 || !re.test( token ) ) {
          throw new Error( 'Invalid expression: ' + input );
        }
        st.push( eval( n1 + token + ' ' + n2 ) );
      }
    }
    if( st.length !== 1 ) {
      throw new Error( 'Invalid expression: ' + input );
    }
    return st.pop();
  }
};

function rand(min, max) {
  var min = min || 0;
  var max = max || 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
