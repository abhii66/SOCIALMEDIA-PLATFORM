import exp from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'

export const userApp = exp.Router()

// ─────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
userApp.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found with this email.' })

    if (!user.isUserActive) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password.' })

    const signedToken = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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

// ─────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// CHECK AUTH
// ─────────────────────────────────────────────────────────────
userApp.get('/check-auth', verifyToken, (req, res) => {
  try {
    res.status(200).json({ message: 'User authenticated', payload: req.user })
  } catch (err) {
    res.status(500).json({ message: 'Authentication check failed.' })
  }
})

// ─────────────────────────────────────────────────────────────
// MY PROFILE  (owner sees everything including followRequests)
// ─────────────────────────────────────────────────────────────
userApp.get('/mine', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .select('-password')
      .populate('followers', 'name username profilePic isAdmin')
      .populate('following', 'name username profilePic isAdmin')
      .populate('followRequests', 'name username profilePic')

    // Strip admin accounts from followers/following lists
    const payload = user.toObject()
    if (payload.followers) payload.followers = payload.followers.filter(u => !u.isAdmin)
    if (payload.following) payload.following = payload.following.filter(u => !u.isAdmin)

    res.status(200).json({ message: 'Profile fetched', payload })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// GET PROFILE BY ID
//  • Admins are completely hidden from regular users
//  • Private accounts hide followers/following; show _isPrivateView flag
//  • Also tells requester their follow status: none | requested | following
// ─────────────────────────────────────────────────────────────
userApp.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const target = await UserModel.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name username profilePic isAdmin')
      .populate('following', 'name username profilePic isAdmin')

    if (!target) return res.status(404).json({ message: 'User not found.' })

    // Admins are invisible to regular users
    if (target.isAdmin && !req.user.isAdmin) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const isOwner = req.params.id === req.user.id
    const payload = target.toObject()

    // Compute follow relationship for the requester
    const followerId = req.user.id
    const isFollowing = target.followers.some(f => f._id?.toString() === followerId || f?.toString() === followerId)
    const hasRequested = target.followRequests?.some(r => r?.toString() === followerId)

    payload._followStatus = isOwner ? 'self' : isFollowing ? 'following' : hasRequested ? 'requested' : 'none'

    // Private account: hide followers/following from non-followers (non-owner)
    if (target.isPrivate && !isOwner && !isFollowing) {
      payload.followers = null
      payload.following = null
      payload._isPrivateView = true
    }

    // Always strip followRequests from non-owner response
    if (!isOwner) delete payload.followRequests

    // Strip admin accounts from followers/following lists (never visible to regular users)
    if (payload.followers) payload.followers = payload.followers.filter(u => !u.isAdmin)
    if (payload.following) payload.following = payload.following.filter(u => !u.isAdmin)

    res.status(200).json({ message: 'Profile fetched successfully.', payload })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────────────────────
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
      req.user.id, { $set: updatedData }, { new: true }
    )
      .select('-password')
      .populate('followers', 'name username profilePic isAdmin')
      .populate('following', 'name username profilePic isAdmin')
      .populate('followRequests', 'name username profilePic')

    const updatedPayload = updatedUser.toObject()
    if (updatedPayload.followers) updatedPayload.followers = updatedPayload.followers.filter(u => !u.isAdmin)
    if (updatedPayload.following) updatedPayload.following = updatedPayload.following.filter(u => !u.isAdmin)

    res.status(200).json({ message: 'Profile updated successfully.', payload: updatedPayload })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// TOGGLE PRIVACY
// ─────────────────────────────────────────────────────────────
userApp.patch('/privacy', verifyToken, async (req, res) => {
  try {
    const { isPrivate } = req.body
    if (typeof isPrivate !== 'boolean') {
      return res.status(400).json({ message: 'isPrivate must be a boolean.' })
    }

    // When switching to public: auto-accept all pending requests
    const updateOp = { $set: { isPrivate } }
    if (!isPrivate) {
      const user = await UserModel.findById(req.user.id).select('followRequests')
      if (user.followRequests?.length > 0) {
        // Accept everyone who requested
        await UserModel.updateMany(
          { _id: { $in: user.followRequests } },
          { $addToSet: { following: req.user.id } }
        )
        updateOp.$push = { followers: { $each: user.followRequests } }
        updateOp.$set.followRequests = []
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updateOp, { new: true })
      .select('-password')
      .populate('followers', 'name username profilePic isAdmin')
      .populate('following', 'name username profilePic isAdmin')
      .populate('followRequests', 'name username profilePic')

    const privacyPayload = updatedUser.toObject()
    if (privacyPayload.followers) privacyPayload.followers = privacyPayload.followers.filter(u => !u.isAdmin)
    if (privacyPayload.following) privacyPayload.following = privacyPayload.following.filter(u => !u.isAdmin)

    res.status(200).json({
      message: `Account is now ${isPrivate ? 'private' : 'public'}.`,
      payload: privacyPayload,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update privacy.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// FOLLOW or SEND FOLLOW REQUEST
//  • Admin users cannot follow anyone
//  • Public account  → follow directly
//  • Private account → add to followRequests (pending)
// ─────────────────────────────────────────────────────────────
userApp.put('/follow/:id', verifyToken, async (req, res) => {
  try {
    // Admins cannot follow
    if (req.user.isAdmin) {
      return res.status(403).json({ message: 'Admins cannot follow users.' })
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself.' })
    }

    const targetUser = await UserModel.findById(req.params.id)
    if (!targetUser) return res.status(404).json({ message: 'User not found.' })

    // Block following an admin
    if (targetUser.isAdmin) {
      return res.status(403).json({ message: 'You cannot follow this user.' })
    }

    const alreadyFollowing = targetUser.followers.map(f => f.toString()).includes(req.user.id)
    if (alreadyFollowing) {
      return res.status(400).json({ message: 'Already following this user.' })
    }

    const alreadyRequested = targetUser.followRequests?.map(r => r.toString()).includes(req.user.id)
    if (alreadyRequested) {
      return res.status(400).json({ message: 'Follow request already sent.' })
    }

    if (targetUser.isPrivate) {
      // Send a follow request
      await UserModel.findByIdAndUpdate(req.params.id, { $push: { followRequests: req.user.id } })
      return res.status(200).json({ message: 'Follow request sent.', status: 'requested' })
    }

    // Public account: follow immediately
    await UserModel.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id } })
    await UserModel.findByIdAndUpdate(req.user.id, { $push: { following: req.params.id } })
    res.status(200).json({ message: 'User followed successfully.', status: 'following' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to follow user.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// UNFOLLOW  (also lets requester cancel a pending request)
// ─────────────────────────────────────────────────────────────
userApp.put('/unfollow/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot unfollow yourself.' })
    }

    const targetUser = await UserModel.findById(req.params.id)
    if (!targetUser) return res.status(404).json({ message: 'User not found.' })

    const isFollowing = targetUser.followers.map(f => f.toString()).includes(req.user.id)
    const hasRequested = targetUser.followRequests?.map(r => r.toString()).includes(req.user.id)

    if (!isFollowing && !hasRequested) {
      return res.status(400).json({ message: 'You are not following or requesting this user.' })
    }

    if (hasRequested) {
      // Cancel the pending request
      await UserModel.findByIdAndUpdate(req.params.id, { $pull: { followRequests: req.user.id } })
      return res.status(200).json({ message: 'Follow request cancelled.', status: 'none' })
    }

    // Actually unfollow
    await UserModel.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } })
    await UserModel.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } })
    res.status(200).json({ message: 'User unfollowed successfully.', status: 'none' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to unfollow user.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// ACCEPT FOLLOW REQUEST  (owner of private account)
// PUT /user-api/follow-request/:requesterId/accept
// ─────────────────────────────────────────────────────────────
userApp.put('/follow-request/:requesterId/accept', verifyToken, async (req, res) => {
  try {
    const me = await UserModel.findById(req.user.id)
    const requesterId = req.params.requesterId

    if (!me.followRequests?.map(r => r.toString()).includes(requesterId)) {
      return res.status(400).json({ message: 'No follow request from this user.' })
    }

    // Move from requests → followers
    await UserModel.findByIdAndUpdate(req.user.id, {
      $pull: { followRequests: requesterId },
      $push: { followers: requesterId }
    })
    // Add me to requester's following
    await UserModel.findByIdAndUpdate(requesterId, { $push: { following: req.user.id } })

    res.status(200).json({ message: 'Follow request accepted.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept request.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// REJECT FOLLOW REQUEST  (owner of private account)
// PUT /user-api/follow-request/:requesterId/reject
// ─────────────────────────────────────────────────────────────
userApp.put('/follow-request/:requesterId/reject', verifyToken, async (req, res) => {
  try {
    const requesterId = req.params.requesterId
    await UserModel.findByIdAndUpdate(req.user.id, {
      $pull: { followRequests: requesterId }
    })
    res.status(200).json({ message: 'Follow request rejected.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject request.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// SEARCH USERS  (admins excluded from results)
// ─────────────────────────────────────────────────────────────
userApp.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.trim() === '') {
      return res.status(200).json({ message: 'Type a username or name', payload: [] })
    }

    const users = await UserModel.find({
      isAdmin: false,          // ← admins never appear in search
      $or: [
        { username: { $regex: q.trim(), $options: 'i' } },
        { name: { $regex: q.trim(), $options: 'i' } },
      ],
    })
      .select('name username profilePic bio isPrivate')
      .limit(10)

    res.status(200).json({ message: 'Users fetched.', payload: users })
  } catch (err) {
    res.status(500).json({ message: 'Failed to search users.', error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// CHANGE PASSWORD
// PUT /user-api/change-password
// ─────────────────────────────────────────────────────────────
userApp.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' })
    }

    const user = await UserModel.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' })
    }

    const hashedNew = await bcrypt.hash(newPassword, 10)
    await UserModel.findByIdAndUpdate(req.user.id, { $set: { password: hashedNew } })

    res.status(200).json({ message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password.', error: err.message })
  }
})
