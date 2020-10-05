---
title: Emdee five for life
date: 2020-09-22 10:00:00 +0300
categories: [HackTheBox, Challenges]
tags: [challenges,writeup]     # TAG names should always be lowercase
---
# Σε γενικές γραμμές.

Αν ασχολείσαι με το shell scripting τότε δεν είναι δύσκολο challenge. Εκεί που μπορω να πω πως είναι η παγίδα του είναι η διαφορά του `request.session()` και του `request.get()` το παρακάτω σχολειο στο [github](https://stackoverflow.com/a/32986316) θα λύσει την απορία.


![Desktop View](/assets/img/sample/session-get.png)
### Το πρώτο πράγμα που θα κάνουμε είναι απο το request να απομονόσουμε το string που χρειάζεται να κάνουμε encrypt

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
### Έπειτα έχοντας το string θα το κανουμε encrypt σε md5.
```python
##convert to md5 
hash = hashlib.md5(string.encode()).hexdigest()
```
### Τελευταίο κομματι ειναι το post request.
Έχοντας ολα τα κομμάτια του puzzle το μόνο που μένει είναι τα βάλουμε στο post request. Για να δούμε τι parameter ζητά το request φυσικα θα χρησημοποιήσουμε το burp suite.
![Desktop View](/assets/img/sample/burp-suite.png)

Βλέπουμε οτι η parameter ειναι το hash.
Φτάντοντας κοντα στο τέλος στέλνουμε το post request θέτοντας ως value στην hash την variable hash.
```python
myobj = {'hash': hash}
x = s.post(url, data = myobj)
print(x.text)
```
Ο κώδικας ολόκληρος ειναι παρακάτω:
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
Τρέχοντάς το λύνουμε το challenge.
![Desktop View](/assets/img/sample/end_of_challengeEmdee.png)
