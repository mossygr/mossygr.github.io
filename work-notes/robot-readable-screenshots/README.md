# Αποδεικτικά νέου οδηγού 4WD

- `local-preview/`: το ελεγμένο build πριν δημοσίευση, snapshot f22d9bf7658f079e62886da73f9ea5d1d4eceac3ddc262373fa43d34392b282c. Ανεξάρτητος LOCAL PASS. Περιλαμβάνει πραγματικό code-copy και mobile/desktop TOC.
- `public-home/`: πραγματική νέα δημόσια αρχική μετά το επιτυχημένο deployment, σε 360/390/768/1440.
- `release.json`: η δημοσιευμένη έκδοση source c4cfde51ec1722a816bd092b246fe942e240e881, gh-pages 9cbb233d3e68aa716c2bd1af9827bdb89665ff6c.

Ο τελικός δημόσιος οπτικός έλεγχος του άρθρου δεν ολοκληρώθηκε: το τρέχον sandbox απέκλεισε την εκκίνηση Chromium. Τα screenshots του άρθρου είναι τοπικού preview, όχι δημόσια. Ακριβής εντολή: `node /tmp/robot-readable-public-qa/check.cjs`. Σφάλμα: `FATAL:content/browser/sandbox_host_linux.cc:41 ... shutdown: Operation not permitted (1)` και `browserType.launch: Target page, context or browser has been closed`.
