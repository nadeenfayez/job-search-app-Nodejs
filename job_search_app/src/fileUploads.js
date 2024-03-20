import multer from 'multer';
import { AppError } from './utilities/AppError.js';


export const uploadSingleFile = (fieldname) => {
    const storage = multer.diskStorage({}); // Store in multer cache not in the disk

    function fileFilter (req, file, cb) {
        //(file.mimetype === "application/pdf") && cb(null, true) || cb(new AppError("You should upload PDFs files only!", 400), false);
        (file.mimetype === "application/pdf") ? cb(null, true) : cb(new AppError("You should upload PDF files only!", 400), false);
    }

    const upload = multer({storage, fileFilter});

    return upload.single(fieldname);
};
