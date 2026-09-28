/* =====================================================================
   Widows Sons MRA — Chapter Hellas
   WSDoc — the office that issues the documents of the Chapter.

   It hands a document specification to the renderer in ws-pdf.js and
   returns it as a PDF or as a Word file. Neither carries a password:
   the documents are issued open, to be read and printed by any brother.

   jsPDF, the letterhead faces and the renderer are fetched only when a
   document is actually called for, so no visitor pays for them.
   ===================================================================== */
var WSDoc = (function(){

  var ORG = 'Widows Sons Masonic Riders Association', CHAPTER = 'Chapter Hellas';

  /* The stamp of the edition. Every part of the office is fetched under
     it, so a brother who has opened the office before is never served a
     renderer older than the register it is asked to draw. Raise it
     whenever a document, the renderer or the register changes, and raise
     it in the same breath on the pages that carry the art. */
  var EDITION = '20260928b';
  var PARTS = ['assets/vendor/jspdf.umd.min.js',
               'assets/vendor/jspdf.plugin.autotable.min.js',
               'assets/vendor/ws-fonts.js',
               'assets/ws-pdf.js'].map(function(p){ return p + '?v=' + EDITION; });
  var loading = null;

  function script(src){
    return new Promise(function(done, fail){
      var s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = function(){ done(); };
      s.onerror = function(){ fail(new Error('could not load ' + src)); };
      document.head.appendChild(s);
    });
  }
  function press(){
    if(!loading){
      loading = PARTS.reduce(function(c, src){
        return c.then(function(){ return script(src); });
      }, Promise.resolve());
    }
    return loading;
  }

  /* --- the art of the Chapter, taken from the page as PNG --- */
  /* The art is carried at the size it is actually printed at — the emblem
     sets 25mm wide and the seal 34mm, so 480px is beyond what 300 dpi
     asks for, and the document stays light. */
  var ART_MAX = 480, HAND_MAX = 700;
  function plate(img, cap){
    if(!img || !img.naturalWidth){ return null; }
    var w = img.naturalWidth, h = img.naturalHeight;
    var k = Math.min(1, (cap || ART_MAX) / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    var g = c.getContext('2d');
    if(g.imageSmoothingQuality){ g.imageSmoothingQuality = 'high'; }
    /* The documents are printed on white paper, so the art needs no
       transparency; laid on white and handed over as JPEG it keeps its
       own compression inside the PDF, whether or not the document itself
       is compressed. The renderer draws the signing rule over the hand,
       so the rule is not lost beneath it. */
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, 0, 0, c.width, c.height);
    try { return c.toDataURL('image/jpeg', 0.92); } catch(e){ return null; }
  }
  function settled(img){
    if(!img || img.complete){ return Promise.resolve(img); }
    return new Promise(function(done){
      img.addEventListener('load',  function(){ done(img); }, {once:true});
      img.addEventListener('error', function(){ done(null); }, {once:true});
    });
  }
  function art(){
    var e = document.getElementById('wsLetterhead') || document.getElementById('wsEmblem');
    var s = document.getElementById('wsSeal');
    var a = document.getElementById('wsAutograph');
    return Promise.all([settled(e), settled(s), settled(a)]).then(function(){
      return { emblem: plate(e), emblemW: e ? e.naturalWidth : 1,
               emblemH: e ? e.naturalHeight : 1, seal: plate(s),
               autograph: plate(a, HAND_MAX),
               autographUrl: a ? a.src : '',
               autographW: a ? a.naturalWidth : 1, autographH: a ? a.naturalHeight : 1 };
    });
  }

  function english(v){ return (typeof v === 'string') ? v : ((v && v.en) || ''); }
  function fileName(spec, ext){
    if(spec.file){ return spec.file + '.' + ext; }
    var n = 'Chapter Hellas ' + english(spec.subject) + ' ' + (spec.date || '');
    return n.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.' + ext;
  }

  /* --- issue as a PDF --- */
  function pdf(spec){
    return press().then(art).then(function(plates){
      var ctor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      window.WSPdf.build(ctor, spec, plates, window.WSFonts).save(fileName(spec, 'pdf'));
    });
  }

  /* --- issue as a Word file, for a document still being perfected --- */
  function esc(s){
    return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
           .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function runs(item, cls){
    if(item === null || item === undefined){ return ''; }
    if(typeof item === 'string'){ return '<p class="' + (cls||'b') + '">' + esc(item) + '</p>'; }
    var out = '';
    if(item.en){ out += '<p class="' + (cls||'b') + '">' + esc(item.en) + '</p>'; }
    if(item.el || item.gr){ out += '<p class="alt">' + esc(item.el || item.gr) + '</p>'; }
    if(item.bg){ out += '<p class="alt">' + esc(item.bg) + '</p>'; }
    return out;
  }
  function cellText(c){
    if(c && typeof c === 'object'){
      if(c._field && !c.content){ return '<span class="sub">……………………</span>'; }
      return esc(c.content) + (c._gr ? '<br><span class="sub">' + esc(c._gr) + '</span>' : '');
    }
    return esc(c);
  }
  function wordTable(t){
    var h = t.head ? '<tr>' + t.head.map(function(x){ return '<th>' + esc(x) + '</th>'; }).join('') + '</tr>' : '';
    var b = t.rows.map(function(r){
      return '<tr>' + r.map(function(c){ return '<td>' + cellText(c) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<table>' + h + b + '</table>' + (t.note ? '<p class="note">' + esc(t.note) + '</p>' : '');
  }
  function signHtml(sig, a){
    if(!sig){ return '<td></td>'; }
    /* Word does not read a picture written into the page as data, so the
       hand is linked to the file the page itself carries. */
    var hand = (sig.autograph && a && (a.autographUrl || a.autograph))
      ? '<div class="sig-hand"><img src="' + (a.autographUrl || a.autograph) +
        '" width="190"></div>' : '';
    return '<td class="sig">' +
             '<div class="sig-title">' + esc(sig.title) + '</div>' +
             hand +
             '<div class="sig-line">&nbsp;</div>' +
             '<div class="sig-name">' + esc(sig.name) + '</div>' +
             (sig.road ? '<div class="sig-road">«' + esc(String(sig.road).toUpperCase()) + '»</div>' : '') +
             (sig.role ? '<div class="sig-role">' + esc(sig.role) + '</div>' : '') +
           '</td>';
  }
  function word(spec){
    return art().then(function(a){
      var subj = (typeof spec.subject === 'string') ? {en:spec.subject} : spec.subject;
      var body = '';
      (spec.lead || []).forEach(function(p){ body += runs(p, 'lead'); });
      (spec.sections || []).forEach(function(s){
        var t = (typeof s.title === 'string') ? {en:s.title} : (s.title || {});
        body += '<h2>' + esc(t.en || '') + '</h2>';
        var sub = [t.el || t.gr, t.bg].filter(Boolean).join(' · ');
        if(sub){ body += '<p class="alt h2sub">' + esc(sub) + '</p>'; }
        if(s.image && a[s.image]){
          body += '<p class="plate"><img src="' + a[s.image] + '" width="320"></p>';
          if(s.caption){ body += '<p class="note plate">' + esc(s.caption) + '</p>'; }
        }
        if(s.table){ body += wordTable(s.table); }
        (s.paragraphs || []).forEach(function(p){ body += runs(p); });
      });
      (spec.closing || []).forEach(function(p){ body += runs(p); });

      var pair = spec.signatures;
      var foot = '<table class="feet"><tr>' +
                 (pair ? signHtml(pair.left, a) : '<td></td>') +
                 '<td class="sealcell">' + (a.seal ? '<img src="' + a.seal + '" width="120">' : '') +
                   '<div class="note">Official Seal of Chapter Hellas</div></td>' +
                 signHtml(pair ? pair.right : spec.signature, a) +
                 '</tr></table>';

      var html =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
              'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
              'xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">' +
        '<title>' + esc(CHAPTER + ' — ' + (subj.en || 'Document')) + '</title>' +
        '<style>' +
        '@page{size:A4; margin:2cm 1.8cm;} body{font-family:"Garamond","Times New Roman",serif; font-size:11pt; color:#16181c;}' +
        '.head{text-align:center;} .head img{width:190px;}' +
        '.org{font-size:13pt; font-weight:bold; letter-spacing:2px; text-transform:uppercase;}' +
        '.chapter{font-size:11pt; font-weight:bold; letter-spacing:4px; color:#9E1B1F; text-transform:uppercase;}' +
        '.motto{font-style:italic; font-size:9pt; color:#6b6f77;}' +
        'h1{font-size:19pt; text-align:center; letter-spacing:3px; text-transform:uppercase; margin:18pt 0 2pt;}' +
        '.subalt{text-align:center; font-style:italic; color:#6b6f77; font-size:10.5pt; margin:0;}' +
        '.meta{font-size:8.5pt; letter-spacing:1px; text-transform:uppercase; color:#6b6f77; border-top:1px solid #d8d4ca; border-bottom:1px solid #d8d4ca; padding:5pt 0;}' +
        'h2{font-size:11pt; color:#9E1B1F; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid #d8d4ca; padding-bottom:3pt; margin:16pt 0 2pt;}' +
        '.h2sub{margin:0 0 8pt;} p{text-align:justify; margin:0 0 7pt;} .lead{font-size:11.5pt;}' +
        '.alt{color:#5c6067; font-style:italic; font-size:10.5pt;}' +
        '.note{font-size:9pt; font-style:italic; color:#5c6067;}' +
        'table{border-collapse:collapse; width:100%; font-size:9.5pt; margin:6pt 0;}' +
        'th{background:#22262c; color:#fff; text-align:left; font-size:8.5pt; letter-spacing:1px; text-transform:uppercase; padding:5pt; border:1px solid #22262c;}' +
        'td{border:1px solid #cfcbc1; padding:5pt; vertical-align:top;} .sub{color:#6b6f77; font-size:8.5pt;}' +
        '.feet{border:0; margin-top:26pt;} .feet td{border:0; text-align:center; vertical-align:bottom;}' +
        '.sig-title{font-weight:bold; letter-spacing:2px; text-transform:uppercase; font-size:10pt;}' +
        '.sig-hand{margin-bottom:-30pt; text-align:center;} .sig-hand img{width:190px;}' +
        '.sig-line{border-bottom:1px solid #16181c; height:34pt;} .sig-name{font-weight:bold; padding-top:4pt;}' +
        '.sig-road{color:#9E1B1F; font-size:9pt; letter-spacing:1px;} .sig-role{color:#6b6f77; font-size:8.5pt;}' +
        '.plate{text-align:center;}' +
        '</style></head><body>' +
        '<div class="head">' + (a.emblem ? '<img src="' + a.emblem + '">' : '') +
          '<div class="org">' + esc(ORG) + '</div>' +
          '<div class="chapter">' + esc(CHAPTER) + '</div>' +
          '<div class="motto">Meet on the Level &amp; Part upon the Square</div></div>' +
        '<h1>' + esc(subj.en || '') + '</h1>' +
        ((subj.el || subj.gr) ? '<p class="subalt">' + esc(subj.el || subj.gr) + '</p>' : '') +
        (subj.bg ? '<p class="subalt">' + esc(subj.bg) + '</p>' : '') +
        '<p class="meta">' + esc(spec.ref || '') + ' &nbsp;&nbsp;·&nbsp;&nbsp; ' +
          esc((spec.place || '') + (spec.date ? ' · ' + spec.date : '')) + '</p>' +
        body +
        '<p style="text-align:right; margin-top:18pt;">' +
          esc((spec.place || '') + (spec.date ? ', ' + spec.date : '')) + '</p>' +
        foot + '</body></html>';

      var blob = new Blob(['﻿' + html], {type:'application/msword;charset=utf-8'});
      var url = URL.createObjectURL(blob);
      var a2 = document.createElement('a');
      a2.href = url; a2.download = fileName(spec, 'doc');
      document.body.appendChild(a2); a2.click(); document.body.removeChild(a2);
      setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
    });
  }

  return { pdf:pdf, word:word, issue:pdf };
})();
