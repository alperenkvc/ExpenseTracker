const multer = require("multer");
const path = require("path");

//Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

//File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedExtensions = [".jpeg", ".jpg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if(allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)){
        cb(null, true);
    }else {
        cb(new Error("Only .jpeg, .jpg and .png formats are allowed."), false);
    }
}

const upload = multer({storage, fileFilter});

module.exports = upload;