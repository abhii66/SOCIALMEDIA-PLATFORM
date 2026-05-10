import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()
const {verify}=jwt

export const verifyToken = (req,res,next)=>{
    //access the token
    const token= req.cookies?.token
    //if token doesnt exist(unauthorised user)
    if(!token){
        return res.status(401).json({message:"Please Login."})
    }
    try{
        //if token exists
        const decodeToken=verify(token,process.env.SECRET_KEY)
        // console.log(decodeToken)
        req.user=decodeToken
        next()
    }
    catch(err){
        res.status(401).json({message:"Session Expired,Please Re-login."})
    }
}