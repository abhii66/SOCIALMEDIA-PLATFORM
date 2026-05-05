import exp from 'express'
import { PostModel } from '../Models/PostModel.js'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const FeedApp = exp.Router()

// ─────────────────────────────────────────
// GET FEED (posts from followed users)
// GET /api/feed
// ─────────────────────────────────────────
FeedApp.get('/', verifyToken, async (req, res) => {
  try {
    // Get current user to find following list
    const currentUser = await UserModel.findById(req.user.id)

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Include own posts + followed users posts
    const userIds = [...currentUser.following, req.user.id]

    const posts = await PostModel.find({ author: { $in: userIds } })
      .populate('author', 'name username avatar')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username avatar' }
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Feed fetched successfully.',
      payload: posts
    })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feed.' })
  }
})

// ─────────────────────────────────────────
// GET EXPLORE (all posts from everyone)
// GET /api/feed/explore
// ─────────────────────────────────────────
FeedApp.get('/explore', verifyToken, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('author', 'name username avatar')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username avatar' }
      })
      .sort({ createdAt: -1 })
      .limit(50)

    res.status(200).json({
      message: 'Explore posts fetched successfully.',
      payload: posts
    })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch explore posts.' })
  }
})

// ─────────────────────────────────────────
// GET TRENDING (most liked posts)
// GET /api/feed/trending
// ─────────────────────────────────────────
FeedApp.get('/trending', verifyToken, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('author', 'name username avatar')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name username avatar' }
      })
      .sort({ createdAt: -1 })
      .limit(100)

    // Sort by likes count
    const trendingPosts = posts.sort((a, b) => b.likes.length - a.likes.length).slice(0, 20)

    res.status(200).json({
      message: 'Trending posts fetched successfully.',
      payload: trendingPosts
    })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending posts.' })
  }
})

// ─────────────────────────────────────────
// SEARCH USERS
// GET /api/feed/search?q=
// ─────────────────────────────────────────
FeedApp.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required.' })
    }

    const users = await UserModel.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).select('name username avatar bio').limit(10)

    res.status(200).json({
      message: 'Users fetched successfully.',
      payload: users
    })

  } catch (err) {
    res.status(500).json({ error: 'Failed to search users.' })
  }
})