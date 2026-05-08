import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Author id is required"]
    },

    imageUrl: {
        type: String,
        required: [true, "Post image is required"]
    },

    caption: {
        type: String,
        default: ""
    },

    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],

    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ],

    isPostActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export const PostModel =
    mongoose.models.posts || mongoose.model("posts", postSchema);