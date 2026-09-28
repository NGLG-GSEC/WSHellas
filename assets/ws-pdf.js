/* =====================================================================
   Widows Sons MRA — Chapter Hellas
   WSPdf — the renderer that draws an official document of the Chapter.

   It takes the specification of a document (see WSDocs in the page) and
   draws it on A4: the letterhead, the subject block, the body with its
   tables, and the foot bearing the seal in the centre with a signature
   to each side. The document is issued open — it carries no password —
   and what makes it the Chapter's is the letterhead, the seal and the
   hands at its foot.

   The renderer holds no knowledge of any particular document — every
   report, regulation, letter and certificate of the Chapter is drawn by
   it, so they all carry the same form.
   ===================================================================== */
(function(root){

  var ORG     = 'Widows Sons Masonic Riders Association';
  var CHAPTER = 'Chapter Hellas';
  var MOTTO   = 'Meet on the Level & Part upon the Square';

  /* --- the page --- */
  var PW = 210, PH = 297, ML = 15, MR = 15, MT = 14, MB = 17;
  var CW = PW - ML - MR, CX = PW / 2;

  /* --- the colours of the Chapter --- */
  var INK    = [22,24,28],   CRIMSON = [158,27,31], GOLD  = [138,109,53],
      GREY   = [107,111,119], RULE   = [216,212,202], HEAD = [34,38,44],
      ZEBRA  = [246,244,239], BORDER = [207,203,193], FAINT = [154,150,142];

  var SERIF = 'WSGaramond', DISPLAY = 'WSCinzel';

  function mm(pt){ return pt * 25.4 / 72; }

  /* the kind of picture, read off the data itself */
  function fmt(data){
    return (typeof data === 'string' && data.indexOf('data:image/jpeg') === 0) ? 'JPEG' : 'PNG';
  }

  /* Width of a string as it will actually be drawn, letter-spacing and all. */
  function widthOf(doc, str, charSpace){
    var w = doc.getTextWidth(str);
    return w + (charSpace || 0) * Math.max(0, str.length - 1);
  }

  /* One line of text. o: {font, style, size, colour, spacing, align, x, y} */
  function line(doc, str, o){
    doc.setFont(o.font || SERIF, o.style || 'normal');
    doc.setFontSize(o.size);
    doc.setTextColor.apply(doc, o.colour || INK);
    var cs = o.spacing || 0, x = o.x;
    if(o.align === 'center'){ x = CX - widthOf(doc, str, cs) / 2; }
    if(o.align === 'right'){  x = (o.x === undefined ? PW - MR : o.x) - widthOf(doc, str, cs); }
    doc.text(str, x, o.y, cs ? { charSpace: cs } : undefined);
    return o.y;
  }

  /* A paragraph, justified to the measure. Returns the new cursor. */
  function paragraph(doc, str, y, o){
    o = o || {};
    var size = o.size || 10.4, lead = o.lead || 1.34, width = o.width || CW;
    doc.setFont(o.font || SERIF, o.style || 'normal');
    doc.setFontSize(size);
    doc.setTextColor.apply(doc, o.colour || INK);
    var lines = doc.splitTextToSize(str, width);
    for(var i = 0; i < lines.length; i++){
      var last = (i === lines.length - 1);
      doc.text(lines[i], o.x || ML, y, {
        maxWidth: width,
        align: (o.align || (last ? 'left' : 'justify'))
      });
      y += mm(size) * lead;
    }
    return y;
  }

  /* A block of text. A string is set as it stands; a pair {en, gr} sets the
     English and then the Greek beneath it, which is how every founding
     document of the Chapter is drawn. */
  function block(doc, item, y, o){
    o = o || {};
    if(item === null || item === undefined){ return y; }
    if(typeof item === 'string'){ return paragraph(doc, item, y, o); }
    if(item.en){ y = paragraph(doc, item.en, y, o); }
    var second = { size:(o.size || 10.4) - 1.1, colour:GREY, style:'italic',
                   lead:o.lead || 1.3, width:o.width, x:o.x };
    var el = item.el || item.gr;
    if(el){ y = paragraph(doc, el, y + 0.9, second); }
    if(item.bg){ y = paragraph(doc, item.bg, y + 0.9, second); }
    return y;
  }

  /* A heading, bilingual in the same manner. */
  function heading(doc, title, y){
    if(typeof title === 'string'){ title = { en: title }; }
    line(doc, String(title.en || '').toUpperCase(),
         {font:DISPLAY, style:'bold', size:9.8, spacing:0.5, colour:CRIMSON, x:ML, y:y});
    var sub = [title.el || title.gr, title.bg].filter(Boolean).join('  ·  ');
    if(sub){ y += 3.7; line(doc, sub, {size:8, style:'italic', colour:GREY, x:ML, y:y}); }
    return y;
  }

  /* An image set into the body of a document, with its legend. */
  function plate(doc, s, art, y){
    var key = s.image, data = art && art[key];
    if(!data){ return y; }
    var W = s.width || 60;
    var nat = (key === 'emblem') ? (art.emblemH / art.emblemW) : 1;
    var H = W * (nat || 1);
    if(y + H + 12 > PH - MB){ doc.addPage(); y = MT + 4; }
    doc.addImage(data, fmt(data), CX - W/2, y, W, H);
    y += H + 3.4;
    if(s.caption){
      line(doc, String(s.caption).toUpperCase(),
           {size:6.6, spacing:0.4, colour:FAINT, align:'center', y:y});
      y += 3;
    }
    return y + 2;
  }

  /* ---------- the letterhead ---------- */
  function letterhead(doc, spec, art){
    var y = MT;
    if(art && art.emblem){
      var w = 25, h = w * (art.emblemH / art.emblemW || 1);
      doc.addImage(art.emblem, fmt(art.emblem), CX - w/2, y, w, h);
      y += h + 4.5;
    }
    line(doc, ORG.toUpperCase(), {font:DISPLAY, style:'bold', size:12.4, spacing:0.42, align:'center', y:y});
    y += 5.2;
    line(doc, CHAPTER.toUpperCase(), {font:DISPLAY, style:'bold', size:10.4, spacing:0.95,
                                      colour:CRIMSON, align:'center', y:y});
    y += 4.6;
    line(doc, MOTTO, {style:'italic', size:8.6, colour:GREY, align:'center', y:y});
    y += 3.4;
    doc.setDrawColor.apply(doc, CRIMSON); doc.setLineWidth(0.5);
    doc.line(ML, y, PW - MR, y);
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(0.2);
    doc.line(ML, y + 0.9, PW - MR, y + 0.9);
    y += 9;

    /* subject */
    line(doc, 'SUBJECT', {size:7.4, spacing:1.15, colour:GOLD, align:'center', y:y});
    y += 6.6;
    var subj = spec.subject; if(typeof subj === 'string'){ subj = { en: subj }; }
    var sen = subj.en || '';
    line(doc, sen.toUpperCase(), {font:DISPLAY, style:'bold',
         size: sen.length > 26 ? 15 : 18, spacing:0.55, align:'center', y:y});
    [subj.el || subj.gr, subj.bg].filter(Boolean).forEach(function(t){
      y += 5.0; line(doc, t, {size:10.4, style:'italic', colour:GREY, align:'center', y:y});
    });
    y += 3.4;
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(0.3);
    doc.line(CX - 11, y, CX + 11, y);
    y += 6.4;

    /* the reference and the place and day of issue */
    doc.setDrawColor.apply(doc, RULE); doc.setLineWidth(0.15);
    doc.line(ML, y, PW - MR, y);
    y += 3.6;
    line(doc, String(spec.ref || '').toUpperCase(), {size:7.4, spacing:0.45, colour:GREY, x:ML, y:y});
    line(doc, ((spec.place || '') + (spec.date ? ' · ' + spec.date : '')).toUpperCase(),
         {size:7.4, spacing:0.45, colour:GREY, align:'right', y:y});
    y += 2.2;
    doc.line(ML, y, PW - MR, y);
    return y + 7;
  }

  /* The jsPDF namespace, for the form fields; the renderer asks for it only
     when a document actually carries one. */
  function ns(){
    var g = (typeof window !== 'undefined' && window.jspdf) ||
            (typeof globalThis !== 'undefined' && globalThis.jspdf);
    return g || null;
  }

  /* ---------- a table in the house style ---------- */
  function table(doc, t, y){
    var widths = {}, i;
    if(t.widths){
      for(i = 0; i < t.widths.length; i++){ widths[i] = { cellWidth: CW * t.widths[i] / 100 }; }
    }
    /* An office cell carries its Greek title beneath; room is reserved for
       it under the English line, and it is drawn once the cell is down. */
    var GR_SIZE = 7.2, GR_LEAD = 1.22;
    /* The column width is taken from the specification, because a cell does
       not know its own width until after the heights have been settled. */
    function greekLines(doc, cell, col){
      var raw = cell.raw;
      if(!raw || !raw._gr){ return null; }
      doc.setFont(SERIF, 'normal'); doc.setFontSize(GR_SIZE);
      var pad = (cell.styles.cellPadding.left || 0) + (cell.styles.cellPadding.right || 0);
      var w = cell.width || (t.widths ? CW * t.widths[col] / 100 : 40);
      return doc.splitTextToSize(raw._gr, Math.max(8, w - pad));
    }

    doc.autoTable({
      head: t.head ? [t.head] : undefined,
      body: t.rows,
      startY: y,
      margin: { left: ML, right: MR, bottom: MB + 4 },
      theme: 'grid',
      styles: {
        font: SERIF, fontStyle: 'normal', fontSize: 8.8, textColor: INK,
        lineColor: BORDER, lineWidth: 0.15, valign: 'top',
        cellPadding: { top: 1.7, right: 1.9, bottom: 1.7, left: 1.9 }
      },
      headStyles: {
        font: SERIF, fontStyle: 'bold', fontSize: 7.4, textColor: [255,255,255],
        fillColor: HEAD, lineColor: HEAD, cellPadding: { top: 1.9, right: 1.9, bottom: 1.9, left: 1.9 }
      },
      alternateRowStyles: { fillColor: ZEBRA },
      columnStyles: widths,
      didParseCell: function(data){
        if(data.section !== 'body'){ return; }
        var raw = data.cell.raw;
        if(raw && raw._gr){
          var n = greekLines(doc, data.cell, data.column.index), p = data.cell.styles.cellPadding;
          /* a fresh object: the padding is shared between cells */
          data.cell.styles.cellPadding = {
            top: p.top, right: p.right, left: p.left,
            bottom: p.bottom + (n ? n.length : 1) * mm(GR_SIZE) * GR_LEAD + 0.4
          };
        }
      },
      didDrawCell: function(data){
        if(data.section !== 'body'){ return; }
        var raw = data.cell.raw;
        /* a cell the brother fills in himself, once the document is in his hands */
        if(raw && raw._field){
          var N = ns();
          if(N && N.AcroFormTextField){
            /* A form field takes its appearance from the font in hand, and the
               letterhead faces carry no metrics it can use. Set one of the
               standard faces while the field is made, then put ours back. */
            var was = doc.getFont();
            doc.setFont('helvetica', 'normal');
            try{
              var f = new N.AcroFormTextField();
              var pad = 0.7;
              f.Rect = [data.cell.x + pad, data.cell.y + pad,
                        data.cell.width - pad*2, data.cell.height - pad*2];
              f.fieldName = raw._field;
              f.value = raw.content || '';
              f.fontSize = 8;
              doc.addField(f);
            }catch(e){ /* a reader without forms loses nothing but the field */ }
            doc.setFont(was.fontName, was.fontStyle);
          }
        }
        if(raw && raw._gr){
          var n = greekLines(doc, data.cell, data.column.index);
          var yy = data.cell.y + data.cell.height - data.cell.styles.cellPadding.bottom
                   + mm(GR_SIZE) * GR_LEAD;
          doc.setTextColor.apply(doc, GREY);
          for(var k = 0; k < n.length; k++){
            doc.text(n[k], data.cell.x + data.cell.styles.cellPadding.left, yy);
            yy += mm(GR_SIZE) * GR_LEAD;
          }
        }
      }
    });
    y = doc.lastAutoTable.finalY + 3;
    if(t.note){ y = paragraph(doc, t.note, y + 1.4, {size:8.2, style:'italic', colour:GREY, lead:1.3}) + 1; }
    return y;
  }

  /* ---------- graphics ----------
     Two forms only, and each is chosen by the job its numbers do.

     A count that is a headline in itself — fifteen offices, two vacant —
     is not a chart: it is set as a tile and read at a glance. A set of
     counts to be compared against one another is set as bars, laid
     horizontally so the labels read as words rather than as turned type.

     The two series colours were not chosen by eye. Crimson #9E1B1F with
     goldenrod #B8860B clear the colourblind separation (ΔE 20.0 deutan,
     20.3 tritan), the chroma floor and 3:1 against the paper. An empty
     seat is not a third colour: it is drawn hollow, which is what it is.
     Every bar carries its own number, so the reading never rests on
     colour alone. */
  var SERIES = [[158,27,31], [184,134,11]];
  var TRACK  = [237,234,227];

  /* A row of tiles: one number apiece, and what it counts beneath it. */
  function tiles(doc, list, y){
    var n = list.length, gap = 3.4;
    var w = (CW - gap * (n - 1)) / n, h = 19.5;
    if(y + h + 6 > PH - MB){ doc.addPage(); y = MT + 4; }
    for(var i = 0; i < n; i++){
      var x = ML + i * (w + gap), t = list[i];
      doc.setFillColor(252, 251, 248);
      doc.setDrawColor.apply(doc, BORDER); doc.setLineWidth(0.2);
      doc.rect(x, y, w, h, 'FD');
      /* a gold rule along the head of the tile */
      doc.setFillColor.apply(doc, GOLD);
      doc.rect(x, y, w, 0.8, 'F');
      var big = String(t.value);
      doc.setFont(DISPLAY, 'bold'); doc.setFontSize(19);
      doc.setTextColor.apply(doc, t.quiet ? GREY : INK);
      doc.text(big, x + w / 2 - doc.getTextWidth(big) / 2, y + 11.4);
      var cap = String(t.label).toUpperCase();
      /* measured in the face it is drawn in, not in the numeral's */
      doc.setFont(DISPLAY, 'bold'); doc.setFontSize(6.4);
      line(doc, cap, {font:DISPLAY, style:'bold', size:6.4, spacing:0.34, colour:GREY,
                      x: x + w / 2 - widthOf(doc, cap, 0.34) / 2, y: y + 16.2});
    }
    return y + h + 2;
  }

  /* Horizontal bars, one to a row, each carrying its own number. */
  function bars(doc, chart, y){
    var rows = chart.rows || [], labelW = chart.labelW || 52, valueW = 11;
    var rowH = 7.4, barH = 4.6, trackX = ML + labelW, trackW = CW - labelW - valueW;
    var max = 0, i;
    for(i = 0; i < rows.length; i++){
      if(!rows[i].spacer){ max = Math.max(max, rows[i].value); }
    }
    if(!max){ max = 1; }
    var need = rows.length * rowH + (chart.legend ? 7 : 0) + 6;
    if(y + need > PH - MB){ doc.addPage(); y = MT + 4; }

    var cy = y;
    for(i = 0; i < rows.length; i++){
      var r = rows[i];
      if(r.spacer){ cy += rowH * 0.45; continue; }
      line(doc, r.label, {size:8.6, colour:INK, x:ML, y:cy + barH - 0.6});
      if(r.el){ line(doc, r.el, {size:6.8, style:'italic', colour:GREY, x:ML, y:cy + barH + 2.6}); }
      doc.setFillColor.apply(doc, TRACK);
      doc.roundedRect(trackX, cy, trackW, barH, 1.2, 1.2, 'F');
      var w = trackW * (r.value / max);
      if(w > 0.1){
        doc.setFillColor.apply(doc, SERIES[(r.series || 0) % SERIES.length]);
        doc.roundedRect(trackX, cy, Math.max(w, 2.4), barH, 1.2, 1.2, 'F');
      }
      var v = String(r.value);
      doc.setFont(DISPLAY, 'bold'); doc.setFontSize(9);
      doc.setTextColor.apply(doc, INK);
      doc.text(v, PW - MR - doc.getTextWidth(v), cy + barH - 0.6);
      cy += rowH;
    }
    y = cy + 1.4;

    if(chart.legend){
      y += 1.2;
      var lx = trackX;
      for(i = 0; i < chart.legend.length; i++){
        var g = chart.legend[i];
        if(g.hollow){
          doc.setFillColor.apply(doc, TRACK);
          doc.setDrawColor.apply(doc, BORDER); doc.setLineWidth(0.2);
          doc.roundedRect(lx, y - 2.4, 4.4, 3, 0.7, 0.7, 'FD');
        } else {
          doc.setFillColor.apply(doc, SERIES[i % SERIES.length]);
          doc.roundedRect(lx, y - 2.4, 4.4, 3, 0.7, 0.7, 'F');
        }
        line(doc, g.label, {size:7.4, colour:GREY, x:lx + 6, y:y});
        lx += 6 + doc.getTextWidth(g.label) + 8;
      }
      y += 3;
    }
    return y + 1.6;
  }

  /* One bar carrying the whole of something, divided into its parts.
     A hollow tail is what is not yet filled. */
  function split(doc, chart, y){
    var h = 7, total = 0, i;
    for(i = 0; i < chart.parts.length; i++){ total += chart.parts[i].value; }
    total += (chart.empty || 0);
    if(!total){ return y; }
    if(y + h + 12 > PH - MB){ doc.addPage(); y = MT + 4; }

    var x = ML, gap = 0.7;
    doc.setFillColor.apply(doc, TRACK);
    doc.roundedRect(ML, y, CW, h, 1.6, 1.6, 'F');
    for(i = 0; i < chart.parts.length; i++){
      var p = chart.parts[i], w = CW * (p.value / total) - (i ? gap : 0);
      doc.setFillColor.apply(doc, SERIES[i % SERIES.length]);
      doc.roundedRect(x + (i ? gap : 0), y, Math.max(w, 3), h, 1.6, 1.6, 'F');
      var t = p.label + '  ' + p.value;
      doc.setFont(DISPLAY, 'bold'); doc.setFontSize(7.6);
      doc.setTextColor(255, 255, 255);
      if(w > doc.getTextWidth(t) + 6){
        doc.text(t, x + (i ? gap : 0) + 3.2, y + h / 2 + 1.4);
      }
      x += CW * (p.value / total);
    }
    if(chart.empty){
      doc.setDrawColor.apply(doc, BORDER); doc.setLineWidth(0.25);
      doc.roundedRect(x + gap, y, Math.max(CW * (chart.empty / total) - gap, 3), h, 1.6, 1.6, 'S');
    }
    y += h + 3.6;
    if(chart.note){ y = paragraph(doc, chart.note, y, {size:8, style:'italic', colour:GREY}); }
    return y + 1;
  }

  /* ---------- the foot: a signature to each side of the seal ---------- */
  function foot(doc, spec, art, y){
    var COL = 56, SEAL = 34, capH = 3.2;
    var head = 5.6, rule = 15, name = 4.6, road = 3.6, role = 3.6;
    var height = head + rule + name + road + role + 4;
    if(y + height + 8 > PH - MB){ doc.addPage(); y = MT + 4; }

    var base = y + head + rule;                        /* the signing rule */
    function column(sig, x){
      if(!sig){ return; }
      var cx = x + COL / 2;
      doc.setFont(DISPLAY, 'bold'); doc.setFontSize(9.6);
      var t = String(sig.title || '').toUpperCase();
      doc.setTextColor.apply(doc, INK);
      doc.text(t, cx - widthOf(doc, t, 0.5) / 2, y + head, { charSpace: 0.5 });
      /* the hand of the signatory, set upon the rule as it would be
         signed; the rule is drawn after it, so it runs whole beneath the
         hand as it does on paper */
      if(sig.autograph && art && art.autograph){
        var aw = COL * 0.9, ah = aw * (art.autographH / art.autographW || 0.2);
        doc.addImage(art.autograph, fmt(art.autograph), cx - aw/2, base - ah + 2.6, aw, ah);
      }
      doc.setDrawColor.apply(doc, INK); doc.setLineWidth(0.25);
      doc.line(x, base, x + COL, base);
      var yy = base + name;
      line(doc, sig.name || '', {style:'bold', size:9.6, x:cx - doc.getTextWidth(sig.name || '')/2, y:yy});
      if(sig.road){
        yy += road;
        line(doc, '«' + String(sig.road).toUpperCase() + '»',
             {size:7.8, spacing:0.35, colour:CRIMSON,
              x:cx - widthOf(doc, '«' + String(sig.road).toUpperCase() + '»', 0.35)/2, y:yy});
      }
      if(sig.role){
        yy += role;
        line(doc, sig.role, {size:7.2, spacing:0.2, colour:GREY,
             x:cx - widthOf(doc, sig.role, 0.2)/2, y:yy});
      }
    }

    if(spec.seal !== false && art && art.seal){
      /* the seal sits clear of its caption: art cut edge to edge would
         otherwise run into the words beneath it */
      doc.addImage(art.seal, fmt(art.seal), CX - SEAL/2, base - SEAL - 1, SEAL, SEAL);
      line(doc, 'OFFICIAL SEAL OF CHAPTER HELLAS',
           {size:6.2, spacing:0.4, colour:FAINT, align:'center', y:base + capH});
    }
    var pair = spec.signatures;
    column(pair ? pair.left : null, ML);
    column(pair ? pair.right : (spec.signature || null), PW - MR - COL);
    return base + name + road + role;
  }

  /* ---------- the running foot of every page ---------- */
  function pageFeet(doc, spec){
    var n = doc.internal.getNumberOfPages();
    for(var p = 1; p <= n; p++){
      doc.setPage(p);
      var sj = spec.subject, sname = (typeof sj === 'string') ? sj : (sj && sj.en) || '';
      var t = (ORG + ' — ' + CHAPTER + (sname ? ' · ' + sname : '')).toUpperCase();
      line(doc, t, {size:6.4, spacing:0.42, colour:FAINT, align:'center', y:PH - 9});
      line(doc, p + ' / ' + n, {size:6.4, spacing:0.3, colour:FAINT, align:'center', y:PH - 6});
    }
  }

  /* Does the document carry a cell the reader is meant to fill? Compressed
     content streams and form annotations do not agree in jsPDF — the fields
     survive the file but no reader finds them — so a document with fields is
     written uncompressed. */
  function carriesFields(spec){
    return (spec.sections || []).some(function(s){
      return s.table && (s.table.rows || []).some(function(r){
        return r.some(function(c){ return c && c._field; });
      });
    });
  }

  /* ---------- draw the whole document ---------- */
  function build(jsPDFCtor, spec, art, fonts){
    /* The documents are issued open: no password is set upon them, and a
       brother opens one in any reader without being asked for anything. */
    var doc = new jsPDFCtor({
      unit: 'mm', format: 'a4', compress: !carriesFields(spec)
    });
    fonts.register(doc);
    /* The subject of a document is a pair of tongues, not a string; the
       properties of the file take the English of it. (While the documents
       were encrypted this passed unnoticed — that path never escaped the
       value — and it threw the moment the password was taken off.) */
    var sj = spec.subject, sname = (typeof sj === 'string') ? sj : ((sj && sj.en) || 'Document');
    doc.setProperties({
      title: CHAPTER + ' — ' + sname,
      subject: sname, author: ORG + ' — ' + CHAPTER,
      creator: ORG + ' — ' + CHAPTER
    });

    var y = letterhead(doc, spec, art), i, j;

    (spec.lead || []).forEach(function(p){ y = block(doc, p, y, {size:10.6}) + 1.8; });

    (spec.sections || []).forEach(function(s){
      if(y + 30 > PH - MB){ doc.addPage(); y = MT + 4; }
      y += 3.4;
      y = heading(doc, s.title || '', y);
      y += 1.9;
      doc.setDrawColor.apply(doc, RULE); doc.setLineWidth(0.15);
      doc.line(ML, y, PW - MR, y);
      y += 4.4;
      if(s.image){ y = plate(doc, s, art, y); }
      if(s.tiles){ y = tiles(doc, s.tiles, y); }
      if(s.split){ y = split(doc, s.split, y); }
      if(s.bars){  y = bars(doc, s.bars, y); }
      if(s.table){ y = table(doc, s.table, y); }
      (s.paragraphs || []).forEach(function(p){ y = block(doc, p, y, {}) + 1.6; });
    });

    if(spec.closing && spec.closing.length){
      y += 3;
      spec.closing.forEach(function(p){ y = block(doc, p, y, {size:10.4}) + 1.6; });
    }

    y += 4;
    if(spec.place || spec.date){
      if(y + 8 > PH - MB){ doc.addPage(); y = MT + 4; }
      line(doc, (spec.place || '') + (spec.date ? ', ' + spec.date : ''),
           {size:10, align:'right', y:y});
      y += 6;
    }
    foot(doc, spec, art, y + 4);
    pageFeet(doc, spec);
    return doc;
  }

  root.WSPdf = { build: build, ORG: ORG, CHAPTER: CHAPTER };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
