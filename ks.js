// Ks © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/ks

!function(undefined) {

  'use strict';

  /**
   * Combinations
   */

  var combs = [];

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
   * @param  {String} key
   * @return {String}
   * @api private
   */

  function code(key) {
    return special[key] || key.toUpperCase().charCodeAt(0);
  }

  /**
   * Add event listener
   * @param {Object} target
   * @param {String} event
   * @param {Function} fn
   * @api private
   */

  function onEventListener(target, event, fn) {

    if (target.addEventListener) {
      target.addEventListener(event, fn, false);
    } else {
      target.attachEvent('on' + event, function() {
        fn(window.event);
      });
    }

  }

  /**
   * Compare
   * @param  {Object} event
   * @param  {Object} e
   * @return {Boolean}
   * @api private
   */

  function compare(event, e) {

    var target = event.target === null ? null : (typeof e.target === 'string' ?
      e.target : (/^#.+$/g.test(event.target) ?
      '#' + e.target.id : e.target.tagName.toLowerCase()));

    return event.target === target && event.keyCode === e.keyCode &&
      event.altKey === e.altKey && event.ctrlKey === e.ctrlKey &&
      event.shiftKey === e.shiftKey;

  }

  /**
   * Key event listener
   * @param {Object} e
   * @api private
   */

  function listener(e) {

    e.target = e.target || e.srcElement;

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], e)) {
        combs[c].fn.call(e.target, combs[c]);
      }
    }

  }

  /**
   * Parse combination
   * @param  {String} comb
   * @return {Object}
   * @api private
   */

  function parse(comb) {

    var res = {};

    res.comb = comb.replace(/\s/g, "");
    comb = comb.split('+');

    res.keyCode = code(comb[comb[0] in modifiers ? 1 : 0]);
    res.altKey = comb[0] === 'alt' || comb[0] === 'option';
    res.ctrlKey = comb[0] === 'ctrl' || comb[0] === 'control';
    res.shiftKey = comb[0] === 'shift';

    return res;

  }

  /**
   * Attach combination
   * @param {String} comb
   * @param {String} target
   * @param {Function} fn
   * @api private
   */

  function add(comb, target, fn) {

    var route = parse(comb);
    route.target = target;
    route.fn = fn;

    combs.push(route);

  }

  /**
   * Ks module
   * @param {String} comb
   * @param {String|Function} target
   * @param {Funtion} fn
   * @api public
   */

  function ks(comb, target, fn) {

    fn = typeof target === 'function' ? target : fn;
    target = typeof target === 'string' ? target : null;

    if (typeof fn !== 'function' || typeof comb !== 'string') {
      return;
    }

    add(comb, target, fn);

  }

  /**
   * Detach combination
   * @param {String} comb
   * @param {String} target
   * @api public
   */

  ks.remove = function(comb, target) {

    if (typeof comb !== 'string') {
      return;
    }

    var route = parse(comb);
    route.target = target || null;

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], route)) {
        combs.splice(c, 1);
        c--;
      }
    }

  };

  /**
   * Listener initialization
   */

  onEventListener(document, 'keydown', listener);

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
