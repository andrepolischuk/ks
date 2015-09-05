(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ks = require('ks');

var _ks2 = _interopRequireDefault(_ks);

var keys = document.querySelector('.keys');

(0, _ks2['default'])(function (ctx) {
  ctx.preventDefault();
  keys.innerHTML = ctx.keys;
});

},{"ks":2}],2:[function(require,module,exports){
'use strict';
var events = require('event');
var keycomb = require('keycomb');
module.exports = ks;

function ks(keys, fn, scope) {
  if (typeof keys === 'function') return ks('*', keys, fn);

  if (typeof fn === 'function') {
    ks.callbacks.push(new Route(keys, fn, scope));
  } else {
    ks.show(keys);
  }
}

ks.callbacks = [];
ks.current = {keyCode: []};
ks.scopes = [];

ks.show = function(keys, event) {
  var ctx = new Context(keys, event);
  execute(ctx);
};

ks.remove = function(keys, fn, scope) {
  for (var i = 0, route, len = ks.callbacks.length; i < len; i++) {
    route = ks.callbacks[i];
    if (route.keys !== keys) continue;
    if (route.fn !== fn) continue;
    if (route.scope !== scope) continue;
    ks.callbacks.splice(i, 1);
  }
};

ks.scope = function(name) {
  if (ks.scopes.indexOf(name) < 0) ks.scopes.push(name);
  return ks.scopes;
};

ks.removeScope = function(name) {
  if (name) {
    ks.scopes.splice(ks.scopes.indexOf(name), 1);
  } else {
    ks.scopes = [];
  }

  return ks.scopes;
};

events.bind(document, 'keydown', attach);
events.bind(document, 'keyup', detach);
events.bind(window, 'blur', detach);

function attach(event) {
  var cur = ks.current;
  event = event || window.event;
  if (!event.target) event.target = event.srcElement;
  if (event.keyCode > 15 && event.keyCode < 19) return;

  if (cur.keyCode.indexOf(event.keyCode) < 0) {
    cur.altKey = event.altKey;
    cur.ctrlKey = event.ctrlKey;
    cur.shiftKey = event.shiftKey;
    cur.keyCode.push(event.keyCode);
  }

  ks.show(keycomb(cur).join('+'), event);
}

function detach(event) {
  var cur = ks.current;
  event = event || window.event;
  cur.keyCode.splice(cur.keyCode.indexOf(event.keyCode), 1);
}

function execute(ctx) {
  var i = 0;

  function next() {
    var route = ks.callbacks[i++];
    if (!route) return;
    var fn = route.callback();
    if (!fn) return;
    fn(ctx, next);
  }

  next();
}

function Context(keys, event) {
  this.keys = keys;
  this.event = keycomb(keys);
  this.scope = ks.scopes;
  this.target = event ? event.target : event;

  this.preventDefault = event ? function() {
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
  } : function() {};
}

function Route(keys, fn, scope) {
  this.keys = keys;
  this.event = keys === '*' ? keys : keycomb(keys);
  this.fn = fn;
  this.scope = scope;
}

Route.prototype.callback = function() {
  var self = this;

  return function(ctx, next) {
    if (self.match(ctx)) return self.fn(ctx, next);
    next();
  };
};

Route.prototype.match = function(ctx) {
  var a = this.event;
  var b = ctx.event;
  if (this.scope && ctx.scope.indexOf(this.scope) < 0) return;
  if (a === '*') return true;
  var len = a.keyCode.length;
  if (len !== b.keyCode.length) return;

  for (var i = 0; i < len; i++) {
    if (b.keyCode.indexOf(a.keyCode[i]) < 0) return;
  }

  if (a.altKey !== b.altKey) return;
  if (a.ctrlKey !== b.ctrlKey) return;
  if (a.shiftKey !== b.shiftKey) return;
  return true;
};

},{"event":3,"keycomb":4}],3:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],4:[function(require,module,exports){
'use strict';
var keycode = require('keycodes');

module.exports = function(input) {
  if (typeof input === 'string') input = input.replace(/\s/g, '').split('+');
  if (typeof input !== 'object') return;
  if (input.length) return code(input);
  return combination(input);
};


function code(input) {
  var obj = {};
  obj.keyCode = [];
  obj.altKey = false;
  obj.ctrlKey = false;
  obj.shiftKey = false;
  var key;

  for (var k = 0, len = input.length; k < len; k++) {
    key = keycode(input[k]);
    if (key === 18) obj.altKey = true;
    if (key === 17) obj.ctrlKey = true;
    if (key === 16) obj.shiftKey = true;
    if (key < 16 || key > 18) obj.keyCode.push(key);
  }

  return obj;
}

function combination(input) {
  var keys = input.keyCode.length ? input.keyCode : [input.keyCode];
  var arr = [];
  if (input.altKey) arr.push('alt');
  if (input.ctrlKey) arr.push('ctrl');
  if (input.shiftKey) arr.push('shift');

  for (var k = 0, len = keys.length; k < len; k++) {
    arr.push(keycode(keys[k]));
  }

  return arr;
}

},{"keycodes":5}],5:[function(require,module,exports){
'use strict';

var keys = {
  ctrl: 17,
  control: 17,
  alt: 18,
  option: 18,
  shift: 16,
  windows: 91,
  command: 91,
  esc: 27,
  escape: 27,
  '`': 192,
  '-': 189,
  '=': 187,
  backspace: 8,
  tab: 9,
  '\\': 220,
  '[': 219,
  ']': 221,
  ';': 186,
  '\'': 222,
  enter: 13,
  'return': 13,
  ',': 188,
  '.': 190,
  '/': 191,
  space: 32,
  pause: 19,
  'break': 19,
  insert: 45,
  'delete': 46,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  capslock: 20,
  numlock: 144,
  scrolllock: 145
};

for (var f = 1; f < 20; f++) {
  keys['f' + f] = 111 + f;
}

module.exports = function(input) {
  if (typeof input === 'string') return code(input);
  if (typeof input === 'number') return key(input);
};

function code(input) {
  return keys[input.toLowerCase()] || input.toUpperCase().charCodeAt(0);
}

function key(input) {
  for (var k in keys) {
    if (keys.hasOwnProperty(k)) {
      if (keys[k] === input) return k;
    }
  }

  return String.fromCharCode(input).toLowerCase();
}

},{}]},{},[1]);
