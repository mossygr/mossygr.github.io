---
key: 2020-10-5-Find-The-Easy-Pass
lang: el
title: Find The Easy Pass
description: 'Αναζητώντας τον κωδικό στην πρόκληση Find The Easy Pass: παρατήρηση του προγράμματος και βήματα στο
  περιβάλλον αποσφαλμάτωσης.'
date: '2020-10-05T10:00:00+03:00'
permalink: /posts/Find-The-Easy-Pass/
categories:
- HackTheBox
- Challenges
tags:
- challenges
- writeup
- beginner track
type: article
image:
  path: /assets/img/sample/HTC/find_the_code_screen.png
  alt: Στιγμιότυπο από το άρθρο Find The Easy Pass
---

### Prerequirement

`Για Kali`
* wine
* OllyDbg

`Για Windows`
* OllyDbg

### Reversing

Εγώ θα χρησιμοποιήσω kali. Αρχικά τρέχω το OllyDbg με wine.

```shell
wine OLLYDBG.EXE
```
Έπειτα όπως είναι λογικό `File -> Open > EasyPass.exe`

![Desktop View](/assets/img/sample/HTC/find_the_code_screen.png)

Όπως φαίνεται και απο το παραπάνω screen θα αναζητήσουμε σαν text το `password` ωστε να προσανατολιστούμε στον κώδικα.

![Desktop View](/assets/img/sample/HTC/find_password_find_the_easy_password.png)

Πατώντας δυο φορές στο `Good Job Congratulations!` μας πηγαίνει στην παρακάτω εικόνας.

![Desktop View](/assets/img/sample/HTC/find_the_easy_password_assemply.png)

Εκεί βλέπουμε οτι καλεί την fuction `EasyPass` μετά πηγαίνει στο instruction `JNZ` το ο οποίο ουσιαστικά σημαίνει `Jump if not zero`. Δηλαδή συγκρίνει το string που δείνουμε με το σωστό string και αν είναι σωστό μας δίνει το μήνυμα Good Job. Congratulation. 
Άρα μια καλη ιδέα είναι να βάλουμε ένα `breakpoing` στο `CALL` instuction και να τρέξουμε σε εκείνο το σημέιο στο πρόγραμμα για να δούμε με πιο sting στο συγκρίνει.

![Desktop View](/assets/img/sample/HTC/find_the_easy_password_breakpoint.png)

Όταν τρέχουμε το πρόγραμμα μας ζητάει να βάλουμε ενα κωδικό και έπειτα να πατήσουμε check. Βάζουμε σαν κωδικό test_pass και πατάμε check. Στα αριστερά βλεπουμε οτι το string που του δώσαμε το συγρκίνει με το string που πρέπει να πάρει ώστε να ικανοποιηθει η συνθήκη. Το sting με το οποιο συγρίνετε το δικό μας είναι και το `flag`.

![Desktop View](/assets/img/sample/HTC/find_the_easy_password_flag.png)
