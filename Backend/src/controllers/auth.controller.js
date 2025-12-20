import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });
export const signup= async(req,res)=>{
    const { fullName, email, password } = req.body;

    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        } 
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email address"});
        }   
    
   const user = await User.findOne({email});
   if(user){
    return res.status(400).json({message:"Email already exists"});
   }  
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password,salt);
   const newUser = new User({
    fullName:fullName,
    email,  
    password:hashedPassword
   }); 
   if(newUser){
    generateToken(newUser._id,res)
    await newUser.save();
    

    // sending welcome email
    try {
        await sendWelcomeEmail(email,fullName,process.env.CLIENT_URL);  
    } catch (error) {
        console.log(error);
    }
    return res.status(201).json({_id:newUser._id,fullName:newUser.fullName,email:newUser.email,profilePic:newUser.profilePic});

   }
   else{
    return res.status(400).json({message:"Invalid user data"}); 
}
}

    catch(err){
        console.log("Error in signup:",err);
        return res.status(500).json({message:"Server error"});
    }
};
export const login= async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        } 
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }  
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }
        generateToken(user._id,res);
        return res.status(200).json({_id:user._id,fullName:user.fullName,email:user.email,profilePic:user.profilePic});     
}
catch(err){
    console.log("Error in login:",err);
    return res.status(500).json({message:"Server error"});
}
}



export const logout= async(_,res)=>{
    res.cookie("jwt","",{
        maxAge:0,}
    );

    return res.status(200).json({message:"Logged out successfully"});
};