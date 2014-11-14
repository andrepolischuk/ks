// Ks © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/ks

!function(undefined) {

  'use strict';

  /**
   * Modifier keys
   */

  var modifiers = {
    ctrl : 17,
    control : 17,
    alt : 18,
    option : 18,
    shift : 16
  };

  /**
   * Special keys
   */

  var special = {
    escape : 27,
    esc : 27,
    '`' : 192,
    '-' : 189,
    '=' : 187,
    backspace : 8,
    tab : 9,
    '\\' : 220,
    '[' : 219,
    ']' : 221,
    ';' : 186,
    '\'' : 222,
    enter : 13,
    return : 13,
    ',' : 188,
    '.' : 190,
    '/' : 191,
    space : 32,
    pause : 19,
    insert : 45,
    delete : 46,
    home : 36,
    end : 35,
    pageup : 33,
    pagedown : 34,
    left : 37,
    up: 38,
    right : 39,
    down : 40
  };

  /**
   * Function keys
   */

  for (var i = 1; i < 20; i++) {
    special['F' + i] = 111 + i;
  }

  /**
   * Get key code
   */

  var code = function(key) {
    return special[key] || key.toUpperCase().charCodeAt(0);
  };

  /**
   * Ks module
   * @param {String|Function} comb
   * @param {String|Function} target
   * @param {Funtion} fn
   */

  function ks(comb, target, fn) {

    fn = fn || (typeof comb === 'function' ? comb : target);
    comb = typeof comb === 'string' ? comb : null;
    target = typeof target === 'string' ? target : null;

    // ...

  }

  /**
   * Module exports
   */

  if (typeof define === 'function' && define.amd) {

    define([], function() {
      return ks;
    });

  } else if (typeof module !== 'undefined' && module.exports) {

    module.exports = ks;

  } else {

    this.ks = ks;

  }

}.call(this);
