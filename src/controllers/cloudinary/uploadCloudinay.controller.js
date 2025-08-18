//fBuscar usuario por slug
const uploadUserCloudinary = async (req, res, next) => {
    try {
        const { filename, mimetype } = req.file;
        const extension = mimetype.split('/')[1]; // jpg | jpeg | png
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${filename}.${extension}`;
        return res.json({
            message: 'Imagen subida correctamente',
            url, // URL pública de Cloudinary
            // public_id: req.file.filename // será igual al uid
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    uploadUserCloudinary
}
