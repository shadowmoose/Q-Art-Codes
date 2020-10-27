import {make as makeQR, setLoaderClass} from './qr-builder';
import BrowserLoader from './canvas/canvas-browser';

setLoaderClass(BrowserLoader);


export default makeQR;

