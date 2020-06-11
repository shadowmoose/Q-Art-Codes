

exports.makeCanvas = async (width, height) => {
	let ret;
	if (typeof OffscreenCanvas !== 'undefined') {
		ret = new OffscreenCanvas(width, height);
	} else {
		const canv = document.createElement('canvas');
		canv.width  = width;
		canv.height = height;
		ret = canv;
	}

	/**
	 * Encodes the canvas object into a Data URL of the Image.
	 *
	 * @param {string} mimeType The type of image to output.
	 * @param {number} quality A decimal, representing the image quality level to target.
	 * @return {Promise<string>} A DataURL representing this image.
	 */
	ret.encodeCanvas = async (mimeType='image/png', quality=0.95) => {
		let blob;
		if (ret.convertToBlob) {
			blob = await ret.convertToBlob({type: mimeType, quality});
		} else {
			blob = await new Promise(res => {
				ret.toBlob(res, mimeType, quality);
			})
		}
		return URL.createObjectURL(blob);
	}

	return ret;
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
