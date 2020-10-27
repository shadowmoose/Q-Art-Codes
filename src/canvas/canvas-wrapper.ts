import {Stream} from "stream";


/**
 * A helper class, which wraps all encoding/decoding of images in Node or the Browser.
 */
export default abstract class CanvasLoader {
    protected canvas: CanvasIsh;
    constructor(width: number, height: number) {
        this.canvas = this.makeCanvas(width, height);
    }

    /**
     * Build a "Canvas" representation internally. The exact implementation depends on the environment.
     * @param width
     * @param height
     * @hidden
     */
    protected abstract makeCanvas (width: number, height: number): CanvasIsh;

    /**
     * Export the generated QR code as a Blob.
     *
     * Note that this only works within a Browser, and will raise an Error otherwise.
     * @param mimeType The type of image file to export. eg: "image/png"
     * @param quality A float representing the desired image quality (0.95 is a good baseline).
     * @see {@link toStream} For running in Node.
     */
    abstract toBlob (mimeType: string, quality: number): Promise<Blob>;

    /**
     * Export the generated QR code to an open Stream.
     *
     * Note that this only works within NodeJS, and will raise an Error otherwise.
     * @param stream A Stream, already opened by Node. This can lead to a file, an outgoing HTTP stream, etc.
     * @see {@link toStream} For running in Node.
     */
    abstract toStream (stream: Stream): void;

    /**
     * Load an image, using logic inherent to the environment.
     * @param image
     * @hidden
     */
    abstract loadImage (image: string): Promise<any>;

    toSVG(): string { throw Error('toSVG() is not implemented for this QR Code Type.')}
}

interface blobCB {(): Blob}

export interface CanvasIsh {
    getContext(arg0: string): CanvasGraphics|null;
    width: number;
    height: number;
    convertToBlob?(opts: any): Promise<Blob>;
    toBlob?(callback: blobCB, ...opts: any): void;
}


export interface CanvasGraphics {
    fillStyle: any;
    fillRect: (x: number, y: number, width: number, height: number) => void;
    drawImage: (img: any, x: number, y: number, width: number, height: number, dBoxW: number, dBoxH: number, dWidth: number, dHeight: number) => void;
}

