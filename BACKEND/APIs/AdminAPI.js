import exp from 'express'
import { PostModel } from '../models/PostModel.js'
import { UserModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const adminApp = exp.Router()

// --------------------------------------
// Verify Admin Middleware
// --------------------------------------
const verifyAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({
            message: "Access denied. Admin only."
        })
    }
    next()
}


// --------------------------------------
// GET ALL USERS
// GET => /admin-api/users
// --------------------------------------
adminApp.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await UserModel.find()
            .select("-password")
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: "All users fetched successfully",
            payload: users
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users"
        })
    }
})


// --------------------------------------
// DELETE USER
// DELETE => /admin-api/user/:id
// --------------------------------------
adminApp.delete('/user/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.id

        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // Delete user's posts
        await PostModel.deleteMany({
            author: userId
        })

        // Remove user's likes from all posts
        await PostModel.updateMany(
            {},
            {
                $pull: {
                    likes: userId
                }
            }
        )

        // Remove user's comments from all posts
        await PostModel.updateMany(
            {},
            {
                $pull: {
                    comments: {
                        user: userId
                    }
                }
            }
        )

        // Delete user
        await UserModel.findByIdAndDelete(userId)

        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user"
        })
    }
})


// --------------------------------------
// GET ALL POSTS
// GET => /admin-api/posts
// --------------------------------------
adminApp.get('/posts', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate("author", "name username")
            .populate("comments.user", "name username")
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: "Posts fetched successfully",
            payload: posts
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch posts"
        })
    }
})


// --------------------------------------
// DELETE POST
// DELETE => /admin-api/post/:id
// --------------------------------------
adminApp.delete('/post/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id)

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        await PostModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: "Post deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete post"
        })
    }
})


// --------------------------------------
// DELETE COMMENT
// DELETE => /admin-api/post/:postId/comment/:commentId
// --------------------------------------
adminApp.delete(
    '/post/:postId/comment/:commentId',
    verifyToken,
    verifyAdmin,
    async (req, res) => {
        try {
            const { postId, commentId } = req.params

            const post = await PostModel.findById(postId)

            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }

            const commentExists = post.comments.id(commentId)

            if (!commentExists) {
                return res.status(404).json({
                    message: "Comment not found"
                })
            }

            post.comments.pull(commentId)
            await post.save()

            res.status(200).json({
                message: "Comment deleted successfully"
            })

        } catch (error) {
            res.status(500).json({
                message: "Failed to delete comment"
            })
        }
    }
)


// --------------------------------------
// ADMIN STATS
// GET => /admin-api/stats
// --------------------------------------
adminApp.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments()
        const totalPosts = await PostModel.countDocuments()

        const posts = await PostModel.find()

        let totalComments = 0

        posts.forEach(post => {
            totalComments += post.comments.length
        })

        res.status(200).json({
            message: "Stats fetched successfully",
            payload: {
                totalUsers,
                totalPosts,
                totalComments
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch stats"
        })
    }
})