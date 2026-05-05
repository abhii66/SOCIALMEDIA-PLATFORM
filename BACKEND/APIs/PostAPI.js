import exp from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { PostModel } from '../models/PostModel.js'
import { UserModel } from '../models/UserModel.js'
export const postApp=exp.Router()

//new post
postApp.post("/posts",verifyToken,async(req,res)=>{
    //get body from the req
    const postInfo=req.body
    // console.log(postInfo)
    let newPost=await UserModel.findById(postInfo.author);
    //if user not found
    if(!newPost){
        return res.status(404).json({message:"User Not Found."})
    }
    //save
    let newDoc=new PostModel(postInfo)
    await newDoc.save();
    return res.status(201).json({message:"Post Completed."})
})

//reading own posts
postApp.get("/posts",verifyToken,async(req,res)=>{
    const IdOfToken=req.user?._id
    console.log(IdOfToken)
    const postView=await PostModel.find({author:IdOfToken});
    console.log(postView)
    return res.status(200).json({message:"Posts: ",payload:postView});
})

//update post
postApp.put("/posts",verifyToken,async(req,res)=>{
    //get body
    const {postId,content}=req.body;
    //get user id from decode token
    const IdOfToken=req.user?._id
    const newPost=await PostModel.findOneAndUpdate(
        { _id:postId,author:IdOfToken},
        {$set:{content:content}},
        {new:true});
    if(!newPost){
        return res.status(403).json({message:"You are not authorized."})
    }
    res.status(200).json({message:"Updated Successfully."})
})

//