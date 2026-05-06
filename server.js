import exp from 'express'
import { connect } from 'mongoose'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import { userApp } from './API/UserAPI.js';
import { PostAPI } from './API/PostAPI.js';
import { FeedAPI } from './API/FeedAPI.js';
import { adminApp } from './API/AdminAPI.js';


config();  //process.env.PORT,process.env.DB_URL

const app=exp()
//app.listen(4000,()=>console.log("server on port 4000...."))//if DB connection has failed then there is no use of http server so first we need to check db connection and later http server

//use body parser middleware
app.use(exp.json())

//add cookie parser middleware
app.use(cookieParser())

//forward req to Userapp if path start with /user-api
app.use("/user-api",userApp)
app.use("/post-api",PostAPI)
app.use("/feed-api",FeedAPI)
app.use("/admin-api",adminApp)

const port=process.env.PORT

//connect to db server
 async function connectDB(){
    try{
    await connect(process.env.DB_URL)
    console.log("DB Connection Success")
    //start server
    app.listen(8000,()=>console.log("server on port 8000...."))
    }
    catch(err){
        console.log("Error in DB connection:",err)
    }
 }

 connectDB()

 //error handling middleware
 app.use((err,req,res,next)=>{
    //ValidationError
    if(err.name==='ValidationError'){
      return res.status(400).json({message:"Error Occured",error:err.message})
    }
    //CastError
    if(err.name==='CastError'){
      return res.status(400).json({message:"Error occured",error: err.message})
    }
    console.log(err)
    //send server side error
    res.status(500).json({message:"error occured",error:"Server side error"})
    })
