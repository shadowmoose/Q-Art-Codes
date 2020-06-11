const QRCode = require('qrcode');
const canvasWrapper = require('./canvas-node');
const svg = require('./svg-renderer');

/**
 * Generates a QR code with an image background.
 *
 * @param data {String|Array} The data to encode within the image.
 * @param backgroundPath {string} A path to the background PNG to use.
 * @param props Options to configure the output.
 * @param props.qrOpts {version, errorCorrectionLevel} The Version/error level to use. See [node-qrcode](https://www.npmjs.com/package/qrcode#error-correction-level).
 * @param props.colors {dark, light, overlay} Two Strings, which represent the light & dark colors to use. If `overlay` is set, adds a color over the image - use alpha! All can be `rgba()`.
 * @param props.size {boxSize, scale} Two numbers, indicating the size per-square in pixels, and the scale to resize data squares.
 * @return {Promise<{decodeCanvas}>} The canvas object, containing the QR code data.
 */
const make = async(data, backgroundPath, props = {qrOpts: {}, colors: {}, size: {}, useSVG: false}) => {
	let { qrOpts, colors, size, useSVG} = props;
	qrOpts = qrOpts || {};
	colors = colors || {};
	size = size || {boxSize: 6, scale: 0.35};
	// noinspection JSCheckFunctionSignatures
	const qrCode = QRCode.create(data, qrOpts);
	const canvas = useSVG ? new svg.SVGCanvas() : canvasWrapper;
	if (qrCode.version === 1) {
		// V2 makes the image more robust by adding bottom right square, so require v2 minimum.
		return await make({...props, qrOpts: {...qrOpts, version: 2}})
	}
	// noinspection JSCheckFunctionSignatures
	const background = await canvas.loadImage(backgroundPath);
	const bits = new Uint8Array(qrCode.modules.data);
	const reserved = new Uint8Array(qrCode.modules.reservedBit);
	const qrWidth = qrCode.modules.size;
	const boxSize = size.boxSize || 6;
	const boxScale = size.scale || 0.35;
	const colorDark = colors.dark || 'rgba(0,0,0, 1.0)', colorLight = colors.light || 'rgba(255,255,255, 0.75)';
	const img = await canvas.makeCanvas((qrWidth+2)*boxSize, (Math.ceil(bits.length / qrWidth)+2) * boxSize);
	const ctx = img.getContext('2d');

	ctx.fillStyle = colorLight;
	ctx.fillRect(0, 0, img.width, img.height);

	ctx.drawImage(background,
		0, 0, background.width, background.height, // source dimensions
		boxSize, boxSize, img.width - boxSize*2, img.height - boxSize*2 // destination dimensions
	);

	if (colors.overlay) {
		ctx.fillStyle = colors.overlay;
		ctx.fillRect(0, 0, img.width, img.height);
	}

	let idx = 0,x=0, y=0;
	for (const b of bits) {
		if (idx && 0 === (idx % qrWidth)){
			y +=1;
			x = 0;
		}
		const important = reserved[idx];
		let ox = (x+1)*boxSize, oy = (y+1)*boxSize, square = boxSize;

		if (!important) {
			square = Math.ceil(boxSize * boxScale);
			ox += Math.ceil((boxSize - square)/2);
			oy += Math.floor((boxSize - square)/2);
		}

		ctx.fillStyle = b ? colorDark : colorLight;
		ctx.fillRect(ox,oy, square, square);
		x += 1;
		idx += 1;
	}

	return img;
}

exports.makeQR = make;
