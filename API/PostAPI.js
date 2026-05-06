import exp from 'express'
import { PostModel } from '../Models/PostModel.js'
import { CommentModel } from '../Models/CommentModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'

export const PostAPI = exp.Router()

// =====================================================
// CREATE POST
// POST /post-api/create
// =====================================================
PostAPI.post('/create',verifyToken,upload.single('image'),async (req, res) => {
    try {
      const { caption } = req.body
      let imageUrl = ''

      if (!req.file) {
        return res.status(400).json({
          message: "Post image is required"
        })
      }

      // upload image to cloudinary
      imageUrl = await uploadToCloudinary(req.file.buffer, "posts")

      const newPost = new PostModel({
        author: req.user.id,
        imageUrl,
        caption
      })

      await newPost.save()

      res.status(201).json({
        message: "Post created successfully",
        payload: newPost
      })

    } 
    catch (err) {
      res.status(500).json({message: "Failed to create post",error: err.message})
    }
})


// =====================================================
// GET MY POSTS
// GET /post-api/myposts
// Returns feed-friendly data
// =====================================================
PostAPI.get('/myposts', verifyToken, async (req, res) => {
  try {
    const posts = await PostModel.find({
      author: req.user.id,
      isPostActive: true
    })
      .populate("author", "name username profilePic")
      .sort({ createdAt: -1 })

    const formattedPosts = posts.map(post => ({
      postId: post._id,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt
    }))

    res.status(200).json({
      message: "Your posts fetched successfully",
      payload: formattedPosts
    })

  } 
  catch (err) {
    res.status(500).json({error: "Failed to fetch posts"})
  }
})


// =====================================================
// GET SINGLE POST
// GET /post-api/:id
// =====================================================
PostAPI.get('/:id', verifyToken, async (req, res) => {
  try {
    const post = await PostModel.findOne({
      _id: req.params.id,
      isPostActive: true
    })
      .populate("author", "name username profilePic")

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    res.status(200).json({
      message: "Post fetched successfully",
      payload: post
    })

  } 
  catch (err) {
    res.status(500).json({error: "Failed to fetch post"})
  }
})


// =====================================================
// SOFT DELETE POST
// DELETE /post-api/:id
// =====================================================
PostAPI.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can delete only your own posts"
      })
    }

    post.isPostActive = false
    await post.save()

    res.status(200).json({
      message: "Post deleted successfully"
    })

  } 
  catch (err) {
    res.status(500).json({error: "Failed to delete post"})
  }
})


// =====================================================
// LIKE / UNLIKE POST
// PUT /post-api/:id/like
// =====================================================
PostAPI.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)

    if (!post || !post.isPostActive) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    const alreadyLiked = post.likes.includes(req.user.id)

    if (alreadyLiked) {
      await PostModel.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user.id }
      })

      return res.status(200).json({
        message: "Post unliked successfully"
      })
    }

    await PostModel.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.user.id }
    })

    res.status(200).json({
      message: "Post liked successfully"
    })

  } 
  catch (err) {
    res.status(500).json({error: "Failed to like/unlike post"})
  }
})


// =====================================================
// GET LIKED USERS
// GET /post-api/:id/likes
// =====================================================
PostAPI.get('/:id/likes', verifyToken, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("likes", "name username profilePic")

    if (!post || !post.isPostActive) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    res.status(200).json({
      message: "Liked users fetched successfully",
      payload: post.likes
    })

  } catch (err) {
    res.status(500).json({error: "Failed to fetch liked users"})
  }
})


// =====================================================
// ADD COMMENT
// PUT /post-api/:id/comment
// =====================================================
PostAPI.put('/:id/comment', verifyToken, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required"
      })
    }

    const post = await PostModel.findById(req.params.id)

    if (!post || !post.isPostActive) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    // Prevent commenting on own post
    if (post.author.toString() === req.user.id) {
      return res.status(403).json({
        message: "You cannot comment on your own post"
      })
    }

    // Create comment
    const newComment = new CommentModel({
      author: req.user.id,
      post: req.params.id,
      text
    })

    await newComment.save()

    // Push comment reference into post
    post.comments.push(newComment._id)
    await post.save()

    res.status(200).json({
      message: "Comment added successfully",
      payload: newComment
    })

  } catch (err) {
    res.status(500).json({
      error: "Failed to add comment"
    })
  }
})

// =====================================================
// GET ALL COMMENTS
// GET /post-api/:id/comments
// =====================================================
PostAPI.get('/:id/comments', verifyToken, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name username profilePic"
        }
      })

    if (!post || !post.isPostActive) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    res.status(200).json({
      message: "Comments fetched successfully",
      payload: post.comments
    })

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch comments"
    })
  }
})


// =====================================================
// DELETE COMMENT
// DELETE /post-api/:postId/comment/:commentId
// =====================================================
PostAPI.delete('/:postId/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId)

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      })
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can delete only your own comments"
      })
    }

    await PostModel.findByIdAndUpdate(req.params.postId, {
      $pull: { comments: req.params.commentId }
    })

    await CommentModel.findByIdAndDelete(req.params.commentId)

    res.status(200).json({
      message: "Comment deleted successfully"
    })

  } catch (err) {
    res.status(500).json({
      error: "Failed to delete comment"
    })
  }
})