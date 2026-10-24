---
title: 'GPi Case 2W και Pi Zero W: στήνουμε το Recalbox 9.2'
date: 2026-10-22 23:30:00 +0300
categories:
- Raspberry Pi
- Retro gaming
tags:
- gpi case 2w
- retroflag
- recalbox
- raspberry pi zero w
- troubleshooting
description: Πώς έλυσα τη λανθασμένη αναγνώριση της θήκης, διόρθωσα την εικόνα και έστησα τα χειριστήρια στο GPi
  Case 2W με Raspberry Pi Zero W.
image:
  path: /assets/gpicase2w/cover-1200.webp
  alt: Η συσκευασία του Retroflag GPi Case 2W και τα συμβατά μοντέλα Raspberry Pi Zero
layout: post
lang: el-GR
toc: true
translation_key: 2026-10-22-gpi-case-2w-pi-zero-w-recalbox
permalink: /posts/gpi-case-2w-pi-zero-w-recalbox/
---
Το **Retroflag GPi Case 2W** είναι μια θήκη σε σχήμα Game Boy, με οθόνη 3" 640×480, ενσωματωμένη μπαταρία και κουμπιά, που δέχεται μέσα σε ένα «cartridge» ένα Raspberry Pi Zero. Στο κουτί γράφει ότι είναι συμβατή με Pi Zero, Zero W και Zero 2W.

Εγώ είχα ένα **Pi Zero W** (το πρώτο, όχι το Zero 2W) και ήθελα να τρέξω **Recalbox**. Στην πράξη, αυτός ο συνδυασμός δεν δουλεύει έτοιμος. Μου πήρε αρκετές δοκιμές να καταλάβω ότι η λανθασμένη αναγνώριση της θήκης εξηγούσε την εικόνα και τις ρυθμίσεις που επέστρεφαν στις παλιές τιμές. Σε αυτό τον οδηγό εξηγώ τι βρήκα και πώς το έστησα τελικά να δουλεύει. Οι ρυθμίσεις αφορούν τη συγκεκριμένη εγκατάσταση· δεν είναι γενική συνταγή για κάθε image ή έκδοση του Recalbox.

> **Αφορά:** GPi Case 2W + Raspberry Pi Zero ή Zero W + Recalbox 9.2. Η υποστήριξη που προστέθηκε στο Recalbox 9.x αφορά το **Pi Zero 2W**. Αυτός ο οδηγός καταγράφει τη δική μου εγκατάσταση με το παλιότερο Zero W· δεν προϋποθέτει ότι κάθε image για το Zero 2W συμπεριφέρεται με τον ίδιο τρόπο.
{: .prompt-info }

## Το πρόβλημα: το Recalbox βλέπει τη θήκη ως την παλιά

Το Recalbox αναγνωρίζει αυτόματα τη θήκη στην πρώτη εκκίνηση και ρυθμίζει μόνο του οθόνη, ήχο και κουμπιά. Η υποστήριξη για το GPi Case 2W όμως [προστέθηκε μόνο για το Raspberry Pi Zero 2](https://github.com/live-clones/recalbox/blob/master/RELEASE-NOTES.md). Το image για Pi Zero / Pi 1, που χρειάζεται το Zero W, ξέρει μόνο τον **πρώτο GPi Case**.

Οι δύο θήκες συνδέονται με το Pi με τον ίδιο τρόπο: η οθόνη μέσω της διεπαφής **DPI** στα GPIO και τα κουμπιά ως χειριστήριο. Η ανίχνευση λοιπόν δεν μπορεί να τις ξεχωρίσει και διαλέγει αυτή που ξέρει. Φαίνεται και στο log εκκίνησης (`SHARE/system/logs`):

```text
doing startup for board GPiV1
```

Ο παλιός GPi όμως είναι διαφορετική συσκευή: έχει οθόνη **320×240**, περιστραμμένη, και δεν έχει κουμπί Home. Το Recalbox εφαρμόζει τις δικές του ρυθμίσεις σε μια θήκη με οθόνη 640×480.

### Τα συμπτώματα

Τα παρακάτω εμφανίστηκαν στη δική μου εγκατάσταση. Η λανθασμένη αναγνώριση εξηγεί την εικόνα και την επαναφορά των ρυθμίσεων. Ένα παιχνίδι που δεν ξεκινά χρειάζεται επιπλέον έλεγχο: το ίδιο μήνυμα μπορεί να αφορά ROM ή BIOS, όχι μόνο τη ρύθμιση της οθόνης.

1. **Σπασμένη εικόνα.** Μικρό κομμάτι του logo πάνω αριστερά και κάθετες χρωματιστές γραμμές στο υπόλοιπο, επειδή η οθόνη παίρνει χρονισμό για 320×240.
2. **Οι διορθώσεις χάνονται.** Ακόμα κι όταν διόρθωνα τις ρυθμίσεις, εμφανιζόταν το μήνυμα «Installing GPi Case… Finalizing» και το Recalbox ξανάγραφε τις ρυθμίσεις του παλιού GPi.
3. **Τα παιχνίδια δεν ξεκινούν.** Είτε με πετούσε πίσω στη λίστα είτε έβγαζε «Looks like your game didn't start at all!», ακόμα και με τα παιχνίδια που έρχονται με το Recalbox.
4. **Τα κουμπιά Hotkey δεν κάνουν τίποτα** στο Home.

![Λανθασμένη εικόνα και κάθετες γραμμές στο GPi Case 2W](/assets/gpicase2w/broken-screen-1200.webp)
{: width="1200" height="1600" srcset="/assets/gpicase2w/broken-screen-480.webp 480w, /assets/gpicase2w/broken-screen-800.webp 800w, /assets/gpicase2w/broken-screen-1200.webp 1200w" sizes="(max-width: 768px) 92vw, 720px" }
_Η πρώτη εκκίνηση με τις ρυθμίσεις του παλιού GPi._

![Το μήνυμα Installing GPi Case και Finalizing στην οθόνη](/assets/gpicase2w/installing-gpi-case-1200.webp)
{: width="1200" height="1600" srcset="/assets/gpicase2w/installing-gpi-case-480.webp 480w, /assets/gpicase2w/installing-gpi-case-800.webp 800w, /assets/gpicase2w/installing-gpi-case-1200.webp 1200w" sizes="(max-width: 768px) 92vw, 720px" }
_Το Recalbox εγκαθιστά τις ρυθμίσεις της θήκης που αναγνώρισε._

### Γιατί δεν αρκεί το patch της Retroflag

Η Retroflag έχει στο GitHub ([GPICASE2W-display-patch](https://github.com/RetroFlag/GPICASE2W-display-patch)) ξεχωριστό αρχείο ρυθμίσεων για Zero και για Zero 2W. Με το Zero W και το Recalbox 9.2 όμως:

- Το αρχείο για Zero φορτώνει το overlay `dpi-pizero-gpicase`, που **δεν υπάρχει** στο Recalbox 9.2, γιατί το patch γράφτηκε για το 8.1.1.
- Στο [issue #2](https://github.com/RetroFlag/GPICASE2W-display-patch/issues/2) του repo, χρήστες αναφέρουν ότι **το αρχείο για Zero 1 είναι χαλασμένο**, ενώ **το αρχείο για Zero 2W δουλεύει και στο Zero 1**. Η βασική διαφορά: το δεύτερο τρέχει την οθόνη πιο αργά (pixel clock **19,2 MHz** αντί για 32 MHz) και με χαμηλότερες ρυθμίσεις από το άλλο patch. Στη δική μου δοκιμή, με τη γρήγορη οθόνη και τις πιο επιθετικές ρυθμίσεις το μενού έβγαινε αλλά τα παιχνίδια κρασάριζαν.
- Ακόμα και το αρχείο για Zero 2W, αυτούσιο, κόλλησε σε μένα στην οθόνη φόρτωσης, το ίδιο που αναφέρει κι άλλος χρήστης στο ίδιο issue. Χρειάστηκε συνδυασμός των δύο.

![Το μήνυμα Looks like your game did not start at all στο Recalbox](/assets/gpicase2w/game-error-1200.webp)
{: width="1200" height="1600" srcset="/assets/gpicase2w/game-error-480.webp 480w, /assets/gpicase2w/game-error-800.webp 800w, /assets/gpicase2w/game-error-1200.webp 1200w" sizes="(max-width: 768px) 92vw, 720px" }
_Το μήνυμα αποτυχίας αναφέρει και πιθανές αιτίες ROM ή BIOS. Δεν αρκεί μόνο του για διάγνωση._

## Η λύση βήμα βήμα

### Τι χρειάζομαι

- Retroflag GPi Case 2W
- Raspberry Pi Zero ή Zero W, **χωρίς** κολλημένα pins
- Κάρτα microSD
- Υπολογιστή με το **Raspberry Pi Imager**

### 1. Γράφω το σωστό image

Στο Raspberry Pi Imager: **Choose OS → Emulation and game OS → Recalbox → «Recalbox - Raspberry Pi Zero / 1 / GPiCase1»**.

Όσο κι αν ακούγεται λάθος, αυτό είναι το σωστό image για Zero W. Ένας χρήστης με την ίδια σύνθεση [σημειώνει](https://github.com/mirkochip/recalbox-rpi_zero_v1.3-gpi_case_2w) ότι το image «GPiCase 2W + Raspberry Pi Zero» από το site του Recalbox είναι παραπλανητικό για αυτό τον συνδυασμό και καταλήγει σε μαύρη οθόνη.

> Το **«GPi Case 2»** είναι άλλη θήκη, για Compute Module 4. Δεν έχει σχέση με το 2W.
{: .prompt-warning }

### 2. Πρώτη εκκίνηση χωρίς να αγγίξω τίποτα

Βάζω την κάρτα στο cartridge και ανοίγω τον διακόπτη. Η εικόνα θα βγει σπασμένη, και αυτό είναι αναμενόμενο. Το αφήνω **10 λεπτά χωρίς να πατήσω τίποτα**, για να ολοκληρωθεί η εγκατάσταση της θήκης, και μετά κλείνω.

> Αν κλείσω τον διακόπτη στη μέση της εγκατάστασης, μπορεί να μείνει μισοτελειωμένη και να ξανατρέχει σε κάθε εκκίνηση, επαναφέροντας κάθε φορά τις ρυθμίσεις του παλιού GPi. Σε μένα συνέβη, και η μόνη καθαρή λύση ήταν να ξαναγράψω την κάρτα.
{: .prompt-danger }

### 3. Βρίσκω το διαμέρισμα RECALBOX στα Windows
{: #step-partition }

Τα δύο διαμερίσματα που μας ενδιαφέρουν εδώ, από τα Windows, είναι τα παρακάτω. Ανάλογα με το image μπορεί να υπάρχουν και άλλα διαμερίσματα που δεν χρειάζεται να πειράξουμε:

| Διαμέρισμα | Τι έχει |
|---|---|
| **RECALBOX** (FAT32, μικρό) | `config.txt`, `recalbox-user-config.txt`, `recalbox-boot.conf`, overlays |
| **SHARE** (exFAT) | παιχνίδια, BIOS, saves, `system/recalbox.conf` |

Τα Windows συχνά δείχνουν μόνο το SHARE. Για να εμφανιστεί και το RECALBOX: δεξί κλικ στο Έναρξη → **Διαχείριση δίσκων** → δεξί κλικ στο μικρό διαμέρισμα FAT32 της κάρτας → **Αλλαγή γράμματος μονάδας δίσκου** → Προσθήκη.

> Αν τα Windows προτείνουν μορφοποίηση του δίσκου, πατάω **Άκυρο**.
{: .prompt-danger }

### 4. Αντικαθιστώ τις ρυθμίσεις της οθόνης
{: #final-config }

Στο RECALBOX κρατάω πρώτα ένα αντίγραφο του `recalbox-user-config.txt`. Έπειτα το ανοίγω —τα Windows μπορεί να κρύβουν το `.txt`—, αντικαθιστώ **όλο** το περιεχόμενο και βάζω αυτό:

```ini
boot_delay=5
dtparam=audio=on
dtoverlay=pwm-audio-pizero-gpicase
display_rotate=0
dtoverlay=recalbox-gpicase1
overscan_left=0
overscan_right=0
overscan_top=0
overscan_bottom=0
framebuffer_width=640
framebuffer_height=480
enable_dpi_lcd=1
display_default_lcd=1
dpi_group=2
dpi_mode=87
dpi_output_format=0x00016
hdmi_timings=640 0 1 1 20 480 0 1 1 2 0 0 0 60 0 19200000 1
avoid_safe_mode=1
disable_pvt=1
disable_audio_dither=1
audio_pwm_mode=2
dtparam=act_led_trigger=default-on
arm_freq=1000
over_voltage=0
core_freq=450
sdram_freq=450
over_voltage_sdram=0
dtparam=sd_overclock=50
extra_transpose_buffer=2
```

Είναι η ρύθμιση της Retroflag για Zero 2W, με δύο αλλαγές για να ανοίγει στο Zero W:

Μια σημαντική διευκρίνιση: το Pi Zero W έχει CPU 1000 MHz εργοστασιακά, οπότε το `arm_freq=1000` δεν αυξάνει τη συχνότητα του επεξεργαστή. Το `core_freq=450`, όμως, είναι πάνω από την επίσημη προεπιλογή των 400 MHz· δεν είναι σωστό να χαρακτηρίσουμε όλο το παραπάνω αρχείο «χωρίς overclock». Κρατάω αυτούσιες τις τιμές της εγκατάστασής μου, χωρίς να τις παρουσιάζω ως καθολικά ασφαλείς για κάθε πλακέτα. [Επίσημη τεκμηρίωση συχνοτήτων](https://www.raspberrypi.com/documentation/computers/legacy_config_txt.html).

| Ρύθμιση | Zero 2W (Retroflag) | Εδώ | Γιατί |
|---|---|---|---|
| Overlay οθόνης | `dpi24` | `recalbox-gpicase1` | με το `dpi24` κολλούσε στην οθόνη φόρτωσης |
| Overlay ήχου | `audremap,pins_18_19,swap_lr` | `pwm-audio-pizero-gpicase` | ο ήχος του GPi στο Zero |
| Pixel clock | 19,2 MHz | 19,2 MHz | σταθερότητα, ίδιο |
| Συχνότητες | Οι τιμές του patch | CPU 1000 / core 450 / SDRAM 450 MHz | διατηρούνται οι τιμές της συγκεκριμένης εγκατάστασης |

> Το παραπάνω μπλοκ δίνεται χωρίς σχόλια για εύκολη αντιγραφή. Το `config.txt` **υποστηρίζει κανονικά γραμμές με `#`**, σύμφωνα με την [τεκμηρίωση του Raspberry Pi](https://www.raspberrypi.com/documentation/computers/config_txt.html). Η [αναφορά στο forum του Recalbox](https://forum.recalbox.com/topic/34650/recalbox-gpi-case-2w-pi-zero-w), όπου η αφαίρεση σχολίων βοήθησε σε μια εγκατάσταση, είναι μεμονωμένη εμπειρία και όχι γενικός κανόνας για κάθε μαύρη οθόνη.
{: .prompt-info }

### 5. Διορθώνω την ανάλυση των emulators

Στο **SHARE → system → `recalbox.conf`** βρίσκω τη γραμμή `global.videomode` και την κάνω:

```ini
global.videomode=default
```

Σε μένα ήταν `1280x720`, δηλαδή κάθε emulator προσπαθούσε να ανοίξει σε ανάλυση που μια οθόνη 640×480 στα GPIO δεν μπορεί να δείξει.

### 6. Εκκίνηση

Κάνω **Eject** την κάρτα, τη βάζω στο GPi και ανοίγω. Η πρώτη φόρτωση μετά την αλλαγή αργεί λίγο. Περιμένω μέχρι να εμφανιστεί το μενού και δοκιμάζω ένα παιχνίδι Game Boy.

![Το λογότυπο Recalbox και τα φαντασματάκια σε σωστά προσανατολισμένη οθόνη](/assets/gpicase2w/working-screen-1200.webp)
{: width="1200" height="1600" srcset="/assets/gpicase2w/working-screen-480.webp 480w, /assets/gpicase2w/working-screen-800.webp 800w, /assets/gpicase2w/working-screen-1200.webp 1200w" sizes="(max-width: 768px) 92vw, 720px" }
_Η οθόνη φόρτωσης γεμίζει πλέον σωστά την επιφάνεια της οθόνης· η φωτογραφία δείχνει φόρτωση, όχι εκτέλεση παιχνιδιού._

## Μετά την εγκατάσταση: η θήκη σαν «παλιός GPi»

Ακόμα και με σωστή οθόνη, το Recalbox συνεχίζει να θεωρεί ότι έχω τον παλιό GPi. Αυτό έχει κάποιες συνέπειες που πρέπει να ξέρω.

### Το Hotkey είναι το SELECT, όχι το Home

Σύμφωνα με το [wiki του Recalbox](https://wiki-next.recalbox.com/en/basic-usage/getting-started/special-commands), Hotkey είναι το κουμπί Home/Guide όταν το χειριστήριο έχει τέτοιο, αλλιώς συνήθως το **SELECT**. Ο παλιός GPi δεν έχει Home, οπότε **Hotkey = SELECT**, και το κουμπί με το σπιτάκι του 2W δεν κάνει τίποτα.

Ακόμα: το Recalbox ονομάζει τα κουμπιά με βάση τη **θέση** τους στο χειριστήριο του Super Nintendo, όχι με τα γράμματα που είναι τυπωμένα στη θήκη: **A = δεξί, B = κάτω, X = πάνω, Y = αριστερό**.

| Συνδυασμός (κρατάω SELECT) | Τι κάνει |
|---|---|
| Select + Start | Έξοδος από το παιχνίδι |
| Select + κάτω κουμπί (B) | Μενού RetroArch |
| Select + δεξί κουμπί (A) | Reset του παιχνιδιού |
| Select + αριστερό κουμπί (Y) | Save state |
| Select + πάνω κουμπί (X) | Load state |
| Select + ↑ / ↓ | Αλλαγή θέσης save (0–9) |
| Select + ← / → | Rewind / γρήγορη κίνηση |

Αν κάποιος συνδυασμός δεν πέφτει εκεί που περιμένω, όλα γίνονται και από το **μενού του RetroArch**: Quick Menu → **Save State** / **Load State**, Quick Menu → **Options** για τις ρυθμίσεις του emulator, και **Resume** για επιστροφή στο παιχνίδι.

### Πώς σώζω

- **Το save του ίδιου του παιχνιδιού**, από το μενού του. Γράφεται στο `SHARE/saves`, αρκεί να βγαίνω από το παιχνίδι με **Select + Start** και όχι κλείνοντας τον διακόπτη.
- **Save state**, που σώζει ακριβώς τη στιγμή που βρίσκομαι, ακόμα και σε παιχνίδια χωρίς save.
- Για να συνεχίζει μόνο του από εκεί που σταμάτησα, βάζω `global.autosave=1` στο `recalbox.conf`.

> Στο **SNES** το Recalbox στο Pi Zero χρησιμοποιεί τον **PiSNES**, που είναι ξεχωριστός emulator και όχι μέρος του RetroArch. Εκεί οι συνδυασμοί save state και το μενού του RetroArch μπορεί να μη δουλεύουν. Το σίγουρο είναι το save μέσα από το παιχνίδι.
{: .prompt-info }

### Οι ρυθμίσεις μπορεί να ξαναγραφτούν

Αν η εγκατάσταση της θήκης ξανατρέξει (μετά από διακοπή ή αναβάθμιση του Recalbox), θα γράψει πάλι τις ρυθμίσεις του παλιού GPi στο `recalbox-user-config.txt`. Γι' αυτό:

- Κρατάω **αντίγραφο** του αρχείου στον υπολογιστή.
- **Δεν κάνω update** από το μενού, ή βάζω `updates.enabled=0` στο `recalbox.conf`.
- Κλείνω πάντα από το μενού: **Start → Quit → Shutdown**, και μετά τον διακόπτη.

Αν παρόλα αυτά οι ρυθμίσεις ξαναγράφονται συνέχεια, υπάρχει παράκαμψη: προσθέτω στο **τέλος** του `config.txt`, μετά τη γραμμή `include recalbox-user-config.txt`, τις βασικές τιμές της οθόνης. Ό,τι γράφεται τελευταίο υπερισχύει:

```ini
display_rotate=0
framebuffer_width=640
framebuffer_height=480
dpi_output_format=0x00016
hdmi_timings=640 0 1 1 20 480 0 1 1 2 0 0 0 60 0 19200000 1
```

> Το `config.txt` αντικαθίσταται σε κάθε αναβάθμιση του Recalbox, οπότε η παράκαμψη χάνεται κι αυτή αν κάνω update.
{: .prompt-warning }

## Παιχνίδια

Τα παιχνίδια μπαίνουν στο **SHARE → roms → φάκελος της κονσόλας**, απευθείας μέσα στον φάκελο και όχι σε υποφάκελο:

| Κονσόλα | Φάκελος | Καταλήξεις |
|---|---|---|
| Game Boy | `gb` | `.gb`, `.zip` |
| Game Boy Color | `gbc` | `.gbc`, `.zip` |
| NES | `nes` | `.nes`, `.zip` |
| Super Nintendo | `snes` | `.sfc`, `.smc`, `.zip` |
| Game Boy Advance | `gba` | `.gba`, `.zip` |

Αν ένα παιχνίδι δεν εμφανίζεται: **START → UI Settings → Update game lists**. Αν πάλι δεν εμφανίζεται, ελέγχω ότι δεν είναι ενεργό το **DO NOT SCAN NEW GAMES** (Advanced Settings → Boot Settings), που κατά το [wiki του Recalbox](https://wiki-next.recalbox.com/en/basic-usage/first-use-and-configuration/add-games) είναι η πιο συχνή αιτία.

> Χρησιμοποίησε αρχεία παιχνιδιών που έχεις δικαίωμα να χρησιμοποιείς. Για προσωπικά cartridges υπάρχουν εργαλεία ανάγνωσης όπως το GB Operator, ενώ υπάρχουν και δωρεάν homebrew παιχνίδια για Game Boy στο itch.io.
{: .prompt-info }

### Τι αντέχει το Zero W

- **Game Boy, Game Boy Color, NES, Master System, Game Gear:** άνετα.
- **SNES:** τρέχει, με τον PiSNES που είναι φτιαγμένος για τα παλιά Pi. Κάποια βαριά παιχνίδια κολλάνε λίγο.
- **Game Boy Advance:** πολλά παίζουν, κάποια κόβουν. Ο ελαφρύτερος emulator είναι ο **gpsp**.
- **PSP:** όχι. Σε Pi Zero το Recalbox [δεν εμφανίζει καν τα παιχνίδια PSP](https://forum.recalbox.com/topic/32845/does-not-show-psp-games-on-raspberry-pi-zero-w).

Αν τα παιχνίδια **Game Boy Color** αργούν σε κίνηση και ήχο (σε μένα έτρεχε πιο ομαλά το SNES), διαλέγω τον ελαφρύτερο emulator **gambatte** από τις ρυθμίσεις του συστήματος και βάζω `global.smooth=0` στο `recalbox.conf`.

Τα παιχνίδια του αρχικού Game Boy είναι μονόχρωμα. Από το μενού του RetroArch (Quick Menu → Options) η επιλογή **GB Colorization** τους δίνει παλέτα σαν του Game Boy Color.

## Αν κάτι δεν πάει καλά

| Τι βλέπω | Τι κάνω |
|---|---|
| Σπασμένη εικόνα μετά από καιρό | Οι ρυθμίσεις ξαναγράφτηκαν. Ξαναβάζω το `recalbox-user-config.txt` από το αντίγραφο. |
| Βλέπω μόνο τον δίσκο SHARE | Δίνω γράμμα στο RECALBOX από τη Διαχείριση δίσκων ([βήμα 3](#step-partition)). |
| Κολλάει στην οθόνη φόρτωσης | Περιμένω 5 λεπτά. Αν συνεχίζει, ελέγχω ότι τα overlays είναι `recalbox-gpicase1` και `pwm-audio-pizero-gpicase`. |
| Μαύρη οθόνη | Ελέγχω image, έκδοση, ονόματα overlays και ότι το αρχείο αντιγράφηκε σωστά. Η παρουσία σχολίων δεν αποδεικνύει την αιτία. |
| «Game didn't start at all» | Ελέγχω `global.videomode=default`, ROM/BIOS και τις ρυθμίσεις συχνοτήτων. Το μήνυμα μόνο του δεν ξεχωρίζει την αιτία. |
| Κάθε εκκίνηση γράφει «Installing GPi Case» | Η εγκατάσταση έχει μείνει μισή. Το πιο καθαρό είναι να ξαναγράψω την κάρτα και να αφήσω την πρώτη εκκίνηση να τελειώσει. |
| Το Home δεν κάνει τίποτα | Φυσιολογικό: το Hotkey είναι το Select. |

## Συμπέρασμα

Το GPi Case 2W δουλεύει με Pi Zero W, αλλά όχι έτοιμο. Το Recalbox το βλέπει ως τον παλιό GPi, οπότε η οθόνη ρυθμίζεται με το χέρι, το Hotkey είναι το Select, και θέλει προσοχή στις αναβαθμίσεις. Όταν στηθεί σωστά, για Game Boy, GBC, NES και τα περισσότερα SNES είναι ένα πολύ ωραίο φορητό.

Για νέα εγκατάσταση θα εξέταζα το **Pi Zero 2W**, για το οποίο προστέθηκε επίσημη υποστήριξη της θήκης στο Recalbox 9.x. Ο παρών οδηγός παραμένει η καταγραφή του δικού μου Zero W και δεν υποκαθιστά τις οδηγίες του εκάστοτε image. Δες πρώτα τις [οδηγίες της Retroflag](https://github.com/RetroFlag/GPICASE2W-display-patch) και τις σημειώσεις έκδοσης που αντιστοιχούν στην εγκατάστασή σου.

## Πηγές

- [RetroFlag – GPICASE2W display patch](https://github.com/RetroFlag/GPICASE2W-display-patch)
- [RetroFlag – Issue #2: GPICase-Zero2W new case - display issues](https://github.com/RetroFlag/GPICASE2W-display-patch/issues/2)
- [mirkochip – Recalbox 9.2.3 σε Pi Zero με GPi Case 2W](https://github.com/mirkochip/recalbox-rpi_zero_v1.3-gpi_case_2w)
- [Recalbox – Release notes](https://github.com/live-clones/recalbox/blob/master/RELEASE-NOTES.md)
- [Recalbox Forum – GPi Case 2W + Pi Zero W](https://forum.recalbox.com/topic/34650/recalbox-gpi-case-2w-pi-zero-w)
- [Recalbox Wiki – Special commands](https://wiki-next.recalbox.com/en/basic-usage/getting-started/special-commands)
- [Recalbox Wiki – Add games](https://wiki-next.recalbox.com/en/basic-usage/first-use-and-configuration/add-games)
- [RaspberryTips – GPi Case 2W Review](https://raspberrytips.com/gpi-case-2w-review/)

- [Raspberry Pi — μορφή αρχείου config.txt](https://www.raspberrypi.com/documentation/computers/config_txt.html)
- [Raspberry Pi — συχνότητες και παλιότερες ρυθμίσεις](https://www.raspberrypi.com/documentation/computers/legacy_config_txt.html)
