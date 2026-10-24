---
description: Configuring Firefox to use Burp Suite, with screenshots of the proxy settings.
image:
  path: /assets/img/sample/tutorials/burpsuite-settings.png
  alt: Screenshot from Using Burp Suite with Firefox
title: Using Burp Suite with Firefox
date: 2021-03-11 10:00:00 +0300
categories:
- Burpsuite
- Tutorials
tags:
- burpsuite
lang: en
translation_key: 2020-10-10-Burpsuite-on-firefox
permalink: /posts/burpsuite-on-firefox/
---

First, open Firefox and follow the steps shown in the screenshots below.

![Desktop view](/assets/img/sample/tutorials/burpsuite-settings.png)

Select the “General” tab, find the “Network Proxy” settings, and click “Settings”.

![Desktop view](/assets/img/sample/tutorials/burpsuite-settings.png)

Select “Manual proxy configuration”.

Enter the Burp Proxy listener address in the “HTTP Proxy” field. The default address is 127.0.0.1.

Next, enter the Burp Proxy listener port in the “Port” field. The default is 8080. Make sure “Use this proxy server for all protocols” is selected.

![Desktop view](/assets/img/sample/tutorials/burpsuite-network-settings.png)

It is ready to use.
