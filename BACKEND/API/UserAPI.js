import exp from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'

export const userApp = exp.Router()

// ── Register ──────────────────────────────────────────────────
userApp.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already taken.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({ name, username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user.', error: err.message })
  }
})

// ── Login ─────────────────────────────────────────────────────
userApp.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' })
    }

    // Block check — blocked users cannot log in at all
    if (!user.isUserActive) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' })
    }

    const signedToken = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('token', signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    const userObj = user.toObject()
    delete userObj.password

    res.status(200).json({
      message: 'Login successful',
      role: user.isAdmin ? 'admin' : 'user',
      payload: userObj,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to login.', error: err.message })
  }
})

// ── Logout ────────────────────────────────────────────────────
userApp.get('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    res.status(200).json({ message: 'Logout successful' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to logout.', error: err.message })
  }
})

// ── Check auth (used on page refresh) ────────────────────────
userApp.get('/check-auth', verifyToken, (req, res) => {
  try {
    res.status(200).json({ message: 'User authenticated', payload: req.user })
  } catch (err) {
    res.status(500).json({ message: 'Authentication check failed.' })
  }
})

// ── My profile ────────────────────────────────────────────────
userApp.get('/mine', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .select('-password')
      .populate('followers', 'name username profilePic')
      .populate('following', 'name username profilePic')
    res.status(200).json({ message: 'Profile fetched', payload: user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message })
  }
})

// ── Get profile by ID ─────────────────────────────────────────
// Followers/following list is shown to:
//   - the owner always
//   - everyone if profile is public (isPrivate === false)
//   - hidden if profile is private AND requester is not the owner
userApp.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name username profilePic')
      .populate('following', 'name username profilePic')

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const isOwner = req.params.id === req.user.id
    const isPrivate = user.isPrivate && !isOwner

    const payload = user.toObject()
    if (isPrivate) {
      // Hide followers/following lists for private accounts
      payload.followers = null
      payload.following = null
      payload._isPrivateView = true
    }

    res.status(200).json({ message: 'Profile fetched successfully.', payload })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message })
  }
})

// ── Update profile ────────────────────────────────────────────
userApp.put('/update', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, bio } = req.body
    let profilePicUrl

    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.buffer, 'profilePics')
    }

    const updatedData = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(profilePicUrl && { profilePic: profilePicUrl }),
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true }
    )
      .select('-password')
      .populate('followers', 'name username profilePic')
      .populate('following', 'name username profilePic')

    res.status(200).json({ message: 'Profile updated successfully.', payload: updatedUser })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.', error: err.message })
  }
})

// ── Toggle privacy ────────────────────────────────────────────
// PATCH /user-api/privacy  { isPrivate: true/false }
userApp.patch('/privacy', verifyToken, async (req, res) => {
  try {
    const { isPrivate } = req.body
    if (typeof isPrivate !== 'boolean') {
      return res.status(400).json({ message: 'isPrivate must be a boolean.' })
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: { isPrivate } },
      { new: true }
    )
      .select('-password')
      .populate('followers', 'name username profilePic')
      .populate('following', 'name username profilePic')

    res.status(200).json({
      message: `Account is now ${isPrivate ? 'private' : 'public'}.`,
      payload: updatedUser,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update privacy.', error: err.message })
  }
})

// ── Follow ────────────────────────────────────────────────────
userApp.put('/follow/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself.' })
    }

    const targetUser = await UserModel.findById(req.params.id)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (targetUser.followers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already following this user.' })
    }

    await UserModel.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id } })
    await UserModel.findByIdAndUpdate(req.user.id, { $push: { following: req.params.id } })

    res.status(200).json({ message: 'User followed successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to follow user.', error: err.message })
  }
})

// ── Unfollow ──────────────────────────────────────────────────
userApp.put('/unfollow/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot unfollow yourself.' })
    }

    const targetUser = await UserModel.findById(req.params.id)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!targetUser.followers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not following this user.' })
    }

    await UserModel.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } })
    await UserModel.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } })

    res.status(200).json({ message: 'User unfollowed successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to unfollow user.', error: err.message })
  }
})

// ── Search users ──────────────────────────────────────────────
userApp.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim() === '') {
      return res.status(200).json({ message: 'Type a username or name', payload: [] })
    }

    const users = await UserModel.find({
      $or: [
        { username: { $regex: q.trim(), $options: 'i' } },
        { name: { $regex: q.trim(), $options: 'i' } },
      ],
    })
      .select('name username profilePic bio isPrivate')
      .limit(10)

    if (users.length === 0) {
      return res.status(200).json({ message: 'No users found.', payload: [] })
    }

    res.status(200).json({ message: 'Users fetched successfully.', payload: users })
  } catch (err) {
    res.status(500).json({ message: 'Failed to search users.', error: err.message })
  }
})
