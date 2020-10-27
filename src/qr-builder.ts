import * as QRCode from 'qrcode';
import {QRCodeOptions} from "qrcode";
import CanvasLoader from "./canvas/canvas-wrapper";
import SVGLoader from './canvas/canvas-svg';
let LoaderClass: CanvasLoader|null = null; // TODO: SVG Loader support.

/**
 * @hidden
 * @param newLoader
 */
export const setLoaderClass = (newLoader: any) => {
    LoaderClass = newLoader;
}

export interface QRStyleOpts {
    /**
     * The Version/error level to use. See [node-qrcode](https://www.npmjs.com/package/qrcode#error-correction-level).
     */
    qrOpts?: QRCodeOptions;
    /**
     * The individual colors used in the QR code.
     * All colors can be specified in rgba(), or any other HTML string.
     *
     * If `overlay` is set to a non-empty string, covers the image with this color to increase contrast. Use rgba().
     */
    colors?: {
        dark: string,
        light: string,
        overlay: string
    };
    /**
     * Adjust the scaling of the image.
     */
    size?: {
        /**
         * The size per-square in pixels.
         */
        boxSize: number,
        /**
         * The scale to resize data squares.
         */
        scale: number
    };
    useSVG?: boolean;
}

/**
 * Generates a QR code with an image background.
 *
 * @param data The data to encode within the image.
 * @param backgroundPath A path to the background PNG to use. In browser, should be a URL.
 * @param props Customize the QR code using these properties.
 *
 * @see {@link https://www.npmjs.com/package/qrcode#manual-mode QRCode data structure}
 */
export const make = async(data: string|QRCode.QRCodeSegment[], backgroundPath: string, props?: QRStyleOpts): Promise<CanvasLoader> => {
    if (!LoaderClass) throw Error("Loader was not set.");
    let { qrOpts, colors, size, useSVG} = props || {};
    qrOpts = qrOpts || {};
    colors = Object.assign({
        dark: 'rgba(0,0,0, 1.0)',
        light: 'rgba(255,255,255, 0.75)',
        overlay: ''
    }, colors||{});
    size = size || {boxSize: 6, scale: 0.35};
    // noinspection JSCheckFunctionSignatures
    const qrCode = QRCode.create(data, qrOpts);
    if (qrCode.version === 1) {
        // V2 makes the image more robust by adding bottom right square, so require v2 minimum.
        return await make(data, backgroundPath,{...props, qrOpts: {...qrOpts, version: 2}});
    }

    // Calc size information:
    const boxSize = size.boxSize || 6;
    const boxScale = size.scale || 0.35;
    const bits = new Uint8Array(qrCode.modules.data);
    const qrWidth = qrCode.modules.size;
    const reserved = new Uint8Array(qrCode.modules.reservedBit);
    const w = (qrWidth+2)*boxSize, h = (Math.ceil(bits.length / qrWidth)+2) * boxSize

    // Create working canvas:
    // @ts-ignore
    const loader = useSVG ? new SVGLoader(w, h) : new LoaderClass(w, h);
    // Init styles and images:
    const background = await loader.loadImage(backgroundPath);
    const img = await loader.canvas;
    const ctx = img.getContext('2d');

    ctx.fillStyle = colors.light;
    ctx.fillRect(0, 0, img.width, img.height);

    ctx.drawImage(background,
        0, 0, background.width, background.height, // source dimensions
        boxSize, boxSize, img.width - boxSize*2, img.height - boxSize*2 // destination dimensions
    );

    if (colors.overlay) {
        ctx.fillStyle = colors.overlay;
        ctx.fillRect(0, 0, img.width, img.height);
    }

    let x=0, y=0;
    bits.forEach( (b, idx) => {
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

        // @ts-ignore
        ctx.fillStyle = b ? colors.dark : colors.light;
        ctx.fillRect(ox,oy, square, square);
        x += 1;
    })

    return loader;
}

