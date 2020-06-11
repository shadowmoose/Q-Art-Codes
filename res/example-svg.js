const qr = require('../src/qr');
const fs = require('fs');

qr.makeQR(
	`{"lastName":"ever","firstName":"greatest","employeeID":1337,"online":true}`,
	fs.readFileSync("C:\\Images\\Background.svg", 'utf-8'),
	{ useSVG: true }
).then(async (img) => {
	console.log('Built image.');
	fs.writeFileSync('./out.svg', await img.encodeCanvas()); // Save the generated xml to a file.
}).catch(console.error)
