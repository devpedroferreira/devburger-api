import multer from 'multer';
import { v4 } from 'uuid';
import { resolve, extname } from 'path';

const fileFilter = (req, file, callback) => {
    // Allowed image formats
    const allowedMimes = [
        'image/jpg',
        'image/png'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Formato inválido. Apenas JPG e PNG são permitidos.'));
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
        fileFilter,
        limits: {
            fileSize: 40 * 1024 * 1024 // 40MB para imagens 4K não comprimidas
        }
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
        fileFilter,
        limits: {
            fileSize: 40 * 1024 * 1024 // 40MB para imagens 4K não comprimidas
        }
    },
};

export default uploadConfig;