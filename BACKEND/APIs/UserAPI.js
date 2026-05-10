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
    },process.env.SECRET_KEY,{expiresIn:"7d"})
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

//update user-profile
userApp.put('/users/update-profile',verifyToken,async(req,res)=>{
    //get body from the req
    const {firstName,userName,bio}=req.body || {}
    const userId=req.user?._id
    // console.log(userId)
    const updates={}
    //check the fields that have been passed
    if(firstName!==undefined) updates.firstName=firstName;
    if(userName!==undefined) updates.userName=userName;
    if(bio!==undefined) updates.bio=bio;
    //if updates objects is empty
    if(Object.keys(updates).length===0){
        return res.status(400).json({message:"No updates done."})
    }
    const updatedProfile=await UserModel.findByIdAndUpdate(userId,
        { $set: updates },
        { new:true }
    )
    //res
    res.status(200).json({message:"Profile Updated."})
})

//Change password
userApp.put("/users/password",verifyToken,async(req,res)=>{
    //check the current password and new password are same
    const {currentPassword,newPassword}=req.body
    //console.log(currentPassword)
    //get the userId
    const userId=req.user?._id
    //get current password of user
    const user=await UserModel.findById(userId)
    //check the current password of req and user are not same
    const passwordMatch = await compare(currentPassword,user.password)
    //if password doesnt match
    if(!passwordMatch){
        return res.status(401).json({message:"Enter correct password to change password."})
    }
    //hash the password
    const sameValidation=await compare(newPassword,user.password)
    //if current and new passwords are same
    if(sameValidation===true){
        return res.status(400).json({message:"Current and new passwords cannot be same."})
    }
    const hashedPassword=await hash(newPassword,12)
    //replace current pass w hashed new password
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {$set:{password:hashedPassword}}
        )
    //res
    res.status(200).json({message:"Password changed successfully."})
})

//reading all the posts
userApp.get('/posts/fyp',async(req,res)=>{
    //get user id from body
    const userId=req.user?._id
    //get user by id
    const user=await UserModel.findById(userId)
    let query={isPostActive:true}
    //get preferences if user has any
    if(user?.preferredCategories?.length>0){
        query.category={$in:user.preferredCategories}
    }
    //read posts
    const allPosts=await PostModel.find(query).populate("author", "firstName lastName userName profileImageUrl").sort({createdAt:-1})
    //send res
    res.status(200).json({message:"Posts: ",payload:allPosts})
})

//change preferred content
userApp.put('/users/preferences',verifyToken,async(req,res)=>{
    const {preferredCategories}=req.body
    const userId=req.user?._id
    await UserModel.findByIdAndUpdate(userId,
        {$set:{preferredCategories}},
        {new:true}
    )
    res.status(200).json({message:"Preferences updated."})
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
    }).populate("author","firstName lastName userName profileImageUrl").sort({createdAt:-1})

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
    const currentUser=await UserModel.findById(bodyy)
      const searchUser=await UserModel.findOne({email:email})
    if(currentUser.following.includes(searchUser._id)){
await UserModel.findByIdAndUpdate(bodyy,{$pull:{following:searchUser._id}})
await UserModel.findByIdAndUpdate(searchUser._id,{$pull:{followers:bodyy}})
res.status(200).json({message:"unfollowed the user successfully"})
    }
else{
    if(searchUser && searchUser._id==bodyy){
     return   res.status(400).json({message:"Cannot follow your account."})
    }
    await UserModel.updateOne({_id:bodyy},
        {$addToSet:{following:searchUser._id}})
    await UserModel.updateOne({_id:searchUser._id},
        {$addToSet:{followers:bodyy}})
    res.status(200).json({ message: "Following..." });
}
})

//to view user's followers
userApp.get('/users/followers/:id',verifyToken,async(req,res)=>{
    //get userId from endpoint
    const userId=req.params.id
    // console.log(userId)
    //get user
    const user=await UserModel.findById(userId).populate("followers")
    //if user not found/not active
    if(!user || user.isUserActive===false){
        return res.status(404).json({message:"User Not Found"})
    }
    //res
    res.status(200).json({message:"Follwers: ",payload:user.followers})
})

//to view following users
userApp.get('/users/following/:id',verifyToken,async(req,res)=>{
    //get userId from endpoint
    const userId=req.params.id
    // console.log(userId)
    //get user
    const user=await UserModel.findById(userId).populate("following")
    //if user not found/not active
    if(!user || user.isUserActive===false){
        return res.status(404).json({message:"User Not Found"})
    }
    //res
    res.status(200).json({message:"Following: ",payload:user.following})
})

//to view own followers
userApp.get('/users/followers',verifyToken,async(req,res)=>{
    //get userId from token
    const userId=req.user?._id
    // console.log(userId)
    //get user
    const user=await UserModel.findById(userId).populate("followers")
    //if user not found
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    }
    //res
    res.status(200).json({message:"Followers: ",payload:user.followers})
})

//to view own following
userApp.get('/users/following',verifyToken,async(req,res)=>{
    //get userId from token
    const userId=req.user?._id
    // console.log(userId)
    //get user
    const user=await UserModel.findById(userId).populate("following")
    //if user not found
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    }
    //res
    res.status(200).json({message:"Following: ",payload:user.following})
})


//to view profiles
userApp.get('/users/profile/:id',verifyToken,async(req,res)=>{
    //get userId from endpoint
    const userId=req.params.id
    //get user by id
    const user=await UserModel.findById(userId)
    //if not found
    if(!user){
        return res.status(404).json({message:"User Not Found."})
    }
    // fetch their posts too
    const posts=await PostModel.find({author:userId}).sort({createdAt:-1})
    //res
    res.status(200).json({message:"Profile: ",payload:user,posts})
})

//to view own profile
userApp.get('/users/profile',verifyToken,async(req,res)=>{
    //get userId from token
    const userId=req.user?._id
    //get user by id
    const user=await UserModel.findById(userId)
    //if not found
    if(!user){
        return res.status(404).json({message:"User Not Found."})
    }
    // fetch posts
    const posts=await PostModel.find({author:userId}).sort({createdAt:-1})
    //res
    res.status(200).json({message:"Profile: ",payload:user,posts})
})


//to view liked posts
userApp.get('/users/liked-posts', verifyToken, async(req,res)=>{
    //get body from req
    const userId=req.user?._id
    //find user
    const user=await UserModel.findById(userId).populate("likedPosts")
    //res 
    res.status(201).json({message:"Liked Posts: ",payload:user.likedPosts})
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

//saved posts
userApp.put('/users/saved/:id',verifyToken,async (req,res)=>{
    //get id from endpoint
    const postId=req.params.id
    //get userId from token
    const userId=req.user?._id
    //extract the userobj
    const userObj=await UserModel.findById(userId)
    //find if user already saved the post
    if(userObj.savedPosts.includes(postId)){
 await UserModel.updateOne({_id:userId},
    {$pull:{savedPosts:postId}})
    res.status(200).json({message:"post unsaved."})
    }
else{
    await UserModel.updateOne({_id:userId},
    {$addToSet:{savedPosts:postId}})
    res.status(200).json({message:"post saved."})
    }
})
//get saved posts
userApp.get("/users/saved", verifyToken,async (req,res)=>{
    //userobj from usermodel
   const userId=req.user?._id
   const posts=await UserModel.findById(userId).populate("savedPosts")
   //res
   res.status(200).json({message:"Saved Posts: ",payload:posts.savedPosts})

})

//Page refresh
userApp.get("/check-auth",verifyToken,async(req,res)=>{
    const user=await UserModel.findById(req.user._id).select("-password")
    res.status(200).json({
        message:"authenticated",
        payload: user
    })
})