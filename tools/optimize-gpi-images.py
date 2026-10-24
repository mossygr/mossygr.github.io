#!/usr/bin/env python3
"""Create web-sized, correctly oriented copies; the source photographs stay untouched."""
from pathlib import Path
from PIL import Image, ImageOps
import argparse, hashlib, json
parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);args=parser.parse_args()
root=Path(__file__).resolve().parents[1];target=root/'assets/gpicase2w';target.mkdir(parents=True,exist_ok=True)
photos={'cover':('20261021_214455.jpg',True),'broken-screen':('20261021_214448.jpg',False),'game-error':('20261022_180818.jpg',False),'installing-gpi-case':('20261022_180936.jpg',False),'working-screen':('20261022_203314.jpg',True)}
records=[]
for name,(filename,clockwise) in photos.items():
 p=args.source/filename
 with Image.open(p) as raw:
  im=ImageOps.exif_transpose(raw).convert('RGB')
  if clockwise:im=im.transpose(Image.Transpose.ROTATE_270)
  sizes=[]
  for width in [480,800,1200]:
   height=round(im.height*width/im.width);copy=im.resize((width,height),Image.Resampling.LANCZOS);dest=target/f'{name}-{width}.webp';copy.save(dest,'WEBP',quality=82,method=6)
   with Image.open(dest)as check:assert not check.getexif();assert check.size==(width,height)
   sizes.append({'file':dest.name,'width':width,'height':height,'bytes':dest.stat().st_size})
 records.append({'source':filename,'source_bytes':p.stat().st_size,'source_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'oriented_size':list(im.size),'extra_clockwise_rotation':clockwise,'outputs':sizes})
out=root/'work-notes/GPI_IMAGE_INVENTORY.json';out.write_text(json.dumps(records,indent=2)+'\n')
print(json.dumps({'original_bytes':sum(x['source_bytes']for x in records),'largest_variants_bytes':sum(x['outputs'][-1]['bytes']for x in records),'all_variants_bytes':sum(y['bytes']for x in records for y in x['outputs']),'photos':len(records)},indent=2))
