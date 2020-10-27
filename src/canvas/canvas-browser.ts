import CanvasLoader, {CanvasIsh} from "./canvas-wrapper";

export default class BrowserLoader extends CanvasLoader {
    async loadImage(image: string): Promise<any> {
        return new Promise((res, rej) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                res(img);
            };
            img.onerror = rej;
            img.src = image;
        });
    }

    makeCanvas(width: number, height: number): CanvasIsh {
        let ret;
        if (typeof OffscreenCanvas !== 'undefined') {
            ret = new OffscreenCanvas(width, height);
        } else {
            const canv = document.createElement('canvas');
            canv.width  = width;
            canv.height = height;
            ret = canv;
        }

        return ret;
    }

    async toBlob(mimeType: string, quality: number): Promise<Blob> {
        let blob: any;
        if (this.canvas.convertToBlob) {
            blob = await this.canvas.convertToBlob({type: mimeType, quality});
        } else if (this.canvas.toBlob){
            blob = await new Promise(res => {
                // @ts-ignore
                canvas.toBlob(res, mimeType, quality);
            })
        }

        return blob;
    }

    toStream(_stream: any): void {
        throw Error('Cannot encode canvas to stream inside the browser! Use "toBlob" instead.')
    }
}
