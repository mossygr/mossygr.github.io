# Συντήρηση m0ss1 Documentation Portal

Η ενεργή τεχνολογία είναι Astro + TypeScript + Markdown/MDX με στατικό output `dist/`. Στο `feat/retro-amber-a` εφαρμόζεται το επιλεγμένο **Minimal Amber Terminal (A)** σε όλες τις διαδρομές, ως ένα μοναδικό theme. Οι συγκριτικές προτάσεις B/C και ο επιλογέας τους αφαιρέθηκαν. Ο ιδιοκτήτης ενέκρινε ρητά τη δημοσίευση του επιλεγμένου A στις 2026-10-25. Δες `THEME_ARCHITECTURE.md` για αρχεία, tokens και ασφαλές cleanup.

## Το επόμενο άρθρο

1. Αντέγραψε το `templates/new-post.md.example` στο `src/content/docs/el/2026-10-24-esp32-temperature.md`.
2. Συμπλήρωσε πραγματικό τίτλο, περιγραφή, ημερομηνία ISO με ζώνη ώρας, `key`, `type`, `permalink`, categories και tags. Το permalink είναι υποχρεωτικό και δεν αλλάζει μετά τη δημοσίευση.
3. Φτιάξε την πλήρη μετάφραση στο `src/content/docs/en/2026-10-24-esp32-temperature.md`, με το ίδιο `key`, `lang: en`, αγγλικό κείμενο/metadata και `/en/posts/esp32-temperature/`. Μην μεταφράζεις executable εντολές, pins ή string literals firmware αυθαίρετα.
4. Βάλε τις πραγματικές εικόνες στο `assets/img/esp32-temperature/`. Δήλωσε `image` μόνο αν το αρχείο υπάρχει. Για φωτογραφίες χρησιμοποίησε σωστό EXIF orientation, WebP, responsive παραλλαγές και περιγραφικό alt. Το script `tools/optimize-gpi-images.py` είναι συγκεκριμένο για τις πέντε φωτογραφίες GPi· μην το τρέξεις σε άλλη συλλογή χωρίς προσαρμογή.
5. Τρέξε τις παρακάτω εντολές και εξέτασε screenshots πριν ανοίξεις PR.

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4321
npm run test:browser
```

Το `package-lock.json` είναι πλέον διαθέσιμο. Οι εγκαταστάσεις χρησιμοποιούν `npm ci`. Σε περιορισμένο περιβάλλον χωρίς writable home χρησιμοποίησε `ASTRO_TELEMETRY_DISABLED=1` πριν από τις εντολές Astro. Για preview μέσα στο Codex: `ASTRO_TELEMETRY_DISABLED=1 npm run preview -- --port 4321 --ignore-lock`.

Η αρχική, οι κατηγορίες, οι ετικέτες, το αρχείο και η αναζήτηση δημιουργούνται από το collection `docs`. Οι οδηγοί και τα projects εμφανίζονται στα αντίστοιχα ευρετήρια. Δεν προσθέτουμε χειροκίνητες διπλές κάρτες. Η αρχική προβάλλει ειδικά το πραγματικό 4WD Robot και τις υπάρχουσες κατασκευές. Το `pin` διατηρήθηκε ως metadata· η προβολή του Robot στην επισκόπηση είναι ρητή.

Δεν υπάρχει φίλτρο drafts ή ημερομηνιών: κάθε έγκυρο αρχείο του collection δημοσιεύεται στο build. Κράτα μη έτοιμα άρθρα εκτός `src/content/docs`. Οι πραγματικές παλιές ημερομηνίες παραμένουν. Η αρχική απουσία του Robot είχε αιτία τη χωριστή συλλογή/σελίδα στην παλιότερη υλοποίηση, όχι την cache ή κάποιο draft.

## Δομή και εμφάνιση

- `src/config/site.ts`: ταυτότητα, κοινά ελληνικά/αγγλικά UI κείμενα.
- `src/styles/portal.css`: μοναδικό entry point του custom design system.
- `src/design/tokens.css`: black/amber χρώματα dark/light, γραμματοσειρές και κοινές διαστάσεις.
- `src/design/primitives.css`, `layout.css`, `prose.css`, `home.css`: κοινά primitives, λειτουργικό shell, τυπογραφία άρθρων και αρχική.
- `src/components/design`: minimal command prompt, ρητό author-avatar placeholder και αρχική από πραγματικό περιεχόμενο.
- Inter Variable στο κείμενο και Handjet Variable για pixel τίτλους. Και οι δύο φιλοξενούνται τοπικά και παρέχουν πραγματικό Greek subset.
- `src/layouts/Portal.astro`: κοινός σκελετός, SEO, off-canvas navigation dialog σε κάθε πλάτος και δεξιό/mobile TOC.
- `src/components`: επαναχρησιμοποιήσιμα navigation, λίστες άρθρων, τεχνικά δεδομένα, Robot widgets.
- `src/content.config.ts`: typed schema και προαιρετικά materials/cost/wiring/steps/downloads/troubleshooting. Το σώμα Markdown/MDX φιλοξενεί κώδικα και εξηγήσεις.
- `src/lib/routes.ts`: ευρετήρια και αντιστοίχιση γλωσσών. `src/config/legacy-taxonomies.json` διατηρεί τα ιστορικά taxonomy URLs.
- `src/scripts/portal.ts`: keyboard search, native dialogs, dark/light, copy, ενεργή ενότητα. Η αποθήκευση εμφάνισης χρησιμοποιεί `m0ss1-amber-theme`.

Τα `##` και `###` δημιουργούν TOC. Για διατήρηση παλιού anchor γράψε `## Η ενότητα {#stable-id}`. Σε αρχεία `.mdx` γράψε `## Η ενότητα \{#stable-id\}` με escaped άγκιστρα, ώστε να μην αναλυθούν ως JavaScript expression. Χρησιμοποίησε fenced blocks με πραγματική γλώσσα, π.χ. `cpp`, `bash`, `ini`. Η αντιγραφή κρατά το ακριβές κείμενο. Markdown tables γίνονται οριζόντια κυλιόμενοι πίνακες μέσα στην περιοχή ανάγνωσης. SVG εικόνες μπορούν να συνδεθούν με Markdown· διαδραστικά στοιχεία μπαίνουν σε `.mdx` με Astro component.

## Ελληνικά και αγγλικά / SEO

Το ελληνικό περιεχόμενο κρατά τα υπάρχοντα URLs. Τα αγγλικά βρίσκονται στο `/en/`. Κάθε άρθρο έχει self canonical, αμφίδρομα `hreflang` και `x-default` προς τα ελληνικά. Η εναλλαγή EL/EN οδηγεί στο ίδιο άρθρο, όχι γενικά στην αρχική. Δεν υπάρχουν αυτόματες ανακατευθύνσεις βάσει browser ούτε widget μετάφρασης.

Αν μία νέα κατηγορία ή ετικέτα μεταφράζεται με διαφορετικό slug, πρόσθεσε την αντιστοίχιση στο κεντρικό `src/config/legacy-taxonomies.json` μαζί με τα δύο πραγματικά άρθρα. Για παράδειγμα, για `tags: [ESP32, αισθητήρες]` στα ελληνικά και `tags: [ESP32, sensors]` στα αγγλικά:

```json
"/tags/αισθητήρες/": {
  "el": "/tags/αισθητήρες/",
  "en": "/en/tags/sensors/"
}
```

Το αρχείο κρατά τόσο τις ιστορικές όσο και τις νέες ρητές αντιστοιχίσεις. Χρησιμοποίησε `/categories/…/` αντί `/tags/…/` για κατηγορίες. Μην προσθέτεις αντιστοιχίσεις για ανύπαρκτο περιεχόμενο. Ο έλεγχος διαδρομών εντοπίζει στόχους εναλλαγής γλώσσας που λείπουν.

Η Pagefind χτίζεται μετά το Astro από ρητή allowlist του collection· δεν διαβάζει αυθαίρετα το output. Χωρίζει αυτόματα τις γλώσσες μέσω `html.lang`. Στο `astro dev` η αναζήτηση δεν διαθέτει νέο index: ο πλήρης έλεγχος γίνεται σε `npm run build` και `npm run preview`.

## Robot και αρχική προέλευση

Ενεργά σώματα: `src/content/docs/el/2026-10-21-robot-4wd.mdx` και αντίστοιχο `en`. Κοινά διαγράμματα/πίνακας/δεδομένα στο `src/data/robot`, αγγλικά labels στο `en-labels.json`. Δεν αλλάζουμε γεωμετρία, 216 κελιά, 36 συνδέσεις, τιμές ή polarity για αισθητικούς λόγους. Οι οκτώ κώδικες στο άρθρο κρατούν τα παρεχόμενα excerpts. Οι γνωστές διαφορές παραλλαγής ήχου είναι ρητά καταγεγραμμένες, όχι σιωπηλά διορθωμένες.

Τα `_posts`, `_translations`, `_includes` και τα παλιά εργαλεία Jekyll μένουν ως προέλευση της μετάβασης, όχι ως δεύτερη ενεργή πηγή. Το `tools/migrate-content.py` είναι εφάπαξ migration και μπορεί να αντικαταστήσει νέα edits· μην το χρησιμοποιείς για κανονικό build.

## Ασφαλές build και μελλοντική δημοσίευση

Το `tools/prepare-public.mjs` αντιγράφει τα editable `assets` και επαληθευμένα compatibility snapshots στο αγνοούμενο `public`. Το build παράγει μόνο `dist`. Τα `preserved/manifest.json` και snapshots είναι εσωτερικά, δεν δημοσιεύονται ως φάκελος ούτε γίνονται άρθρα. Δεν αλλάζουμε τις προστατευμένες διαδρομές και δεν τις προσθέτουμε στα δημόσια ευρετήρια. Η διατήρηση ακριβούς HTML δεν αποτελεί υπόσχεση αφαίρεσης παλιών URLs από εξωτερικές μηχανές αναζήτησης.

Το πρότυπο Astro CI στο `tools/ci-reference/astro-checks.yml.example` χτίζει και κρατά preview artifact· δεν δημοσιεύει. Η ενεργοποίησή του απαιτεί κατάλληλο GitHub `workflow` scope. Μέχρι τότε οι έλεγχοι release εκτελούνται τοπικά. Production merge/deployment απαιτούν την τελική έγκριση του ιδιοκτήτη, πραγματικό build, route/asset/SEO audit και ανεξάρτητο browser QA σε αρχική, Robot, GPi, κατηγορία και παλιό άρθρο, στις 390/768/1440 διαστάσεις και light/dark. Άνοιξε τα screenshots. Έλεγξε keyboard, search, mobile menu, TOC clicks, copy, diagrams, tables, downloads, γλώσσες και overflow.

Μετά την έγκριση: τήρησε branch protections, κάνε PR και δημοσίευσε το ελεγμένο artifact με overlay πάνω σε φρέσκο checkout του gh-pages. Διατήρησε άγνωστα/ανεξάρτητα paths και namespaces· ποτέ ολική διαγραφή output branch. Μην ενεργοποιείς Chirpy PWA. Επαλήθευσε τη δημόσια αρχική και όλα τα κρίσιμα URLs μετά τη δημοσίευση.

## Production: Astro / GitHub Pages

Το ενεργό build είναι `ASTRO_TELEMETRY_DISABLED=1 npm run build`, όχι Jekyll. Το Pages εξυπηρετεί το `gh-pages` από τη ρίζα με `.nojekyll`. Μετά από ελέγχους και έγκριση, αντιγράφουμε μόνο το `dist/` πάνω στο καθαρό checkout του τρέχοντος `gh-pages`, χωρίς διαγραφές ή force push, ελέγχοντας ότι ανεξάρτητες διαδρομές παραμένουν byte-identical. Δεν αντιγράφουμε source, work-notes, QA ή secrets. Το ανενεργό παλιό Jekyll workflow αφαιρέθηκε. Το νέο Astro CI παραμένει ως ανενεργό πρότυπο στο `tools/ci-reference/astro-checks.yml.example`, επειδή το token δεν επιτρέπει προσθήκη ή ενημέρωση workflows. Δεν επαναφέρουμε Jekyll ούτε αλλάζουμε δικαιώματα ή protections. Το native GitHub Pages deployment συνεχίζει να δημοσιεύει από το `gh-pages`.
