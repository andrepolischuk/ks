# ks

  > Keyboard shortcuts

## Install

```sh
npm install --save ks
```

```sh
component install andrepolischuk/ks
```

## Usage

```js
var ks = require('ks');
ks('enter', open);
ks('esc', close);
ks('ctrl+enter', send, 'edit');
ks('ctrl+/', help);
```

## API

### ks(keys, fn[, scope])

  Attach `fn` to specified `keys` combinations and `scope`

```js
ks('a', function(ctx, next) {
  ctx.keys; // 'a'
});
```

### ks(fn)

  Set global `fn` for all combinations

### ks.remove(keys, fn[, scope])

  Detach `fn`

### ks.scope([name])

  Set specified scope

```js
ks.scope('auth'); // ['auth']
ks.scope(); // ['auth']
```

### ks.removeScope([name])

  Remove scope or clear scope list

```js
ks.scope('auth'); // ['auth']
ks.scope('hello'); // ['auth', 'hello']
ks.removeScope('auth'); // ['hello']
ks.removeScope(); // []
```

## Keys

### Modifiers

  * `ctrl`, `control`
  * `alt`, `option`
  * `shift`

### Special

  * `escape`, `esc`
  * `` ` ``
  * `-`
  * `=`
  * `backspace`
  * `tab`
  * `\`
  * `[`
  * `]`
  * `;`
  * `'`
  * `enter`, `return`
  * `,`
  * `.`
  * `/`
  * `space`
  * `pause`, `break`
  * `insert`
  * `delete`
  * `home`
  * `end`
  * `pageup`
  * `pagedown`
  * `left`
  * `up`
  * `right`
  * `down`
  * `windows`, `command`
  * `capslock`
  * `numlock`
  * `scrolllock`
  * `f1`-`f19`

## Related

* [keycodes][keycodes] — key codes and names
* [keycomb][keycomb] — key combinations parser

## License

  MIT

[keycodes]: https://github.com/andrepolischuk/keycodes
[keycomb]: https://github.com/andrepolischuk/keycomb
