---
key: 2020-10-10-Burpsuite-on-firefox
lang: en
title: Using Burp Suite with Firefox
description: Configuring Firefox to use Burp Suite, with screenshots of the proxy settings.
date: '2021-03-11T10:00:00+03:00'
permalink: /en/posts/burpsuite-on-firefox/
categories:
- Burpsuite
- Tutorials
tags:
- burpsuite
type: article
image:
  path: /assets/img/sample/tutorials/burpsuite-settings.png
  alt: Screenshot from Using Burp Suite with Firefox
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
