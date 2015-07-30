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
