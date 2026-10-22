# Συντήρηση m0ss1

Το site χρησιμοποιεί Jekyll 4.3.2 και το προηγούμενο Chirpy 6.2.2 με native αριστερό μενού, κάρτες, breadcrumbs, δεξιά περιεχόμενα, σχετικά άρθρα και light/dark. Source: master. Δημοσίευση compiled output: gh-pages με .nojekyll. Τα παλιά URLs διατηρούνται.

## Προσθήκη άρθρου

Αντέγραψε το `templates/new-post.md.example` στο `_posts/2026-10-22-esp32-sensor.md`. Συμπλήρωσε πραγματική ημερομηνία και ώρα, τίτλο, description, categories και tags. Για παράδειγμα:

```yaml
layout: post
title: Αισθητήρας θερμοκρασίας με ESP32
date: 2026-10-22 18:00:00 +0200
description: Σύνδεση και ανάγνωση αισθητήρα με ESP32.
categories: [Arduino]
tags: [esp32, αισθητήρες]
toc: true
pin: false
```

Χρησιμοποίησε πραγματική εικόνα στο image.path/alt ή αφαίρεσε το image block. Γράψε σύντομη εισαγωγή και ενότητες `##` / `###`: δημιουργούν αυτόματα anchors και δεξιό πίνακα περιεχομένων. Μελλοντικές ημερομηνίες δεν δημοσιεύονται πριν από την ώρα τους. Το pin:true εμφανίζει το άρθρο πρώτο. Αρχική, κατηγορίες, tags, αρχείο και αναζήτηση διαβάζουν τα `_posts`· μην βάζεις άρθρα στα `_tabs`.

## Οδηγός ρομπότ

Μοναδική πηγή: `_posts/2026-10-21-robot-4wd.html`, permalink `/robot/`, πραγματική πρώτη δημοσίευση 2026-10-21T13:28:31Z. Διατήρησε `layout: post`, `robot: true`, `toc: true`, `pin: true`: ο native script selector απαιτεί post layout. Το κείμενο και τα διαγράμματα βρίσκονται στο `_includes/robot/`, τα πραγματικά ZIP/PNG/CSS/JS στο `assets/robot/`. Δεν υπάρχουν λήψεις model.py/check.py/MP3· μην επινοήσεις αρχεία.

Διατήρησε τα 17 guide-section heading IDs και guide-downloads. Τα HTML h2/h3 απαιτούν μοναδικό id. Έλεγξε πραγματικό κλικ στα δεξιά περιεχόμενα για διάγραμμα, harness, πίνακα, σημειώσεις, firmware και λήψεις. Διατήρησε pins, πολικότητα, 36 συνδέσεις, SVG/data-w και JavaScript WD/PARTS_OF σε συμφωνία. Το robot έλειπε από την αρχική λόγω διαφορετικού collection, όχι λόγω draft ή ημερομηνίας.

## Εμφάνιση και πλοήγηση

Κεντρικές ρυθμίσεις `_config.yml`: title, tagline, avatar, theme_mode και lang: el-GR για το πραγματικό ελληνικό locale. Στατικές σελίδες `_tabs/` με layout:page/title/icon/order/permalink. Το `_includes/sidebar.html` είναι το native sidebar με άμεσο shortcut προς το canonical robot. Τα υπόλοιπα layouts, styles και scripts προέρχονται από το κλειδωμένο theme gem. Μην επαναφέρεις custom editorial shell.

Το `_layouts/default.html` διατηρεί native δομή, page.lang fallback και lang παράμετρο στο search-loader. Το metadata-hook φορτώνει scoped guide assets μόνο στο robot. Το content-fixes.css διορθώνει την αντίθεση παλιών inline μπλε τίτλων. Για μικρές μελλοντικές αλλαγές SCSS, διατήρησε το native @import main και πρόσθεσε περιορισμένους κανόνες. Το /search/ χρησιμοποιεί το native πεδίο αναζήτησης χωρίς διπλά input IDs.

## Build και δημοσίευση

```sh
JEKYLL_ENV=production GEM_HOME=/home/Codex-Robot/.local/robot-gems GEM_PATH=/home/Codex-Robot/.local/robot-gems BUNDLE_PATH=/home/Codex-Robot/.local/robot-bundle /home/Codex-Robot/.local/robot-gems/bin/bundle exec jekyll build
```

Πριν από PR/merge/deployment: επιτυχές build και ανεξάρτητος πραγματικός οπτικός έλεγχος αρχικής, robot, κατηγορίας και παλιού άρθρου σε κινητό/tablet/desktop. Άνοιξε screenshots, έλεγξε ελληνικά, sidebar, δεξί TOC με κλικ, light/dark, εικόνες, διαγράμματα, πίνακες, downloads, αναζήτηση και οριζόντια υπερχείλιση. Δημοσίευσε το ελεγμένο `_site` στο gh-pages, διατηρώντας άσχετα paths και τις προστασίες repository· επαλήθευσε το δημόσιο site μετά το deployment.

Το παλιό workflow αφορά main/posts, ενώ το source είναι master. Το root sw.js αποσύρει μόνο chirpy- caches και root registration· το unregister override περιορίζεται στο root scope. Άλλα scopes/cache namespaces, `/gym-app` και Supabase δεν αγγίζονται. PWA:false αποφεύγει stale HTML. Templates, work-notes και οδηγίες εξαιρούνται από το generated site.
