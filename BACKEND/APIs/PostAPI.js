import exp from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { PostModel } from '../models/PostModel.js'
import { UserModel } from '../models/UserModel.js'
import {upload} from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
export const postApp=exp.Router()

//new post
postApp.post("/posts",verifyToken,upload.single("imageUrl"),async(req,res)=>{
    //get body from the req
    const {content, category}=req.body
    //get author id token
    const authorId = req.user?._id;
    // console.log(postInfo)
    let user=await UserModel.findById(authorId);
    //if user not found
    if(!user){
        return res.status(404).json({message:"User Not Found."})
    }
    //save the pic to cloudinary(if picture is uploaded)
    let imageUrl = null
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer)
        imageUrl = result.secure_url
    }
    //save
    let newDoc=new PostModel({content,category,author:authorId,imageUrl})
    await newDoc.save();
    return res.status(201).json({message:"Post Added."})
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

//delete post
postApp.patch("/posts",verifyToken,async(req,res)=>{
    //get userid form decoded token
    const userId=req.user?._id
    //get body from the req
    const {postId,isPostActive}=req.body;
    //find the post
    let newPostStatus=await PostModel.findOne({_id:postId,author:userId})
    //if post not found
    if(!newPostStatus){
        return res.status(404).json({message:"Post not found"})
    }
    //status check
    if(newPostStatus.isPostActive===isPostActive){
        return res.status(400).json({message:"No change in status"})
    }
    ///changing the status
    const result=await PostModel.findByIdAndUpdate(postId,
        { $set:{isPostActive:isPostActive} },
        { new:true }
    )
    res.status(200).json({message:"Status updated",payload:result})
})

//like/unlike post
postApp.patch("/posts/:id/like",verifyToken,async(req,res)=>{
    //get the id from endpoint
    const postId=req.params.id
    const post=await PostModel.findById(postId)
    //get id
    const userId=req.user?._id
    //check if the userid is already in the likes
    const alreadyLiked=post.likes.includes(userId)
    //if alreadyLiked
    if(alreadyLiked){
        //unlike
        await PostModel.findByIdAndUpdate(req.params.id,{ $pull:{likes:userId} })
        //removing the post to user's liked posts
        await UserModel.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } })
    }
    else {
        //like 
        await PostModel.findByIdAndUpdate(req.params.id,{ $push:{likes:userId} })
        //adding the post to user's liked posts
        await UserModel.findByIdAndUpdate(userId, { $push: { likedPosts: postId } })
    }
    //res
    res.status(200).json({message: alreadyLiked ? "Unliked" : "Liked"})
}
)

//Add a comment 
postApp.put("/posts/comments",verifyToken,async(req,res)=>{
    //get body from request
    const {postId, comment}=req.body
    //check post
    const post=await PostModel.findOne({_id:postId,isPostActive:true}).populate("comments.user","userName")
    //if the post is not available
    if(!post){
        return res.status(404).json({message:"Post not found."})
    }
    //get user 
    const userId=req.user?._id
    //add comment
    post.comments.push({ user: userId, comment: comment })
    //save
    await post.save()
    //send res
    res.status(201).json({message:"Comment added successfully.",payload:post})
})

//to get info of the commented user
postApp.get('/posts/:id', verifyToken, async(req,res)=>{
    const post = await PostModel.findById(req.params.id)
        .populate("comments.user", "firstName userName email")
        .populate("author", "firstName userName")
    res.status(200).json({message:"user", payload:post})
})

//to delete comment
postApp.delete("/posts/:postId/comments/:commentId", verifyToken, async(req,res)=>{
    const {postId, commentId} = req.params
    const post = await PostModel.findByIdAndUpdate(
        postId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
    ).populate("comments.user", "firstName email")
    
    res.status(200).json({message:"Comment deleted.", payload:post})
})