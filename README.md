# QArt-Codes [![](https://data.jsdelivr.com/v1/package/npm/qart-codes/badge)](https://www.jsdelivr.com/package/npm/qart-codes)
My own "fancy" browser-and-server-side QR Code generator.

This is built in pure JavaScript, so it should run anywhere. A bundle has also been provided for browser use.

## Installation:
Simply run `npm i qart-codes`

## Use guide:

### NodeJS:
```js
const qr = require('qart-codes');

qr.makeQR(
	`{"lastName":"ever","firstName":"greatest","employeeID":1337,"online":true}`, // Data to encode - string or binary array.
	"C:\\CompanyLogo.png" // The background image to use.
).then(async (img) => {
	console.log('Built image.');
	await qr.encodeQR(img, 'out.png'); // Save the generated canvas bitmap to a file.
}).catch(console.error)
```

### Browser:
```html
<!-- Download this locally or pin the version in production, the code at this link can change: -->
<script src="https://cdn.jsdelivr.net/npm/qart-codes/bundle/browser.js"></script> 
<script>
	qartCode.makeQR(
		`https://shadowmoo.se`,
		"https://i.imgur.com/7tMdIX9.png",
		{
			colors: {
				dark: 'rgba(37,45,206, 1.0)',
				light: 'white'
			}
		}
	).then(async canv => {
		const uri = await qartCode.encodeQR(canv, 'image/png', 0.95); // The browser encodes to Object URLs.
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
        scale: 2.5  // If set, scale the image up or down.
    },
    colors: {
        dark: 'black',  // The color to use for the dark squares.
        light: 'white', // The color to use for the light squares.
        overlay: 'rgba(0,0,0,0.7)'  // If set, cover the background image in a color - this can be used to increase readability.
    }
}
```
