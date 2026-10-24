---
key: 2020-09-22-Emdee-five-for-life
lang: en
title: Emdee five for life
description: 'The HackTheBox Emdee five for life challenge: a small automation exercise involving HTTP requests
  and a time limit.'
date: '2020-09-22T10:00:00+03:00'
permalink: /en/posts/emdee-five-for-life/
categories:
- HackTheBox
- Challenges
tags:
- challenges
- writeup
type: article
image:
  path: /assets/img/sample/session-get.png
  alt: Screenshot from Emdee five for life
---

# Overview

If you are familiar with shell scripting, this is not a difficult challenge. The catch is the difference between `request.session()` and `request.get()`. This [Stack Overflow answer](https://stackoverflow.com/a/32986316) explains it.

![Desktop view](/assets/img/sample/session-get.png)

### First, extract the string we need to hash from the response

```python
import requests
from bs4 import BeautifulSoup
import hashlib

##get the string
url = 'http://docker.hackthebox.eu:30731'
s = requests.Session()
responce = s.get(url)
soup = BeautifulSoup(responce.text,'html.parser')
string = soup.find("h3").text
print (string)
```

### Next, calculate the MD5 hash of the string

```python
##convert to md5 
hash = hashlib.md5(string.encode()).hexdigest()
```

### Finally, send the POST request

With all the pieces of the puzzle in place, we just need to put them into the POST request. To see which parameter the request expects, we use Burp Suite.

![Desktop view](/assets/img/sample/burp-suite.png)

The parameter is called `hash`. We are nearly there: send the POST request with the `hash` variable as the value of that parameter.

```python
myobj = {'hash': hash}
x = s.post(url, data = myobj)
print(x.text)
```

Here is the complete code:

```python
import requests
from bs4 import BeautifulSoup
import hashlib

##get the string
url = 'http://docker.hackthebox.eu:30731'
s = requests.Session()
responce = s.get(url)
soup = BeautifulSoup(responce.text,'html.parser')
string = soup.find("h3").text
print (string)


##convert to md5 
hash = hashlib.md5(string.encode()).hexdigest()
print(hash)


myobj = {'hash': hash}
x = s.post(url, data = myobj)
print(x.text)
```

Running it solves the challenge.

![Desktop view](/assets/img/sample/end_of_challengeEmdee.png)
