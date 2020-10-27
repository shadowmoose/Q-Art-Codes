const qr = require('../');
const fs = require('fs');

const img = __dirname + '/images/img.png';
const outPath = __dirname + '/generated-QR.png';

console.log(img);

qr('https://pathofexile.gamepedia.com/Perquil%27s_Toe', img).then(async res => {
	console.log('Result:', res);
	await res.toStream(fs.createWriteStream(outPath));
})
