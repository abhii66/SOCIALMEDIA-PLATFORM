import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: [true, "Post id is required"]
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User id is required"]
    },

    text: {
        type: String,
        required: [true, "Comment text is required"]
    },

    isCommentActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export const CommentModel =  mongoose.models.comment ||  mongoose.model("comment", commentSchema);