# Ks

  Keybord shortcuts

## Instalation

  Via script tag in page sources:

```html
<script src="//cdn.rawgit.com/andrepolischuk/ks/1.0.0/ks.min.js"></script>
```

## API

### ks(comb[, target], fn)

  Attach callback `fn` to specified combination and target.

#### comb

  Keys combination `key` or `modifier+key`.
  Can be used only one key and one modifier:

  * `m`
  * `alt+n`
  * `ctrl+q`
  * `shift+o`

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
  * `F1`-`F19`

#### target

  Specified by tagname or id:

  * `input`
  * `#name`

### ks.remove(comb[, target])

  Detach combination.
