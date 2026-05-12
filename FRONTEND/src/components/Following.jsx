import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import PostCard from './PostCard'

const BASE_URL = "http://localhost:2167"

export default function FollowingFeed() {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/user-api/posts/following`, { withCredentials: true })
        setPosts(res.data.payload)
      } catch(err) {
        setError("Failed to load posts")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if(loading) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>
      Loading...
    </div>
  )

  if(error) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#e05454", fontSize: 14 }}>
      {error}
    </div>
  )

  if(posts.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <p style={{ fontSize: 15, color: "#aaa", margin: 0 }}>No posts yet</p>
      <p style={{ fontSize: 13, color: "#ccc", margin: "6px 0 0" }}>
        Follow people to see their posts here
      </p>
    </div>
  )

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post._id} post={post} currentUser={currentUser} />
      ))}
    </div>
  )
}