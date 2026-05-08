import jwt from 'jsonwebtoken'
import { UserModel } from '../Models/UserModel.js'

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if the user account is still active (blocked users are rejected here)
    const user = await UserModel.findById(decoded.id).select('isUserActive isAdmin')
    if (!user) {
      return res.status(401).json({ message: 'User not found.' })
    }
    if (!user.isUserActive) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' })
    }

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
