import multer from 'multer';
import { v4 } from 'uuid';
import { resolve, extname } from 'path';

const fileFilter = (req, file, callback) => {
    // Allowed image formats
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/pjpeg'  // Progressive JPEG
    ];

    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Formato inválido. Apenas JPG/JPEG e PNG são permitidos.'));
    }
};

const uploadConfig = {
    // Configuração para categorias
    categories: {
        storage: multer.diskStorage({
            destination: resolve('uploads', 'categories'),
            filename: (req, file, callback) => {
                const filename = `${v4()}${extname(file.originalname)}`;
                return callback(null, filename);
            },
        }),
        fileFilter
    },
    
    // Configuração para produtos
    products: {
        storage: multer.diskStorage({
            destination: resolve('uploads', 'products'),
            filename: (req, file, callback) => {
                const filename = `${v4()}${extname(file.originalname)}`;
                return callback(null, filename);
            },
        }),
        fileFilter
    },
};

export default uploadConfig;