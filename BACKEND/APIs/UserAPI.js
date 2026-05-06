import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { PostModel } from '../models/PostModel.js'
import { hash,compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middleware/verifyToken.js'
import { config } from 'dotenv'
import {upload} from '../config/multer.js'
import {uploadToCloudinary} from '../config/cloudinaryUpload.js'
const {sign}=jwt
export const userApp=exp.Router()

//user registration
userApp.post("/users",upload.single("profileImageUrl"),async(req,res)=>{
    //get user from body
    const newUser=req.body
    //upload image to cloudinary from memoryStorage
    // upload image to cloudinary if file exists
    if(req.file){
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer)
        newUser.profileImageUrl = cloudinaryResult.secure_url
    }

    //hash the password
    const hashedPassword=await hash(newUser.password,12)
    //replace plain password with hashed password
    newUser.password=hashedPassword
    //create newUserDocument 
    const newUserDocument=new UserModel(newUser)
    //save 
    const result=await newUserDocument.save()
    console.log(result)
    //response
    res.status(201).json({message:"Registration successful."})
})

//user login
userApp.post('/users/login',async(req,res)=>{
    //get data from req
    const {idCreds,password}=req.body
    // console.log(idCreds)
    //check email if it exists
    let user = await UserModel.findOne({$or:[{email:idCreds},{userName:idCreds}]})
    //if email isnt found
    if(!user){
        return res.status(400).json({message:"Invalid email."})
    }
    //if email is valid then validate the password.
    const passwordMatch = await compare(password,user.password)
    //if password doesnt match
    if(passwordMatch===false){
        return res.status(400).json({message:"Incorrect Password."})
    }

    //if the user is blocked from app-side(admin)
    if(!user.isUserActive){
    return res.status(403).json({message:"Your account has been blocked. Please contact the admin."})
    }

    //if password matches,give a token
    const signedToken=sign(
        {
        _id:user.id,
        email:user.email,
        bio:user.bio,
        firstName:user.firstName,
        userName:user.userName,
        profileImageUrl:user.profileImageUrl,
        lastName:user.lastName,
    },process.env.SECRET_KEY,{expiresIn:"1hr"})
    //store it as httpOnly token
    res.cookie("token", signedToken, {
        httpOnly: true,
        sameSite: "lax",  
        secure: false       
    })
    let userObj=user.toObject()
    delete userObj.password
    res.status(200).json({message:"Login Success",payload:userObj})
})

//user logout
userApp.get('/users/logout',async(req,res)=>{
    //delete token from the cookie storage
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    })
    res.status(200).json({message:"Logout Success."})
})

//reading all the posts
userApp.get('/posts/fyp',async(req,res)=>{
    //read posts
    const allPosts=await PostModel.find({isPostActive:"true"})
    //send res
    res.status(200).json({message:"Posts: ",payload:allPosts})
})

//reading following posts
userApp.get('/posts/following', verifyToken, async (req, res) => {
  try {
    const userId=req.user?._id;
    const user=await UserModel.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message:"No user found"});
    }
    const followingUsers = user.following
    console.log(followingUsers)
    const allPosts=await PostModel.find({
      author: { $in:followingUsers }
    });

    res.status(200).json({
      message:"Posts fetched successfully",
      payload:allPosts
    });

  } catch (err) {
    res.status(500).json({
      message:"Error fetching posts",
      error:err.message
    });
  }
});

//following-system
userApp.put("/users/following", verifyToken, async (req,res)=>{
    const {email}=req.body
    const bodyy=req.user?._id
    const searchUser=await UserModel.findOne({email:email})
    if(searchUser && searchUser._id==bodyy){
        res.status(400).json({message:"Cannot follow your account."})
    }
    await UserModel.updateOne({_id:bodyy},
        {$addToSet:{following:searchUser._id}})
    await UserModel.updateOne({_id:searchUser._id},
        {$addToSet:{followers:bodyy}})
    res.status(200).json({ message: "Following..." });
})

//search users
userApp.get("/users/search", verifyToken, async(req,res)=>{
    //get query from the req body
    const {query} = req.query
    //get users using query
    const users = await UserModel.find({
        $or: [
            { firstName:{ $regex: `^${query}`, $options: "i"} },
            { lastName:{ $regex: `^${query}`, $options: "i"} },
            { userName:{ $regex: `^${query}`, $options: "i"} }
        ],isUserActive:true 
    }, { firstName:1, lastName:1,userName:1, email:1, profileImageUrl:1 })
    //if users not found
    if(users.length===0){
        return res.status(404).json({message:`No results for '${query}' `})
    }
    //res
    res.status(200).json({message:"Search results: ", payload:users})
})

//Page refresh
userApp.get("/check-auth", verifyToken, (req,res)=>{
    res.status(200).json({
        message:"authenticated",
        payload:req.user
    })
})