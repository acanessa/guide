import qrtools
from PIL import Image
import base64
import os
import sys
import fileinput
import io

data = sys.stdin.read() 

image = base64.b64decode(data)
fname = 'temp.png'
with open(fname, 'wb') as f:
     f.write(image)
qr = qrtools.QR()
qr.decode(fname)

print qr.data

    
    
#sys.stdout.write(data1)

