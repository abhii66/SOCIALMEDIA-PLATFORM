import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
     name: {
        type: String,
        required: [true, "Name is required"]
    },
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username already exists"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    following:[
        {
            type: Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    isUserActive:{
        type:Boolean,
        default:true
    },
    isAdmin: {
    type: Boolean,
    default: false
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
});

export const UserModel =
    mongoose.models.user || mongoose.model("user", userSchema);