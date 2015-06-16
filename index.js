
import ks from 'ks';

const keys = document.querySelector('.keys');

ks((ctx) => {
  ctx.preventDefault();
  keys.innerHTML = ctx.keys;
});
