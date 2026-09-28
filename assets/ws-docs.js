/* =====================================================================
   Widows Sons MRA — Chapter Hellas
   WSDocs — the register of the documents the Chapter issues.

   Each document is a function returning its specification; WSDoc draws
   it, so every one of them carries the same letterhead, the same seal
   and the same signatures.

   The founding documents are set in three languages — English first,
   then Greek and Bulgarian. Words proper to the brotherhood are left as
   they stand: Widows Sons, Chapter, MRA, patch, and the names of the
   offices where they are used as titles.
   ===================================================================== */
var WSDocs = (function(){

  var PLACE = 'Piraeus, Greece';
  var DATE  = '1 September 2026';

  /* How the Chapter executes its documents.
     FOUNDING — the founding documents are signed by the Founding
     President, already a Widows Son at the foundation.
     EXECUTED — every document of the Secretariat bears, at its foot, the
     seal in the centre, the Secretary on the left, the President on the
     right. */
  var FOUNDING = {
    title:'The Founding President', name:'Dimitrios Skiadopoulos', road:'Build Smith',
    role:'Ιδρυτικός Πρόεδρος & Οικιστής · Chapter Hellas', autograph:true
  };
  var EXECUTED = {
    left:  { title:'The Secretary', name:'Nikolaos Markopoulos',
             role:'Γραμματέας · Chapter Hellas' },
    right: { title:'The President', name:'Dimitrios Skiadopoulos', road:'Build Smith',
             role:'Πρόεδρος · Chapter Hellas', autograph:true }
  };

  /* --- cells in the house style --- */
  function office(en, el, bg){
    var under = [el, bg].filter(Boolean).join('\n');
    return { content:en, _gr:under, styles:{ font:'WSCinzel', fontStyle:'bold', fontSize:8.8 } };
  }
  /* A cell whose text is repeated beneath in another language. */
  function second(en, other, size){
    return { content:en, _gr:other, styles:{ fontSize: size || 8.8 } };
  }
  function person(n){
    return n ? { content:n, styles:{ fontStyle:'bold' } }
             : { content:'To be appointed', styles:{ fontStyle:'italic', textColor:[139,143,150] } };
  }
  function road(r){
    return r ? { content:String(r).toUpperCase(), styles:{ textColor:[158,27,31], fontSize:8.2 } }
             : { content:'to be advised', styles:{ fontStyle:'italic', textColor:[139,143,150] } };
  }
  function term(t){ return { content:t, styles:{ fontSize:7.9, textColor:[60,64,70] } }; }
  function blank(){ return { content:'……………………………………', styles:{ textColor:[139,143,150] } }; }
  /* a cell left open, to be filled in the reader once the document is issued */
  function field(name, value){
    return { content:value || '', _field:name, styles:{ fontSize:8.4, fillColor:[252,251,248] } };
  }
  /* the obedience under which the brethren hold their Lodges */
  var OBEDIENCE = 'NGLG - est. 1986';

  function base(no, subject, sections, opts){
    opts = opts || {};
    return {
      subject: subject,
      ref: 'Ref. CH-FD-' + (no < 10 ? '0' + no : no) + '/2026',
      place: PLACE, date: DATE,
      lead: opts.lead || [],
      sections: sections,
      closing: opts.closing || [],
      signature: FOUNDING,
      seal: true
    };
  }

  /* =================================================================
     1 — The Official Emblem
     ================================================================= */
  function emblem(){
    return base(1, {en:'The Official Emblem', el:'Το Επίσημο Έμβλημα'}, [
      { title:{en:'I. The Emblem Adopted', el:'Το υιοθετούμενο έμβλημα'},
        image:'emblem', width:96, caption:'The official emblem of Widows Sons MRA — Chapter Hellas',
        paragraphs:[
          {en:'The emblem set out above is adopted as the one and only official emblem of Chapter Hellas, and is the emblem worn upon the colours of the Chapter and borne upon its documents.',
           el:'Το ανωτέρω έμβλημα υιοθετείται ως το ένα και μοναδικό επίσημο έμβλημα του Chapter Hellas· είναι το έμβλημα που φέρεται επί των χρωμάτων του Chapter και επί των εγγράφων του.'}
        ] },
      { title:{en:'II. Composition', el:'Σύνθεση'},
        paragraphs:[
          {en:'The emblem is composed of three parts. The top rocker bears the words WIDOWS SONS. The central oval bears the name Widows Sons in red script above the winged square and compasses, within which stands the all-seeing eye, and beneath them the motto: Meet on the Level & Part upon the Square. The bottom rocker bears the words HELLAS CHAPTER.',
           el:'Το έμβλημα συντίθεται από τρία μέρη. Το άνω τόξο φέρει τις λέξεις WIDOWS SONS. Το κεντρικό οβάλ φέρει το όνομα Widows Sons με κόκκινη γραφή, άνωθεν του φτερωτού γνώμονα και διαβήτη, εντός των οποίων ίσταται ο πανεπόπτης οφθαλμός, και κάτωθεν αυτών το ρητό: Meet on the Level & Part upon the Square. Το κάτω τόξο φέρει τις λέξεις HELLAS CHAPTER.'},
          {en:'No element of the emblem may be altered, omitted or added to, nor may its colours be changed.',
           el:'Ουδέν στοιχείο του εμβλήματος επιτρέπεται να μεταβληθεί, να παραλειφθεί ή να προστεθεί, ούτε να αλλοιωθούν τα χρώματά του.'}
        ] },
      { title:{en:'III. Ownership, Use and Custody', el:'Κυριότητα, χρήση και φύλαξη'},
        paragraphs:[
          {en:'The emblem, the name and the insignia of Widows Sons belong exclusively to Widows Sons MRA. The Chapter and its members hold them only for so long as they remain in good standing, and every patch is returned to the Chapter upon a brother’s departure.',
           el:'Το έμβλημα, το όνομα και τα διακριτικά των Widows Sons ανήκουν αποκλειστικά στη Widows Sons MRA. Το Chapter και τα μέλη του τα κατέχουν μόνο για όσο διατηρούν την καλή τους κατάσταση, και κάθε patch επιστρέφεται στο Chapter κατά την αποχώρηση του αδελφού.'},
          {en:'The emblem is worn only by members in good standing and only upon the approved vest. It may not be reproduced, published or given to any third party save by leave of the President. The Quartermaster keeps the record of every patch issued and returned.',
           el:'Το έμβλημα φέρεται μόνον από μέλη σε καλή κατάσταση και μόνον επί του εγκεκριμένου γιλέκου. Δεν αναπαράγεται, δεν δημοσιεύεται και δεν παραχωρείται σε τρίτους παρά μόνο με άδεια του Προέδρου. Ο Επιμελητής τηρεί το αρχείο κάθε patch που χορηγείται και επιστρέφεται.'}
        ] }
    ], {
      lead:[{en:'By this founding act the Chapter establishes the emblem under which it rides and by which it is known, and declares the manner in which it shall be worn, kept and protected.',
             el:'Με την παρούσα ιδρυτική πράξη το Chapter καθιερώνει το έμβλημα υπό το οποίο ιππεύει και διά του οποίου αναγνωρίζεται, και ορίζει τον τρόπο με τον οποίο φέρεται, φυλάσσεται και προστατεύεται.'}],
      closing:[{en:'Adopted at the foundation of the Chapter and entered in its records.',
                el:'Υιοθετήθηκε κατά την ίδρυση του Chapter και καταχωρήθηκε στα αρχεία του.'}]
    });
  }

  /* =================================================================
     2 — The Official Seal
     ================================================================= */
  function seal(){
    return base(2, {en:'The Official Seal', el:'Η Επίσημη Σφραγίδα'}, [
      { title:{en:'I. The Seal Adopted', el:'Η υιοθετούμενη σφραγίδα'},
        image:'seal', width:62, caption:'The official seal of Chapter Hellas',
        paragraphs:[
          {en:'The seal set out above is adopted as the official seal of Chapter Hellas. It is the only seal by which the Chapter authenticates its acts.',
           el:'Η ανωτέρω σφραγίδα υιοθετείται ως η επίσημη σφραγίδα του Chapter Hellas. Είναι η μόνη σφραγίδα διά της οποίας το Chapter πιστοποιεί τις πράξεις του.'}
        ] },
      { title:{en:'II. Composition', el:'Σύνθεση'},
        paragraphs:[
          {en:'The seal is circular. About its upper edge stand the words WIDOWS SONS and about its lower edge the words MASONIC RIDERS ASSOCIATION. Across its face stand the words CHAPTER HELLAS. At its centre is set a Corinthian helmet, flanked by two wheels, and above the helmet the year of foundation, EST. 2026.',
           el:'Η σφραγίδα είναι κυκλική. Περί την άνω περιφέρειά της φέρονται οι λέξεις WIDOWS SONS και περί την κάτω οι λέξεις MASONIC RIDERS ASSOCIATION. Επί της όψεώς της φέρονται οι λέξεις CHAPTER HELLAS. Στο κέντρο τίθεται κορινθιακό κράνος, εκατέρωθεν του οποίου δύο τροχοί, και άνωθεν του κράνους το έτος ιδρύσεως, EST. 2026.'}
        ] },
      { title:{en:'III. Custody and Manner of Use', el:'Φύλαξη και τρόπος χρήσης'},
        paragraphs:[
          {en:'The Secretary is custodian of the seal and answers for it to the Chapter. It is kept in the custody of no other officer, and is never given out of his hands.',
           el:'Ο Γραμματέας είναι ο θεματοφύλακας της σφραγίδας και λογοδοτεί γι’ αυτήν στο Chapter. Δεν φυλάσσεται από άλλον αξιωματικό και ουδέποτε παραδίδεται εκτός των χειρών του.'},
          {en:'The seal is affixed at the centre of the foot of every official document of the Chapter. Upon the founding documents it stands above the signature of the Founding President. Upon every document issued thereafter it stands between the signature of the Secretary on the left and the signature of the President on the right.',
           el:'Η σφραγίδα τίθεται στο κέντρο του τέλους κάθε επίσημου εγγράφου του Chapter. Επί των ιδρυτικών εγγράφων ίσταται μετά της υπογραφής του Ιδρυτικού Προέδρου. Επί κάθε εγγράφου που εκδίδεται εφεξής ίσταται μεταξύ της υπογραφής του Γραμματέως αριστερά και της υπογραφής του Προέδρου δεξιά.'}
        ] }
    ], {
      lead:[{en:'By this founding act the Chapter establishes the seal by which its documents are authenticated, and appoints its custodian and the manner of its use.',
             el:'Με την παρούσα ιδρυτική πράξη το Chapter καθιερώνει τη σφραγίδα διά της οποίας πιστοποιούνται τα έγγραφά του και ορίζει τον θεματοφύλακα και τον τρόπο χρήσεώς της.'}],
      closing:[{en:'Adopted at the foundation of the Chapter and entered in its records.',
                el:'Υιοθετήθηκε κατά την ίδρυση του Chapter και καταχωρήθηκε στα αρχεία του.'}]
    });
  }

  /* =================================================================
     3 — Charter
     ================================================================= */
  function charter(){
    return base(3, {en:'Charter', el:'Καταστατικός Χάρτης'}, [
      { title:{en:'Article I — Name and Seat', el:'Άρθρο Α΄ — Επωνυμία και έδρα'},
        paragraphs:[
          {en:'The Chapter is named Widows Sons Masonic Riders Association — Chapter Hellas. Its seat is at the Masonic Hall of Piraeus, 24 Konstantinoupoleos Street, Piraeus 185 40, Greece, and its field is the whole of the Hellenic territory.',
           el:'Το Chapter φέρει την επωνυμία Widows Sons Masonic Riders Association — Chapter Hellas. Έδρα του είναι το Τεκτονικό Μέγαρο Πειραιώς, Κωνσταντινουπόλεως 24, Πειραιάς, Τ.Κ. 185 40, Ελλάδα, και πεδίο δράσεώς του το σύνολο της Ελληνικής επικράτειας.'}
        ] },
      { title:{en:'Article II — Nature and Purpose', el:'Άρθρο Β΄ — Φύση και σκοπός'},
        paragraphs:[
          {en:'The Chapter is a brotherhood of Master Masons who ride. It is not a Lodge and holds no masonic labour; it meets upon the level as brethren and rides as a club.',
           el:'Το Chapter είναι αδελφότητα Διδασκάλων Τεκτόνων που ιππεύουν. Δεν είναι Στοά και δεν τελεί τεκτονική εργασία· συνέρχεται επί του αλφαδίου ως αδελφοί και ιππεύει ως club.'},
          {en:'Its purposes are the relief of the widow and the orphan, the support of brethren in need, the practice of charity, and the fellowship of the common rides and excursions upon the motorcycle, under the discipline of the Craft.',
           el:'Σκοποί του είναι η αρωγή της χήρας και του ορφανού, η υποστήριξη αδελφών εν ανάγκη, η άσκηση της αγαθοεργίας και η συντροφικότητα στις κοινές πορείες και εκδρομές με τις μοτοσικλέτες, υπό την πειθαρχία της Τεκτονικής.'}
        ] },
      { title:{en:'Article III — Membership', el:'Άρθρο Γ΄ — Μέλη'},
        paragraphs:[
          {en:'Membership is open to Master Masons in good standing of a regular Lodge under the National Grand Lodge of Greece or another regularly recognized Grand Lodge, who own and ride a motorcycle, and who are received according to the Internal Regulations.',
           el:'Μέλος δύναται να γίνει Διδάσκαλος Τέκτων εν καλή καταστάσει κανονικής Στοάς υπό την Εθνική Μεγάλη Στοά της Ελλάδος ή άλλη κανονικώς αναγνωρισμένη Μεγάλη Στοά, ο οποίος κατέχει και οδηγεί μοτοσικλέτα και γίνεται δεκτός κατά τον Εσωτερικό Κανονισμό.'},
          {en:'Every candidate passes through the trial appointed by the Chapter and is presented by the Preparing Brother before he is received.',
           el:'Κάθε υποψήφιος διέρχεται τη δοκιμασία που ορίζει το Chapter και παρουσιάζεται από τον Δοκιμαστή πριν γίνει δεκτός.'}
        ] },
      { title:{en:'Article IV — Government', el:'Άρθρο Δ΄ — Διοίκηση'},
        paragraphs:[
          {en:'The Chapter is administered by fifteen officers, the first six of whom are the Principal Officers; the remaining offices are optional. The President, the Treasurer and the Road Captain are elected — the President for a term of five years, the Treasurer and the Road Captain every two years — and the remaining offices are filled by appointment of the President.',
           el:'Το Chapter διοικείται από δεκαπέντε αξιωματικούς, εκ των οποίων οι πρώτοι έξι είναι οι Κύριοι Αξιωματικοί· τα λοιπά αξιώματα είναι προαιρετικά. Ο Πρόεδρος, ο Ταμίας και ο Αρχηγός Αποστολής εκλέγονται — ο Πρόεδρος για θητεία πέντε ετών, ο Ταμίας και ο Αρχηγός Αποστολής ανά διετία — τα δε λοιπά αξιώματα πληρούνται με διορισμό του Προέδρου.'}
        ] },
      { title:{en:'Article V — Insignia and Documents', el:'Άρθρο Ε΄ — Διακριτικά και έγγραφα'},
        paragraphs:[
          {en:'The emblem and the seal of the Chapter are those established by the founding documents. Every official document bears the seal at the centre of its foot, the signature of the Secretary on the left and that of the President on the right; the founding documents are signed by the Founding President.',
           el:'Το έμβλημα και η σφραγίδα του Chapter είναι τα καθιερωθέντα διά των ιδρυτικών εγγράφων. Κάθε επίσημο έγγραφο φέρει τη σφραγίδα στο κέντρο του τέλους του, την υπογραφή του Γραμματέως αριστερά και του Προέδρου δεξιά· τα ιδρυτικά έγγραφα υπογράφονται από τον Ιδρυτικό Πρόεδρο.'}
        ] },
      { title:{en:'Article VI — Duration and Amendment', el:'Άρθρο ΣΤ΄ — Διάρκεια και τροποποίηση'},
        paragraphs:[
          {en:'The Chapter is founded for an unlimited duration. This Charter may be amended only in general assembly, upon the proposal of the President, and no amendment may touch the rights of Widows Sons MRA in its name, emblem and insignia.',
           el:'Το Chapter ιδρύεται για αόριστη διάρκεια. Ο παρών Καταστατικός Χάρτης τροποποιείται μόνον εν γενική συνελεύσει, κατόπιν προτάσεως του Προέδρου, και ουδεμία τροποποίηση δύναται να θίξει τα δικαιώματα της Widows Sons MRA επί του ονόματος, του εμβλήματος και των διακριτικών της.'}
        ] }
    ], {
      lead:[{en:'This Charter is the founding instrument of Chapter Hellas. It declares the name, the nature, the purposes, the membership and the government of the Chapter, and stands above every other rule it may adopt.',
             el:'Ο παρών Καταστατικός Χάρτης είναι το ιδρυτικό κείμενο του Chapter Hellas. Δηλώνει την επωνυμία, τη φύση, τους σκοπούς, τα μέλη και τη διοίκηση του Chapter και υπέρκειται κάθε άλλου κανόνα που ήθελε υιοθετήσει.'}],
      closing:[{en:'Granted and adopted at the foundation of the Chapter, at Piraeus, and entered in its records.',
                el:'Χορηγήθηκε και υιοθετήθηκε κατά την ίδρυση του Chapter, εν Πειραιεί, και καταχωρήθηκε στα αρχεία του.'}]
    });
  }

  /* =================================================================
     4 — Internal Regulations
     ================================================================= */
  function regulations(){
    return base(4, {en:'Internal Regulations', el:'Εσωτερικός Κανονισμός'}, [
      { title:{en:'I. Assemblies', el:'Συνελεύσεις'},
        paragraphs:[
          {en:'The Chapter meets in ordinary assembly once each month and in extraordinary assembly whenever the President calls it. The Secretary gives notice, keeps the minutes and enters them in the archive.',
           el:'Το Chapter συνέρχεται σε τακτική συνέλευση άπαξ του μηνός και σε έκτακτη οσάκις την συγκαλεί ο Πρόεδρος. Ο Γραμματέας ειδοποιεί, τηρεί τα πρακτικά και τα καταχωρεί στο αρχείο.'},
          {en:'The Guard keeps the door and admits none but those entitled to enter. Matters are decided by the voice of the brethren present, and the President holds the casting voice.',
           el:'Ο Φύλακας τηρεί τη θύρα και δεν δέχεται παρά μόνον τους δικαιουμένους να εισέλθουν. Τα θέματα κρίνονται διά της φωνής των παρόντων αδελφών, ο δε Πρόεδρος έχει την αποφασιστική ψήφο.'}
        ] },
      { title:{en:'II. Conduct and Discipline', el:'Συμπεριφορά και πειθαρχία'},
        paragraphs:[
          {en:'Every brother conducts himself so as to honour the Craft, the Chapter and the colours he wears. The Sergeant-at-Arms answers for order, addresses breaches, and reports to the President what he cannot settle.',
           el:'Έκαστος αδελφός φέρεται κατά τρόπον που τιμά την Τεκτονική, το Chapter και τα χρώματα που φέρει. Ο Υπεύθυνος Τάξης ευθύνεται για την τάξη, αντιμετωπίζει τις παραβάσεις και αναφέρει στον Πρόεδρο ό,τι δεν δύναται να διευθετήσει.'},
          {en:'A brother who brings the Chapter into disrepute may be admonished, suspended or expelled by decision of the assembly upon the report of the President, and returns his patches upon expulsion.',
           el:'Αδελφός που εκθέτει το Chapter δύναται να επιπληχθεί, να τεθεί σε αναστολή ή να διαγραφεί με απόφαση της συνελεύσεως κατόπιν αναφοράς του Προέδρου, και επιστρέφει τα patches του κατά τη διαγραφή.'}
        ] },
      { title:{en:'III. The Road', el:'Ο δρόμος'},
        paragraphs:[
          {en:'Upon every organised ride the Road Captain commands. He appoints the route and the formation, and the Road Sergeant keeps the column. No brother leaves the formation without the leave of the Road Captain.',
           el:'Σε κάθε οργανωμένη διαδρομή διοικεί ο Αρχηγός Αποστολής. Ορίζει τη διαδρομή και τον σχηματισμό, ο δε Ομαδάρχης διατηρεί τη στήλη. Ουδείς αδελφός εγκαταλείπει τον σχηματισμό άνευ αδείας του Αρχηγού Αποστολής.'},
          {en:'The law of the road is kept before all else. No brother rides who is unfit to ride, and the Chapter suffers no man to ride under drink.',
           el:'Ο νόμος του δρόμου τηρείται προ παντός άλλου. Ουδείς αδελφός ιππεύει εφόσον δεν είναι ικανός, και το Chapter δεν ανέχεται ουδένα να ιππεύει υπό την επήρεια οινοπνεύματος.'}
        ] },
      { title:{en:'IV. Dues and Finances', el:'Συνδρομές και οικονομικά'},
        paragraphs:[
          {en:'The dues are fixed in general assembly. The Treasurer receives all monies, keeps the books and reports the position of the Chapter at each ordinary assembly. No payment is made but upon the order of the President.',
           el:'Οι συνδρομές ορίζονται εν γενική συνελεύσει. Ο Ταμίας εισπράττει πάντα τα χρήματα, τηρεί τα βιβλία και αναφέρει την κατάσταση του Chapter σε κάθε τακτική συνέλευση. Ουδεμία πληρωμή γίνεται παρά μόνον κατ’ εντολήν του Προέδρου.'}
        ] },
      { title:{en:'V. The Vest and the Insignia', el:'Το γιλέκο και τα διακριτικά'},
        paragraphs:[
          {en:'The colours are worn upon the approved black leather vest and in the appointed places. The Warden oversees their proper wearing and the Quartermaster their issue, record and return.',
           el:'Τα χρώματα φέρονται επί του εγκεκριμένου μαύρου δερμάτινου γιλέκου και στις οριζόμενες θέσεις. Ο Έφορος Μελών επιβλέπει την ορθή τους χρήση και ο Επιμελητής τη χορήγηση, καταγραφή και επιστροφή τους.'}
        ] },
      { title:{en:'VI. Admission', el:'Εισδοχή'},
        paragraphs:[
          {en:'A candidate is proposed by a member, examined as to his masonic standing and his riding, prepared by the Preparing Brother, and received by vote of the assembly. He rides as a prospect for such time as the Chapter appoints before he is given his colours.',
           el:'Ο υποψήφιος προτείνεται από μέλος, εξετάζεται ως προς την τεκτονική του ιδιότητα και την οδήγησή του, προετοιμάζεται από τον Δοκιμαστή και γίνεται δεκτός με ψήφο της συνελεύσεως. Ιππεύει ως prospect για όσο χρόνο ορίζει το Chapter πριν λάβει τα χρώματά του.'}
        ] }
    ], {
      lead:[{en:'These Regulations govern the Chapter day by day. They are made under the Charter, and where they and the Charter differ, the Charter prevails.',
             el:'Ο παρών Κανονισμός διέπει το Chapter καθ’ ημέραν. Θεσπίζεται δυνάμει του Καταστατικού Χάρτη, και όπου διαφέρουν, υπερισχύει ο Χάρτης.'}],
      closing:[{en:'Adopted at the foundation of the Chapter and entered in its records. Every member is held to know them.',
                el:'Υιοθετήθηκε κατά την ίδρυση του Chapter και καταχωρήθηκε στα αρχεία του. Έκαστο μέλος τεκμαίρεται ότι τον γνωρίζει.'}]
    });
  }

  /* The fifteen offices, as Section 04 carries them. Each office is given
     in English, Greek and Bulgarian, and so are its duties, the manner in
     which it is filled and its term, so that the document may be read
     throughout by the Bulgarian brethren as well. */
  var OFFICERS = [
    { en:'President', el:'Πρόεδρος', name:'Dimitrios Skiadopoulos', road:'BuildSmith',
      lodge:'Themistocles No. 96',
      rank:{en:'Principal Officer'},
      term:{en:'Five years · Elected'},
      duties:{en:'Leads the Chapter as a whole and holds the highest responsibility for its operation and its direction. Presides over the assemblies, organises and directs the activities, represents the Chapter officially, and ensures the faithful application of the Charter, the Internal Regulations and the decisions of the Chapter.'} },
    { en:'Vice President', el:'Αντιπρόεδρος', name:'Dimitrios Panagakos', road:'Developer',
      rank:{en:'Principal Officer'},
      term:{en:'By appointment'},
      duties:{en:'Second in the hierarchy and the immediate associate of the President. Supports the President in the exercise of his duties and stands fully in his place in any absence or impediment. Accompanies the President at official events and assists in coordinating the administration of the Chapter.'} },
    { en:'Secretary', el:'Γραμματέας', name:'Nikolaos Markopoulos', road:'',
      rank:{en:'Principal Officer'},
      term:{en:'By appointment'},
      duties:{en:'Responsible for the administrative operation of the Chapter. Keeps the minutes, the roll of members, the administrative archive, the official correspondence and the prescribed reports. Custodian of the seal: every official document of the Chapter bears, at its foot, the seal in the centre, the signature of the Secretary on the left and the signature of the President on the right. The founding documents are signed by the Founding President. The Secretary alone signs the membership cards of the Chapter.'} },
    { en:'Treasurer', el:'Ταμίας', name:'Panagiotis Vlahos', road:'',
      rank:{en:'Principal Officer'},
      term:{en:'Two years · Elected'},
      duties:{en:'Holds responsibility for the financial management of the Chapter. Administers the bank accounts, the subscriptions, the receipts and the payments, keeps the financial books and the supporting records, and presents the prescribed financial statements and reports to the administration.'} },
    { en:'Sergeant-at-Arms', el:'Υπεύθυνος Τάξης', name:'Marinos Andreas', road:'',
      rank:{en:'Principal Officer'},
      term:{en:'By appointment'},
      duties:{en:'Responsible for internal order, for discipline and for the observance of the Regulations and the decisions of the Chapter. Oversees the proper conduct of the members, addresses breaches or questions of discipline and, where required, reports and escalates them to the President.'} },
    { en:'Road Captain', el:'Αρχηγός Αποστολής', name:'Panagiotis Floris', road:'',
      rank:{en:'Principal Officer'},
      term:{en:'Two years · Elected'},
      duties:{en:'Holds the principal responsibility for every organised ride and mission. Plans the route, the stopping points and the progress of the column, organises and controls the formation, and answers for the discipline, the safety and the orderly movement of the group on the road.'} },
    { en:'Road Sergeant', el:'Ομαδάρχης', name:'Christos Diavatis', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Directly supports the Road Captain on organised rides and missions. Oversees the section, group or formation assigned to him, maintains communication with the Road Captain, and attends to spacing, discipline, cohesion and the safety of the riders on the road.'} },
    { en:'Warden', el:'Έφορος Μελών & Συμμόρφωσης', name:'George Dryllis', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Follows the matters concerning the members, their standing and their compliance with the Charter, the Internal Regulations and the decisions of the Chapter. Oversees the proper wearing of the vest, the emblems and the insignia, and contributes to the protection of the property and the identity of the Chapter.'} },
    { en:'Orator', el:'Σύμβουλος', name:'Andreas Tsounakos', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Serves as counsellor to the President and to the Chapter. Assists in the forming of positions and official presentations, in communication, at events and in public representation, seeing that the word and the presence of the Chapter answer to its principles and to its standing.'} },
    { en:'Ambassador', el:'Εκπρόσωπος προς άλλα Motorcycle Clubs', name:'Pantelis Lathiotakis', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Represents the Chapter in its relations with other Motorcycle Clubs, Widows Sons Chapters and kindred organisations. Develops and maintains communication, cooperation and fraternal ties, and informs the administration of contacts, invitations and matters of external relations.'} },
    { en:'Almoner', el:'Ελεονόμος Αγαθοεργίας', name:'Pavlos Sarof', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Responsible for the charitable work, the social care and the benevolent action of the Chapter. Follows the cases of brethren, families or other persons in need of help, proposes the means of support, and coordinates the charitable and benevolent works of the Chapter.'} },
    { en:'Quartermaster', el:'Επιμελητής', name:'', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Administers the property, the equipment and the stores of the Chapter. Holds responsibility for the emblems, the patches, the insignia and every object belonging to or used by the Chapter, and attends to their recording, safe keeping, issue, delivery and return.'} },
    { en:'Master of Ceremonies', el:'Τελετάρχης', name:'Alexandros Epifanis', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Responsible for the ceremonial, the protocol and the formal order of the ceremonies and events of the Chapter. Prepares the flow of the programme, guides the participants through the prescribed procedures, and coordinates the smooth and dignified conduct of every official ceremony.'} },
    { en:'Preparing Brother', el:'Δοκιμαστής', name:'Konstantinos Karmalis', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'A fundamental office for the admission and the initiation of a new member. Comes to know and prepares the candidate, guides him before his admission, organises and oversees the trial he must pass before he is judged fit to become a Widows Son, and reports to the President and the administration for the completion of his admission.'} },
    { en:'Event Manager', el:'Υπεύθυνος Εκδηλώσεων', name:'', road:'',
      rank:{en:'Chapter Officer'},
      term:{en:'By appointment'},
      duties:{en:'Responsible for the practical preparation, organisation and support of the events of the Chapter. Coordinates the requirements of place, time, hospitality and operation, and assists in whatever is required before, during and after an event for its smooth conduct.'} }
  ];

  /* =================================================================
     5 — Application for Foundation
     ================================================================= */
  function application(){
    return base(5, {en:'Application for Foundation', el:'Αίτηση Ιδρύσεως'}, [
      { title:{en:'I. The Petition', el:'Η αίτηση'},
        paragraphs:[
          {en:'The undersigned brethren, Master Masons in good standing of regular Lodges and riders of motorcycles, respectfully pray Widows Sons MRA to grant them a charter for the establishment of a Chapter in Greece, to be named Chapter Hellas, with its seat at the Masonic Hall of Piraeus, 24 Konstantinoupoleos Street, Piraeus 185 40.',
           el:'Οι υπογράφοντες αδελφοί, Διδάσκαλοι Τέκτονες εν καλή καταστάσει κανονικών Στοών και αναβάτες μοτοσικλέτας, παρακαλούν ευσεβάστως τη Widows Sons MRA όπως τους χορηγήσει χάρτη προς ίδρυση Chapter εν Ελλάδι, υπό την επωνυμία Chapter Hellas, με έδρα το Τεκτονικό Μέγαρο Πειραιώς, Κωνσταντινουπόλεως 24, Πειραιάς 185 40.'}
        ] },
      { title:{en:'II. The Founding Brethren', el:'Οι ιδρυτές αδελφοί'},
        table:{ head:['Office','Brother','Road Name','Lodge','Grand Lodge','Signature'],
                widths:[19,20,12,18,18,13],
                rows: OFFICERS.filter(function(o){ return o.name; }).map(function(o, i){
                        var n = i + 1;
                        return [ office(o.en, o.el), person(o.name), road(o.road),
                                 field('lodge-' + n, o.lodge || ''),
                                 field('grand-lodge-' + n, OBEDIENCE),
                                 field('signature-' + n) ];
                      }),
                note:'The founding brethren are the officers of the Chapter. NGLG is the National Grand Lodge of Greece, under whose constitution the brethren hold their Lodges. The pale cells are fillable: open this document in a PDF reader and enter the Lodge and the signature of each brother. Road names not yet advised are entered as they are given to the Secretary.' } },
      { title:{en:'III. The Emblem Borne by the Chapter', el:'Το έμβλημα που φέρει το Chapter'},
        image:'emblem', width:104, caption:'The emblem of Widows Sons MRA — Chapter Hellas',
        paragraphs:[
          {en:'The petitioners submit the emblem set out above as the emblem the Chapter shall bear. Its top rocker reads WIDOWS SONS; its central oval carries the name Widows Sons in red script above the winged square and compasses, within which stands the all-seeing eye, and beneath them the motto, Meet on the Level & Part upon the Square; its bottom rocker reads HELLAS CHAPTER.',
           el:'Οι αιτούντες υποβάλλουν το ανωτέρω έμβλημα ως το έμβλημα που θα φέρει το Chapter. Το άνω τόξο φέρει τις λέξεις WIDOWS SONS· το κεντρικό οβάλ φέρει το όνομα Widows Sons με κόκκινη γραφή, άνωθεν του φτερωτού γνώμονα και διαβήτη, εντός των οποίων ίσταται ο πανεπόπτης οφθαλμός, και κάτωθεν αυτών το ρητό Meet on the Level & Part upon the Square· το κάτω τόξο φέρει τις λέξεις CHAPTER HELLAS.'},
          {en:'The name, the emblem and the insignia are acknowledged to belong to Widows Sons MRA. The Chapter and its members shall hold them only while in good standing, and shall return every patch upon demand or upon a brother’s departure.',
           el:'Το όνομα, το έμβλημα και τα διακριτικά αναγνωρίζεται ότι ανήκουν στη Widows Sons MRA. Το Chapter και τα μέλη του θα τα κατέχουν μόνον εφόσον τελούν εν καλή καταστάσει και θα επιστρέφουν κάθε patch εφόσον ζητηθεί ή κατά την αποχώρηση του αδελφού.'}
        ] },
      { title:{en:'IV. Undertakings', el:'Δεσμεύσεις'},
        paragraphs:[
          {en:'The petitioners undertake to observe the constitution, the rules and the customs of Widows Sons MRA; to hold its name, emblem and insignia as its property and to return them upon demand; to keep the Chapter in charity, in good order and in good repute; and to render such account of themselves as the Association may require.',
           el:'Οι αιτούντες αναλαμβάνουν να τηρούν το καταστατικό, τους κανόνες και τα έθιμα της Widows Sons MRA· να κατέχουν το όνομα, το έμβλημα και τα διακριτικά της ως περιουσία της και να τα επιστρέψουν εφόσον ζητηθούν· να διατηρούν το Chapter εν αγαθοεργία, ευταξία και καλή υπολήψει· και να λογοδοτούν όπως η Ένωση ήθελε απαιτήσει.'}
        ] },
      { title:{en:'V. Prayer', el:'Παράκληση'},
        paragraphs:[
          {en:'Wherefore the petitioners pray that this application be received, that the charter be granted, and that Chapter Hellas be numbered among the Chapters of Widows Sons MRA.',
           el:'Όθεν οι αιτούντες παρακαλούν όπως γίνει δεκτή η παρούσα αίτηση, χορηγηθεί ο χάρτης και το Chapter Hellas συναριθμηθεί μεταξύ των Chapters της Widows Sons MRA.'}
        ] }
    ], {
      lead:[{en:'This application is addressed to Widows Sons Masonic Riders Association for the foundation of a Chapter in Greece.',
             el:'Η παρούσα αίτηση απευθύνεται προς τη Widows Sons Masonic Riders Association για την ίδρυση Chapter εν Ελλάδι.'}],
      closing:[{en:'Submitted in the name of the founding brethren.',
                el:'Υποβάλλεται εξ ονόματος των ιδρυτών αδελφών.'}]
    });
  }

  /* =================================================================
     6 — Appointment of Officers
     ================================================================= */
  function officers(){
    return base(6, {en:'Appointment of Officers', el:'Διορισμός Αξιωματικών'}, [
      { title:{en:'I. Offices, Duties and Terms', el:'Αξιώματα, καθήκοντα και θητεία'},
        table:{ head:['Office','Duties and Responsibilities','Term'], widths:[24,58,18],
                rows: OFFICERS.map(function(o){
                  return [ office(o.en, o.el), o.duties.en, term(o.term.en) ];
                }),
                note:'The President, the Treasurer and the Road Captain are elected by the Chapter: the President for a term of five years, the Treasurer and the Road Captain every two years. The first six offices are the Principal Officers of the Chapter; the remaining offices are optional and are filled by appointment of the President, in accordance with the rules of the Chapter.' } },
      { title:{en:'II. The Officers Appointed', el:'Οι διοριζόμενοι αξιωματικοί'},
        table:{ head:['Office','Brother','Road Name','Rank'], widths:[30,24,20,26],
                rows: OFFICERS.map(function(o){
                  return [ office(o.en, o.el), person(o.name), road(o.road), term(o.rank.en) ];
                }),
                note:'The first six offices constitute the Principal Officers — Κύριοι Αξιωματικοί — of the Chapter. Road names not yet entered above are to be advised to the Secretary and will be carried in the next issue of this document.' } },
      { title:{en:'III. Founding Distinction', el:'Ιδρυτική διάκριση'},
        table:{ head:['Distinction','Brother','Nature of the Distinction'], widths:[26,22,52],
                rows:[[ office('Founding President','Ιδρυτικός Πρόεδρος & Οικιστής'),
                        person('Dimitrios Skiadopoulos'),
                        'A special and permanent founding distinction of the Chapter, held in recognition of its foundation. It does not constitute a sixteenth office and carries no duties beyond those of the office held by the brother who bears it.' ]] } }
    ], {
      lead:[{en:'By this founding act the Chapter constitutes its administration and appoints to each of its fifteen offices the brother who shall hold it, the first six of these offices being the Principal Officers of the Chapter.',
             el:'Με την παρούσα ιδρυτική πράξη το Chapter συγκροτεί τη διοίκησή του και διορίζει σε έκαστο των δεκαπέντε αξιωμάτων τον αδελφό που θα το κατέχει, των πρώτων έξι εξ αυτών όντων των Κυρίων Αξιωματικών του Chapter.'}],
      closing:[{en:'Appointed at the foundation of the Chapter and entered in its records. All emblems, patches and insignia of office remain the property of Widows Sons MRA and are returned to the Chapter upon a brother’s departure from office or from the Chapter.',
                el:'Διορίσθηκαν κατά την ίδρυση του Chapter και καταχωρήθηκαν στα αρχεία του. Όλα τα εμβλήματα, τα patches και τα διακριτικά του αξιώματος παραμένουν ιδιοκτησία της Widows Sons MRA και επιστρέφονται στο Chapter κατά την αποχώρηση του αδελφού από το αξίωμα ή από το Chapter.'}]
    });
  }

  /* =================================================================
     7 — Appointment of Honorary Members
     ================================================================= */
  function honorary(){
    return base(7, {en:'Appointment of Honorary Members', el:'Διορισμός Επίτιμων Μελών'}, [
      { title:{en:'I. The Distinction', el:'Η διάκριση'},
        paragraphs:[
          {en:'Honorary membership is the highest distinction the Chapter confers. It is granted to a brother who has served the Craft, the Association or this Chapter in a manner the Chapter wishes to hold in remembrance.',
           el:'Η επίτιμη ιδιότητα του μέλους είναι η ανώτατη διάκριση που απονέμει το Chapter. Χορηγείται σε αδελφό που υπηρέτησε την Τεκτονική, την Ένωση ή το παρόν Chapter κατά τρόπον που το Chapter επιθυμεί να διατηρήσει εις μνήμην.'}
        ] },
      { title:{en:'II. Rights and Limits', el:'Δικαιώματα και όρια'},
        paragraphs:[
          {en:'An honorary member is received at every assembly and at every ride of the Chapter, and is seated with honour. He pays no dues. He holds no office, and he does not vote in the assembly unless he is also a full member of the Chapter.',
           el:'Το επίτιμο μέλος γίνεται δεκτό σε κάθε συνέλευση και σε κάθε διαδρομή του Chapter και ενθρονίζεται μετά τιμής. Δεν καταβάλλει συνδρομή. Δεν κατέχει αξίωμα και δεν ψηφίζει στη συνέλευση, εκτός εάν είναι και πλήρες μέλος του Chapter.'},
          {en:'The distinction is conferred by decision of the assembly upon the proposal of the President, and is entered by the Secretary upon the roll below.',
           el:'Η διάκριση απονέμεται με απόφαση της συνελεύσεως κατόπιν προτάσεως του Προέδρου και καταχωρείται από τον Γραμματέα στον κάτωθι κατάλογο.'}
        ] },
      { title:{en:'III. The Roll of Honorary Members', el:'Ο κατάλογος των επίτιμων μελών'},
        table:{ head:['Brother','Road Name','Conferred for','Date'], widths:[28,18,36,18],
                rows:[ [person(''), road(''), blank(), blank()],
                       [person(''), road(''), blank(), blank()],
                       [person(''), road(''), blank(), blank()],
                       [person(''), road(''), blank(), blank()],
                       [person(''), road(''), blank(), blank()] ],
                note:'The roll is kept by the Secretary and each entry is made upon the decision of the assembly conferring the distinction.' } }
    ], {
      lead:[{en:'By this founding act the Chapter institutes the distinction of honorary membership, declares the rights that attend it, and opens the roll upon which every such member is entered.',
             el:'Με την παρούσα ιδρυτική πράξη το Chapter θεσπίζει τη διάκριση του επίτιμου μέλους, δηλώνει τα δικαιώματα που τη συνοδεύουν και ανοίγει τον κατάλογο στον οποίο καταχωρείται κάθε τοιούτο μέλος.'}],
      closing:[{en:'Instituted at the foundation of the Chapter and entered in its records.',
                el:'Θεσπίσθηκε κατά την ίδρυση του Chapter και καταχωρήθηκε στα αρχεία του.'}]
    });
  }

  /* =================================================================
     The documents of the Secretariat — signed by the Secretary and the
     President, with the seal between them. These are working documents:
     the blanks are filled in Word before they are issued.
     ================================================================= */
  function secretariat(no, subject, sections, opts){
    opts = opts || {};
    return {
      subject: subject,
      ref: 'Ref. CH-SEC-' + (no < 10 ? '0' + no : no) + '/2026',
      place: PLACE, date: DATE,
      lead: opts.lead || [],
      sections: sections,
      closing: opts.closing || [],
      signatures: EXECUTED,
      seal: true
    };
  }

  function certificate(){
    return secretariat(1, {en:'Certificate of Membership', el:'Βεβαίωση Μέλους'}, [
      { title:{en:'I. Certificate', el:'Βεβαίωση'},
        paragraphs:[
          'The Secretary of Widows Sons Masonic Riders Association — Chapter Hellas certifies that the brother named below is a member of this Chapter, received according to its Charter and Internal Regulations, and is at the date of this certificate in good standing.',
          {el:'Ο Γραμματέας της Widows Sons Masonic Riders Association — Chapter Hellas βεβαιώνει ότι ο κατωτέρω αναφερόμενος αδελφός είναι μέλος του παρόντος Chapter, γενόμενος δεκτός κατά τον Καταστατικό Χάρτη και τον Εσωτερικό Κανονισμό του, και κατά την ημερομηνία της παρούσης τελεί εν καλή καταστάσει.'}
        ] },
      { title:{en:'II. The Member', el:'Το μέλος'},
        table:{ head:['Brother','Road Name','Office held','Member since'], widths:[30,20,28,22],
                rows:[[ person(''), road(''), blank(), blank() ]] } },
      { title:{en:'III. Validity', el:'Ισχύς'},
        paragraphs:[
          'This certificate is issued for whatever lawful use the brother may have of it, remains valid for so long as he continues in good standing, and is returned to the Chapter should he cease to be a member.',
          {el:'Η παρούσα βεβαίωση εκδίδεται για κάθε νόμιμη χρήση του αδελφού, ισχύει για όσο διατηρεί την καλή του κατάσταση και επιστρέφεται στο Chapter εφόσον παύσει να είναι μέλος.'}
        ] }
    ]);
  }

  function introduction(){
    return secretariat(2, {en:'Letter of Introduction', el:'Συστατική Επιστολή'}, [
      { title:{en:'I. To Whom It May Concern', el:'Προς πάντα ενδιαφερόμενον'},
        paragraphs:[
          'To the Officers and Brethren of every Chapter of Widows Sons MRA, and to all kindred Motorcycle Clubs and organisations: greeting.',
          {el:'Προς τους Αξιωματικούς και τους Αδελφούς παντός Chapter της Widows Sons MRA, και προς πάντα συγγενή Motorcycle Club και οργάνωση: χαίρετε.'}
        ] },
      { title:{en:'II. The Bearer', el:'Ο κομιστής'},
        table:{ head:['Brother','Road Name','Office held'], widths:[36,26,38],
                rows:[[ person(''), road(''), blank() ]] },
        paragraphs:[
          'The brother named above is commended to you as a member of Chapter Hellas in good standing. We ask for him the welcome, the assistance and the fellowship which our brethren everywhere extend to one another upon the road.',
          {el:'Ο ανωτέρω αδελφός συνιστάται προς υμάς ως μέλος του Chapter Hellas εν καλή καταστάσει. Ζητούμε δι’ αυτόν την υποδοχή, τη συνδρομή και τη συντροφικότητα που οι αδελφοί μας απανταχού επιδεικνύουν αλλήλοις επί του δρόμου.'}
        ] },
      { title:{en:'III. Assurance', el:'Διαβεβαίωση'},
        paragraphs:[
          'Chapter Hellas holds itself ready to render the same office to any brother of your Chapter who may come among us.',
          {el:'Το Chapter Hellas δηλώνει έτοιμο να προσφέρει την ίδια υπηρεσία σε κάθε αδελφό του Chapter σας που θα βρεθεί μεταξύ μας.'}
        ] }
    ]);
  }

  function minutes(){
    return secretariat(3, {en:'Minutes of the Assembly', el:'Πρακτικό Συνεδρίασης'}, [
      { title:{en:'I. The Assembly', el:'Η συνέλευση'},
        table:{ head:['Kind of assembly','Place','Date','Hour'], widths:[28,26,24,22],
                rows:[[ blank(), blank(), blank(), blank() ]] } },
      { title:{en:'II. Present', el:'Παρόντες'},
        table:{ head:['Office','Brother','Present / Absent'], widths:[34,40,26],
                rows:[ [office('President','Πρόεδρος'), person('Dimitrios Skiadopoulos'), blank()],
                       [office('Vice President','Αντιπρόεδρος'), person('Dimitrios Panagakos'), blank()],
                       [office('Secretary','Γραμματέας'), person('Nikolaos Markopoulos'), blank()],
                       [office('Treasurer','Ταμίας'), person('Panagiotis Vlahos'), blank()],
                       [office('Sergeant-at-Arms','Υπεύθυνος Τάξης'), person('Marinos Andreas'), blank()],
                       [office('Road Captain','Αρχηγός Αποστολής'), person('Panagiotis Floris'), blank()] ],
                note:'The remaining officers and the members present are entered by the Secretary upon the roll kept with these minutes.' } },
      { title:{en:'III. Business', el:'Θέματα'},
        table:{ head:['No.','Matter laid before the assembly','Decision'], widths:[10,52,38],
                rows:[ ['1', blank(), blank()], ['2', blank(), blank()],
                       ['3', blank(), blank()], ['4', blank(), blank()] ] } },
      { title:{en:'IV. Close', el:'Λήξη'},
        paragraphs:[
          'There being no further business, the President closed the assembly, and these minutes were entered in the archive of the Chapter by the Secretary.',
          {el:'Μη υπάρχοντος ετέρου θέματος, ο Πρόεδρος έλυσε τη συνέλευση, το δε παρόν πρακτικό καταχωρήθηκε στο αρχείο του Chapter από τον Γραμματέα.'}
        ] }
    ]);
  }

  /* -----------------------------------------------------------------
     The Report of the Officers and the Members.

     It is drawn from the same OFFICERS the site is drawn from, so it can
     never disagree with the page: count the array and you have the
     report. The counts at its head and the bars beneath them are
     computed here, not written down, and they move the moment a brother
     is appointed.
     ----------------------------------------------------------------- */
  function principals(){ return OFFICERS.filter(function(o){ return o.rank.en === 'Principal Officer'; }); }
  function chapterOff(){ return OFFICERS.filter(function(o){ return o.rank.en !== 'Principal Officer'; }); }
  function filled(){ return OFFICERS.filter(function(o){ return !!o.name; }); }
  function elected(){ return OFFICERS.filter(function(o){ return /Elected/.test(o.term.en); }); }

  function rollRows(list, from){
    return list.map(function(o, i){
      return [ { content:String(from + i), styles:{ halign:'center', fontStyle:'bold',
                                                    textColor:[158,27,31], fontSize:8.6 } },
               office(o.en, o.el), person(o.name), road(o.road), term(o.term.en) ];
    });
  }
  var ROLL_HEAD = ['No.','Office','Brother','Road Name','Term'];
  var ROLL_W    = [6, 30, 28, 18, 18];

  function roster(){
    var P = principals(), C = chapterOff(), F = filled().length;
    return secretariat(4, {en:'Report of the Officers and the Members',
                           el:'Έκθεση Αξιωματικών και Μελών'}, [

      { title:{en:'I. The Chapter at a Glance', el:'Το Chapter με μια ματιά'},
        tiles:[ { value:OFFICERS.length,  label:'Offices' },
                { value:F,                label:'Filled' },
                { value:OFFICERS.length - F, label:'Vacant', quiet:true },
                { value:P.length,         label:'Principal' },
                { value:elected().length, label:'Elected' } ],
        paragraphs:[
          {en:'The Chapter provides for ' + OFFICERS.length + ' offices under Article V of the By-Laws. Of these, ' + F +
              ' are held at the date of this report and ' + (OFFICERS.length - F) + ' stand vacant. The first ' + P.length +
              ' are the Principal Officers; the remainder are filled by appointment of the President.',
           el:'Το Chapter προβλέπει ' + OFFICERS.length + ' αξιώματα κατά το Άρθρο V του Κανονισμού. Εξ αυτών, ' + F +
              ' κατέχονται κατά την ημερομηνία της παρούσης και ' + (OFFICERS.length - F) + ' παραμένουν κενά. Τα πρώτα ' + P.length +
              ' είναι οι Κύριοι Αξιωματικοί· τα λοιπά πληρούνται με διορισμό του Προέδρου.'} ] },

      { title:{en:'II. The Strength of the Administration', el:'Η δύναμη της διοικήσεως'},
        split:{ parts:[ { label:'FILLED', value:F } ], empty: OFFICERS.length - F,
                note:'The whole bar is the ' + OFFICERS.length + ' offices of Article V. The filled part is what the Chapter holds today; the hollow tail is what it does not — the Quartermaster and the Event Manager.' },
        bars:{ labelW:56,
               rows:[ { label:'Principal Officers', el:'Κύριοι Αξιωματικοί', value:P.length, series:0 },
                      { label:'Chapter Officers',   el:'Αξιωματικοί του Chapter', value:C.length, series:1 },
                      { spacer:true },
                      { label:'Elected to office',  el:'Εκλεγόμενα αξιώματα', value:elected().length, series:0 },
                      { label:'Held by appointment',el:'Διοριζόμενα αξιώματα', value:OFFICERS.length - elected().length, series:1 } ],
               legend:[ { label:'Principal · elected' }, { label:'Chapter · appointed' } ] } },

      { title:{en:'III. The Principal Officers', el:'Οι Κύριοι Αξιωματικοί'},
        table:{ head:ROLL_HEAD, widths:ROLL_W, rows:rollRows(P, 1),
                note:'The first six offices of the Chapter. The President is elected for five years; the Treasurer and the Road Captain every two. The rest are held by appointment of the President.' } },

      { title:{en:'IV. The Officers of the Chapter', el:'Οι Αξιωματικοί του Chapter'},
        table:{ head:ROLL_HEAD, widths:ROLL_W, rows:rollRows(C, P.length + 1),
                note:'Filled by appointment of the President within thirty days of his taking office. An office shown as to be appointed is vacant at the date of this report.' } },

      { title:{en:'V. The Founding Distinction', el:'Η ιδρυτική διάκριση'},
        table:{ head:['Distinction','Brother','Road Name','Lodge'], widths:[32,27,18,23],
                rows:[[ office('Founding President', 'Ιδρυτικός Πρόεδρος & Οικιστής'),
                        person('Dimitrios Skiadopoulos'), road('BuildSmith'),
                        { content:'Themistocles No. 96', styles:{ fontSize:8.4 } } ]],
                note:'A permanent founding distinction, not a sixteenth office. It carries no duties beyond those of the office its holder holds.' } },

      { title:{en:'VI. The Roll of Members', el:'Το μητρώο μελών'},
        paragraphs:[
          {en:'The roll of members is kept by the Secretary, and this report is drawn from it. At the date of this report the members of Chapter Hellas are the ' + F +
              ' brethren named above — the founding brethren of the Chapter, each a Master Mason in good standing of a regularly recognised Grand Lodge. No brother stands upon the roll who is not named in this report.',
           el:'Το μητρώο μελών τηρείται από τον Γραμματέα και η παρούσα έκθεση συντάσσεται εξ αυτού. Κατά την ημερομηνία της παρούσης, μέλη του Chapter Hellas είναι οι ' + F +
              ' ανωτέρω αναφερόμενοι αδελφοί — οι ιδρυτικοί αδελφοί του Chapter, έκαστος Διδάσκαλος Τέκτων εν καλή καταστάσει κανονικώς αναγνωρισμένης Μεγάλης Στοάς. Ουδείς αδελφός ευρίσκεται επί του μητρώου που δεν κατονομάζεται στην παρούσα έκθεση.'},
          {en:'Brethren received hereafter — whether as prospects, as full patch members, or upon the Masonic Riders Hellas outreach — are entered upon the roll by the Secretary and will be carried in the next issue of this report.',
           el:'Αδελφοί γενόμενοι δεκτοί εφεξής — είτε ως δόκιμοι, είτε ως μέλη πλήρους σήματος, είτε επί της προσεγγίσεως Masonic Riders Hellas — καταχωρούνται στο μητρώο από τον Γραμματέα και θα περιληφθούν στην επόμενη έκδοση της παρούσης εκθέσεως.'} ] }

    ], {
      lead:[ {en:'This report sets out the officers of Widows Sons MRA — Chapter Hellas as they stand at the date below: every office of Article V, the brother who holds it, the road name by which he is known and the term for which he holds it — together with the roll of the members of the Chapter.',
              el:'Η παρούσα έκθεση παραθέτει τους αξιωματικούς της Widows Sons MRA — Chapter Hellas ως έχουν κατά την κατωτέρω ημερομηνία: έκαστο αξίωμα του Άρθρου V, τον αδελφό που το κατέχει, το όνομα του δρόμου με το οποίο είναι γνωστός και τη θητεία για την οποία το κατέχει — ομού μετά του μητρώου των μελών του Chapter.'} ],
      closing:[ {en:'Issued from the roll of the Chapter and entered in its records. It speaks as at its date and is superseded by the next issue.',
                 el:'Εκδίδεται εκ του μητρώου του Chapter και καταχωρείται στα αρχεία του. Ισχύει ως προς την ημερομηνία της και αντικαθίσταται από την επόμενη έκδοση.'} ]
    });
  }

  /* -----------------------------------------------------------------
     The Letter of the Officers — a formal letter giving every office of
     Article V, the real name of the brother who holds it and his road
     name. Drawn from OFFICERS, so it always says what Section 04 says.
     It is dated on the day it is issued, not on the founding date.
     ----------------------------------------------------------------- */
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function today(){ var d = new Date(); return { text: d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
    stamp: ('0'+d.getDate()).slice(-2) + ('0'+(d.getMonth()+1)).slice(-2) + String(d.getFullYear()).slice(-2) }; }

  function officersLetter(){
    var t = today(), F = filled().length;
    var spec = secretariat(5, {en:'Letter of the Officers', el:'Επιστολή Αξιωματικών'}, [

      { title:{en:'I. Address', el:'Προσφώνηση'},
        paragraphs:[
          {en:'To the Officers and Brethren of every Chapter of Widows Sons Masonic Riders Association, to kindred Motorcycle Clubs and organisations, and to all whom it may concern: greeting.',
           el:'Προς τους Αξιωματικούς και τους Αδελφούς παντός Chapter της Widows Sons Masonic Riders Association, προς τα συγγενή Motorcycle Clubs και οργανώσεις, και προς πάντα ενδιαφερόμενον: χαίρετε.'},
          {en:'We have the honour to make known to you the officers of Widows Sons MRA — Hellas Chapter, as they stand at the date of this letter. Each office of Article V of the By-Laws is given below together with the real name of the brother who holds it and the road name by which he is known among the brethren.',
           el:'Έχουμε την τιμή να σας γνωστοποιήσουμε τους αξιωματικούς της Widows Sons MRA — Hellas Chapter, ως έχουν κατά την ημερομηνία της παρούσης. Έκαστο αξίωμα του Άρθρου V του Κανονισμού παρατίθεται κατωτέρω μαζί με το πραγματικό όνομα του αδελφού που το κατέχει και το όνομα του δρόμου με το οποίο είναι γνωστός μεταξύ των αδελφών.'} ] },

      { title:{en:'II. The Officers of the Chapter', el:'Οι Αξιωματικοί του Chapter'},
        table:{ head:['No.','Office','Real Name','Road Name'], widths:[7,37,32,24],
                rows: OFFICERS.map(function(o, i){
                  return [ { content:String(i + 1), styles:{ halign:'center', fontStyle:'bold', textColor:[158,27,31], fontSize:8.6 } },
                           office(o.en, o.el), person(o.name), road(o.road) ];
                }),
                note:'Nos. 1 to 6 are the Principal Officers — Κύριοι Αξιωματικοί — of the Chapter; the remainder are held by appointment of the President. ' +
                     F + ' of the ' + OFFICERS.length + ' offices are held at the date of this letter. A road name shown as to be advised has not yet been entered with the Secretary.' } },

      { title:{en:'III. Correspondence', el:'Αλληλογραφία'},
        paragraphs:[
          {en:'Correspondence for the Chapter is addressed to the Secretary, and matters of the road to the Road Captain. We shall be glad to receive in return the officers of your own Chapter, and hold ourselves ready to welcome any of your brethren who may ride among us.',
           el:'Η αλληλογραφία προς το Chapter απευθύνεται στον Γραμματέα, τα δε θέματα του δρόμου στον Αρχηγό Αποστολής. Θα χαρούμε να λάβουμε αντιστοίχως τους αξιωματικούς του δικού σας Chapter, και δηλώνουμε έτοιμοι να υποδεχθούμε κάθε αδελφό σας που θα ταξιδέψει μαζί μας.'} ] }

    ], {
      closing:[ {en:'With fraternal regards, we remain yours on the Level and upon the Square.',
                 el:'Με αδελφικούς χαιρετισμούς, παραμένουμε δικοί σας επί της Στάθμης και επί της Γωνίας.'} ]
    });
    spec.date = t.text;
    spec.file = 'Hellas-Chapter-Letter-of-the-Officers-' + t.stamp + '-v1';
    return spec;
  }

  /* =================================================================
     The catalogue, as the Secretary's page shows it.
     ================================================================= */
  var CATALOGUE = [
    { no:1, category:'founding', build:emblem,
      title:{en:'The Official Emblem', el:'Το Επίσημο Έμβλημα'},
      note:'Establishes the emblem, its composition, and how it is worn and kept.' },
    { no:2, category:'founding', build:seal,
      title:{en:'The Official Seal', el:'Η Επίσημη Σφραγίδα'},
      note:'Establishes the seal, its custodian and the manner of its use.' },
    { no:3, category:'founding', build:charter,
      title:{en:'Charter', el:'Καταστατικός Χάρτης'},
      note:'The founding instrument: name, purpose, membership and government.' },
    { no:4, category:'founding', build:regulations,
      title:{en:'Internal Regulations', el:'Εσωτερικός Κανονισμός'},
      note:'Assemblies, discipline, the road, dues, insignia and admission.' },
    { no:5, category:'founding', build:application,
      title:{en:'Application for Foundation', el:'Αίτηση Ιδρύσεως'},
      note:'The petition to Widows Sons MRA for the charter of the Chapter.' },
    { no:6, category:'founding', build:officers,
      title:{en:'Appointment of Officers', el:'Διορισμός Αξιωματικών'},
      note:'The fifteen offices, their duties and terms, and the brethren appointed.' },
    { no:7, category:'founding', build:honorary,
      title:{en:'Appointment of Honorary Members', el:'Διορισμός Επίτιμων Μελών'},
      note:'Institutes the distinction and opens the roll of honorary members.' },

    { no:1, category:'secretariat', build:certificate,
      title:{en:'Certificate of Membership', el:'Βεβαίωση Μέλους'},
      note:'Certifies that a brother is a member of the Chapter in good standing.' },
    { no:2, category:'secretariat', build:introduction,
      title:{en:'Letter of Introduction', el:'Συστατική Επιστολή'},
      note:'Commends a brother to other Chapters and kindred clubs.' },
    { no:3, category:'secretariat', build:minutes,
      title:{en:'Minutes of the Assembly', el:'Πρακτικό Συνεδρίασης'},
      note:'The record of an assembly, its attendance and its decisions.' },
    { no:4, category:'secretariat', build:roster,
      title:{en:'Report of the Officers and the Members', el:'Έκθεση Αξιωματικών και Μελών'},
      note:'Every office of Article V, the brother who holds it and his term, with the roll of members — counted and drawn at the head.' },
    { no:5, category:'secretariat', build:officersLetter,
      title:{en:'Letter of the Officers', el:'Επιστολή Αξιωματικών'},
      note:'A formal letter giving every office, the real name of the brother who holds it and his road name.' }
  ];

  function list(category){
    return CATALOGUE.filter(function(d){ return d.category === category; })
                    .sort(function(a,b){ return a.no - b.no; });
  }

  return {
    catalogue: CATALOGUE, list: list,
    officers: officers,            /* the Officers document, called for by name */
    officersLetter: officersLetter,/* the Letter of the Officers, issued from Section 04 */
    FOUNDING: FOUNDING, EXECUTED: EXECUTED
  };
})();
