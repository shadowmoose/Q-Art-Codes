/**
 * Polyfill class that replaces several basic Canvas methods with custom SVG rendering.
 */
class SVGCanvas {
	constructor() {
		this.col = 'white';
		this.shapeCache = {};
		this.defs = {};
		this.shapes = [];
		this.width = 0;
		this.height = 0;
	}

	makeCanvas(width, height) {
		this.width = width;
		this.height = height;
		return this;
	}

	getContext() {
		return this;
	}

	set fillStyle(value) {
		this.col = value;
	}

	fillRect(x, y, width, height) {
		const key = `${width}-${height}-${this.col}`;
		const newID = `s${Object.values(this.defs).length}`;
		let rect = this.shapeCache[key];
		if (!rect){
			this.defs[newID] = `<rect width="${width}" height="${height}" fill="${this.col}" id="${newID}"/>`;
			this.shapeCache[key] = newID;
			rect = newID;
		}
		this.shapes.push({ rect, x, y });
	}

	/**
	 * Mocks a dummy image object so the existing render commands work.
	 *
	 * @param img
	 * @return {{img: string, width: number, height: number}}
	 */
	loadImage(img) {
		if (typeof img !== 'string') {
			throw Error('Invalid image input - SVG Mode only supports pure text background images!');
		}

		return {
			width: 1,
			height: 1,
			img: `${img}`.replace(/<[?\s]*(xml)/gm, (m)=>m.replace('xml', 'misc'))
		}
	}

	drawImage(imageObj, xx, yy, ow, oh, dx, dy, dw, dh) {
		const txt = `<svg x="${dx}" y="${dy}" width="${dw}" height="${dh}">${imageObj.img}</svg>`;
		this.shapes.push({txt});
	}

	encodeCanvas() {
		let out = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.width}" height="${this.height}">\n`;
		out += '<defs>\n' + Object.values(this.defs).join('\n') + '</defs>\n';
		out += this.shapes.map(s => s.txt || `<use href="#${s.rect}" x="${s.x}" y="${s.y}"/>`).join('\n');
		return out + "</svg>"
	}
}

exports.SVGCanvas = SVGCanvas;

