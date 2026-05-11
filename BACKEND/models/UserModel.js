import {Schema,model,Types} from "mongoose"

const userSchema=new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required."],
    },
    lastName:{
        type:String
    },
    userName:{
        type:String,
        required:[true,"Create a username"],
        unique:[true,"Username not available, try another."]
    },
    email:{
        type:String,
        required:[true,"email is required."],
        unique:[true,"email already exists."]

    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    profileImageUrl:{
        type:String,
         default: ""

    },
    bio: {
        type: String,
        default: ""
    },
    followers: [{
        type: Types.ObjectId,
        ref: "user"
    }],
    following: [{
        type: Types.ObjectId,
        ref: "user"
    }],
    likedPosts:[{
        type:Types.ObjectId,
        ref: "post"
    }],
    isUserActive:{
        type:Boolean,
        default:true
    },
     savedPosts:[{
 type: Types.ObjectId,
      ref: "post"
    }]
},

{
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

export const UserModel=model("user",userSchema)