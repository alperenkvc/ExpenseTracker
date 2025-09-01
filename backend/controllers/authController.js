const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

//Register user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //Validation: Check for missing fields
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required." });
    }
    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is requied." });
    }

    try {
        //Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: true, message: "Email already in use" });
        }

        //Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
}

//Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //Validation: Check for missing fields
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required." });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required." });
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: true, message: "No users found with the current email."});
        }
        if(!(await user.comparePassword(password))){
            return res.status(400).json({error: true, message: "Invalid password."});
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });
    }catch(err){
        return res.status(500).json({message: "Error while logging in: ", error: err.message});
    }
}

//Get user info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({error: true, message: "User not found"});
        }

        return res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: "Error finding user: ", error: err.message});
    }
}

//Update user profile
exports.updateUserProfile = async (req, res) => {
    const { fullName, profileImageUrl } = req.body;

    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        // Update fields if provided
        if (fullName) {
            user.fullName = fullName;
        }
        if (profileImageUrl !== undefined) {
            user.profileImageUrl = profileImageUrl;
        }

        await user.save();

        // Return user without password
        const updatedUser = await User.findById(req.user.id).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
}