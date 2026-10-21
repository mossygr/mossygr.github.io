# Ενσωμάτωση 4WD — 2026-10-21

Repository: mossygr/mossygr.github.io, source master, branch εργασίας feat/robot-guide. Theme/lock: Chirpy 6.2.2, Jekyll 4.3.2, Bundler 2.4.19. Ruby 3.2.3. Δεν τροποποιήθηκαν /gym-app ή Supabase. Η έγκριση remote mutations ανήκει αποκλειστικά στον συντονιστή.

## Αντιστοίχιση πηγών

- Καλωδίωση Ρομπότ 4WD.html: τα δύο εμφωλευμένα document wrappers αφαιρέθηκαν. Όλες οι πέντε ενότητες διατηρήθηκαν στα `_includes/robot/t-*.html`, introduction στο `introduction.html`. Ο τίτλος v1.5 διατηρήθηκε στην εισαγωγή. Το HTML κείμενο είναι επεξεργάσιμο ανεξάρτητα από το layout/styles.
- SVG pict/harness: εξήχθησαν χωρίς αλλαγή byte στα `_includes/robot/pict.svg` και `harness.svg`. Όλα τα 201+158 SVG text στοιχεία διατηρούνται, μαζί με wires, pins, labels, viewBox και data-w.
- Πίνακας: 36 γραμμές × 6 κελιά, απόλυτη ισότητα όλων των 216 κελιών source/generated output με lxml και html5lib. Η διπλή φράση προαιρετικό/συνιστάται διατηρήθηκε αυτούσια για αντιστοίχιση.
- Κυρίως κείμενο και των πέντε source sections: διατηρείται με την ίδια σειρά. Προστέθηκαν κανονικοί τίτλοι/anchors και οδηγίες πληκτρολογίου. Τα κενά μετά από bold τίτλους διορθώθηκαν.
- Markdown πηγή: τα ίδια στοιχεία κειμένου/31 inline code spans υπάρχουν στην HTML· η HTML προτιμήθηκε επειδή περιέχει τα διαγράμματα και πλήρη διαδραστικότητα.
- JS: διατηρούνται WD/PARTS_OF, αρίθμηση36, pan/pinch/zoom/select/highlight. Οι κρυφές καρτέλες έγιναν συνεχής ανάγνωση με anchors. Ο theme toggle συνδέεται με το υπάρχον Chirpy native mode. Προστέθηκε μετακίνηση διαγράμματος με βέλη, zoom +/− και Home.
- CSS: όλοι οι selectors scoped `.robot-guide`. Responsive grid και wrap inline code προστατεύουν κινητά. Μόνο το robot layout φορτώνει guide CSS/JS.
- robot_firmware.zip: πραγματικό νέο συνημμένο, αντιγράφηκε αυτούσιο. Περιέχει robot_firmware.ino και 6 headers camera/audio/web_ui/config/web/motors. Δεν εκτελέστηκε compilation firmware, εκτός πεδίου site build.
- desktop_diagram.png (1400×1000), firmware_ui_phone.png (780×2074): πραγματικά νέα συνημμένα, αντιγράφηκαν αυτούσια, διαστάσεις/alt text/full-size links. Δεν χρησιμοποιήθηκαν ως απόδειξη οπτικού QA.
- ZIP και δύο PNG: hashes αρχικών/παραγόμενων assets ταυτίζονται.
- Απουσιάζουν tools/model.py, tools/check.py και MP3. Δεν κατασκευάστηκαν λήψεις. Δήλωση source generator διατηρήθηκε με διευκρίνιση μη διαθεσιμότητας/μη εκτέλεσης.

## Αποκλίσεις πηγών (χωρίς αυθαίρετη αλλαγή)

Στον οδηγό/διαγράμματα ο ήχος περνά από DFR0119. Το ZIP περιγράφει ηχείο απευθείας DFPlayer και εντολή AT+AMP=ON. Ο οδηγός αναφέρει STA fallback10s, ZIP STA_TIMEOUT_MS20000. Το 0.5mm² (22AWG) διατηρείται όπως παραδόθηκε. Αυτά αναγράφονται και δημόσια στην ενότητα λήψεων, χωριστά από τις αρχικές οδηγίες.

## Build

Εγκατάσταση dependencies από αμετάβλητο Gemfile.lock σε writable local directories. Ακριβής επιτυχής εντολή:

```sh
JEKYLL_ENV=production GEM_HOME=/home/Codex-Robot/.local/robot-gems GEM_PATH=/home/Codex-Robot/.local/robot-gems BUNDLE_PATH=/home/Codex-Robot/.local/robot-bundle /home/Codex-Robot/.local/robot-gems/bin/bundle exec jekyll build
```

Πρώτο σταθερό build ολοκληρώθηκε επιτυχώς σε 3.507s. Snapshot SHA256 (sorted relative _site paths+bytes): f8141252f2111b96ce1803e5f2e68c0ef6b2dd50124a6d309a85db9ac80a5b27. Preview http://127.0.0.1:4187/robot/ — πραγματικό curl output287643bytes, περιέχει v1.5+SVG+guide.js. Η 4173 βρέθηκε απασχολημένη από άλλο προϋπάρχον service και δεν τροποποιήθηκε.

Παραγόμενο document: ένα doctype, root lang el. Όλες οι λήψεις υπάρχουν. Τα templates, οδηγίες συντήρησης, AGENTS, skills/agent definitions και work-notes απουσιάζουν από generated output. `node --check assets/robot/guide.js` επιτυχές. Τα metadata και άρθρα του παλιού site διατηρήθηκαν. Το `_layouts/default.html` αντιγράφει την κλειδωμένη έκδοση Chirpy και αλλάζει μόνο root lang ώστε να προτιμά page.lang.

## QA και δημοσίευση

Ανεξάρτητο browser QA βρίσκεται σε εξέλιξη από greek-visual-reviewer. Ο συντονιστής θα καταγράψει PR/merge, gh-pages deployment και έλεγχο δημόσιας έκδοσης. Το παρόν δεν αποτελεί δήλωση ολοκληρωμένης δημοσίευσης.

## Διόρθωση QA v2

Ο reviewer εντόπισε επικάλυψη της source δήλωσης generator με τις λήψεις στο mobile360, από γενικούς κανόνες theme footer. Το εσωτερικό source footer αντικαταστάθηκε με `div.source-note` και αντίστοιχο scoped CSS χωρίς αλλαγή κειμένου. Νέο production build επιτυχές σε3.352s. Snapshot v2: 4cab0b9bd4466aa52c7126e063c7c22fdde6e4b2c1015fe8e3f15c812021bdc1. Ο reviewer ενημερώθηκε για επανέλεγχο επηρεαζόμενης περιοχής.

## Διόρθωση QA v3

Ο reviewer εντόπισε σκούρο βασικό κείμενο πίνακα σε dark theme λόγω Bootstrap table color. Προστέθηκαν scoped overrides `#conn color`, `--bs-table-color` και `td:not(.note)`· οι προειδοποιήσεις/σημειώσεις διατηρούν τα δικά τους χρώματα. Το selected row αναμειγνύεται με `var(--card)` για αντίθεση. Production build επιτυχές3.142s. Snapshot v3: 85073bbd3163ec1b2d12a9c9ba0c12dc68c662dcefa5f112977b97ea5c51d6b3. Νέος reviewer έλεγχος dark normal/selected/hover mobile/desktop ζητήθηκε.

Επιπλέον static έλεγχοι v2: 21 τοπικοί σύνδεσμοι assets/λήψεων/anchors, κανένας ανύπαρκτος στόχος. 216 κελιά και359 SVG text labels διατηρούνται ακριβώς. `git diff --check` επιτυχές.

## Τελικό τοπικό αποτέλεσμα

**LOCAL QA PASS** από τον ανεξάρτητο greek-visual-reviewer, snapshot v3 `85073bbd3163ec1b2d12a9c9ba0c12dc68c662dcefa5f112977b97ea5c51d6b3`. Πραγματικός Chromium140 στα360×800/390×844/768×1024/1440×900, πλήρης κύλιση κινητού/desktop, ελληνικά, menu clicks, light/dark, πίνακας normal/hover/selected, πληκτρολόγιο pan/zoom/row11, ισοδύναμο200%reflow, αρχική και προϋπάρχον Doji άρθρο, λήψειςHTTP200/hash. Τα δύο ουσιώδη ευρήματα footer/dark table διορθώθηκαν και επανελέγχθηκαν. Αποδεικτικά screenshots και λεπτομέρειες στην ανεξάρτητη αναφορά `work-notes/ROBOT_VISUAL_QA.md`.

Όλα31 inline code tokens ακριβώς ίδια, ένα html/head/body, `git diff --check` επιτυχές. Έτοιμο για την εξουσιοδοτημένη source PR/merge και deployment από τον συντονιστή. Η τελική δημοσίευση/δημόσιος έλεγχος καταγράφεται χωριστά στο `work-notes/ROBOT_PUBLICATION.md`.
