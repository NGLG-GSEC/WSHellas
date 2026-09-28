/* =====================================================================
   Widows Sons MRA — Hellas Chapter
   The Register of Members and Officers — Secretariat unit 5.

   Where the register is kept
   --------------------------
   This site is a public page with no server behind it. The register holds
   the brethren's mobiles and e-mails, so it is NEVER written into the page
   or into the repository. It lives in the browser of the Secretary's own
   device (localStorage), and the Excel file he exports is the master copy:
   he keeps it safe, and imports it again on another device or after a
   browser is cleared.

   Adding a field later
   --------------------
   Add one line to FIELDS. The form, the table (if `list` is set), the
   Excel export and the Excel import all follow it; nothing else changes.
   A column the file carries that FIELDS does not know is kept with the
   member and written back on the next export, so no data is lost while a
   field is still to be added here.

   Code and seal
   -------------
   Import and export both ask again for the Chapter's code and for the
   seal to be pressed, as the door of the office does. Import first shows
   exactly what it will add and change; nothing is written until the seal
   is pressed.
   ===================================================================== */
(function(){
  var KEY = 'ws-register-v1', CODE = '1966';
  var HONOURS = ['No', 'Honorary', 'Most Honorary'];
  var OFFICES_FALLBACK = ['President','Vice President','Secretary','Treasurer','Sergeant-at-Arms',
    'Road Captain','Road Sergeant','Warden','Orator','Ambassador','Almoner','Quartermaster',
    'Master of Ceremonies','Preparing Brother','Event Manager'];
  var offices = OFFICES_FALLBACK.concat(['Member']);

  var FIELDS = [
    { key:'id',           en:'ID',                          el:'Α/Α',                     auto:true, list:true },
    { key:'name',         en:'Name',                        el:'Όνομα',                   required:true, list:true },
    { key:'surname',      en:'Surname',                     el:'Επώνυμο',                 required:true, list:true },
    { key:'road',         en:'Road name',                   el:'Όνομα δρόμου',            upper:true, list:true },
    { key:'mobile',       en:'Mobile',                      el:'Κινητό',                  type:'tel', list:true },
    { key:'email',        en:'Email',                       el:'Email',                   type:'email', list:true },
    { key:'office',       en:'Office rank',                 el:'Αξίωμα',                  type:'select', options:function(){ return offices; }, dflt:'Member', list:true },
    { key:'honorary',     en:'Honorary title',              el:'Επίτιμος τίτλος',         type:'select', options:function(){ return HONOURS; }, dflt:'No', list:true },
    { key:'honoraryDate', en:'Date of honorary',            el:'Ημ/νία επίτιμου',         type:'date', list:true },
    { key:'founder',      en:'Founder',                     el:'Ιδρυτής',                 type:'select', options:function(){ return ['No','Yes']; }, dflt:'No', list:true },
    { key:'supportDate',  en:'Entered as supporter (prospect)', el:'Είσοδος ως υποστηρικτής (δόκιμος)', type:'date', list:true },
    { key:'fullDate',     en:'Entered as full member',      el:'Είσοδος ως πλήρες μέλος', type:'date', list:true },
    { key:'notes',        en:'Notes',                       el:'Σημειώσεις',              type:'textarea' }
  ];

  /* ---------------------------------------------------------------- store */
  function load(){
    try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if(d && d.members){ return d; } } catch(e){}
    return { members:[], updated:0, exported:0 };
  }
  var store = load();
  function save(){
    store.updated = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(store)); }
    catch(e){ alert('This browser would not keep the register (private window or storage full). Export it to Excel now so nothing is lost.'); }
    render();
  }
  function nextId(){
    var n = store.members.reduce(function(m, r){ var k = parseInt(String(r.id).replace(/\D/g,''), 10); return isNaN(k) ? m : Math.max(m, k); }, 0);
    return 'HC-' + ('00' + (n + 1)).slice(-3);
  }

  /* --------------------------------------------------------------- values */
  function isoDate(v){
    if(v === null || v === undefined || v === '') return '';
    if(v instanceof Date && !isNaN(v)) return v.getFullYear() + '-' + ('0'+(v.getMonth()+1)).slice(-2) + '-' + ('0'+v.getDate()).slice(-2);
    var s = String(v).trim(), m;
    if((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + '-' + ('0'+m[2]).slice(-2) + '-' + ('0'+m[3]).slice(-2);
    if((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/))){   // dd/mm/yyyy, as written in Greece
      var y = m[3].length === 2 ? '20' + m[3] : m[3];
      return y + '-' + ('0'+m[2]).slice(-2) + '-' + ('0'+m[1]).slice(-2);
    }
    if(/^\d{5}(\.\d+)?$/.test(s)){   // an Excel day number: read in UTC, so no time zone can move the day
      var d = new Date(Math.round(Math.floor(+s) - 25569) * 864e5);
      return d.getUTCFullYear() + '-' + ('0'+(d.getUTCMonth()+1)).slice(-2) + '-' + ('0'+d.getUTCDate()).slice(-2);
    }
    return 'INVALID:' + s;
  }
  function showDate(iso){ if(!iso) return ''; var p = iso.split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso; }
  function clean(f, v){
    if(v === null || v === undefined) v = '';
    if(f.type === 'date') return isoDate(v);
    v = String(v).trim();
    if(f.upper) v = v.toUpperCase();
    if(f.type === 'email') v = v.toLowerCase();
    if(f.type === 'select'){
      var opts = f.options(), hit = opts.filter(function(o){ return o.toLowerCase() === v.toLowerCase(); })[0];
      if(f.key === 'founder'){
        if(/^(yes|ναι|y|founder|ιδρυτής|ιδρυτης|true|1)$/i.test(v)) hit = 'Yes';
        if(/^(no|όχι|οχι|n|false|0|)$/i.test(v)) hit = 'No';
      }
      if(f.key === 'honorary'){
        if(/^(yes|ναι|y)$/i.test(v)) hit = 'Honorary';
        if(/^(no|όχι|οχι|n|)$/i.test(v)) hit = 'No';
      }
      return hit || v || f.dflt || '';
    }
    return v;
  }
  function problems(r){
    var out = [];
    FIELDS.forEach(function(f){
      var v = r[f.key];
      if(f.required && !v) out.push(f.en + ' is required');
      if(f.type === 'date' && /^INVALID:/.test(v || '')) out.push(f.en + ' is not a date (' + v.slice(8) + ')');
      if(f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) out.push('Email is not valid');
      if(f.type === 'tel' && v && !/^\+?[\d\s()\-]{7,}$/.test(v)) out.push('Mobile is not valid');
      if(f.type === 'select' && v && f.options().indexOf(v) < 0) out.push(f.en + ' "' + v + '" is not one of the list');
    });
    if(r.honorary && r.honorary !== 'No' && !r.honoraryDate) out.push('Date of honorary is required for an honorary title');
    if(r.supportDate && r.fullDate && r.fullDate < r.supportDate) out.push('Full member date is before the supporter date');
    return out;
  }

  /* ---------------------------------------------------------------- style */
  var CSS =
  '.reg-over{position:fixed;inset:0;z-index:90;background:#070708;display:flex;flex-direction:column;color:var(--bone)}' +
  '.reg-over[hidden],.reg-modal[hidden]{display:none!important}' +
  'body.reg-open .ws-imgno-layer{display:none!important}' +
  '.reg-table td.id,.reg-table td.nw{white-space:nowrap}' +
  '.reg-head{display:flex;align-items:center;gap:16px;padding:16px 26px;border-bottom:1px solid var(--stitch);background:#0b0b0d}' +
  '.reg-head img{width:44px;height:44px;object-fit:contain}' +
  '.reg-head h2{font-size:22px;letter-spacing:.06em;text-transform:uppercase}' +
  '.reg-head .gr{font-size:14px;color:var(--steel-dim);font-family:"EB Garamond",serif}' +
  '.reg-x{margin-left:auto;width:44px;height:44px;border-radius:50%;border:1px solid rgba(203,168,103,.45);background:rgba(255,255,255,.03);color:var(--bone);cursor:pointer;display:grid;place-items:center;flex:none}' +
  '.reg-x:hover{border-color:var(--gold-bright);background:rgba(203,168,103,.14)}' +
  '.reg-x svg{width:18px;height:18px}' +
  '.reg-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:14px 26px;border-bottom:1px solid var(--stitch)}' +
  '.reg-bar input[type=search]{flex:1;min-width:200px;font:16px "EB Garamond",serif;color:var(--bone);background:#0d0d0f;border:1px solid var(--stitch);padding:10px 14px;outline:none}' +
  '.reg-bar input[type=search]:focus{border-color:var(--gold)}' +
  '.reg-state{padding:9px 26px;font:600 11px/1.4 Oswald,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--steel-dim);border-bottom:1px solid var(--stitch);display:flex;gap:18px;flex-wrap:wrap}' +
  '.reg-state .warn{color:#e0b45c}.reg-state .ok{color:#8fc79a}' +
  '.reg-body{flex:1;overflow:auto;padding:0 26px 30px}' +
  '.reg-table{width:100%;border-collapse:collapse;font-size:15px;min-width:1080px}' +
  '.reg-table th{position:sticky;top:0;background:#141416;text-align:left;font:600 10.5px/1.3 Oswald,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-bright);padding:12px 10px;border-bottom:1px solid rgba(203,168,103,.4);white-space:nowrap;cursor:pointer;user-select:none}' +
  '.reg-table th .el{display:block;color:var(--steel-dim);letter-spacing:.04em;text-transform:none;font:italic 12px "EB Garamond",serif}' +
  '.reg-table td{padding:10px;border-bottom:1px solid var(--stitch);vertical-align:top}' +
  '.reg-table tr:hover td{background:rgba(203,168,103,.05)}' +
  '.reg-table td.id{font:600 12px Oswald,sans-serif;letter-spacing:.1em;color:var(--gold)}' +
  '.reg-table td.road{font:600 12.5px Oswald,sans-serif;letter-spacing:.12em;color:#e05a61}' +
  '.reg-table td .muted{color:var(--steel-dim)}' +
  '.reg-table .tag{display:inline-block;padding:2px 8px;border:1px solid var(--stitch);font:600 10.5px Oswald,sans-serif;letter-spacing:.1em;text-transform:uppercase}' +
  '.reg-table .tag.fd{border-color:#c22a2a;color:#ff8f8f}.reg-table .tag.h{border-color:#8b8f96;color:#d6d9de}.reg-table .tag.mh{border-color:var(--gold-bright);color:var(--gold-bright)}' +
  '.reg-row-acts{white-space:nowrap}.reg-row-acts button{background:none;border:1px solid var(--stitch);color:var(--bone-dim);font:600 10.5px Oswald,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:6px 10px;cursor:pointer;margin-left:4px}' +
  '.reg-row-acts button:hover{border-color:var(--gold);color:var(--bone)}.reg-row-acts button.del:hover{border-color:var(--crimson-bright);color:#ff8f8f}' +
  '.reg-empty{text-align:center;color:var(--steel-dim);padding:70px 20px;font-size:17px}' +
  '.reg-modal{position:fixed;inset:0;z-index:95;background:rgba(3,3,4,.8);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px}' +
  '.reg-card{position:relative;width:min(820px,100%);max-height:calc(100vh - 48px);overflow:auto;background:radial-gradient(ellipse 120% 80% at 50% 0%,#1d1f24,#0b0c0e 70%);border:1px solid rgba(203,168,103,.42);border-radius:12px;padding:40px 44px 34px;box-shadow:0 30px 80px rgba(0,0,0,.8)}' +
  '.reg-card h3{font-size:24px;letter-spacing:.04em;margin:0 0 4px}.reg-card .sub{color:var(--steel-dim);margin:0 0 22px;font-size:15.5px}' +
  '.reg-card .reg-x{position:absolute;top:14px;right:14px;margin:0}' +
  '.reg-form{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px}' +
  '.reg-form label{display:flex;flex-direction:column;gap:5px;font:600 10.5px/1.3 Oswald,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-bright)}' +
  '.reg-form label .el{font:italic 12.5px "EB Garamond",serif;letter-spacing:0;text-transform:none;color:var(--steel-dim)}' +
  '.reg-form label.wide{grid-column:1/-1}.reg-form label.off{opacity:.45}' +
  '.reg-form input,.reg-form select,.reg-form textarea{font:16px "EB Garamond",serif;color:var(--bone);background:#0d0d0f;border:1px solid var(--stitch);padding:10px 12px;outline:none;letter-spacing:0;text-transform:none;color-scheme:dark}' +
  '.reg-form textarea{min-height:74px;resize:vertical}' +
  '.reg-form input:focus,.reg-form select:focus,.reg-form textarea:focus{border-color:var(--gold)}' +
  '.reg-form .bad{border-color:var(--crimson-bright)!important}' +
  '.reg-errs{color:#ff8f8f;font-size:15px;margin:16px 0 0;min-height:1em}' +
  '.reg-foot{display:flex;gap:10px;justify-content:flex-end;margin-top:22px;flex-wrap:wrap}' +
  '.reg-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:0 0 18px}' +
  '.reg-sum div{border:1px solid var(--stitch);padding:12px;text-align:center}' +
  '.reg-sum b{display:block;font:700 26px Cinzel,serif;color:var(--bone)}.reg-sum span{font:600 10px Oswald,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--steel-dim)}' +
  '.reg-sum .bad b{color:#ff8f8f}' +
  '.reg-list{max-height:34vh;overflow:auto;border:1px solid var(--stitch);font-size:14.5px}' +
  '.reg-list div{padding:8px 12px;border-bottom:1px solid var(--stitch)}.reg-list .k{font:600 10.5px Oswald,sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-right:8px}' +
  '.reg-list .k.n{color:#8fc79a}.reg-list .k.u{color:#e0b45c}.reg-list .k.e{color:#ff8f8f}' +
  '.reg-seal{text-align:center;margin-top:20px}' +
  '.reg-seal input{font:17px Oswald,sans-serif;letter-spacing:.42em;text-align:center;width:170px;padding:12px;color:var(--bone);background:#0d0d0f;border:1px solid var(--stitch);outline:none}' +
  '.reg-seal input:focus{border-color:var(--gold)}' +
  '.reg-seal button.wax{display:block;margin:18px auto 0;padding:0;border:0;background:none;cursor:pointer;width:150px;line-height:0;filter:drop-shadow(0 10px 18px rgba(0,0,0,.6));transition:transform .12s}' +
  '.reg-seal button.wax img{width:100%}.reg-seal button.wax:active,.reg-seal button.wax.pressed{transform:scale(.955) translateY(3px)}' +
  '.reg-seal .hint{font:600 10.5px Oswald,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:var(--steel-dim);margin-top:10px}' +
  '.reg-seal .err{color:#ff8f8f;font:600 11px Oswald,sans-serif;letter-spacing:.16em;text-transform:uppercase;min-height:15px;margin-top:10px}' +
  '@media(max-width:700px){.reg-head,.reg-bar,.reg-body{padding-left:14px;padding-right:14px}.reg-form{grid-template-columns:1fr}.reg-card{padding:60px 20px 26px}.reg-sum{grid-template-columns:1fr 1fr}}';

  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function el(html){ var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

  /* ------------------------------------------------------------- the view */
  var over, tbody, search, stateEl, sortKey = 'id', sortDir = 1;

  function build(){
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    over = el(
      '<div class="reg-over" hidden role="dialog" aria-modal="true" aria-label="Register of Members and Officers">' +
        '<div class="reg-head"><img src="assets/chapter-hellas-seal-helmet.webp?v=20260928" alt="">' +
          '<div><h2>Register of Members and Officers</h2><div class="gr">Μητρώο Μελών και Αξιωματικών</div></div>' +
          '<button type="button" class="reg-x" data-close aria-label="Close" title="Close">' + X + '</button></div>' +
        '<div class="reg-bar">' +
          '<button type="button" class="btn solid" data-new>+ New member</button>' +
          '<input type="search" placeholder="Search name, road name, office, mobile, email…" aria-label="Search the register">' +
          '<button type="button" class="btn" data-export>Export Excel</button>' +
          '<button type="button" class="btn" data-import>Import Excel</button>' +
          '<input type="file" accept=".xlsx,.xls,.csv" hidden>' +
        '</div>' +
        '<div class="reg-state"></div>' +
        '<div class="reg-body"><table class="reg-table"><thead></thead><tbody></tbody></table></div>' +
      '</div>');
    document.body.appendChild(over);
    tbody = over.querySelector('tbody'); search = over.querySelector('input[type=search]'); stateEl = over.querySelector('.reg-state');
    over.querySelector('[data-close]').addEventListener('click', close);
    over.querySelector('[data-new]').addEventListener('click', function(){ edit(null); });
    over.querySelector('[data-export]').addEventListener('click', exportExcel);
    var file = over.querySelector('input[type=file]');
    over.querySelector('[data-import]').addEventListener('click', function(){ file.value = ''; file.click(); });
    file.addEventListener('change', function(){ if(file.files[0]) importExcel(file.files[0]); });
    search.addEventListener('input', render);
    document.addEventListener('keydown', function(e){
      if(e.key !== 'Escape' || over.hidden) return;
      var m = document.querySelector('.reg-modal:not([hidden])');
      if(m){ m.remove(); } else { close(); }
    });
    var cols = FIELDS.filter(function(f){ return f.list; });
    over.querySelector('thead').innerHTML = '<tr>' + cols.map(function(f){
      return '<th data-k="' + f.key + '">' + esc(f.en) + '<span class="el">' + esc(f.el) + '</span></th>'; }).join('') + '<th></th></tr>';
    over.querySelectorAll('th[data-k]').forEach(function(th){
      th.addEventListener('click', function(){ var k = th.getAttribute('data-k'); sortDir = (sortKey === k) ? -sortDir : 1; sortKey = k; render(); });
    });
  }

  function open(){ if(!over) build(); over.hidden = false; document.body.style.overflow = 'hidden'; document.body.classList.add('reg-open'); render(); readOffices(); }
  function close(){ over.hidden = true; document.body.style.overflow = ''; document.body.classList.remove('reg-open'); }

  function cell(f, r){
    var v = r[f.key] || '';
    if(f.key === 'id') return '<td class="id">' + esc(v) + '</td>';
    if(f.key === 'road') return '<td class="road">' + (v ? '«' + esc(v) + '»' : '<span class="muted">—</span>') + '</td>';
    if(f.key === 'founder') return '<td>' + (v === 'Yes' ? '<span class="tag fd">Founder</span>' : '<span class="muted">No</span>') + '</td>';
    if(f.key === 'honorary') return '<td>' + (v === 'Most Honorary' ? '<span class="tag mh">Most Honorary</span>' : v === 'Honorary' ? '<span class="tag h">Honorary</span>' : '<span class="muted">No</span>') + '</td>';
    if(f.type === 'date') return '<td class="nw">' + (v ? esc(showDate(v)) : '<span class="muted">—</span>') + '</td>';
    if(f.type === 'email' && v) return '<td><a href="mailto:' + esc(v) + '">' + esc(v) + '</a></td>';
    if(f.type === 'tel' && v) return '<td class="nw"><a href="tel:' + esc(v.replace(/\s/g,'')) + '">' + esc(v) + '</a></td>';
    return '<td>' + (v ? esc(v) : '<span class="muted">—</span>') + '</td>';
  }

  function render(){
    if(!over || over.hidden) return;
    var q = (search.value || '').toLowerCase();
    var rows = store.members.filter(function(r){
      if(!q) return true;
      return FIELDS.some(function(f){ return String(r[f.key] || '').toLowerCase().indexOf(q) >= 0; });
    }).sort(function(a, b){ var x = String(a[sortKey] || ''), y = String(b[sortKey] || ''); return x < y ? -sortDir : x > y ? sortDir : 0; });
    var cols = FIELDS.filter(function(f){ return f.list; });
    tbody.innerHTML = rows.length ? rows.map(function(r){
      return '<tr data-id="' + esc(r.id) + '">' + cols.map(function(f){ return cell(f, r); }).join('') +
        '<td class="reg-row-acts"><button type="button" data-edit>Edit</button><button type="button" class="del" data-del>Delete</button></td></tr>';
    }).join('') : '<tr><td colspan="' + (cols.length + 1) + '" class="reg-empty">' +
      (store.members.length ? 'No member matches the search.' : 'The register is empty. Add the first member, or import the Chapter’s Excel file.') + '</td></tr>';
    tbody.querySelectorAll('tr[data-id]').forEach(function(tr){
      var id = tr.getAttribute('data-id');
      tr.querySelector('[data-edit]').addEventListener('click', function(){ edit(id); });
      tr.querySelector('[data-del]').addEventListener('click', function(){ remove(id); });
    });
    var full = store.members.filter(function(r){ return r.fullDate; }).length;
    var hon = store.members.filter(function(r){ return r.honorary && r.honorary !== 'No'; }).length;
    var fnd = store.members.filter(function(r){ return r.founder === 'Yes'; }).length;
    var pending = store.updated > (store.exported || 0) && store.members.length;
    stateEl.innerHTML =
      '<span>' + store.members.length + ' in the register</span><span>' + full + ' full members</span>' +
      '<span>' + (store.members.length - full) + ' supporters / prospects</span><span>' + hon + ' honorary</span><span>' + fnd + ' founders</span>' +
      (pending ? '<span class="warn">Changes not yet exported to Excel</span>'
               : (store.exported ? '<span class="ok">Exported ' + new Date(store.exported).toLocaleString('en-GB') + '</span>' : '')) +
      '<span>Kept on this device only &mdash; the Excel file is the master copy</span>';
  }

  /* offices read from the officers of the Chapter, as the configurator does */
  var officesRead = false;
  function readOffices(){
    if(officesRead) return; officesRead = true;
    fetch('index.html', {cache:'no-cache'}).then(function(r){ return r.text(); }).then(function(h){
      var d = new DOMParser().parseFromString(h, 'text/html');
      var list = Array.prototype.map.call(d.querySelectorAll('#administration .ws-office-en'), function(e){ return e.textContent.trim(); }).filter(Boolean);
      if(list.length) offices = list.filter(function(v, i){ return list.indexOf(v) === i; }).concat(['Member']);
    }).catch(function(){});
  }

  /* ------------------------------------------------------------ the form */
  function modal(inner){
    var m = el('<div class="reg-modal"><div class="reg-card"><button type="button" class="reg-x" aria-label="Close" title="Close">' + X + '</button>' + inner + '</div></div>');
    m.querySelector('.reg-x').addEventListener('click', function(){ m.remove(); });
    m.addEventListener('click', function(e){ if(e.target === m) m.remove(); });
    document.body.appendChild(m);
    return m;
  }

  function control(f, v){
    var id = 'rg_' + f.key, attrs = ' id="' + id + '" name="' + f.key + '"';
    if(f.type === 'select'){
      var opts = f.options().slice(); if(v && opts.indexOf(v) < 0) opts.push(v);
      return '<select' + attrs + '>' + opts.map(function(o){ return '<option' + (o === (v || f.dflt) ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    }
    if(f.type === 'textarea') return '<textarea' + attrs + '>' + esc(v) + '</textarea>';
    return '<input' + attrs + ' type="' + (f.type || 'text') + '" value="' + esc(v) + '"' + (f.auto ? ' readonly' : '') +
           (f.upper ? ' style="text-transform:uppercase"' : '') + (f.required ? ' required' : '') + ' autocomplete="off">';
  }

  function edit(id){
    var r = id ? store.members.filter(function(m){ return m.id === id; })[0] : null;
    var v = r ? JSON.parse(JSON.stringify(r)) : { id:nextId(), office:'Member', honorary:'No' };
    var m = modal(
      '<h3>' + (r ? 'Edit member' : 'New member') + '</h3><p class="sub">' + (r ? esc(v.id + ' · ' + v.name + ' ' + v.surname) : 'Entered in the register of the Chapter') + '</p>' +
      '<form class="reg-form" novalidate>' + FIELDS.map(function(f){
        return '<label class="' + (f.type === 'textarea' ? 'wide' : '') + '" data-f="' + f.key + '">' + esc(f.en) + (f.required ? ' *' : '') +
               ' <span class="el">' + esc(f.el) + '</span>' + control(f, v[f.key]) + '</label>';
      }).join('') + '</form><div class="reg-errs"></div>' +
      '<div class="reg-foot"><button type="button" class="btn" data-cancel>Cancel</button><button type="button" class="btn solid" data-save>Save</button></div>');
    var form = m.querySelector('form'), errs = m.querySelector('.reg-errs');
    function honorState(){
      var on = form.honorary.value !== 'No', lab = m.querySelector('[data-f=honoraryDate]');
      lab.classList.toggle('off', !on); form.honoraryDate.disabled = !on; if(!on) form.honoraryDate.value = '';
    }
    form.honorary.addEventListener('change', honorState); honorState();
    m.querySelector('[data-cancel]').addEventListener('click', function(){ m.remove(); });
    m.querySelector('[data-save]').addEventListener('click', function(){
      var rec = {};
      Object.keys(v).forEach(function(k){ rec[k] = v[k]; });          // keeps columns not yet in FIELDS
      FIELDS.forEach(function(f){ rec[f.key] = clean(f, form[f.key].value); });
      var p = problems(rec);
      form.querySelectorAll('.bad').forEach(function(x){ x.classList.remove('bad'); });
      FIELDS.forEach(function(f){ if(p.some(function(t){ return t.indexOf(f.en) === 0; })) form[f.key].classList.add('bad'); });
      var dup = store.members.filter(function(x){ return x.id !== rec.id && x.name.toLowerCase() === rec.name.toLowerCase() && x.surname.toLowerCase() === rec.surname.toLowerCase(); })[0];
      if(dup && !m._dupOk){ p.push('A member of the same name is already entered (' + dup.id + '). Press Save again to enter him all the same.'); m._dupOk = true; }
      if(p.length){ errs.innerHTML = p.map(esc).join('<br>'); return; }
      if(r){ store.members = store.members.map(function(x){ return x.id === rec.id ? rec : x; }); }
      else { store.members.push(rec); }
      save(); m.remove();
    });
    (form.name).focus();
  }

  function remove(id){
    var r = store.members.filter(function(m){ return m.id === id; })[0]; if(!r) return;
    sealed('Delete ' + r.id + ' · ' + r.name + ' ' + r.surname + ' from the register?',
           'The entry is removed from this device. It remains in any Excel file already exported.', 'Delete').then(function(ok){
      if(!ok) return;
      store.members = store.members.filter(function(m){ return m.id !== id; }); save();
    });
  }

  /* ------------------------------------------------------ code and seal */
  function sealed(title, body, verb, extra){
    return new Promise(function(done){
      var m = modal('<h3>' + esc(title) + '</h3><p class="sub">' + esc(body) + '</p>' + (extra || '') +
        '<div class="reg-seal"><input type="password" inputmode="numeric" maxlength="12" aria-label="Security code" placeholder="CODE" autocomplete="off">' +
        '<button type="button" class="wax" aria-label="Press the seal to ' + esc(verb) + '"><img src="assets/chapter-hellas-wax-seal.webp?v=20260928" alt=""></button>' +
        '<div class="hint">Give the code, then press the seal to ' + esc(verb.toLowerCase()) + '</div><div class="err"></div></div>');
      var box = m.querySelector('.reg-seal input'), err = m.querySelector('.reg-seal .err'), wax = m.querySelector('.wax');
      var settled = false;
      function finish(v){ if(settled) return; settled = true; m.remove(); done(v); }
      m.querySelector('.reg-x').addEventListener('click', function(){ finish(false); });
      m.addEventListener('click', function(e){ if(e.target === m) finish(false); });
      new MutationObserver(function(){ if(!document.body.contains(m)) finish(false); }).observe(document.body, {childList:true});
      box.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); err.textContent = box.value ? 'Now press the seal' : 'Give the code first'; } });
      wax.addEventListener('click', function(){
        if(box.value.trim() !== CODE){ err.textContent = box.value.trim() ? 'The code is not right' : 'Give the code first'; box.value = ''; box.focus(); return; }
        wax.classList.add('pressed'); setTimeout(function(){ finish(true); }, 240);
      });
      box.focus();
    });
  }

  /* --------------------------------------------------------------- Excel */
  var xlsxReady = null;
  function xlsx(){
    xlsxReady = xlsxReady || new Promise(function(ok, no){
      if(window.XLSX) return ok(window.XLSX);
      var s = document.createElement('script'); s.src = 'assets/vendor/xlsx.full.min.js?v=0.18.5';
      s.onload = function(){ ok(window.XLSX); }; s.onerror = function(){ xlsxReady = null; no(new Error('The Excel library could not be loaded.')); };
      document.head.appendChild(s);
    });
    return xlsxReady;
  }
  function stamp(){ var d = new Date(); return ('0'+d.getDate()).slice(-2) + ('0'+(d.getMonth()+1)).slice(-2) + String(d.getFullYear()).slice(-2); }

  function exportExcel(){
    if(!store.members.length){ alert('The register is empty — there is nothing to export yet.'); return; }
    sealed('Export the register to Excel',
           'The file holds the brethren’s personal details. Keep it with the Secretariat; do not send it on or post it anywhere public.',
           'Export').then(function(ok){
      if(!ok) return;
      return xlsx().then(function(X){
        var extra = [];
        store.members.forEach(function(r){ Object.keys(r).forEach(function(k){ if(!FIELDS.some(function(f){ return f.key === k; }) && extra.indexOf(k) < 0) extra.push(k); }); });
        var head = FIELDS.map(function(f){ return f.en; }).concat(extra);
        var rows = store.members.slice().sort(function(a, b){ return a.id < b.id ? -1 : 1; }).map(function(r){
          return FIELDS.map(function(f){
            var v = r[f.key] || '';
            if(f.type === 'date' && v){   // written as an Excel day number, in UTC, so it cannot slip a day
              var p = v.split('-'); return { t:'n', v:(Date.UTC(+p[0], +p[1] - 1, +p[2]) - Date.UTC(1899, 11, 30)) / 864e5, z:'dd/mm/yyyy' }; }
            return v;
          }).concat(extra.map(function(k){ return r[k] || ''; }));
        });
        var ws = X.utils.aoa_to_sheet([head].concat(rows));
        ws['!cols'] = head.map(function(h, i){ return { wch: [8,16,18,16,16,28,22,15,15,10,20,20,36][i] || 18 }; });
        ws['!autofilter'] = { ref: X.utils.encode_range({ s:{r:0, c:0}, e:{r:rows.length, c:head.length - 1} }) };
        var about = X.utils.aoa_to_sheet([
          ['Widows Sons MRA — Hellas Chapter · Register of Members and Officers'],
          ['Exported ' + new Date().toLocaleString('en-GB')],
          [''],
          ['How to update the register from this file'],
          ['Edit the rows on the Members sheet and import the file again from the Secretary’s page (Register → Import Excel).'],
          ['A row whose ID is already in the register updates that member. A row with no ID, or a new ID, is added as a new member.'],
          ['Keep the column headings exactly as they are. Dates may be written as dd/mm/yyyy.'],
          ['Honorary title: No, Honorary or Most Honorary.'],
          ['Founder: Yes or No.'],
          ['Office rank: one of the offices of Article V, or Member.'],
          [''],
          ['CONFIDENTIAL — personal details of the brethren. Keep with the Secretariat.']
        ]);
        about['!cols'] = [{ wch:110 }];
        var wb = X.utils.book_new();
        X.utils.book_append_sheet(wb, ws, 'Members');
        X.utils.book_append_sheet(wb, about, 'About');
        X.writeFile(wb, 'Hellas-Chapter-Register-' + stamp() + '-v1.xlsx');
        store.exported = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e){} render();
      });
    }).catch(function(e){ alert(e.message); });
  }

  function importExcel(file){
    Promise.all([xlsx(), file.arrayBuffer()]).then(function(res){
      var X = res[0], wb = X.read(res[1], { type:'array', cellDates:false });
      var ws = wb.Sheets['Members'] || wb.Sheets[wb.SheetNames[0]];
      var grid = X.utils.sheet_to_json(ws, { header:1, raw:true, defval:'' });
      if(!grid.length) throw new Error('The file has no rows.');
      var norm = function(s){ return String(s).toLowerCase().replace(/[^a-z0-9α-ωάέήίόύώ]/g, ''); };
      var map = grid[0].map(function(h){
        var n = norm(h); if(!n) return null;
        var f = FIELDS.filter(function(f){ return norm(f.en) === n || norm(f.key) === n || norm(f.el) === n; })[0];
        return f ? { f:f } : { extra:String(h).trim() };
      });
      if(!map.some(function(m){ return m && m.f && m.f.key === 'name'; }) || !map.some(function(m){ return m && m.f && m.f.key === 'surname'; }))
        throw new Error('The file must have the columns Name and Surname in its first row. Export the register once to see the layout it expects.');
      var added = [], updated = [], same = 0, bad = [], seen = {};
      var nextNo = parseInt(nextId().replace(/\D/g, ''), 10);
      grid.slice(1).forEach(function(row, i){
        if(!row.some(function(c){ return String(c).trim() !== ''; })) return;
        var rec = {};
        map.forEach(function(m, c){ if(!m) return; if(m.f) rec[m.f.key] = clean(m.f, row[c]); else if(String(row[c]).trim() !== '') rec[m.extra] = String(row[c]).trim(); });
        var cur0 = rec.id ? store.members.filter(function(m){ return m.id === rec.id; })[0] : null;
        // a column the file does not carry (an older export, say) leaves the
        // member's value as it is; only a new member takes the defaults
        FIELDS.forEach(function(f){ if(!(f.key in rec)) rec[f.key] = cur0 ? (cur0[f.key] || '') : (f.dflt || ''); });
        var p = problems(rec);
        if(rec.id && seen[rec.id]) p.push('ID ' + rec.id + ' appears twice in the file');
        if(p.length){ bad.push('Row ' + (i + 2) + ' (' + (rec.name || '?') + ' ' + (rec.surname || '') + '): ' + p.join('; ')); return; }
        var cur = rec.id ? store.members.filter(function(m){ return m.id === rec.id; })[0] : null;
        if(cur){
          seen[rec.id] = 1;
          var merged = {}; Object.keys(cur).forEach(function(k){ merged[k] = cur[k]; }); Object.keys(rec).forEach(function(k){ merged[k] = rec[k]; });
          var changes = Object.keys(merged).filter(function(k){ return String(merged[k] || '') !== String(cur[k] || ''); });
          if(changes.length) updated.push({ rec:merged, what:changes.map(function(k){ var f = FIELDS.filter(function(f){ return f.key === k; })[0]; return f ? f.en : k; }) });
          else same++;
        } else {
          if(!rec.id){ rec.id = 'HC-' + ('00' + nextNo++).slice(-3); }
          else if(parseInt(rec.id.replace(/\D/g, ''), 10) >= nextNo){ nextNo = parseInt(rec.id.replace(/\D/g, ''), 10) + 1; }
          seen[rec.id] = 1; added.push(rec);
        }
      });
      preview(file.name, added, updated, same, bad);
    }).catch(function(e){ alert('The file could not be read. ' + e.message); });
  }

  function preview(name, added, updated, same, bad){
    var list = added.map(function(r){ return '<div><span class="k n">New</span>' + esc(r.id + ' · ' + r.name + ' ' + r.surname) + (r.road ? ' «' + esc(r.road) + '»' : '') + ' — ' + esc(r.office) + '</div>'; })
      .concat(updated.map(function(u){ return '<div><span class="k u">Update</span>' + esc(u.rec.id + ' · ' + u.rec.name + ' ' + u.rec.surname) + ' — ' + esc(u.what.join(', ')) + '</div>'; }))
      .concat(bad.map(function(b){ return '<div><span class="k e">Not taken</span>' + esc(b) + '</div>'; })).join('');
    var sum = '<div class="reg-sum"><div><b>' + added.length + '</b><span>New</span></div><div><b>' + updated.length + '</b><span>Updated</span></div>' +
              '<div><b>' + same + '</b><span>Unchanged</span></div><div class="' + (bad.length ? 'bad' : '') + '"><b>' + bad.length + '</b><span>Not taken</span></div></div>' +
              (list ? '<div class="reg-list">' + list + '</div>' : '');
    if(!added.length && !updated.length){
      var m = modal('<h3>Nothing to import</h3><p class="sub">' + esc(name) + ' holds no new member and no change to the register.</p>' + sum +
                    '<div class="reg-foot"><button type="button" class="btn solid">Close</button></div>');
      m.querySelector('.reg-foot button').addEventListener('click', function(){ m.remove(); });
      return;
    }
    sealed('Import ' + name,
           'Check the changes below. Nothing is written into the register until the code is given and the seal pressed.' +
           (bad.length ? ' Rows marked Not taken are left out; correct them in the file and import it again.' : ''),
           'Import', sum).then(function(ok){
      if(!ok) return;
      updated.forEach(function(u){ store.members = store.members.map(function(m){ return m.id === u.rec.id ? u.rec : m; }); });
      added.forEach(function(r){ store.members.push(r); });
      save();
    });
  }

  /* --------------------------------------------------- the card, unit 5 */
  function card(){
    var host = document.getElementById('secretariat'); if(!host) return;
    var c = document.createElement('article');
    c.className = 'doc register';
    c.innerHTML = '<div class="no">5</div><h3>Register of Members and Officers</h3>' +
      '<div class="alt"><span>Μητρώο Μελών και Αξιωματικών</span></div>' +
      '<div class="note">Every member and officer: name, surname, road name, mobile, email, office, honorary title and the dates of entry as supporter and as full member. Export to Excel, or import it back to add and update — both under the code and the seal.</div>' +
      '<div class="acts"><button type="button" class="btn solid">Open the Register</button></div>';
    c.querySelector('button').addEventListener('click', open);
    var cards = host.querySelectorAll('.doc'), after = null;
    cards.forEach(function(d){ var n = d.querySelector('.no'); if(n && +n.textContent === 4) after = d; });
    if(after && after.nextSibling) host.insertBefore(c, after.nextSibling); else host.appendChild(c);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', card); else card();
  window.WSRegister = { open:open, fields:FIELDS };
})();
