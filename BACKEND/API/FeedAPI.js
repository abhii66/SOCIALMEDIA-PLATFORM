import exp from 'express'
import { PostModel } from '../Models/PostModel.js'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const FeedAPI = exp.Router()

// =====================================================
// GET FEED
// Following users posts + trending public posts
// GET /feed-api/
// =====================================================
FeedAPI.get('/', verifyToken, async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.user.id)

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    // ================================
    // Get IDs of blocked (inactive) users — their posts must be hidden
    // ================================
    const blockedUsers = await UserModel.find({ isUserActive: false }).select('_id')
    const blockedIds = blockedUsers.map(u => u._id)

    // ================================
    // FOLLOWING USERS POSTS (includes private accounts the user follows)
    // Exclude posts from blocked users
    // ================================
    const followingPosts = await PostModel.find({
      author: { $in: currentUser.following, $nin: blockedIds },
      isPostActive: true
    })
      .populate('author', 'name username profilePic isPrivate isUserActive')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username profilePic isUserActive' }
      })

    // ================================
    // TRENDING POSTS (only public accounts; exclude private unless followed; exclude blocked)
    // ================================
    const privateAccountsNotFollowed = await UserModel.find({
      isPrivate: true,
      _id: { $ne: req.user.id, $nin: currentUser.following }
    }).select('_id')
    const privateIdsNotFollowed = privateAccountsNotFollowed.map(u => u._id)

    // Combine excluded IDs: private-not-followed + blocked
    const excludedFromTrending = [
      ...privateIdsNotFollowed.map(id => id.toString()),
      ...blockedIds.map(id => id.toString())
    ]

    const trendingPosts = await PostModel.find({
      isPostActive: true,
      author: { $ne: req.user.id, $nin: excludedFromTrending }
    })
      .populate('author', 'name username profilePic isPrivate isUserActive')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username profilePic isUserActive' }
      })

    const sortedTrending = trendingPosts
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 10)

    const allPosts = [...followingPosts, ...sortedTrending]

    const uniquePosts = Array.from(
      new Map(allPosts.map(post => [post._id.toString(), post])).values()
    )

    uniquePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Filter out comments from blocked users
    const sanitizedPosts = uniquePosts.map(post => {
      const p = post.toObject ? post.toObject() : post
      if (p.comments) {
        p.comments = p.comments.filter(c => c.author && c.author.isUserActive !== false)
      }
      return p
    })

    res.status(200).json({ message: "Feed fetched successfully", payload: sanitizedPosts })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to fetch feed" })
  }
})

// =====================================================
// GET EXPLORE
// All posts from public accounts + private accounts the user follows
// Excludes posts from blocked users
// GET /feed-api/explore
// =====================================================
FeedAPI.get('/explore', verifyToken, async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.user.id).select('following')

    // IDs of blocked (inactive) users
    const blockedUsers = await UserModel.find({ isUserActive: false }).select('_id')
    const blockedIds = blockedUsers.map(u => u._id)

    // Exclude private accounts the user does NOT follow (except own)
    const privateAccountsExplore = await UserModel.find({
      isPrivate: true,
      _id: { $ne: req.user.id, $nin: currentUser.following }
    }).select('_id')
    const privateIdsExplore = privateAccountsExplore.map(u => u._id)

    // Combined exclusion list: private-not-followed + blocked
    const excludedAuthors = [
      ...privateIdsExplore.map(id => id.toString()),
      ...blockedIds.map(id => id.toString())
    ]

    const posts = await PostModel.find({
      isPostActive: true,
      author: { $nin: excludedAuthors }
    })
      .populate('author', 'name username profilePic isPrivate isUserActive')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username profilePic isUserActive' }
      })
      .sort({ createdAt: -1 })

    // Filter out comments from blocked users
    const sanitizedPosts = posts.map(post => {
      const p = post.toObject ? post.toObject() : post
      if (p.comments) {
        p.comments = p.comments.filter(c => c.author && c.author.isUserActive !== false)
      }
      return p
    })

    res.status(200).json({ message: "Explore posts fetched successfully", payload: sanitizedPosts })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to fetch explore posts" })
  }
})
