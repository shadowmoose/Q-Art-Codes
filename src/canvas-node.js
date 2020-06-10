const PImage = require('pureimage');
const fs = require('fs');

exports.makeCanvas = async (width, height) => {
	return PImage.make(width, height);
}

/**
 * Save the given canvas image to a PNG file.
 * @param {bitmap} canv The canvas/image object to save.
 * @param {string} outPath The path to save the file into.
 * @return {Promise<void>}
 */
exports.encodeCanvas = async (canv, outPath) => {
	return PImage.encodePNGToStream(canv, fs.createWriteStream(outPath));
}

exports.loadImage = async (url) => {
	return PImage.decodePNGFromStream(fs.createReadStream(url))
}
