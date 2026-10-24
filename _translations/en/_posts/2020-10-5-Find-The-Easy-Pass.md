---
description: 'Finding the password in the Find The Easy Pass challenge: examining the program and stepping through
  it in a debugger.'
image:
  path: /assets/img/sample/HTC/find_the_code_screen.png
  alt: Screenshot from Find The Easy Pass
title: Find The Easy Pass
date: 2020-10-05 10:00:00 +0300
categories:
- HackTheBox
- Challenges
tags:
- challenges
- writeup
- beginner track
lang: en
translation_key: 2020-10-5-Find-The-Easy-Pass
permalink: /posts/find-the-easy-pass/
---

### Prerequisites

`For Kali`
* Wine.
* OllyDbg.

`For Windows`
* OllyDbg.

### Reversing

I will use Kali. First, run OllyDbg through Wine.

```shell
wine OLLYDBG.EXE
```

Next, open the executable with `File -> Open > EasyPass.exe`.

![Desktop view](/assets/img/sample/HTC/find_the_code_screen.png)

As the screenshot shows, search for the text `password` to find our way around the code.

![Desktop view](/assets/img/sample/HTC/find_password_find_the_easy_password.png)

Double-clicking `Good Job Congratulations!` takes us to the view below.

![Desktop view](/assets/img/sample/HTC/find_the_easy_password_assemply.png)

We can see a call to the `EasyPass` function, followed by a `JNZ` instruction, meaning `Jump if not zero`. It compares the string we supply with the correct string. If it matches, we get the “Good Job. Congratulation.” message.

A useful next step is to set a breakpoint at the `CALL` instruction and run the program up to that point, so we can see which string our input is compared with.

![Desktop view](/assets/img/sample/HTC/find_the_easy_password_breakpoint.png)

When the program runs, it asks us to enter a password and press Check. Enter `test_pass` and click Check. On the left, we can see our input being compared with the string required to satisfy the condition. That comparison string is the `flag`.

![Desktop view](/assets/img/sample/HTC/find_the_easy_password_flag.png)
