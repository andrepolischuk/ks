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
   * Attached keys
   */

  var attached = {};

  attached.target = {};
  attached.keys = {};

  /**
   * Detach via keyup
   */

  function detach(e) {
    delete attached.keys[e.keyCode];
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

    var target = (!event.target.id.length && !event.target.tag.length) ||
      (event.target.id.length && event.target.id === e.target.id) ||
      (event.target.tag.length && event.target.tag === e.target.tag) || false;

    var lengthEventInEvent = 0;
    var lengthEvent = 0;

    for (var k in e.keys) {
      if (e.keys.hasOwnProperty(k)) {
        lengthEventInEvent += k in event.keys ? 1 : 0;
      }
    }

    for (k in event.keys) {
      if (event.keys.hasOwnProperty(k)) {
        lengthEvent++;
      }
    }

    return target && lengthEventInEvent === lengthEvent &&
      event.altKey === e.altKey && event.ctrlKey === e.ctrlKey &&
      event.shiftKey === e.shiftKey;

  }

  /**
   * Key event listener
   * @param {Object} e
   * @api private
   */

  function listener(e) {

    if (e.keyCode in attached.keys) {
      return;
    }

    if (e.keyCode < 16 || e.keyCode > 18) {
      attached.keys[e.keyCode] = true;
    }

    e.target = e.target || e.srcElement;

    attached.target.id = e.target.id.length ? '#' + e.target.id : '';
    attached.target.tag = e.target.tagName.toLowerCase();

    attached.altKey = e.altKey;
    attached.ctrlKey = e.ctrlKey;
    attached.shiftKey = e.shiftKey;

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], attached)) {
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

  function parseComb(comb) {

    var res = {};

    res.comb = comb.replace(/\s/g, "");
    comb = comb.split('+');

    res.keys = {};
    res.altKey = false;
    res.ctrlKey = false;
    res.shiftKey = false;

    for (var k = 0; k < comb.length; k++) {

      if (comb[k] in modifiers) {
        res.altKey = res.altKey || comb[k] === 'alt' || comb[k] === 'option';
        res.ctrlKey = res.ctrlKey || comb[k] === 'ctrl' || comb[k] === 'control';
        res.shiftKey = res.shiftKey || comb[k] === 'shift';
      } else {
        res.keys[code(comb[k])] = comb[k];
      }

    }

    return res;

  }

  /**
   * Parse target
   * @param  {String} target
   * @return {Object}
   * @api private
   */

  function parseTarget(target) {

    var res = {};

    res.id = '';
    res.tag = '';
    res[/^#.+$/g.test(target) ? 'id' : 'tag'] = target;

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

    var route = parseComb(comb);

    route.target = parseTarget(target);
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
    target = typeof target === 'string' ? target : '';

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

    var route = parseComb(comb);
    route.target = parseTarget(target);

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
  onEventListener(document, 'keyup', detach);

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
