// import exp from 'express'
// import { PostModel } from '../Models/PostModel.js'
// import { UserModel } from '../Models/UserModel.js'
// import { CommentModel } from '../Models/CommentModel.js'
// import { verifyToken } from '../middlewares/verifyToken.js'

// export const adminApp = exp.Router()

// // --------------------------------------
// // Verify Admin Middleware
// // --------------------------------------
// const verifyAdmin = (req, res, next) => {
//     if (!req.user?.isAdmin) {
//         return res.status(403).json({
//             message: "Access denied. Admin only."
//         })
//     }
//     next()
// }


// // --------------------------------------
// // GET ALL USERS
// // GET => /admin-api/users
// // --------------------------------------
// adminApp.get('/users', verifyToken, verifyAdmin, async (req, res) => {
//     try {
//         const users = await UserModel.find()
//             .select("-password")
//             .sort({ createdAt: -1 })

//         res.status(200).json({
//             message: "All users fetched successfully",
//             payload: users
//         })

//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to fetch users"
//         })
//     }
// })


// // // --------------------------------------
// // // DELETE USER
// // // DELETE => /admin-api/user/:id
// // // --------------------------------------
// // adminApp.delete('/user/:id', verifyToken, verifyAdmin, async (req, res) => {

// //     try {

// //         const userId = req.params.id

// //         const user = await UserModel.findById(userId)

// //         if (!user) {
// //             return res.status(404).json({
// //                 message: "User not found"
// //             })
// //         }

// //         // Delete user's posts
// //         await PostModel.deleteMany({
// //             author: userId
// //         })

// //         // Remove user's likes from all posts
// //         await PostModel.updateMany(
// //             {},
// //             {
// //                 $pull: {
// //                     likes: userId
// //                 }
// //             }
// //         )

// //         // Find all comments created by user
// //         const userComments = await CommentModel.find({
// //             author: userId
// //         })

// //         // Extract comment ids
// //         const commentIds = userComments.map(
// //             comment => comment._id
// //         )

// //         // Remove comment references from posts
// //         await PostModel.updateMany(
// //             {},
// //             {
// //                 $pull: {
// //                     comments: {
// //                         $in: commentIds
// //                     }
// //                 }
// //             }
// //         )

// //         // Delete actual comments
// //         await CommentModel.deleteMany({
// //             author: userId
// //         })

// //         // Delete user
// //         await UserModel.findByIdAndDelete(userId)

// //         res.status(200).json({
// //             message: "User deleted successfully"
// //         })

// //     } catch (error) {

// //         res.status(500).json({
// //             message: "Failed to delete user"
// //         })
// //     }
// // })



// // --------------------------------------
// // DELETE USER
// // DELETE => /admin-api/user/:id
// // --------------------------------------
// adminApp.delete('/user/:id',verifyToken,verifyAdmin,async (req, res) => {

//     try {

//       const userId = req.params.id

//       const user = await UserModel.findById(userId)

//       if (!user) {
//         return res.status(404).json({
//           message: "User not found"
//         })
//       }

//       // =========================================
//       // FIND USER POSTS
//       // =========================================
//       const userPosts = await PostModel.find({
//         author: userId
//       })

//       // Extract post ids
//       const postIds = userPosts.map(
//         post => post._id
//       )

//       // =========================================
//       // DELETE COMMENTS BELONGING TO USER POSTS
//       // Prevent orphan comments
//       // =========================================
//       await CommentModel.deleteMany({
//         post: {
//           $in: postIds
//         }
//       })

//       // =========================================
//       // DELETE USER POSTS
//       // =========================================
//       await PostModel.deleteMany({
//         author: userId
//       })

//       // =========================================
//       // REMOVE USER LIKES FROM POSTS
//       // =========================================
//       await PostModel.updateMany(
//         {},
//         {
//           $pull: {
//             likes: userId
//           }
//         }
//       )

//       // =========================================
//       // FIND COMMENTS CREATED BY USER
//       // =========================================
//       const userComments = await CommentModel.find({
//         author: userId
//       })

//       // Extract comment ids
//       const commentIds = userComments.map(
//         comment => comment._id
//       )

//       // =========================================
//       // REMOVE COMMENT REFERENCES FROM POSTS
//       // =========================================
//       await PostModel.updateMany(
//         {},
//         {
//           $pull: {
//             comments: {
//               $in: commentIds
//             }
//           }
//         }
//       )

//       // =========================================
//       // DELETE USER COMMENTS
//       // =========================================
//       await CommentModel.deleteMany({
//         author: userId
//       })

//       // =========================================
//       // DELETE USER
//       // =========================================
//       await UserModel.findByIdAndDelete(userId)

//       res.status(200).json({
//         message: "User deleted successfully"
//       })

//     } catch (error) {

//       console.log(error)

//       res.status(500).json({
//         message: "Failed to delete user"
//       })
//     }
//   }
// )


// // --------------------------------------
// // GET ALL POSTS
// // GET => /admin-api/posts
// // --------------------------------------
// adminApp.get('/posts', verifyToken, verifyAdmin, async (req, res) => {

//     try {

//         const posts = await PostModel.find()
//             .populate(
//                 "author",
//                 "name username profilePic"
//             )
//             .populate({
//                 path: "comments",
//                 populate: {
//                     path: "author",
//                     select: "name username profilePic"
//                 }
//             })
//             .sort({ createdAt: -1 })

//         res.status(200).json({
//             message: "Posts fetched successfully",
//             payload: posts
//         })

//     } catch (error) {

//         res.status(500).json({
//             message: "Failed to fetch posts"
//         })
//     }
// })

// // --------------------------------------
// // DELETE COMMENT
// // DELETE => /admin-api/post/:postId/comment/:commentId
// // --------------------------------------
// adminApp.delete(
//   '/post/:postId/comment/:commentId',
//   verifyToken,
//   verifyAdmin,
//   async (req, res) => {

//     try {

//       const { postId, commentId } = req.params

//       const post = await PostModel.findById(postId)

//       if (!post) {
//         return res.status(404).json({
//           message: "Post not found"
//         })
//       }

//       const comment = await CommentModel.findById(commentId)

//       if (!comment) {
//         return res.status(404).json({
//           message: "Comment not found"
//         })
//       }

//       // Remove comment reference from post
//       await PostModel.findByIdAndUpdate(
//         postId,
//         {
//           $pull: {
//             comments: commentId
//           }
//         }
//       )

//       // Delete actual comment document
//       await CommentModel.findByIdAndDelete(commentId)

//       res.status(200).json({
//         message: "Comment deleted successfully"
//       })

//     } catch (error) {

//       res.status(500).json({
//         message: "Failed to delete comment"
//       })
//     }
//   }
// )



// // // ADMIN STATS
// // // GET => /admin-api/stats
// // // --------------------------------------
// // adminApp.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
// //     try {
// //         const totalUsers = await UserModel.countDocuments()
// //         const totalPosts = await PostModel.countDocuments()

// //         const posts = await PostModel.find()

// //         let totalComments = 0

// //         posts.forEach(post => {
// //             totalComments += post.comments.length
// //         })

// //         res.status(200).json({
// //             message: "Stats fetched successfully",
// //             payload: {
// //                 totalUsers,
// //                 totalPosts,
// //                 totalComments
// //             }
// //         })

// //     } catch (error) {
// //         res.status(500).json({
// //             message: "Failed to fetch stats"
// //         })
// //     }
// // })









import exp from 'express'
import { UserModel } from '../Models/UserModel.js'
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
adminApp.get(
    "/users",
    verifyToken,
    verifyAdmin,
    async (req, res) => {
        try {

            const users = await UserModel.find({isAdmin: { $ne: true }})
                .select("-password")
                .sort({ createdAt: -1 })

            res.status(200).json({
                message: "Users fetched successfully",
                payload: users
            })

        } catch (err) {

            res.status(500).json({
                message: "Failed to fetch users"
            })
        }
    }
)


// --------------------------------------
// BLOCK / ACTIVATE USER
// PATCH => /admin-api/users
// --------------------------------------
adminApp.patch(
    "/users",
    verifyToken,
    verifyAdmin,
    async (req, res) => {

        try {

            const { userId, isUserActive } = req.body

            const user = await UserModel.findById(userId)

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            if (user.isUserActive === isUserActive) {
                return res.status(400).json({
                    message: "No change in user status"
                })
            }

            await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        isUserActive: isUserActive
                    }
                },
                {
                    new: true
                }
            )

            res.status(200).json({
                message: "User status updated successfully"
            })

        } catch (err) {

            res.status(500).json({
                message: "Failed to update user status"
            })
        }
    }
)