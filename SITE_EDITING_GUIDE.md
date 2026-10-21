# Οδηγός συντήρησης site

Επαλήθευση 2026-10-21: repository `mossygr/mossygr.github.io`, source `master`, GitHub Pages από `gh-pages` και `/`. Το `Gemfile.lock` κλειδώνει Chirpy 6.2.2, Jekyll 4.3.2 και Bundler 2.4.19. Γλώσσα του υπάρχοντος site `en`· ο οδηγός έχει δικό του `lang: el` και ελληνικό wrapper.

## Χάρτης περιεχομένου

| Τι αλλάζω | Αρχείο ή φάκελος |
| --- | --- |
| Νέα άρθρα | `_posts/YYYY-MM-DD-slug.md`, layout `post` |
| Πρότυπο άρθρου | `templates/new-post.md.example` (δεν δημοσιεύεται) |
| Σελίδες και sidebar menu | `_tabs/`, με `title`, `icon`, `order`, `permalink` |
| Οδηγός 4WD | `_tabs/robot.html`, `/robot/`, layout `_layouts/robot.html` που επεκτείνει το theme `page` |
| Κείμενο οδηγού | `_includes/robot/introduction.html` και `t-*.html`, editable HTML |
| Διαγράμματα οδηγού | `_includes/robot/pict.svg`, `harness.svg`, διατήρηση IDs/data-w |
| Εικόνες / firmware / styles / scripts | `assets/robot/` |
| Κοινές ρυθμίσεις | `_config.yml` |
| Κοινή εμφάνιση | Theme gem Chirpy 6.2.2· overrides στα ίδια paths `_layouts`, `_includes`, `assets/css` με έλεγχο συμβατότητας |
| Κατηγορίες και tags | Frontmatter `categories`/`tags`, αυτόματη παραγωγή από jekyll-archives |

## Πριν από κάθε αλλαγή

Διάβασε `AGENTS.md`, το αντίστοιχο skill και `git status --short`. Διατήρησε άσχετο περιεχόμενο. Επιβεβαίωσε δικαιώματα/default branch/Pages με `gh` χωρίς εμφάνιση tokens. Οι agent definitions είναι `.codex/agents/*.toml`. Μόνο ο συντονιστής εκτελεί remote mutations.

## Προσθήκη άρθρου

Αντέγραψε το πρότυπο στο `_posts/` με ημερομηνία και slug. Συμπλήρωσε τίτλο, ημερομηνία/ζώνη ώρας, κατηγορίες, tags. Αν δεν έχεις εικόνα, αφαίρεσε το `image`. Επίλεξε υπάρχουσες κατηγορίες όπου ταιριάζουν. Για ελληνικό άρθρο βάλε `lang: el`. Χρησιμοποίησε Markdown headings, περιγραφικούς συνδέσμους και alt text. Αποθήκευσε εικόνες στο `assets/img/<project>/` και paths με `relative_url`, π.χ. `{{ '/assets/img/project/photo.jpg' | relative_url }}`.

Το `_config.yml` εξαιρεί `templates`, `SITE_EDITING_GUIDE.md`, `AGENTS.md`, tools, handoff, work-notes και agent metadata από το παραγόμενο site. Επιβεβαίωσε την εξαίρεση μετά από build.

## Νέες σελίδες και εμφάνιση

Χρησιμοποίησε `_tabs/<slug>.md`, `layout: page`, σταθερό `permalink`, `title`, `icon` και `order`. Έλεγξε ότι το route είναι ελεύθερο. Το `_layouts/default.html` είναι αντίγραφο της κλειδωμένης έκδοσης theme με μοναδική λειτουργική αλλαγή το root `lang` να προτιμά `page.lang`, κατόπιν `site.alt_lang`/`site.lang`. Τα common layouts ανήκουν στο Chirpy gem· κάνε μικρά overrides ώστε να επιβιώνουν επόμενες αλλαγές. Το `robot` layout φορτώνει δικό του CSS/JS μόνο στη σελίδα οδηγού και οι κανόνες έχουν `.robot-guide` scope. Το light/dark ακολουθεί τον υπάρχοντα διακόπτη Chirpy (`html[data-mode]`). Μην προσθέτεις καθολικούς κανόνες που αλλάζουν παλιά άρθρα.

Τα SVG έχουν ακριβή pins, ετικέτες και αρίθμηση συνδέσεων που πρέπει να συμφωνούν με τις 36 σειρές του πίνακα και τα `WD`/`PARTS_OF` του JS. Διατήρησε τις αντιφάσεις τεχνικών πηγών χωριστά. Το ZIP είναι το πραγματικό παρεχόμενο αρχείο· δεν έχει ελεγχθεί compilation firmware. Τα tools/model.py/check.py και τα MP3 δεν παραδόθηκαν.

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
