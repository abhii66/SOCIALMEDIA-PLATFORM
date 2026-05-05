import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { PostModel } from '../models/PostModel.js'
export const adminApp=exp.Router()


//read all users
adminApp.get('/users',verifyToken,async(req,res)=>{
    //get username
    const userRole=req.user?.firstName
    if(userRole!=="Admin"){
        return res.status(403).json({message:"Your not authorized to perform this task."})
    }
    //get all the available files
    const users=await UserModel.find({ firstName: { $nin: "Admin" }},{firstName:1,lastName:1,email:1,isUserActive:1})
    //send res 
    res.status(200).json({message:"Users",payload:users})
})

//block or activate user
adminApp.patch("/users",verifyToken,async(req,res)=>{
    //get username
    const userRole=req.user?.firstName
    if(userRole!=="Admin"){
        return res.status(403).json({message:"Your not authorized to perform this task."})
    }
    //get req body
    const {userId,isUserActive}=req.body
    //check if the user is available
    const user= await UserModel.findOne({_id:userId})
    //if user not available
    if(!user){
        return res.status(404).json({message:"User not found."})
    }
    //if the status is same
    if(user.isUserActive===isUserActive){
        return res.status(400).json({message:"No change in status."})
    }
    //status updation
    const result= await UserModel.findByIdAndUpdate({_id:userId},{$set:{isUserActive:isUserActive}},{new:true})
    //res
    res.status(201).json({message:"Status Updated."})
})