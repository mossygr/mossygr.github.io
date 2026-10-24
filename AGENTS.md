# Συντήρηση m0ss1

Η ενεργή εργασία είναι η μετάβαση σε δικό μας Developer Documentation Portal με Astro, TypeScript, Markdown/MDX και SSG. Η εντολή του ιδιοκτήτη στις 23/10/2026 αντικαθιστά την προηγούμενη απαίτηση αντιγραφής Chirpy. Μη γυρίσεις σε magazine homepage ή Jekyll ως ενεργό build. Διάβασε `SITE_EDITING_GUIDE.md` και `work-notes/ASTRO_PORTAL_STATUS.md`.

Repository `mossygr/mossygr.github.io`. Feature branch `feat/astro-docs-portal`. Το production δεν αλλάζει πριν την τελική έγκριση του ιδιοκτήτη. Μην κάνεις merge, push στο gh-pages ή deployment χωρίς αυτή. Απαιτούνται πραγματικό Astro build, έλεγχος διαδρομών και ανεξάρτητος οπτικός έλεγχος. Μην παρουσιάζεις authored tests, source checks ή screenshots παλιάς έκδοσης ως επιτυχημένο έλεγχο νέου UI.

Χρησιμοποίησε τους δύο υπάρχοντες agents: pages-maintainer για υλοποίηση/μεταφορά και greek-visual-reviewer για ανεξάρτητο ελληνικό QA. Τα τοπικά skills παραμένουν χρήσιμα για διατήρηση περιεχομένου/QA· οι παλιές απαιτήσεις Jekyll/Chirpy υποχωρούν στις νεότερες ρητές οδηγίες. Μόνο ο συντονιστής κάνει remote mutations.

Μοναδικές ενεργές πηγές άρθρων `src/content/docs/el` και `src/content/docs/en`, κοινό `key` και explicit `permalink`. Τα `_posts`, `_translations` και `_includes/robot` είναι ιστορική προέλευση. Μην τα ξαναδημοσιεύεις παράλληλα. Μην τρέχεις migration πάνω σε επεξεργασμένο νέο περιεχόμενο. Τα Robot SVG και δεδομένα συνδέσεων στο `src/data/robot` διατηρούν την αρχική γεωμετρία, IDs, pins, πολικότητα και τις 36 συνδέσεις. Το ZIP firmware μένει αυτούσιο. Μην επινοείς κόστος, downloads ή τεχνικές τιμές.

Διατήρησε ανεξάρτητες εφαρμογές και άσχετα paths αμετάβλητα. Δεν συμμετέχουν σε navigation, αρχική, sitemap, search ή δημόσια περιγραφή. `/gym-app` και Supabase είναι εκτός πεδίου. Τα snapshots/manifest στο `preserved/` είναι εσωτερικά δεδομένα συντήρησης. Διατήρησε unknown deployed paths σε κάθε μελλοντικό overlay, ποτέ wipe του gh-pages. Μην ενεργοποιείς theme PWA ούτε σβήνεις άλλα service-worker scopes/cache namespaces.

Μη δημοσιεύεις secrets, μη χρησιμοποιείς force push, μην παρακάμπτεις repository protections ή περιορισμούς περιβάλλοντος. Το preview CI δεν περιέχει deployment. Μετά από διορθώσεις ξαναχτίσε και επανέλεγξε τις επηρεαζόμενες περιοχές.
