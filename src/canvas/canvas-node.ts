import CanvasLoader, {CanvasIsh} from "./canvas-wrapper";
import * as fs from "fs";
// @ts-ignore
import * as PImage from 'pureimage';

/**
 * Node Canvas implementation.
 */
export default class NodeLoader extends CanvasLoader {
    async loadImage(image: string): Promise<any> {
        return PImage.decodePNGFromStream(fs.createReadStream(image))
    }

    makeCanvas(width: number, height: number): CanvasIsh {
        return PImage.make(width, height);
    }

    async toBlob(_mimeType: string, _quality: number): Promise<Blob> {
        throw Error('Cannot encode canvas to Blob inside Node! Use "toStream" instead.')
    }

    toStream(stream: any): void {
        return PImage.encodePNGToStream(this.canvas, stream);
    }
}
