# Ανθρώπινος οδηγός 4WD και εξήγηση κώδικα — 2026-10-22

Αίτημα: φυσική, κατανοητή ανάγνωση και όμορφη δομή, με εξήγηση του πραγματικού firmware. Ακριβώς δύο agents: pages-maintainer για αφήγηση/οργάνωση και greek-visual-reviewer για ανεξάρτητη ελληνική, τεχνική και οπτική επιθεώρηση. Συντονιστής συνέταξε το code walkthrough, εφάρμοσε τα scripts και εκτέλεσε build/QA/remote mutations.

Μία canonical πηγή /robot/. Νέα σειρά: εισαγωγή→υλικά/ρόλοι→τροφοδοσία/συναρμολόγηση→δύο διαγράμματα→IDE/USB/πρώτη δοκιμή/ήχος/OTA→κώδικας→διάγνωση→αναλυτικές σημειώσεις→πλήρης πίνακας36→λήψεις. Φυσική μία στήλη· reference μετά την κύρια διαδρομή, source provenance στο τέλος. Όλες οι 22 τεχνικές παράγραφοι σημειώσεων διατηρήθηκαν, με μία γραμματική διόρθωση της περιγραφής δύο τροφοδοσιών. Διατηρούνται18παλιάheadingIDs,216cells,359SVGlabels,31αρχικάinlinecodeoccurrences(24distinct). ZIP/PNG/SVG/guideJS byte-unchanged.

Code walkthrough: 7 πραγματικά αρχεία, 8 αποσπάσματα/60 πλήρεις γραμμές από το ZIP. Evidence και start_line στο ROBOT_CODE_EXCERPTS.json. Εξηγούνται setup/loop, x/y→διαφορική οδήγηση, normalization, deadzone<8%, PWM77..166/8bit, ramp, failsafe>500ms→target0 (όχι εγγύηση μηχανικού stop), WS/HTTP/browser, κάμερα/PSRAM, flash, audioqueue και feedback limitations, Wi-Fi/20s/OTA lockout. Αποσπάσματα native Rouge με filename/line numbers/copy· generic technical CSS περιορίστηκε στο #conn ώστε να μη χαλάει code tables. Διαφορές πηγών για ήχο, ιστορικό10s/πραγματικό20s και ένδειξηδιατομής παραμένουν ρητές· δεν αλλάχτηκεfirmware.

BuildPASS τελικό4.688s. Source/render integrity PASS:216cells/359labels,8exactsnippets/60lines,24distinctoldcodetokens,18oldheadings,uniqueIDs,53internalanchors. DiffcheckPASS.

Visual lineage: πρώτη matrix13completedviews360/390/768/1440findings[], mobile65/desktop34overlappingguidecaptures inspected ανάενότητα απόreviewer· Chromiumrendererέκλεισεχωρίςsitefindingλίγοπριντελικόdesktoprecord. Ακολούθησε πλήρηςfocused6views home/robot360/1440+category/oldpost1440 f18ca8... findings[], actualnativecodecopyPASS360/1440,7desktopTOCclicks≈80px. Βρέθηκεένωσηstronglabels/notesbody· διορθώθηκεμεblocklabel+literalspace, χωρίςαπώλειακειμένου. Τελικόfocusedfreshnotes360/1440 snapshotf22d9bf7658f079e62886da73f9ea5d1d4eceac3ddc262373fa43d34392b282c: nooverflow,22blocklabels,exactclipboardcopy,codeTOC80.42/80.05 καιmobilepopupκλείνει. Πραγματικάfonts/nativeChirpy7.6παραμένουν. Δενδηλώνεταιfirmwarecompilation/hardwaretest. /gym-app/Supabase ανέγγιχτα.

## Δημοσίευση και όριο δημόσιου ελέγχου

Ανεξάρτητος FINAL LOCAL PASS f22: επιθεωρήθηκαν τα φρέσκα notes360/1440 μετά τη διόρθωση blocklabels και ολόκληρη η διαδρομή/κώδικας από τα προηγούμενα overlapping screenshots. Κανένα τοπικό λειτουργικό/οπτικό blocker.

PR https://github.com/mossygr/mossygr.github.io/pull/5. Το τρέχον περιβάλλον δεν επέτρεπε API CLI (`gh pr merge 5 --merge`→`error connecting to api.github.com`). Η σύνδεση Git παρέμενε διαθέσιμη· έγινε κανονικό no-ff merge και pushmaster c4cfde51ec1722a816bd092b246fe942e240e881, χωρίς force/admin/bypass. Server αποδέχτηκε το push· rulesets API[] πριν merge.

Ακριβές frozenbuild hash επιβεβαιώθηκε πριν αντιγραφή. Deployment gh-pages9cbb233d3e68aa716c2bd1af9827bdb89665ff6c. Pages built/errornull και workflow https://github.com/mossygr/mossygr.github.io/actions/runs/39779368652 SUCCESS. Δημόσια αρχική capture πραγματικά360/390/768/1440, πρώτος οδηγός, nooverflow.

Νέος δημόσιος οπτικός έλεγχος άρθρου BLOCKED από το runtime, δεν δηλώνεται PUBLICPASS. Εντολή `node /tmp/robot-readable-public-qa/check.cjs`→`FATAL:content/browser/sandbox_host_linux.cc:41 ... shutdown: Operation not permitted (1)` / `browserType.launch: Target page, context or browser has been closed`. Αρχική έκδοση του harness με περιττό localserver απέτυχε επίσης`listen EPERM127.0.0.1`· αφαιρέθηκε μόνο αυτό από το public-only harness, το ανεξάρτητο Chromium launch παραμένει αποκλεισμένο. Δεν παρακάμφθηκαν όρια ή μεταβλήθηκαν ήδη εγκεκριμένα scripts για απόκτηση πρόσβασης. Τα τοπικά άρθρου και πραγματικά δημόσιαhome screenshots διακρίνονται ρητά στο work-notes/robot-readable-screenshots.
