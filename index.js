
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
 * Find scope position
 *
 * @param  {String} name
 * @param  {Array} ref
 * @return {Number}
 * @api private
 */

function findScope(name, ref) {

  ref = ref || attached.scope;

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
 * Scope
 */

attached.scope = [];

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

  var scope = ref.scope === null || ref.scope === comb.scope;

  scope = ref.scope && typeof comb.scope === 'object' ?
    findScope(ref.scope, comb.scope) !== null : scope;

  return scope && lengthEventInEvent === lengthEvent &&
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
 * @param {String} scope
 * @api private
 */

function add(string, fn, scope) {

  var comb = keycomb(string);
  comb.fn = fn;
  comb.scope = scope ? scope.substr(1) : scope;

  combs.push(comb);

}

/**
 * Module
 *
 * @param {String|Function} string
 * @param {Funtion} fn
 * @param {String} scope
 * @api public
 */

function ks(string, fn, scope) {

  if (typeof string === 'function') {
    attached.fn = string;
    return;
  }

  if (typeof fn !== 'function') {
    return;
  }

  add(string, fn, scope);

}

/**
 * Detach combination
 *
 * @param {String} string
 * @api public
 */

ks.remove = function(string, scope) {

  if (typeof string !== 'string') {
    return;
  }

  var comb = keycomb(string);
  comb.scope = scope ? scope.substr(1) : scope;

  for (var c = 0; c < combs.length; c++) {
    if (compare(combs[c], comb)) {
      combs.splice(c, 1);
      c--;
    }
  }

};

/**
 * Set or get scope
 *
 * @param  {String} name
 * @return {Array}
 * @api public
 */

ks.scope = function(name) {

  if (name && findScope(name) === null) {
    attached.scope.push(name);
  }

  return attached.scope;

};

/**
 * Remove scope
 *
 * @param  {String} name
 * @return {Array}
 * @api public
 */

ks.removeScope = function(name) {

  var index = findScope(name);

  if (typeof name === 'undefined') {
    attached.scope = [];
  } else if (index !== null) {
    attached.scope.splice(index, 1);
  }

  return attached.scope;

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
