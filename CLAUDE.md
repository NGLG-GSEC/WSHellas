# Widows Sons MRA — Chapter Hellas

The public website of the Chapter, served by GitHub Pages.

**Live site: https://nglg-gsec.github.io/WSHellas/**

## Always end a reply with the live link

Every answer finishes with the live page link, on its own line:

```
🌐 Live: https://nglg-gsec.github.io/WSHellas/
```

When the work touched another page, give that page's link too —
`/secretary.html`, `/officers.html`.

## The pages

| File | What it is |
| --- | --- |
| `index.html` | The main site: organization, dress code, administration, emblem, constitution, by-laws. Self-contained but for `assets/`. |
| `officers.html` | The fifteen officers, their titles and duties. |
| `secretary.html` | The document office: the founding documents and the documents of the Secretariat. |

## The document office

The Chapter issues its documents from the page itself. Three files carry it:

| File | What it holds |
| --- | --- |
| `assets/ws-docs.js` | **The register.** Every document is a function returning its specification. Add a document here and it inherits the letterhead, the tables, the sealed foot and the code. |
| `assets/ws-pdf.js` | **The renderer.** Draws a specification on A4 — letterhead, subject block, tables, the foot. Knows nothing of any particular document. |
| `assets/ws-office.js` | **The office.** Issues a specification as a sealed PDF or as a Word file, and holds the security code. |

jsPDF, the plugin and the letterhead faces live in `assets/vendor/` and are
fetched only when a document is called for.

### How documents are signed

- **Founding documents** — signed by the Founding President alone.
- **Everything issued thereafter** — the seal at the centre of the foot, the
  Secretary on the left, the President on the right.

Both are declared once in `ws-docs.js` as `FOUNDING` and `EXECUTED`.

### Graphics in a document

`ws-pdf.js` draws two forms, and a section chooses one by the job its numbers
do. `tiles` is a row of headline counts — a number that is the answer in itself
is not a chart. `bars` compares counts against one another, laid horizontally so
the labels read as words; `split` is one bar carrying a whole, its unfilled part
drawn hollow rather than in a third colour. Every bar carries its own number, so
no reading rests on colour alone, and a `{spacer:true}` row parts one reading
from the next.

The two series colours are crimson `#9E1B1F` and goldenrod `#B8860B`. They were
not chosen by eye: they clear colourblind separation (ΔE 20.0 deutan, 20.3
tritan), the chroma floor and 3:1 against the paper. Do not substitute the
Chapter's softer gold `#AD8A4E` — it fails the chroma floor and reads grey.

**Table widths are hundredths of the measure and must sum to 100**, not
millimetres; a set that sums past 100 runs off the right margin.

### Other rules of the documents

- Founding documents are set in English first, then Greek and Bulgarian. Words
  proper to the brotherhood are left as they stand: Widows Sons, Chapter, MRA,
  patch, and the office names used as titles.
- **No document carries a password.** Neither the PDF nor the Word export is
  encrypted; a brother opens either in any reader without being asked for
  anything. What makes a file the Chapter's is the letterhead, the seal and the
  hands at its foot — not a lock. (The code on the Secretary's page is a
  separate thing: it guards the door to the office, not the documents that come
  out of it.)
- `spec.subject` is a pair of tongues, not a string, so anything handing it to
  jsPDF must take its `.en` — the file properties do. While the documents were
  encrypted this went unnoticed, because that path never escaped the value; it
  threw the moment the password came off.
- **The edition stamp.** `EDITION` in `assets/ws-office.js` is appended to every
  part the office fetches, and the same stamp is written on the scripts and the
  art in `secretary.html`. Raise it in both places whenever a document, the
  register or the renderer changes — otherwise a brother who has opened the
  office before is served a cached renderer and gets a document drawn by the old
  rules (this is how the President's hand went missing from every document while
  the code that draws it was already live).
- The letterhead uses `assets/chapter-hellas-letterhead-emblem.png` (background
  cut away) and `assets/chapter-hellas-official-seal.png`. Both are read off the
  page by id — `#wsLetterhead` and `#wsSeal` — so a page that issues documents
  must carry them.

## The vest

Section 02 sets out the dress of the Chapter — the front read side by side
(the brother on the left, the Association and the Chapter on the right), the
back read as its three pieces, and the configurator at
`https://dskiad.github.io/wsvest/`, which draws a vest and hands it back as an
image: the front, the back, or both together. That configurator lives in its
own repository, `dskiad/wsvest`, not this one.

The sections of `index.html` are numbered in one run — the eyebrow and the
`.section-prefix` of each. Insert a section and every later number moves with
it, in the page and wherever the register refers to one. **It moves in
`assets/ws-lang.js` too**: the number is part of the English key *and* part of
the Greek and Spanish text, so a renumbering must re-key those entries and bump
the number inside each translation, or the moved sections quietly revert to
English.

## The officers' vests

Section 04 and `officers.html` both show each duty written on the back of a
real vest — `assets/officers-vest-bg.jpg`, an actual photograph, laid in as an
`<img>` behind the text, not a shape drawn in CSS.

**All of its geometry lives in `assets/officer-vest-background.css`** — the
height, the insets, the width and size of the duty block. That file is linked
after each page's own `<style>`, so it is the one authority; the
`officer-vest-sizing-2026` blocks in the two pages are deliberately empty and
must stay that way. They once held a second, conflicting set of numbers, and
the pages were drawn by whichever rule happened to come last.

The photograph is 420 × 525, so its own proportion is h = 1.25 w, and it is
laid in with `object-fit:fill` — it takes the shape of its box. Section 04
lays the offices out in three grids of quite different width (440px for the
leadership row, 260px for the four principal officers, 356px for the nine
others), so **each grid is given a height of its own**. One height across all
three stretched the same vest by 14% on the widest card and by 85% on the
narrowest, and the narrow ones read as ribbons rather than garments.

A card carries a fixed height, so **the longest duty must be measured into
it** — the Secretary's is the longest in the Chapter, and 600px used to cut
the last three lines off it under `overflow:hidden`, silently. Change a duty,
a font or a column count and re-measure `scrollHeight - clientHeight` on every
shell, **in all three tongues**: Greek and Spanish run longer than the English
the height was set for.

### The Charges button

The duty is no longer read on the back of the vest. `assets/ws-charges.js`,
loaded by both pages, hides the duty (and the yoke above it) and puts a
round **CHARGES** button in its place; the button opens the duty in a full
reading panel with a close × at its top right (Esc and a click outside also
close it). The duty stays in the page, hidden, so `ws-lang.js` still
translates it in place and the panel copies it the moment it opens — it is
always read in the tongue the page is in. The button's own label is set in
the script, in all three tongues, on every `ws:lang` event.

The overlay must carry `[hidden]{display:none}` of its own: its `display:flex`
otherwise outranks the `hidden` attribute and an invisible panel sits over the
whole page, swallowing every click.

### The Letter of the Officers

Under the officers of Section 04 a button, **Letter of the Officers**, issues a
formal letter as a sealed, signed PDF: every office of Article V with the real
name of the brother who holds it and his road name. It is Secretariat document
no. 5 in `ws-docs.js` (`officersLetter`), drawn from the same `OFFICERS` array,
so a name or road name entered there reaches the letter; a road name not yet
entered reads *to be advised*. It is dated the day it is issued and saved as
`Hellas-Chapter-Letter-of-the-Officers-DDMMYY-v1.pdf` (`spec.file`). The main
page loads `ws-office.js` and `ws-docs.js` only when the button is pressed, and
carries `#wsAutograph` for the President's hand.

## The pin

Section 03 shows the extra regalia in one part, **03.1 — The Pin**, as two
cards: **the pin** (the helmet roundel on a gold triangle between gold
wings), worn upon the vest or in a Masonic Lodge where the Lodge accepts it;
and **the token** (the struck coin in its leather case), exchanged as a gift
between Widows Sons brothers. The former pair — the braided silver and the
plain gold edge — was struck out at the Chapter's word; its files remain in
`assets/`.

**The section shows and does not explain**: each card is an image, its name
and one line, nothing more. Both pictures sit in the same fixed box
(380px, 280px on a phone) so the cards level; the pin is laid in with
`contain` on black, since its wings reach the edge of its frame, the token
with `cover`.

The technical part (Part 03.2 — how it is made: the specification list and
the maker's sheet) was struck out at the Chapter's word. The sheets remain in
`assets/`: `pin-spec-sheet.jpg` is drawn for the braided border (50 × 32 mm,
2.5–3.0 mm, N52 magnet) and `pin-spec-sheet-2.jpg` disagrees with it (29 mm
tall, 4.5 mm thick, magnet Ø10 × 3 mm). Settle which governs before anything
is struck.

## The visitors' memo

Section 08 is the Chapter's register of its meetings with Widows Sons abroad.
It is a register, not an essay: one card per item, **numbered in a single run
across the whole section** and carrying one sentence, so the Chapter can correct
an entry by its number. The cards are grouped by country, each group under a
flag; `li.tok` holds a token cut to its disc, `li.pic` a photograph in its
frame. Insert an item and every later number moves — in the page, in the
`Nos. N onward` line of the awaited note, **and in `assets/ws-lang.js`**, where
each caption is keyed by its English.

A country from which nothing has yet arrived is named all the same, under
`p.awaited`, rather than left out.

**Part 08.2 holds the letters** — what other Chapters have written to Hellas.
Each is a card: the sender under its flag, one line saying what the letter is,
and the letter itself behind a `<details>` button, since a letter runs far
longer than the one sentence a memo card is allowed. Each card also shows the
document itself. Cartagena's letter carries a link to the file as it arrived
(`assets/letter-cartagena-2026.docx`); Honduras sent a certificate, so that
card says plainly that the patches lying on it cover part of the written text,
which is therefore not transcribed.

A letter is a tall portrait, so `.letter-shot img` is given a **fixed box with
`object-fit:contain`**, not `width:auto` with a `max-height`. The box must have
a size of its own: an image that has not loaded yet is 0 × 0 under `width:auto`,
and a `loading="lazy"` image with no area is never judged to be in view, so it
never loads at all. That is a silent failure — the picture is simply absent.

When counting broken images in this section, **take `loading` off and await
every `load` event** rather than scrolling and waiting. A scroll sweep races
the lazy loader and reports images broken that are merely still in flight;
that false alarm cost a round here.

**A letter is a quotation, not the site's prose, so it is never translated.**
It stays in the tongue it was written in whatever tongue the page is read in —
the same rule that leaves the brethren's names and the motto as they stand.
Only the frame around it is entered in `assets/ws-lang.js`: the heading, the
one-line summary, the button, the caption, the link. Where the original is
Spanish, the Spanish is quoted and an English rendering set beside it. A field the Chapter cannot yet fill reads
*to be entered by the Secretary* rather than being invented; the site's own
idiom for a blank, as with a vacant office.

Coin photographs are cut by **fitting a circle**, not by flood-fill: the disc is
found from its texture (a struck coin is busy, a desk is smooth), the largest
textured body taken, and the circle drawn from its bounding box. Colour keys and
percentile radii were both tried first and both failed — the one leaked into the
lit desk, the other overshot on scattered warm pixels.

## The three tongues

The page is written in English. `assets/ws-lang.js` carries the same page in
Greek and in Spanish and puts a row of three flags at the head of every section
and in the bar; the reader's choice is kept in `localStorage`.

It translates by **block**, not by word: it walks for the innermost block that
holds text — a paragraph, a heading, an item of a list — and uses that block's
own markup as the key, so a sentence keeps its bold and its italics and each
tongue may order its words as it orders them. A block whose key is not in the
register stays English. That is deliberate for the names of the brethren, for
the offices in their English–Greek pair, and for the words proper to the
brotherhood — Widows Sons, Chapter, MRA, and the motto as it is embroidered.

**So: change a line of English on the page and its Greek and Spanish must be
changed here under the new wording, or that line quietly reverts to English.**

**Rebuild the file by re-splitting the live one**, never from a saved copy of
its head and tail. A snapshot taken once and reused silently undid every
hand-edit made to the file in between — a menu breakpoint sat three commits
wrong that way before a width sweep caught it.

The bar's own rule: `nav.links` carries **no `min-width:0`**. With it the box
shrank while the links spilled out of it and ran under the flags — overlap that
no overflow check can see. Without it, anything that no longer fits shows up as
real page overflow, which the sweep catches.
`officers.html` and `secretary.html` are not yet translated; the file is written
to be loaded by any page that wants it.

## Working on this repository

- Develop and push on `claude/repo-push-vfylka`. A push deploys the site
  through `.github/workflows/pages.yml`.
- Uploaded artwork often arrives with its transparency painted into the pixels
  as a grey checkerboard. Cut it out before committing — a colour key alone
  punches holes in silver lettering; flood-fill from the borders instead.
- After changing a document, build it and check it before pushing: that it
  opens with no password and carries no `/Encrypt`, that the Greek and Bulgarian
  text survive into the file, and that the Application keeps its 39 fillable
  cells.
