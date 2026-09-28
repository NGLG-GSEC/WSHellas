/* =====================================================================
   Widows Sons MRA — Hellas Chapter
   WSRanks — THE list of office ranks. There is no other.

   Every drop-down of office rank in the Chapter's apps reads this file,
   and only this file:
     - the Register of Members and Officers (secretary.html, ws-register.js)
     - the vest configurator, https://dskiad.github.io/wsvest/ , which loads
       this script from https://nglg-gsec.github.io/WSHellas/assets/ws-ranks.js
     - any form added later.
   Add, rename or remove a rank HERE and every list follows on its next
   load. The offices are those of Article V, in the order of Section 04 of
   index.html; the main page checks itself against this list on every load
   and says so in the console if the two ever part.

   It is a script, not a JSON file, on purpose: a script may be loaded from
   another site without asking, so the configurator can read it too.
   ===================================================================== */
(function(){
  var RANKS = [
    { en:"President", el:"Πρόεδρος", kind:'office' },
    { en:"Vice President", el:"Αντιπρόεδρος", kind:'office' },
    { en:"Secretary", el:"Γραμματέας", kind:'office' },
    { en:"Treasurer", el:"Ταμίας", kind:'office' },
    { en:"Sergeant-at-Arms", el:"Υπεύθυνος Τάξης", kind:'office' },
    { en:"Road Captain", el:"Αρχηγός Αποστολής", kind:'office' },
    { en:"Road Sergeant", el:"Ομαδάρχης", kind:'office' },
    { en:"Warden", el:"Έφορος Μελών & Συμμόρφωσης", kind:'office' },
    { en:"Orator", el:"Σύμβουλος", kind:'office' },
    { en:"Ambassador", el:"Εκπρόσωπος προς άλλα Motorcycle Clubs", kind:'office' },
    { en:"Almoner", el:"Ελεονόμος Αγαθοεργίας", kind:'office' },
    { en:"Quartermaster", el:"Επιμελητής", kind:'office' },
    { en:"Master of Ceremonies", el:"Τελετάρχης", kind:'office' },
    { en:"Preparing Brother", el:"Δοκιμαστής", kind:'office' },
    { en:"Event Manager", el:"Υπεύθυνος Εκδηλώσεων", kind:'office' },
    { en:"Grand Master", el:"Μέγας Διδάσκαλος", kind:'standing', note:'Most Honorary standing, not an office' },
    { en:"Member",       el:"Μέλος",            kind:'standing', note:'a brother who holds no office' }
  ];
  var seen = {};
  RANKS = RANKS.filter(function(r){ var k = r.en.toLowerCase(); if(seen[k]) return false; seen[k] = 1; return true; });  // unique, always
  window.WSRanks = {
    all:       function(){ return RANKS.slice(); },
    names:     function(){ return RANKS.map(function(r){ return r.en; }); },
    offices:   function(){ return RANKS.filter(function(r){ return r.kind === 'office'; }).map(function(r){ return r.en; }); },
    standings: function(){ return RANKS.filter(function(r){ return r.kind === 'standing'; }).map(function(r){ return r.en; }); },
    greek:     function(en){ var r = RANKS.filter(function(r){ return r.en === en; })[0]; return r ? r.el : ''; },
    updated:   '2026-09-28'
  };
})();
