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
    'return' : 13,
    ',' : 188,
    '.' : 190,
    '/' : 191,
    space : 32,
    pause : 19,
    insert : 45,
    'delete' : 46,
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
    special['f' + i] = 111 + i;
  }

  /**
   * Get key code
   * @param  {String} key
   * @return {String}
   * @api private
   */

  function code(key) {
    return special[key.toLowerCase()] || key.toUpperCase().charCodeAt(0);
  }

  /**
   * Get key name
   * @param  {Number} code
   * @return {String}
   * @api private
   */

  function find(code) {

    var res;

    for (var k in special) {
      if (special.hasOwnProperty(k)) {
        res = special[k] === code ? k : res;
      }
    }

    return res || String.fromCharCode(code).toLowerCase();

  }

  /**
   * Attached keys
   */

  var attached = {};
  detach();

  /**
   * Detach via keyup
   * @param {Object} e
   * @api private
   */

  function detach(e) {

    e = e || {};

    if (e.keyCode) {
      delete attached.keys[find(e.keyCode)];
    } else {
      attached.target = {};
      attached.keys = {};
      attached.fn = attached.fn || null;
    }

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
   * @param  {Object} ref
   * @param  {Object} comb
   * @return {Boolean}
   * @api private
   */

  function compare(ref, comb) {

    var target = (!ref.target.id.length && !ref.target.tag.length) ||
      (ref.target.id.length && ref.target.id === comb.target.id) ||
      (ref.target.tag.length && ref.target.tag === comb.target.tag) || false;

    var lengthEventInEvent = 0;
    var lengthEvent = 0;

    for (var k in comb.keys) {
      if (comb.keys.hasOwnProperty(k)) {
        lengthEventInEvent += k in ref.keys ? 1 : 0;
      }
    }

    for (k in ref.keys) {
      if (ref.keys.hasOwnProperty(k)) {
        lengthEvent++;
      }
    }

    return target && lengthEventInEvent === lengthEvent &&
      ref.altKey === comb.altKey && ref.ctrlKey === comb.ctrlKey &&
      ref.shiftKey === comb.shiftKey;

  }

  /**
   * Clone
   * @param  {Object} comb
   * @return {Object}
   * @api private
   */

  function clone(comb) {

    var res = {};

    for (var k in comb) {
      if (comb.hasOwnProperty(k)) {
        res[k] = typeof comb[k] === 'object' ? clone(comb[k]) : comb[k];
      }
    }

    return res;

  }

  /**
   * Key event listener
   * @param {Object} e
   * @api private
   */

  function listener(e) {

    var key = find(e.keyCode);

    if (key in attached.keys || (e.keyCode > 15 && e.keyCode < 19)) {
      return;
    }

    attached.keys[key] = e.keyCode;

    e.target = e.target || e.srcElement;

    attached.target.id = e.target.id.length ? '#' + e.target.id : '';
    attached.target.tag = e.target.tagName.toLowerCase();

    attached.altKey = e.altKey;
    attached.ctrlKey = e.ctrlKey;
    attached.shiftKey = e.shiftKey;

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], attached)) {
        combs[c].fn.call(e.target, clone(combs[c]));
        return;
      }
    }

    if (typeof attached.fn === 'function') {
      attached.fn.call(e.target, clone(attached));
    }

  }

  /**
   * Parse combination string
   * @param  {String} string
   * @return {Object}
   * @api private
   */

  function parseString(string) {

    var res = {};

    string = string.replace(/\s/g, "").split('+');

    res.keys = {};
    res.altKey = false;
    res.ctrlKey = false;
    res.shiftKey = false;

    for (var k = 0; k < string.length; k++) {

      string[k] = string[k].toLowerCase();

      if (string[k] in modifiers) {
        res.altKey = res.altKey || string[k] === 'alt' || string[k] === 'option';
        res.ctrlKey = res.ctrlKey || string[k] === 'ctrl' || string[k] === 'control';
        res.shiftKey = res.shiftKey || string[k] === 'shift';
      } else {
        res.keys[string[k]] = code(string[k]);
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
   * @param {String} string
   * @param {String} target
   * @param {Function} fn
   * @api private
   */

  function add(string, target, fn) {

    var comb = parseString(string);
    comb.target = parseTarget(target);
    comb.fn = fn;

    combs.push(comb);

  }

  /**
   * Module
   * @param {String|Function} string
   * @param {String|Function} target
   * @param {Funtion} fn
   * @api public
   */

  function ks(string, target, fn) {

    if (typeof string === 'function') {
      attached.fn = string;
      return;
    }

    fn = typeof target === 'function' ? target : fn;
    target = typeof target === 'string' ? target : '';

    if (typeof fn !== 'function' || typeof string !== 'string') {
      return;
    }

    add(string, target, fn);

  }

  /**
   * Detach combination
   * @param {String} string
   * @param {String} target
   * @api public
   */

  ks.remove = function(string, target) {

    if (typeof string !== 'string') {
      return;
    }

    var comb = parseString(string);
    comb.target = parseTarget(target);

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], comb)) {
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
  onEventListener(window, 'blur', detach);

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
