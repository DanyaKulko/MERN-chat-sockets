const multer = require('multer');
const uuid = require('uuid').v4;

const imageUpload = (folder) => {
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(null, false);
            req.fileExtensionUploadError = 'Not an image!';
        }
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/${folder}`);
        },
        filename: (req, file, cb) => {
            cb(null, uuid() + '.' + file.originalname.split('.').pop());
        }
    });
    return multer({storage: storage, fileFilter: multerFilter});
}

module.exports = imageUpload;