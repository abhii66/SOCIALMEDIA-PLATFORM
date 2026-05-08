import exp from 'express'
import { UserModel } from '../Models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const adminApp = exp.Router()

// Verify Admin Middleware
const verifyAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' })
  }
  next()
}

// GET ALL USERS (excluding admins)
// GET => /admin-api/users
adminApp.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await UserModel.find({ isAdmin: { $ne: true } })
      .select('-password')
      .sort({ createdAt: -1 })

    res.status(200).json({ message: 'Users fetched successfully', payload: users })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.', error: err.message })
  }
})

// BLOCK / ACTIVATE USER
// PATCH => /admin-api/users
adminApp.patch('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, isUserActive } = req.body

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (user.isUserActive === isUserActive) {
      return res.status(400).json({ message: 'No change in user status.' })
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isUserActive } },
      { new: true }
    )

    const action = isUserActive ? 'activated' : 'blocked'
    res.status(200).json({ message: `User ${action} successfully.` })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status.', error: err.message })
  }
})
