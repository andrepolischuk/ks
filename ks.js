// Ks © 2014-2015 Andrey Polischuk
// https://github.com/andrepolischuk/ks

!function() {

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
   * Find context position
   * @param  {String} name
   * @param  {Array} ref
   * @return {Number}
   * @api private
   */

  function findContext(name, ref) {

    ref = ref || attached.context;

    for (var c = 0; c < ref.length; c++) {
      if (ref[c] === name) {
        return c;
      }
    }

    return null;

  }

  /**
   * Attached keys
   */

  var attached = {};
  detach();

  /**
   * Context
   */

  attached.context = [];

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
        fn.call(target, window.event);
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

    var target = ref.target === null || (comb.target === null &&
      comb.target === ref.target) || (ref.target.id.length &&
      ref.target.id === comb.target.id) || (ref.target.tag.length &&
      ref.target.tag === comb.target.tag) || false;

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

    var context = ref.context === null || ref.context === comb.context;

    context = ref.context && typeof comb.context === 'object' ?
      findContext(ref.context, comb.context) !== null : context;

    return target && context && lengthEventInEvent === lengthEvent &&
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
        res[k] = Object.prototype.toString.call(comb[k]) === '[object Object]' ?
          clone(comb[k]) : comb[k];
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

    if (e.keyCode > 15 && e.keyCode < 19) {
      return;
    }

    if (typeof attached.keys[key] !== 'number') {

      attached.keys[key] = e.keyCode;

      e.target = e.target || e.srcElement;

      attached.target.id = e.target.id.length ? '#' + e.target.id : '';
      attached.target.tag = e.target.tagName.toLowerCase();

      attached.altKey = e.altKey;
      attached.ctrlKey = e.ctrlKey;
      attached.shiftKey = e.shiftKey;

    }

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], attached)) {

        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }

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
   * @param {String} context
   * @api private
   */

  function add(string, target, fn, context) {

    var comb = parseString(string);
    comb.target = target ? parseTarget(target) : target;
    comb.fn = fn;
    comb.context = context ? context.substr(1) : context;

    combs.push(comb);

  }

  /**
   * Module
   * @param {String|Function} string
   * @param {String|Function} target
   * @param {Funtion} fn
   * @param {String} context
   * @api public
   */

  function ks(string, target, fn, context) {

    if (typeof string === 'function') {
      attached.fn = string;
      return;
    }

    context = typeof fn === 'string' ? fn : (context || null);
    fn = typeof target === 'function' ? target : fn;
    target = typeof target === 'string' ? target : null;

    if (typeof fn !== 'function') {
      return;
    }

    add(string, target, fn, context);

  }

  /**
   * Detach combination
   * @param {String} string
   * @param {String} target
   * @api public
   */

  ks.remove = function(string, target, context) {

    if (typeof string !== 'string') {
      return;
    }

    if (target && target.substr(0, 1) === '@') {
      context = target;
      target = null;
    }

    var comb = parseString(string);
    comb.target = parseTarget(target);
    comb.context = context ? context.substr(1) : context;

    for (var c = 0; c < combs.length; c++) {
      if (compare(combs[c], comb)) {
        combs.splice(c, 1);
        c--;
      }
    }

  };

  /**
   * Set or get context
   * @param  {String} name
   * @return {Array}
   * @api public
   */

  ks.context = function(name) {

    if (name && findContext(name) === null) {
      attached.context.push(name);
    }

    return attached.context;

  };

  /**
   * Remove context
   * @param  {String} name
   * @return {Array}
   * @api public
   */

  ks.removeContext = function(name) {

    var index = findContext(name);

    if (typeof name === 'undefined') {
      attached.context = [];
    } else if (index !== null) {
      attached.context.splice(index, 1);
    }

    return attached.context;

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
