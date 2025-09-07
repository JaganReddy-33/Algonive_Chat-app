import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


// signup controller
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ success: false, message: "Missing Credential details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ fullName, email, password: hashedPassword, bio });
    const token = generateToken(newUser._id);

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ success: true, user: userWithoutPassword, token, message: "User created successfully" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// login controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(userData._id);
    const { password: _, ...userWithoutPassword } = userData.toObject();

    res.json({ success: true, user: userWithoutPassword, token, message: "Login successful" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// controller to check if user authenticated 
export const checkAuth= async(req, res)=>{
    res.json({success:true, user:req.user});
}

//controller to update user profile 
export const updateProfile = async(req, res)=>{
    try{
        const {profilePic,fullName, bio}=req.body;
        const userId= req.user._id;

        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId, {fullName, bio}, {new:true});
        } else{
            const upload= await cloudinary.uploader.upload(profilePic, {folder: "chatApp"});
            updatedUser=await User.findByIdAndUpdate(userId, {fullName, bio, profilePic:upload.secure_url}, {new:true});
        }
        res.json({success:true, user: updatedUser});

    } catch(error){
        console.log("Update profile error:", error.message);
         res.status(500).json({ success: false, message: error.message });
    }
}

