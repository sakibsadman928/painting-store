import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;