/* The charges of each office.

   Every officer's vest used to carry its duty written across the back. The
   back now carries a single round button, CHARGES, and the text opens in a
   full reading panel with a close button at its top right.

   The duty stays in the page, hidden, exactly where it was: ws-lang.js
   translates it in place like any other block, and the panel copies it at
   the moment it opens, so it is always read in the tongue the page is in.

   Two pages load this file:
     index.html     -> #administration .ws-officer-card, duty in .ws-vest-duty
     officers.html  -> .officer, duty in .vest p (English and Greek together)
*/
(function(){
  var WORDS = {
    en:{ btn:'Charges', head:'Charges of the Office', close:'Close', held:'Held by' },
    el:{ btn:'Καθήκοντα', head:'Καθήκοντα του Αξιώματος', close:'Κλείσιμο', held:'Κάτοχος' },
    es:{ btn:'Cargos', head:'Cargos del Oficio', close:'Cerrar', held:'Ocupado por' }
  };
  function lang(){
    var l = document.documentElement.lang || 'en';
    try { l = localStorage.getItem('ws-lang') || l; } catch(e){}
    return WORDS[l] ? l : 'en';
  }
  function w(k){ return WORDS[lang()][k]; }

  var CSS =
    /* the button on the back of the vest */
    '.ws-charges-btn{position:relative;z-index:6;width:118px;height:118px;border-radius:50%;cursor:pointer;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:0;' +
      'background:radial-gradient(circle at 34% 28%,#34373d,#0c0d0f 62%,#050506);' +
      'border:2px solid #cba867;box-shadow:0 0 0 4px rgba(0,0,0,.55),0 0 0 5px rgba(203,168,103,.45),' +
      '0 14px 26px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.14);' +
      'color:#f0d69b;transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}' +
    '.ws-charges-btn:hover{transform:translateY(-2px) scale(1.03);border-color:#f0d69b;' +
      'box-shadow:0 0 0 4px rgba(0,0,0,.55),0 0 0 5px rgba(240,214,155,.7),0 18px 30px rgba(0,0,0,.75),0 0 26px rgba(203,168,103,.28)}' +
    '.ws-charges-btn:focus-visible{outline:2px solid #f0d69b;outline-offset:5px}' +
    '.ws-charges-btn svg{width:26px;height:26px;opacity:.9}' +
    '.ws-charges-btn span{font:700 11.5px/1 Oswald,"Arial Narrow",Arial,sans-serif;letter-spacing:.2em;' +
      'text-transform:uppercase;padding-left:.2em}' +
    '.ws-charges-hidden{display:none !important}' +
    /* the reading panel */
    '.ws-charges-overlay{position:fixed;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;' +
      'padding:28px;background:rgba(3,3,4,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);' +
      'opacity:0;transition:opacity .2s ease}' +
    '.ws-charges-overlay.open{opacity:1}' +
    '.ws-charges-overlay[hidden]{display:none !important}' +
    '.ws-charges-panel{position:relative;width:min(900px,100%);max-height:calc(100vh - 56px);overflow:auto;' +
      'padding:54px 64px 48px;border-radius:14px;border:1px solid rgba(203,168,103,.42);' +
      'background:radial-gradient(ellipse 120% 80% at 50% 0%,#1d1f24,#0b0c0e 70%);' +
      'box-shadow:0 30px 80px rgba(0,0,0,.8),inset 0 0 0 1px rgba(255,255,255,.04);' +
      'transform:translateY(10px) scale(.985);transition:transform .22s ease}' +
    '.ws-charges-overlay.open .ws-charges-panel{transform:none}' +
    '.ws-charges-close{position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;cursor:pointer;' +
      'display:grid;place-items:center;padding:0;background:rgba(255,255,255,.04);' +
      'border:1px solid rgba(203,168,103,.45);color:#e9e5da;transition:background .15s ease,border-color .15s ease}' +
    '.ws-charges-close:hover{background:rgba(203,168,103,.16);border-color:#f0d69b;color:#fff}' +
    '.ws-charges-close:focus-visible{outline:2px solid #f0d69b;outline-offset:3px}' +
    '.ws-charges-close svg{width:18px;height:18px}' +
    '.ws-charges-eyebrow{margin:0 0 12px;font:600 12px/1.2 Oswald,"Arial Narrow",Arial,sans-serif;letter-spacing:.26em;' +
      'text-transform:uppercase;color:#cba867}' +
    '.ws-charges-title{margin:0;font:700 clamp(28px,4vw,44px)/1.1 Cinzel,Georgia,serif;color:#f4f1ea;letter-spacing:.02em}' +
    '.ws-charges-sub{margin:8px 0 0;font:400 clamp(17px,2vw,21px)/1.3 Georgia,serif;color:#cfcabf}' +
    '.ws-charges-rule{height:1px;margin:26px 0 28px;border:0;background:linear-gradient(90deg,rgba(203,168,103,.7),rgba(203,168,103,.08))}' +
    '.ws-charges-text{font:400 clamp(18px,2vw,22px)/1.65 Georgia,"Times New Roman",serif;color:#f1ede4;text-wrap:pretty}' +
    '.ws-charges-text b,.ws-charges-text strong{font-weight:400}' +
    '.ws-charges-text .duty-en{display:block;color:#f4f1ea}' +
    '.ws-charges-text .duty-gr{display:block;margin-top:22px;padding-top:22px;border-top:1px solid rgba(220,222,224,.16);' +
      'color:#cfcabf;font-size:.92em}' +
    '.ws-charges-held{margin:32px 0 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.08);' +
      'font:600 12px/1.4 Oswald,"Arial Narrow",Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#9d978a}' +
    '.ws-charges-held b{color:#e0bd72;font-weight:600;margin-left:8px}' +
    'body.ws-charges-lock{overflow:hidden}' +
    '@media(max-width:640px){.ws-charges-overlay{padding:0;align-items:stretch}' +
      '.ws-charges-panel{max-height:100vh;border-radius:0;padding:74px 24px 36px}' +
      '.ws-charges-btn{width:104px;height:104px}}';

  var ICON_SCROLL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h9a2 2 0 0 1 2 2v12"/><path d="M8 3a2 2 0 0 0-2 2v14a2 2 0 0 1-2-2v-2h12v2a2 2 0 0 0 4 0"/><path d="M10 8h6M10 11.5h6"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* One description of each page's card, so the rest of the file does not
     care which page it is on. */
  var KINDS = [
    { card:'#administration .ws-officer-card', duty:'.ws-vest-duty', hide:['.ws-vest-yoke'],
      title:'.ws-office-en', sub:'.ws-office-gr', holder:'.ws-officer-base' },
    { card:'.officer', duty:'.vest > p', hide:['.vest-role'],
      title:'.rank b', sub:'.rank span', holder:'.nameplate b' }
  ];

  var overlay, panel, closeBtn, lastFocus, buttons = [];

  function text(el){ return el ? el.textContent.replace(/\s+/g,' ').trim() : ''; }

  function build(){
    overlay = document.createElement('div');
    overlay.className = 'ws-charges-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="ws-charges-panel" role="dialog" aria-modal="true" aria-labelledby="wsChargesTitle">' +
        '<button type="button" class="ws-charges-close">' + ICON_X + '</button>' +
        '<p class="ws-charges-eyebrow"></p>' +
        '<h2 class="ws-charges-title" id="wsChargesTitle"></h2>' +
        '<p class="ws-charges-sub"></p>' +
        '<hr class="ws-charges-rule">' +
        '<div class="ws-charges-text"></div>' +
        '<p class="ws-charges-held"></p>' +
      '</div>';
    document.body.appendChild(overlay);
    panel = overlay.querySelector('.ws-charges-panel');
    closeBtn = overlay.querySelector('.ws-charges-close');
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
    document.addEventListener('keydown', function(e){
      if(overlay.hidden) return;
      if(e.key === 'Escape'){ e.preventDefault(); close(); return; }
      if(e.key === 'Tab'){ e.preventDefault(); closeBtn.focus(); }   // the close button is the only control
    });
  }

  function open(card, kind){
    var duty = card.querySelector(kind.duty);
    if(!duty) return;
    lastFocus = document.activeElement;
    var t = text(card.querySelector(kind.title)), s = text(card.querySelector(kind.sub)), h = text(card.querySelector(kind.holder));
    overlay.querySelector('.ws-charges-eyebrow').textContent = w('head');
    overlay.querySelector('.ws-charges-title').textContent = t;
    var sub = overlay.querySelector('.ws-charges-sub');
    sub.textContent = (s && s !== t) ? s : '';
    sub.hidden = !sub.textContent;
    overlay.querySelector('.ws-charges-text').innerHTML = duty.innerHTML;
    var held = overlay.querySelector('.ws-charges-held');
    var vacant = !h || /to be appointed/i.test(h);
    held.hidden = vacant;
    if(!vacant){ held.innerHTML = ''; held.appendChild(document.createTextNode(w('held'))); var b = document.createElement('b'); b.textContent = h; held.appendChild(b); }
    closeBtn.setAttribute('aria-label', w('close'));
    closeBtn.title = w('close');
    overlay.hidden = false;
    document.body.classList.add('ws-charges-lock');
    panel.scrollTop = 0;
    requestAnimationFrame(function(){ overlay.classList.add('open'); closeBtn.focus(); });
  }

  function close(){
    overlay.classList.remove('open');
    document.body.classList.remove('ws-charges-lock');
    setTimeout(function(){ overlay.hidden = true; }, 200);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function label(){
    buttons.forEach(function(b){
      b.el.querySelector('span').textContent = w('btn');
      b.el.setAttribute('aria-label', w('head') + ' — ' + text(b.card.querySelector(b.kind.title)));
    });
  }

  function start(){
    var st = document.createElement('style');
    st.id = 'ws-charges-style';
    st.textContent = CSS;
    document.head.appendChild(st);
    build();
    KINDS.forEach(function(kind){
      var cards = document.querySelectorAll(kind.card);
      for(var i = 0; i < cards.length; i++){
        var card = cards[i], duty = card.querySelector(kind.duty);
        if(!duty || card.querySelector('.ws-charges-btn')) continue;
        kind.hide.forEach(function(sel){ var e = card.querySelector(sel); if(e) e.classList.add('ws-charges-hidden'); });
        duty.classList.add('ws-charges-hidden');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ws-charges-btn';
        btn.setAttribute('aria-haspopup', 'dialog');
        btn.innerHTML = ICON_SCROLL + '<span></span>';
        duty.parentNode.insertBefore(btn, duty);
        (function(c, k){ btn.addEventListener('click', function(){ open(c, k); }); })(card, kind);
        buttons.push({ el:btn, card:card, kind:kind });
      }
    });
    label();
  }

  document.addEventListener('ws:lang', label);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
