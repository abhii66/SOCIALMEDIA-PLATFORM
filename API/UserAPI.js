
// //create min express app(Seperate Route)
// import exp from 'express'
// import { UserModel } from '../Models/UserModel.js';
// import { hash,compare } from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { verifyToken } from '../middlewares/verifyToken.js';
// const {sign}=jwt
// export const userApp = exp.Router()

// //Define USER REST API Routes

// //user login 
// userApp.post("/auth", async(req,res) => {
//     //get cred obj from client
//     const {email,password}=req.body
//     //email authentication
//     const user= await UserModel.findOne({email:email})
//     //if email not exist
//     if(user===null)
//         return res.status(400).json({message:"Invalid Email"})
//     //password verification
//     const result= await compare(password,user.password)
//     //if password not match
//     if(result == false)
//         return res.status(400).json({message:"Invalid password"})
//     //if passwords are matched
//     //create token (jsonwebtoken jwt -->jaat)
//     const signedToken = sign({email:user.email},process.env.SECRET_KEY,{expiresIn:"1h"})
//     /*send token in res
//     return res.status(200).json({message:"Login Success",token: signedToken})*/

//     //store token as httpOnly cookie
//     res.cookie("token",signedToken,{
//         httpOnly:true,
//         sameSite:"lax",
//         secure:false  //secure:true is used for https protocols but no http protocaol. as we are in initial stages we use http protocol 
//     })
//     //send res
//     res.status(200).json({message:"login Successful",payload: user})
//  })

// //Create a new User
// userApp.post("/users", async (req, res) => {
//     //get new user obj from req
//     const newUser = req.body;
//     //hash the password
//     const hashedPassword=await hash(newUser.password,10)
//     //replace plain password with hashed password
//     newUser.password=hashedPassword
//     //create new user document
//     const newuserDocument = new UserModel(newUser)
//     //save
//     const result = await newuserDocument.save()
//     //console.log(result)
//     //send res
//     res.status(201).json({ message: "User Created" }) //201 status code shows successfull creation of user
// }
// )

// //update user profile
// userApp.put("/user",verifyToken,async (req,res)=>{
//     //get user 
// })


import exp from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'

export const userApp = exp.Router()

// Register
userApp.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already taken.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({ name, username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully.' })

  } catch (err) {
    res.status(500).json({ message: "Failed to register user.",error: err.message })
  }
})

// Login
userApp.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const signedToken = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )


    res.cookie("token", signedToken, {
     httpOnly: true,
     secure: false,
     sameSite: "none",
     });
    //remove password from user document
    let userObj = user.toObject();
    delete userObj.password;

   //send res
   res.status(200).json({ message: "login success", payload: userObj });
   }
   catch (err) {
    res.status(500).json({ error: 'Failed to login.' })
  }
})

// Logout User
userApp.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })

    res.status(200).json({
      message: "Logout successful"
    })

  } catch (err) {
    res.status(500).json({
      message:"Failed To Logout",error:err.message
    })
  }
})

// Check Authentication (used during page refresh)
userApp.get("/check-auth", verifyToken, (req, res) => {
  try {
    res.status(200).json({
      message: "User authenticated",
      payload: req.user
    })

  } catch (err) {
    res.status(500).json({
      error: "Authentication check failed"
    })
  }
})

//Get Current Users profile
userApp.get("/mine", verifyToken, async(req,res)=>{
    try{
        const user = await UserModel.findById(req.user.id)
            .select("-password")

        res.status(200).json({
            message:"My profile fetched",
            payload:user
        })
    }
    catch(err){
        res.status(500).json({
            message:"Failed to fetch profile",error:err.message
        })
    }
})

// Get Profile By ID
userApp.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name username profilePic')
      .populate('following', 'name username profilePic')

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.status(200).json({ message: 'Profile fetched successfully.', payload: user })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' })
  }
})

// Update Profile
userApp.put('/update', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, bio} = req.body
    let profilePicUrl

    if (req.file) {
      profilePicUrl= await uploadToCloudinary(req.file.buffer, 'profilePics')
    }

    const updatedData = {
      ...(name && { name }),
      ...(bio && { bio }),
      ...(profilePicUrl && { profilePic: profilePicUrl }),
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true }
    ).select('-password')

    res.status(200).json({ message: 'Profile updated successfully.', payload: updatedUser })

  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' })
  }
})

// Follow User
userApp.put('/follow/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself.' })
    }

    const targetUser = await UserModel.findById(req.params.id)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (targetUser.followers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already following this user.' })
    }

    await UserModel.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id } })
    await UserModel.findByIdAndUpdate(req.user.id, { $push: { following: req.params.id } })

    res.status(200).json({ message: 'User followed successfully.' })

  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user.' })
  }
})

// Unfollow User
userApp.put('/unfollow/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot unfollow yourself.' })
    }

    const targetUser = await UserModel.findById(req.params.id)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!targetUser.followers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not following this user.' })
    }

    await UserModel.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } })
    await UserModel.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } })

    res.status(200).json({ message: 'User unfollowed successfully.' })

  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user.' })
  }
})

// Search Users
userApp.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required.' })
    }

    const users = await UserModel.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).select('name username profilePic bio').limit(10)

    res.status(200).json({ message: 'Users fetched successfully.', payload: users })

  } catch (err) {
    res.status(500).json({ error: 'Failed to search users.' })
  }
})
