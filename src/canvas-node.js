const PImage = require('pureimage');
const fs = require('fs');

exports.makeCanvas = async (width, height) => {
	const img = PImage.make(width, height);
	/**
	 * Save the given canvas image to a PNG file.
	 * @param {Stream} outStream The path to save the file into.
	 * @return {Promise<void>}
	 */
	img.encodeCanvas = async (outStream) => {
		return PImage.encodePNGToStream(img, outStream);
	}
	return img;
}

exports.loadImage = async (path) => {
	return PImage.decodePNGFromStream(fs.createReadStream(path))
}
