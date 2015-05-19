
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

  var lengthEventInEvent = 0;
  var lengthEvent = ref.keyCode.length;

  for (var k = 0; k < comb.keyCode.length; k++) {
    lengthEventInEvent += ref.keyCode.indexOf(comb.keyCode[k]) > -1 ? 1 : 0;
  }

  var context = ref.context === null || ref.context === comb.context;

  context = ref.context && typeof comb.context === 'object' ?
    findContext(ref.context, comb.context) !== null : context;

  return context && lengthEventInEvent === lengthEvent &&
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

  e.target = e.target || e.srcElement;

  if (attached.keyCode.indexOf(e.keyCode) < 0) {

    attached.keyCode.push(e.keyCode);
    attached.key.push(keycode(e.keyCode));
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
 * Attach combination
 *
 * @param {String} string
 * @param {Function} fn
 * @param {String} context
 * @api private
 */

function add(string, fn, context) {

  var comb = keycomb(string);
  comb.fn = fn;
  comb.context = context ? context.substr(1) : context;

  combs.push(comb);

}

/**
 * Module
 *
 * @param {String|Function} string
 * @param {Funtion} fn
 * @param {String} context
 * @api public
 */

function ks(string, fn, context) {

  if (typeof string === 'function') {
    attached.fn = string;
    return;
  }

  if (typeof fn !== 'function') {
    return;
  }

  add(string, fn, context);

}

/**
 * Detach combination
 *
 * @param {String} string
 * @api public
 */

ks.remove = function(string, context) {

  if (typeof string !== 'string') {
    return;
  }

  var comb = keycomb(string);
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
