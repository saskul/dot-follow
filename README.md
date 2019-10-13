# Dot-Follow
Pet project showcasing my current interests and skills.
It's a Single-page Application which displays a 2-dimensional array of dots (colored circles). User can choose from collection of images or upload his own to see how dots reassemble themselves to follow the pattern on the picture. She can change the sorting algorithm and complexity of bitmap conversion.


## C++ bmp2json module
The backbone of the project - transformation from bmp to json - is carried by C++ module, which is wrapped in Napi class to be implemented in Node.js with ease. JavaScript module consists of a single function:

`bmp2json( string src, int divisor)`

- src - the path of the bmp file to be converted
- divisor - the magnitude of data scaling. If picture is 512x512 then the divisor value of 2 will mean that the resulting array will be 256x256 in length, 4 - 128x128 and so on.


## Express server
Node.js express server allows for maintaining user session, uploading images and analyzing them. It also serves the website.

## React.js website
The front-end of the project is written in React.js with TypeScript.  
