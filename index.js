
'use strict';

/**
 * Module dependencies
 */

var keycode = require('keycodes');
var keycomb = require('keycomb');

try {
  var events = require('event');
  var clone = require('clone');
} catch (err) {
  var events = require('component-event');
  var clone = require('component-clone');
}

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
 * Find context position
 *
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
 *
 * @param {Object} e
 * @api private
 */

function detach(e) {

  e = e || {};

  if (e.keyCode) {
    var index = attached.keyCode.indexOf(e.keyCode);
    attached.keyCode.splice(index, 1);
    attached.key.splice(index, 1);
  } else {
    attached.target = {};
    attached.keyCode = [];
    attached.key = [];
    attached.fn = attached.fn || null;
  }

}

/**
 * Compare
 *
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
  var lengthEvent = ref.keyCode.length;

  for (var k = 0; k < comb.keyCode.length; k++) {
    lengthEventInEvent += ref.keyCode.indexOf(comb.keyCode[k]) > -1 ? 1 : 0;
  }

  var context = ref.context === null || ref.context === comb.context;

  context = ref.context && typeof comb.context === 'object' ?
    findContext(ref.context, comb.context) !== null : context;

  return target && context && lengthEventInEvent === lengthEvent &&
    ref.altKey === comb.altKey && ref.ctrlKey === comb.ctrlKey &&
    ref.shiftKey === comb.shiftKey;

}

/**
 * Key event listener
 *
 * @param {Object} e
 * @api private
 */

function listener(e) {

  if (e.keyCode > 15 && e.keyCode < 19) {
    return;
  }

  if (attached.keyCode.indexOf(e.keyCode) < 0) {

    attached.keyCode.push(e.keyCode);
    attached.key.push(keycode(e.keyCode));

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
 * Parse target
 *
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
 *
 * @param {String} string
 * @param {String} target
 * @param {Function} fn
 * @param {String} context
 * @api private
 */

function add(string, target, fn, context) {

  var comb = keycomb(string);
  comb.target = target ? parseTarget(target) : target;
  comb.fn = fn;
  comb.context = context ? context.substr(1) : context;

  combs.push(comb);

}

/**
 * Module
 *
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
 *
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

  var comb = keycomb(string);
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
 *
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
 *
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

events.bind(document, 'keydown', listener);
events.bind(document, 'keyup', detach);
events.bind(window, 'blur', detach);

/**
 * Module exports
 */

module.exports = ks;
