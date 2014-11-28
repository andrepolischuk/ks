# Ks

  Keybord shortcuts

## Instalation

  Via script tag in page sources:

```html
<script src="//cdn.rawgit.com/andrepolischuk/ks/1.1.1/ks.min.js"></script>
```

## API

### ks(string[, target], fn)

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

  Specified by tagname or id:

  * `input`
  * `#name`

### ks(fn)

  Set global callback for undefined shortcuts.

### ks.remove(string[, target])

  Detach shortcut.
