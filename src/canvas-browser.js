

exports.makeCanvas = async (width, height) => {
	return typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(width, height) : document.createElement('canvas');
}

/**
 * Encodes the canvas object into a Data URL of the Image.
 * @param canv
 * @param {String} type The type of image format to use.
 * @param {object} encoderOptions Additional options object for `canvas.toDataURL`.
 * @return {Promise<string>} The data URL string representing this image.
 */
exports.encodeCanvas = async (canv, type='png', encoderOptions={}) => {
	return canv.toDataURL(type, encoderOptions);
}

exports.loadImage = async (url) => {
	return new Promise((res, rej) => {
		const img = new Image();

		img.onload = () => {
			res(img);
		};
		img.onerror = rej;
		img.src = url;
	});
}
