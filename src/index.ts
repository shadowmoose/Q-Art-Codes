import {make as makeQR, setLoaderClass} from './qr-builder';
import NodeLoader from './canvas/canvas-node';

setLoaderClass(NodeLoader);


export default makeQR;

