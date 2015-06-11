
'use strict';

/**
 * Module dependencies
 */

var keycomb = require('keycomb');
var events = require('event');

/**
 * Expose dispatcher
 */

module.exports = ks;

/**
 * Dispatcher
 *
 * @param {String} keys
 * @param {Function} fn
 * @param {String} scope
 * @api public
 */

function ks(keys, fn, scope) {
  if (typeof keys === 'function') return ks('*', keys, fn);

  if (typeof fn === 'function') {
    ks.callbacks.push(new Route(keys, fn, scope));
  } else {
    ks.show(keys);
  }
}

/**
 * Expose callbacks
 */

ks.callbacks = [];

/**
 * Expose current
 */

ks.current = {};
ks.current.keyCode = [];

/**
 * Expose scopes
 */

ks.scopes = [];

/**
 * Show defined context
 *
 * @param {String} keys
 * @param {Object} event
 * @api public
 */

ks.show = function(keys, event) {
  var ctx = new Context(keys, event);
  execute(ctx);
};

/**
 * Detach combination
 *
 * @param {String} keys
 * @param {Function} fn
 * @param {String} scope
 * @api public
 */

ks.remove = function(keys, fn, scope) {
  for (var i = 0, route; i < ks.callbacks.length; i++) {
    route = ks.callbacks[i];
    if (route.keys !== keys) continue;
    if (route.fn !== fn) continue;
    if (route.scope !== scope) continue;
    ks.callbacks.splice(i, 1);
  }
};

/**
 * Attach scope
 *
 * @param  {String} name
 * @return {Array}
 * @api public
 */

ks.scope = function(name) {
  if (ks.scopes.indexOf(name) < 0) ks.scopes.push(name);
  return ks.scopes;
};

/**
 * Detach scope
 *
 * @param  {String} name
 * @return {Array}
 * @api public
 */

ks.removeScope = function(name) {
  if (name) {
    ks.scopes.splice(ks.scopes.indexOf(name), 1);
  } else {
    ks.scopes = [];
  }
  return ks.scopes;
};

/**
 * Start listener
 */

events.bind(document, 'keydown', attach);
events.bind(document, 'keyup', detach);
events.bind(window, 'blur', detach);

/**
 * Key attach
 *
 * @param {Object} event
 * @api private
 */

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

/**
 * Key detach
 *
 * @param {Object} event
 * @api private
 */

function detach(event) {
  var cur = ks.current;
  event = event || window.event;
  cur.keyCode.splice(cur.keyCode.indexOf(event.keyCode), 1);
}

/**
 * Execute context
 *
 * @param {Object} ctx
 * @api private
 */

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

/**
 * Context
 *
 * @param {String} keys
 * @param {Element} event
 * @api private
 */

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

/**
 * Route
 *
 * @param {String} keys
 * @param {Function} fn
 * @param {String} scope
 * @api private
 */

function Route(keys, fn, scope) {
  this.keys = keys;
  this.event = keys === '*' ? keys : keycomb(keys);
  this.fn = fn;
  this.scope = scope;
}

/**
 * Route callback
 *
 * @return {Function}
 * @api private
 */

Route.prototype.callback = function() {
  var self = this;
  return function(ctx, next) {
    if (self.match(ctx)) return self.fn(ctx, next);
    next();
  };
};

/**
 * Route match
 *
 * @param  {Object} ctx
 * @return {Boolean}
 * @api private
 */

Route.prototype.match = function(ctx) {
  var a = this.event;
  var b = ctx.event;

  if (this.scope && ctx.scope.indexOf(this.scope) < 0) return;
  if (a === '*') return true;

  if (a.keyCode.length !== b.keyCode.length) return;

  for (var i = 0; i < a.keyCode.length; i++) {
    if (b.keyCode.indexOf(a.keyCode[i]) < 0) return;
  }

  if (a.altKey !== b.altKey) return;
  if (a.ctrlKey !== b.ctrlKey) return;
  if (a.shiftKey !== b.shiftKey) return;
  return true;
};
