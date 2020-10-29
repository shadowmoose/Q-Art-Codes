# Q-Art-Codes [![](https://data.jsdelivr.com/v1/package/npm/qart-codes/badge)](https://www.jsdelivr.com/package/npm/qart-codes) [![npm](https://img.shields.io/npm/v/qart-codes?style=flat-square)](https://www.npmjs.com/package/qart-codes) ![](https://raw.githubusercontent.com/shadowmoose/Q-Art-Codes/image-data/loc-badge.svg)
My own "fancy" browser-and-server-side QR Code generator.

It generates QR Codes with image backgrounds, supporting any size, data, or color combinations you want.

This is built in pure JavaScript, so it should run anywhere. A bundle has also been provided for browser use.

[![](./examples/images/sample1.png)
![](./examples/images/sample2.png)
![](./examples/images/sample3.png)](https://shadowmoose.github.io/Q-Art-Codes/examples/editor.html)

Edit your own image and check out the options [in-browser here](https://shadowmoose.github.io/Q-Art-Codes/examples/editor.html).

## Installation:
Simply run `npm i qart-codes`

## Use guide:

### NodeJS:
```js
const qr = require('qart-codes');
const fs = require('fs');

qr(
	`{"lastName":"ever","firstName":"greatest","employeeID":1337,"online":true}`, // Data to encode - string or binary array.
	"C:\\CompanyLogo.png" // The background image to use.
).then(async res => {
	await res.toStream(fs.createWriteStream(outPath));  // Write to a file, or choose another output stream.
})
```

### Browser:
```html
<!-- Download this locally or pin the version in production, the code at this link can change: -->
<script src="https://cdn.jsdelivr.net/npm/qart-codes/dist/index-browser.min.js"></script>
<script>
	makeQR(
		`https://shadowmoo.se`,
		"https://i.imgur.com/7tMdIX9.png",
		{
			colors: {
				dark: 'rgba(37,45,206, 1.0)',
				light: 'white'
			}
		}
	).then(async canv => {
		const uri = URL.createObjectURL(await canv.toBlob('image/png', 0.95)); // The browser encodes to Object URIs.
		const img = new Image();
		img.src = uri;
		document.body.appendChild(img);
	})
</script>
```


## Full Generator Options:
This config is the same in the browser and server.
Here are all the options, with sample values:
```js
const opts = {
    qrOpts: {
        version: 2,  // You may pin the QR version used here, no lower than 2.
        errorCorrectionLevel: 'H'  // See https://www.npmjs.com/package/qrcode#error-correction-level
    },
    size: {
        boxSize: 6,  // The base size, in px, that each square should take in the grid.
        scale: 0.35  // Scale the "small" boxes down to this ratio.
    },
    colors: {
        dark: 'black',  // The color to use for the dark squares.
        light: 'white', // The color to use for the light squares.
        overlay: 'rgba(0,0,0,0.7)'  // If set, cover the background image in a color - this can be used to increase readability.
    },
    useSVG: false  // See "Encoding SVGs".
}
```

## Platform Differences:
For the most part, the code runs the same in the browser and in Node.
However, due to limitations in each environment, the result object behaves differently with binary image data.

+ In the Browser, the canvas `toBlob('image/png', 0.95)` accepts an image mimetype, and a quality level.
  + It returns a Blob, which can be used to create images in the DOM.

+ In Node, the canvas `toStream(stream)` accepts an output stream, which it writes binary PNG image data to.
  + There is no return value for this call, as it is assumed Node will be sending or saving this image.


## Encoding SVGs:
SVG output is tentatively supported in the Browser & Node as of version 2.0.0.

When `useSVG` is enabled, the output `toSVG()` will always return raw SVG text, no matter the platform running the code.
Additionally, the given background image MUST be a pre-loaded string, containing the background SVG text.

You may have to do some manual formatting of your input background SVG, if you want things to look a specific way.
The encoder tries to fix some of the more common issues, but it is not able to fix everything automatically.
