

exports.makeCanvas = async (width, height) => {
	if(typeof OffscreenCanvas !== 'undefined'){
		return new OffscreenCanvas(width, height);
	} else {
		const canv = document.createElement('canvas');
		canv.width  = width;
		canv.height = height;
		return canv;
	}
}

/**
 * Encodes the canvas object into a Data URL of the Image.
 * @param canv
 * @param {string} mimeType The type of image to output.
 * @param {number} quality
 * @return {Promise<string>} A DataURL representing this image.
 */
exports.encodeCanvas = async (canv, mimeType='image/png', quality=0.95) => {
	let blob;
	if (canv.convertToBlob) {
		blob = await canv.convertToBlob({type: mimeType, quality});
	} else {
		blob = await new Promise(res => {
			canv.toBlob(res, mimeType, quality);
		})
	}
	return URL.createObjectURL(blob);
}

exports.loadImage = async (url) => {
	if (url instanceof Image) {
		return url;
	}
	return new Promise((res, rej) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = () => {
			res(img);
		};
		img.onerror = rej;
		img.src = url;
	});
}
