# Οδηγίες συντήρησης site

Πραγματικό repository `mossygr/mossygr.github.io`, source branch `master`, επίσημο Chirpy 7.6.0 / Jekyll 4.4.1. Το `/robot/` είναι κανονικό άρθρο `_posts/2026-10-21-robot-4wd.html` με explicit permalink και μία πηγή. Διάβασε πρώτα `SITE_EDITING_GUIDE.md` και το αντίστοιχο skill.

Ο `pages-maintainer` διαβάζει `.agents/skills/github-pages-maintainer/SKILL.md` και υλοποιεί/build. Ο `greek-visual-reviewer` διαβάζει `.agents/skills/greek-web-visual-qa/SKILL.md`, επιθεωρεί πραγματικά screenshots και δεν αλλάζει κώδικα. Για την εργασία 4WD απαιτούνται ακριβώς δύο subagents. Μόνο ο συντονιστής κάνει remote mutations.

Διατήρησε άσχετο περιεχόμενο και αλλαγές, ειδικά `/gym-app`. Το Supabase είναι εκτός πεδίου. Μην αλλάζεις τεχνικές τιμές/pins/πολικότητα ή τον κώδικα firmware αυθαίρετα. Αποκλίσεις πηγών καταγράφονται χωριστά. Μην δημιουργείς ανύπαρκτες λήψεις.

Χρησιμοποιείται ολόκληρο το επίσημο Chirpy 7.6.0 gem, με οπτική αναφορά το επίσημο demo. Μην επαναφέρεις default/sidebar/SCSS overrides της 6.2.2 ή άλλο custom shell. Το robot παραμένει pinned post /robot/, εκτός sidebar. Footer μόνο m0ss1, άδειες στα LICENSE και LICENSE.chirpy-7.6. Native Source Sans Pro/Lato, ελληνικά Lato glyphs από τα αυθεντικά αρχεία στο assets/fonts/lato με OFL. Το guide κείμενο κληρονομεί native typography, SVG labelfonts διατηρούνται. Απαραίτητο actual-font QA, mobile Contents, desktop TOC και Light/Dark/System. Τα hooks περιορίζονται σε guide assets, διορθώσεις παλιού περιεχομένου, Greekfont coverage και root-only cache retirement. Τα templates και έγγραφα συντήρησης εξαιρούνται στο `_config.yml`. Πριν τη δημοσίευση απαιτούνται πραγματικό production build, αντιστοίχιση πηγών, ανεξάρτητο QA στα 360×800, 390×844, 768×1024, 1440×900, αρχική και υπάρχον άρθρο. Μετά από διορθώσεις γίνεται νέο build και έλεγχος επηρεαζόμενων περιοχών. Η δημοσίευση απαιτεί επιτυχημένο deployment και έλεγχο δημόσιας έκδοσης.

Μη δημοσιεύεις credentials, μη χρησιμοποιείς force push, μην παρακάμπτεις repository protections. Η άδεια commit/push/PR/merge/deployment αφορά αυτή την εργασία μετά την επιτυχία build και QA.
