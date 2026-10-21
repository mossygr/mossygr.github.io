# Συνολικός επανασχεδιασμός m0ss1 — 2026-10-21

## Αιτία και δομή

Το robot είχε αποθηκευτεί στο `_tabs/robot.html`, ενώ home/category/archive/search βασίζονται στο `site.posts`. Δεν υπήρχε metadata draft/future/publication να το αποκλείει· η αιτία ήταν η collection. Μεταφέρθηκε με ένα σώμα σε `_posts/2026-10-21-robot-4wd.html`, explicit `/robot/`, πρώτη πραγματική δημοσίευση2026-10-21T13:28:31Z, categoriesArduino/Ρομποτική, tagsESP32-CAM/4WD/firmware, πραγματική εικόνα και descriptions.

Νέο κοινό editorial shell (paper/teal, ελληνική τυπογραφία), header/navigation/footer, αρχική intro/featured/recent/categories, κοινά post cards με πραγματικές εικόνες/περιγραφές/ημερομηνίες, κοινά post/page/category/tag/archive/search layouts. Central εμφάνιση `_data/appearance.yml`, CSS `assets/css/notebook.css`, JS `assets/js/notebook.js`. Οι κλειδωμένες Jekyll4.3.2/Chirpy6.2.2 dependencies διατηρήθηκαν χωρίς νέο framework. Τα παλιά post bodies και URL conventions διατηρούνται. Μόνη περιεχομενική διόρθωση παλιού άρθρου: path typo Jack `sample/htm/`→`sample/thm/` για υπάρχον screenshot. Προστέθηκαν editorial descriptions/image frontmatter από πραγματικό περιεχόμενο/υπαρκτά assets.

Root cache migration στο πραγματικό theme override `assets/js/pwa/sw.js` (permalink/sw.js), skipWaiting/activate, delete onlychirpy- cache namespace, unregister μόνο root scope, ανανέωση ελεγχόμενων σελίδων εκτός/gym-app. Άλλα scopes/cache names διατηρούνται. Δεν τροποποιήθηκαν /gym-app ή Supabase.

## Σταθερό snapshot V1

Production build με την ακριβή managed εντολή του SITE_EDITING_GUIDE επιτυχές1.301s. Preview4187 επαληθεύτηκε curlHTTP20012594bytes. Aggregate _site hash (sorted relativepath+bytes): `3e3653aac8ed5632a51c23c1d4930c3e9ca0cff2e1b550caef6322b404964808`.

Πληρότητα: όλα216tablecells/359SVGlabels/31code tokens ακριβώς ίδια με την αρχική πηγή. Search index15 πραγματικών posts, περιλαμβάνει/robot/. Δεν έγινε compilation firmware. Το _site πάγωσε για ανεξάρτητο reviewerQA. Πρότυπο/οδηγίες/σημειώσεις εξαιρούνται από output.

Ανεξάρτητο QA και τελικό publication pending. Οι ακριβείς έλεγχοι και screenshots καταγράφονται από τον reviewer. Remote ενέργειες εκτελούνται αποκλειστικά από συντονιστή μετά επιτυχίαbuild+QA.
