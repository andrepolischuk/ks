# Ks

  Keyboard shortcuts

## Instalation

  Browser:

```html
<script src="https://cdn.rawgit.com/andrepolischuk/ks/1.3.1/ks.min.js"></script>
```

  Component(1):

```sh
$ component install andrepolischuk/ks
```

  Npm:

```sh
$ npm install ks
```

## API

### ks(string[, target], fn[, context])

  Attach callback `fn` to specified shortcut and target.

#### string

  Shortcut string:

  * `m`
  * `alt+n`
  * `ctrl+q`
  * `shift+alt+o`
  * `ctrl+alt+q+b`

##### Supported modifiers

  * `ctrl`, `control`
  * `alt`, `option`
  * `shift`

##### Supported special keys:

  * `escape`
  * `esc`
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
  * `enter`
  * `return`
  * `,`
  * `.`
  * `/`
  * `space`
  * `pause`
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
  * `f1`-`f19`

#### target

  Bind to specified elements by tagname or id:

  * `input`
  * `#name`

#### context

  Bind to specified context, example `@auth`.

### ks(fn)

  Set global callback for undefined shortcuts.

### ks.remove(string[, target, context])

  Detach shortcut.

### ks.context(name)

  Set context, example `ks.context('auth')`.

### ks.context()

  Get current contexts list.

### ks.removeContext(name)

  Remove context by name.

### ks.removeContext()

  Clear contexts list.
