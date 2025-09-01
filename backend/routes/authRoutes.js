const express = require("express");
const upload = require("../middleware/uploadMiddleware.js");
const {protect} = require("../middleware/authMiddleware.js");

const{
    registerUser,
    loginUser,
    getUserInfo,
    updateUserProfile
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", protect, getUserInfo);
router.put("/update-profile", protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if(!req.file){
        return res.status(400).json({error: true, message: "No file uploaded."});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
});

module.exports = router;