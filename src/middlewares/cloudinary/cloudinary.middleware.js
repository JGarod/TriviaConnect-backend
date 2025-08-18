// backend/middlewares/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const uid = req.user.uuid_imagen;
        return {
            folder: 'perfiles', // Carpeta donde se guardarán en Cloudinary
            public_id: uid, // Usamos el uid que viene del frontend
            allowed_formats: ['jpg', 'png', 'jpeg'],
            format: "jpg", 
            invalidate: true,
            // transformation: [{ width: 500, height: 500, crop: 'limit' }],
            overwrite: true // asegura que lo reemplace // opcional
        };
    },
});

const upload = multer({ storage });

module.exports = upload;
