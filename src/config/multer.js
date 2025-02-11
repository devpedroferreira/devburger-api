import multer from 'multer';
import { resolveSoa } from 'node:dns';
import { v4 } from 'uuid';

// fotos vai ficar em ./uploads
import { extname, resolve } from 'node:path';


export default {
    storage:multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads')
        filename(request, file, callback) => {
            return callback(null, )
        }
    })
};










