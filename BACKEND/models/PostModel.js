// author, content, imageUrl, likes[], comments[]

import { Schema,model,Types } from "mongoose";

const commentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true })

const postSchema = new Schema({
    author: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "Author is required."]
    },
    category: {
        type: String,
        enum: ["Music","Art","Food","Travel","Fitness","Gaming","Thoughts","Other"],
        default: "Other"
    },
    content: {
        type: String,
        required: [true, "Content is required."]
    },
    imageUrl: {
        type: String,
        default: ""
    },
    likes: [{
        type: Types.ObjectId,
        ref: "user"
    }],
    comments: [commentSchema],
    isPostActive:{
        type:Boolean,
        default:true
    }
},
{
    versionKey: false,
    timestamps: true,
    strict: "throw"
})

export const PostModel = model("post", postSchema)