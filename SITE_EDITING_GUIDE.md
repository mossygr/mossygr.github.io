# Οδηγός συντήρησης site

Επαλήθευση 2026-10-21: repository `mossygr/mossygr.github.io`, source `master`, GitHub Pages από `gh-pages` και `/`. Το `Gemfile.lock` κλειδώνει Chirpy 6.2.2, Jekyll 4.3.2 και Bundler 2.4.19. Κοινή γλώσσα `el`, με προαιρετικό `lang` ανά άρθρο. Το site έχει δικό του editorial shell πάνω στο κλειδωμένο Jekyll/Chirpy, χωρίς νέο framework.

## Χάρτης περιεχομένου

| Τι αλλάζω | Αρχείο ή φάκελος |
| --- | --- |
| Νέα άρθρα | `_posts/YYYY-MM-DD-slug.md`, layout `post` |
| Πρότυπο άρθρου | `templates/new-post.md.example` (δεν δημοσιεύεται) |
| Σελίδες και navigation | `_tabs/` με `title`/`permalink`, links στο `_data/appearance.yml` |
| Οδηγός 4WD | `_posts/2026-10-21-robot-4wd.html`, `/robot/`, κοινό layout `post`, μία πηγή |
| Κείμενο οδηγού | `_includes/robot/introduction.html` και `t-*.html`, editable HTML |
| Διαγράμματα οδηγού | `_includes/robot/pict.svg`, `harness.svg`, διατήρηση IDs/data-w |
| Εικόνες / firmware / styles / scripts | `assets/robot/` |
| Κοινές ρυθμίσεις | `_config.yml` |
| Κοινή εμφάνιση / ταυτότητα | `_data/appearance.yml` (tokens, γραμματοσειρές, intro, featured URL, navigation), `assets/css/notebook.css` |
| Shared shell / αρχική / άρθρα | `_layouts/default.html`, `home.html`, `post.html`, `_includes/post-card.html` |
| Αναζήτηση | `_tabs/search.html`, `assets/js/data/search.json`, `assets/js/notebook.js` |
| Αρχείο και ταξινομήσεις | `_layouts/archives.html`, `categories.html`, `category.html`, `tags.html`, `tag.html` |
| Κατηγορίες και tags | Frontmatter `categories`/`tags`, αυτόματη παραγωγή από jekyll-archives |

## Πριν από κάθε αλλαγή

Διάβασε `AGENTS.md`, το αντίστοιχο skill και `git status --short`. Διατήρησε άσχετο περιεχόμενο. Επιβεβαίωσε δικαιώματα/default branch/Pages με `gh` χωρίς εμφάνιση tokens. Οι agent definitions είναι `.codex/agents/*.toml`. Μόνο ο συντονιστής εκτελεί remote mutations.

## Προσθήκη άρθρου — συγκεκριμένο παράδειγμα

1. Αντέγραψε το `templates/new-post.md.example` στο `_posts/2026-10-22-esp32-sensor.md`.
2. Συμπλήρωσε πραγματική ημερομηνία δημοσίευσης, π.χ. `date: 2026-10-22 10:00:00 +0300`. Μελλοντική ημερομηνία μένει εκτός production μέχρι τότε. Μην αντιγράφεις ημερομηνία παλιού άρθρου.
3. Βάλε `title: "Μετράμε θερμοκρασία με ESP32"`, `description` δύο προτάσεων από το πραγματικό περιεχόμενο και `categories: [Arduino]`. Τα tags είναι ελεύθερες λέξεις, π.χ. `[ESP32, αισθητήρες]`. Απόφυγε νέα ονόματα που διαφέρουν μόνο σε κεφαλαία.
4. Αντέγραψε πραγματική εικόνα στο `assets/img/esp32-sensor/cover.jpg`, βάλε `image.path: /assets/img/esp32-sensor/cover.jpg` και περιγραφικό `image.alt`. Αν δεν υπάρχει εικόνα, αφαίρεσε το `image` block· η κάρτα παραμένει λειτουργική χωρίς να επινοεί asset.
5. Γράψε το άρθρο σε Markdown με headings, alt text και σαφείς συνδέσμους. Τα paths χρησιμοποιούν `relative_url`, π.χ. `{{ '/assets/img/esp32-sensor/wiring.jpg' | relative_url }}`.
6. Κάνε build και έλεγξε αρχική, `/archives/`, `/categories/arduino/` και `/search/?q=ESP32`.

Οι κανονικές δημοσιεύσεις ανήκουν στο `_posts`, όχι στο `_tabs`. Η αρχική, το αρχείο, οι κατηγορίες, τα tags και η αναζήτηση διαβάζουν `site.posts`. Το robot έλειπε επειδή ήταν σε collection tabs· δεν ήταν draft, future post ή λανθασμένη ημερομηνία. Μεταφέρθηκε μία φορά σε άρθρο με πραγματική πρώτη δημοσίευση `2026-10-21 13:28:31 +0000` και explicit `/robot/` χωρίς δεύτερο αντίγραφο. Τα `_includes/robot/` παραμένουν η μοναδική επεξεργάσιμη πηγή του τεχνικού σώματος.

Τα υπάρχοντα άρθρα κρατούν τις αρχικές frontmatter ημερομηνίες τους, ακόμη όπου τα filenames διαφέρουν. Τα παλιά URLs `/posts/:title/` διατηρούνται. Η παλιά διπλή εγγραφή Lame παραμένει για αποφυγή απώλειας περιεχομένου ή URL· δεν δημιουργήθηκαν νέα παραδείγματα για να γεμίσει το site.

## Αλλαγή εμφάνισης και αρχικής

Για νέο χρώμα άλλαξε `_data/appearance.yml` `accent` και `accent_dark` (hex). Για διαφορετικό φόντο άλλαξε `paper`, για κείμενο `ink`. Η κοινή CSS διαβάζει αυτά τα tokens σε κάθε σελίδα. Οι `font_body`/`font_heading` χρησιμοποιούν τοπικές γραμματοσειρές με ελληνική κάλυψη, χωρίς εξωτερική υπηρεσία font.

Για αλλαγή τίτλου/intro άλλαξε `label`, `intro`, `description`. Το `featured: /robot/` επιλέγει πραγματικό άρθρο από `site.posts`· για διαφορετικό featured βάλε το τελικό URL άλλου υπάρχοντος άρθρου. Πρόσθεσε ή άλλαξε links στο `navigation`. Τα home recent cards, οι κατηγορίες και το αρχείο παράγονται αυτόματα από αληθινά posts. Δεν υπάρχει δεύτερη λίστα αντιγράφων του robot.

Τα κοινά `_layouts/default.html`, `post.html`, `page.html`, `home.html`, `category.html` και `_includes/post-card.html` κρατούν συνεπή εμφάνιση. Οι responsive κανόνες είναι στο `assets/css/notebook.css`. Η φωτεινή/σκούρα επιλογή αποθηκεύεται ως `m0ss1-mode` και εφαρμόζει `html[data-mode]`. Οι ειδικοί κανόνες robot έχουν `.robot-guide` scope και φορτώνονται μόνο με `robot: true`.

## Νέα σελίδα και assets

Χρησιμοποίησε `_tabs/<slug>.md`, `layout: page`, σταθερό `permalink`, `title`. Πρόσθεσε link στο κεντρικό navigation μόνο αν είναι χρήσιμο. Τα εργαλεία My Trades και Margin Calculator διατηρούνται και συνδέονται από το footer.

Τα SVG έχουν ακριβή pins, ετικέτες και αρίθμηση συνδέσεων που πρέπει να συμφωνούν με τις 36 σειρές του πίνακα και τα `WD`/`PARTS_OF` του JS. Μην αλλάζεις τεχνικές πηγές αυθαίρετα. Το ZIP είναι το πραγματικό παρεχόμενο αρχείο, χωρίς νέο compilation firmware. Τα tools/model.py/check.py και MP3 δεν παραδόθηκαν.

Το `_config.yml` εξαιρεί templates, οδηγίες, AGENTS, tools, work-notes, skills και agent metadata. Επιβεβαίωσε ότι απουσιάζουν από το output.

## Αναζήτηση και παλιά offline cache

Το `/search/` διαβάζει το generated `assets/js/data/search.json` με όλα τα πραγματικά posts. Η αναζήτηση καλύπτει τίτλο, κατηγορίες, tags και κείμενο, χωρίς διάκριση πεζών/κεφαλαίων ή ελληνικών τόνων. Η παράμετρος `?q=` επιτρέπει αποθήκευση αποτελεσμάτων ως σύνδεσμο.

Το παλιό root Chirpy service worker ήταν cache-first και μπορούσε να εμφανίζει παλιά αρχική. Αντικαταστάθηκε στο ίδιο URL `/sw.js` από `assets/js/pwa/sw.js`: skipWaiting, καθαρισμός μόνο `chirpy-` cache names, root-only unregister και ανανέωση ελεγχόμενων σελίδων, εξαιρώντας `/gym-app`. Άλλες cache namespaces και εφαρμογές/scopes δεν αγγίζονται. Δεν εισάγεται νέο offline shell· η αρχική ενημερώνεται από τον server. Η μετάβαση πρέπει να ελέγχεται με πραγματικό παλιό registration, όχι μόνο σε καθαρό browser.

## Build και preview

Κανονικό περιβάλλον Ruby 3.2.3:

```sh
gem install bundler -v 2.4.19
bundle install
JEKYLL_ENV=production bundle exec jekyll build
python3 -m http.server 4187 --directory _site
```

Στο παρόν managed περιβάλλον τα gems βρίσκονται σε writable τοπικό path. Η ακριβής εντολή build είναι:

```sh
JEKYLL_ENV=production GEM_HOME=/home/Codex-Robot/.local/robot-gems GEM_PATH=/home/Codex-Robot/.local/robot-gems BUNDLE_PATH=/home/Codex-Robot/.local/robot-bundle /home/Codex-Robot/.local/robot-gems/bin/bundle exec jekyll build
```

Κράτησε το Gemfile.lock αμετάβλητο εκτός αν ζητείται αναβάθμιση. Τα `_site`, caches και τοπικές dependencies δεν γίνονται commit. Πριν αρχίσει QA πάγωσε τα αρχεία με hashes ή commit και κατέγραψε την εντολή build, αποτέλεσμα και URL preview.

## Έλεγχος και δημοσίευση

Ο ανεξάρτητος reviewer επιθεωρεί πραγματικά screenshots σε 360×800, 390×844, 768×1024 και 1440×900, όλα τα sections, ελληνικά/τόνους, pan/zoom/highlight, πίνακα, μενού, λήψεις, πληκτρολόγιο, 200%, light/dark. Ελέγχει επίσης αρχική και ένα παλιό άρθρο. Κάθε ουσιώδης διόρθωση χρειάζεται rebuild και νέο έλεγχο.

Το παλιό `.github/workflows/main.yml` ακούει μόνο push στο `main` και αλλαγές `_posts/*`, άρα δεν δημοσιεύει αλλαγές από το πραγματικό `master`. Η παρούσα διαδικασία είναι production build από το source commit, PR/merge προς `master` και αντιγραφή built output στο `gh-pages` με `.nojekyll` ώστε να μην ξαναπεράσει το compiled output από Jekyll, διατηρώντας άσχετες διαδρομές όπως `/gym-app`. Τις remote ενέργειες κάνει αποκλειστικά ο συντονιστής, χωρίς force push ή παράκαμψη προστασιών. Μετά τον επιτυχημένο Pages deployment ελέγχεται η δημόσια έκδοση σε κινητό και desktop. Οι build/QA/deployment αναφορές τηρούνται χωριστά από αυτόν τον οδηγό.
