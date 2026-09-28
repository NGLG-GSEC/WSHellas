/* Image numbers — every picture on the page carries a small white number at
   its top-left corner, so the Chapter can point to "image 12" when asking for
   a correction.

   The numbers are drawn in a separate layer laid over the page, never inside
   the page's own markup: ws-lang.js keys each block by its innerHTML, and a
   badge written into a block would break its translation.

   Numbering follows the order of the <img> elements in the page, so it is the
   same in every tongue (a translation rebuilds a block but keeps its images in
   place). A page may set a prefix on the script tag — data-prefix="O" gives
   O1, O2 … — so numbers stay distinct across the pages of the site.
   Hidden images (a closed <details>, a collapsed menu) keep their number; the
   badge appears once the image is shown. */
(function(){
  var me = document.currentScript;
  var PREFIX = (me && me.getAttribute('data-prefix')) || '';

  var css = document.createElement('style');
  css.textContent =
    '.ws-imgno-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden}' +
    '.ws-imgno{position:absolute;font:700 8px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;' +
    'color:#fff;text-shadow:0 0 2px #000,0 0 1px #000;letter-spacing:.02em;white-space:nowrap}';
  document.head.appendChild(css);

  var layer = document.createElement('div');
  layer.className = 'ws-imgno-layer';
  layer.setAttribute('aria-hidden', 'true');
  var badges = [];
  var queued = false;

  function draw(){
    queued = false;
    if(!layer.parentNode){ document.body.appendChild(layer); }
    var imgs = document.images, vw = innerWidth, vh = innerHeight, n = imgs.length, i;
    while(badges.length < n){
      var b = document.createElement('span');
      b.className = 'ws-imgno';
      layer.appendChild(b);
      badges.push(b);
    }
    for(i = 0; i < badges.length; i++){
      var bd = badges[i], img = imgs[i];
      if(!img){ bd.style.display = 'none'; continue; }
      var r = img.getBoundingClientRect();
      if(r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw ||
         getComputedStyle(img).visibility === 'hidden'){
        bd.style.display = 'none';
        continue;
      }
      bd.textContent = PREFIX + (i + 1);
      bd.style.display = '';
      bd.style.left = (r.left + 3) + 'px';
      bd.style.top = (r.top + 3) + 'px';
    }
  }
  function soon(){ if(!queued){ queued = true; requestAnimationFrame(draw); } }

  addEventListener('scroll', soon, { passive:true, capture:true });
  addEventListener('resize', soon);
  addEventListener('load', soon);
  document.addEventListener('toggle', soon, true);
  document.addEventListener('load', soon, true);
  document.addEventListener('click', function(){ setTimeout(soon, 50); setTimeout(soon, 400); }, true);
  new MutationObserver(function(ms){
    for(var k = 0; k < ms.length; k++){ if(!layer.contains(ms[k].target)){ soon(); return; } }
  }).observe(document.documentElement, { childList:true, subtree:true, attributes:true,
    attributeFilter:['class','style','open','src','hidden'] });
  if(window.ResizeObserver){ new ResizeObserver(soon).observe(document.documentElement); }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', soon); } else { soon(); }
  /* transitions (menus, reveals) move images without any event to hear */
  setInterval(soon, 1000);
})();
