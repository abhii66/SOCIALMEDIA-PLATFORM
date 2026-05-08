import exp from 'express'
import { PostModel } from '../Models/PostModel.js'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const FeedAPI = exp.Router()

// // =====================================================
// // GET FEED
// // Posts from following users + trending posts
// // GET /feed-api/
// // =====================================================
// FeedAPI.get('/', verifyToken, async (req, res) => {
//   try {

//     // Get current logged-in user
//     const currentUser = await UserModel.findById(req.user.id)

//     if (!currentUser) {
//       return res.status(404).json({
//         message: "User not found"
//       })
//     }

//     // Include current user + following users
//     const followingUsers = [
//       ...currentUser.following,
//       req.user.id
//     ]

//     // Fetch posts
//     let posts = await PostModel.find({
//       author: { $in: followingUsers },
//       isPostActive: true
//     })
//       .populate(
//         'author',
//         'name username profilePic'
//       )
//       .populate({
//         path: 'comments',
//         populate: {
//           path: 'author',
//           select: 'name username profilePic'
//         }
//       })
//       .sort({ createdAt: -1 })

//     // Sort by likes count for trending effect
//     posts = posts.sort(
//       (a, b) => b.likes.length - a.likes.length
//     )

//     res.status(200).json({
//       message: "Feed fetched successfully",
//       payload: posts
//     })

//   } catch (err) {
//     console.log(err)

//     res.status(500).json({
//       error: "Failed to fetch feed"
//     })
//   }
// })



// =====================================================
// GET FEED
// Following users posts + trending posts
// GET /feed-api/
// =====================================================
FeedAPI.get('/', verifyToken, async (req, res) => {
  try {

    // Get current user
    const currentUser = await UserModel.findById(req.user.id)

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // ================================
    // FOLLOWING USERS POSTS
    // ================================
    const followingPosts = await PostModel.find({
      author: { $in: currentUser.following },
      isPostActive: true
    })
      .populate(
        'author',
        'name username profilePic'
      )
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name username profilePic'
        }
      })

    // ================================
    // TRENDING POSTS (exclude private accounts unless user follows them)
    // ================================
    // Get IDs of private accounts that the current user does NOT follow
    const privateAccounts = await UserModel.find({
      isPrivate: true,
      _id: { $ne: req.user.id, $nin: currentUser.following }
    }).select('_id')
    const privateIds = privateAccounts.map(u => u._id)

    const trendingPosts = await PostModel.find({
      isPostActive: true,
      author: { $ne: req.user.id, $nin: privateIds }
    })
      .populate(
        'author',
        'name username profilePic'
      )
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name username profilePic'
        }
      })

    // Sort trending by likes
    const sortedTrending = trendingPosts
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 10)

    // ================================
    // MERGE BOTH
    // ================================
    const allPosts = [
      ...followingPosts,
      ...sortedTrending
    ]

    // Remove duplicate posts
    const uniquePosts = Array.from(
      new Map(
        allPosts.map(post => [
          post._id.toString(),
          post
        ])
      ).values()
    )

    // Final sort by latest posts
    uniquePosts.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )

    res.status(200).json({
      message: "Feed fetched successfully",
      payload: uniquePosts
    })

  } catch (err) {
    console.log(err)

    res.status(500).json({
      error: "Failed to fetch feed"
    })
  }
})




// =====================================================
// GET EXPLORE
// Get all posts from all users
// GET /feed-api/explore
// =====================================================
FeedAPI.get('/explore', verifyToken, async (req, res) => {
  try {

    // Exclude private accounts (except the current user's own posts)
    const privateAccountsExplore = await UserModel.find({
      isPrivate: true,
      _id: { $ne: req.user.id }
    }).select('_id')
    const privateIdsExplore = privateAccountsExplore.map(u => u._id)

    const posts = await PostModel.find({
      isPostActive: true,
      author: { $nin: privateIdsExplore }
    })
      .populate(
        'author',
        'name username profilePic'
      )
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name username profilePic'
        }
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: "Explore posts fetched successfully",
      payload: posts
    })

  } catch (err) {
    console.log(err)

    res.status(500).json({
      error: "Failed to fetch explore posts"
    })
  }
})