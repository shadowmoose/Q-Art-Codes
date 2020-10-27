/**
 * Polyfill class that replaces several basic Canvas methods with custom SVG rendering.
 */
import CanvasLoader, {CanvasGraphics, CanvasIsh} from "./canvas-wrapper";

export default class CanvasSVG extends CanvasLoader {
    constructor(width: number, height: number) {
        super(width, height);
    }

    makeCanvas(width: number, height: number): CanvasIsh {
        return new SVGCanvas(width, height);
    }

    loadImage(image: string): Promise<any> {
        // @ts-ignore
        return this.canvas.loadImage(image);
    }

    toBlob(mimeType: string, quality: number): Promise<Blob> {
        throw Error('Blob conversion is not implemented for SVG QR Codes.')
    }

    toStream(stream: any): void {
        throw Error('toStream is not implemented for SVG QR Codes.')
    }

    toSVG() {
        // @ts-ignore
        return this.canvas.toSVG();
    }
}

export class SVGCanvas implements CanvasIsh, CanvasGraphics{
    private col: string;
    private readonly shapeCache: Record<string, string> = {};
    private readonly defs: Record<string, string> = {};
    private readonly shapes: any[] = [];
    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.col = 'white';
        this.width = width;
        this.height = height;
    }

    getContext() {
        return this;
    }

    set fillStyle(value: string) {
        this.col = value;
    }

    fillRect(x: number, y: number, width: number, height: number) {
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
    loadImage(img: string) {
        if (typeof img !== 'string') {
            throw Error('Invalid image input - SVG Mode only supports pure text background images!');
        }

        return {
            width: 1,
            height: 1,
            img: `${img}`.replace(/<[?\s]*(xml)/gm, (m)=>m.replace('xml', 'misc'))
        }
    }

    drawImage(imageObj: any, xx: number, yy: number, ow: number, oh: number, dx: number, dy: number, dw: number, dh: number) {
        const txt = `<svg x="${dx}" y="${dy}" width="${dw}" height="${dh}">${imageObj.img}</svg>`;
        this.shapes.push({txt});
    }

    toSVG() {
        let out = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.width}" height="${this.height}">\n`;
        out += '<defs>\n' + Object.values(this.defs).join('\n') + '</defs>\n';
        out += this.shapes.map(s => s.txt || `<use href="#${s.rect}" x="${s.x}" y="${s.y}"/>`).join('\n');
        return out + "</svg>"
    }
}
