---
key: 2020-10-20-Download-office2019-activate
lang: en
title: Download and activate Office
description: My archived notes on downloading and activating Office, collected in one article.
date: '2020-10-20T10:00:00+03:00'
permalink: /en/posts/download-office2019-activate/
categories: []
tags:
- crack
type: article
image:
  path: /assets/img/sample/download-icons.png
  alt: Screenshot from Download and activate Office
---

## Download Office from the following links

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/ProPlus2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/Professional2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/HomeStudent2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/HomeBusiness2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/ProjectStd2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/ProjectPro2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/VisioStd2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/VisioPro2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/Access2019Retail.img 

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/Excel2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/PowerPoint2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/Outlook2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/Publisher2019Retail.img

http://officecdn.microsoft.com/pr/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/el-gr/Word2019Retail.img

## Next, open Command Prompt as administrator and run these commands

```cmd
cd /d %ProgramFiles%\Microsoft Office\Office16
cd /d %ProgramFiles(x86)%\Microsoft Office\Office16

for /f %x in ('dir /b ..\root\Licenses16\ProPlus2019VL*.xrm-ms') do cscript ospp.vbs /inslic:"..\root\Licenses16\%x"

cscript ospp.vbs /setprt:1688
cscript ospp.vbs /unpkey:6MWKP >nul
cscript ospp.vbs /inpkey:NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP
cscript ospp.vbs /sethst:kms8.msguides.com
cscript ospp.vbs /act
```
