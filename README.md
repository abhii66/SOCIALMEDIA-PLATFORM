# 📱 Socials — Full Stack Social Media Platform

A peaceful, fun social media platform built with the MERN stack. Share posts, follow people, and discover content based on your interests — without the noise.

---

## 🚀 Features

### 👤 Authentication
- Register with profile picture upload
- Login with email or username
- JWT-based authentication with HTTP-only cookies
- Session persistence on page refresh

### 📰 Feed
- **For You** — personalized feed based on preferred categories
- **Following** — posts from people you follow
- Category-based post filtering (Music, Art, Food, Travel, Fitness, Gaming, Thoughts)

### 📝 Posts
- Create posts with optional image upload
- Like / unlike posts (persistent across sessions)
- Save / unsave posts
- Comment on posts
- Delete comments
- Category tagging on posts

### 👥 Social
- Follow / unfollow users
- View followers and following lists
- Search users by name or username
- View other users' profiles and their posts

### 👤 Profile
- View own profile with posts, followers, following count
- Edit profile (name, username, bio, profile picture)
- View liked posts
- View saved posts

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router v7
- Zustand (global state)
- Axios
- DM Sans font

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Cloudinary
- Multer
- Cookie Parser

---

## 📁 Project Structure

```
SOCIALMEDIA-PLATFORM/
├── frontend/
│   └── socials-app/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Header.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── RootLayout.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── ForYouPosts.jsx
│       │   │   ├── Following.jsx
│       │   │   ├── PostCard.jsx
│       │   │   ├── PostDetail.jsx
│       │   │   ├── PostsUpload.jsx
│       │   │   ├── Profile.jsx
│       │   │   ├── EditProfile.jsx
│       │   │   ├── ProfilePage.jsx
│       │   │   ├── Search.jsx
│       │   │   ├── SavedPosts.jsx
│       │   │   └── LikedPosts.jsx
│       │   ├── store/
│       │   │   └── authStore.js
│       │   └── App.jsx
│       └── package.json
│
└── backend/
    ├── APIs/
    │   ├── UserAPI.js
    │   ├── PostAPI.js
    │   └── AdminAPI.js
    ├── models/
    │   ├── UserModel.js
    │   └── PostModel.js
    ├── middleware/
    │   └── verifyToken.js
    ├── config/
    │   ├── cloudinary.js
    │   ├── cloudinaryUpload.js
    │   └── multer.js
    ├── server.js
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
```


Start the server:

```bash
node server.js
# or with nodemon
nodemon server.js
```

### Frontend Setup

```bash
cd frontend/socials-app
npm install
npm run dev
```

---

## 🔐 API Routes

### User (`/user-api`)

#### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/users` | Register |
| POST | `/users/login` | Login |
| GET | `/users/logout` | Logout |
| GET | `/check-auth` | Verify session |

#### Profile
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users/profile` | Get own profile + posts |
| GET | `/users/profile/:id` | Get user profile + posts |
| PUT | `/users/update-profile` | Update profile |
| PUT | `/users/password` | Change password |

#### Social
| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/users/following` | Follow / unfollow user |
| GET | `/users/followers` | Get own followers |
| GET | `/users/following` | Get own following |
| GET | `/users/followers/:id` | Get user's followers |
| GET | `/users/following/:id` | Get user's following |
| GET | `/users/search` | Search users |

#### Content
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/posts/fyp` | For You feed |
| GET | `/posts/following` | Following feed |
| PUT | `/users/preferences` | Update category preferences |
| PUT | `/users/saved/:id` | Save / unsave post |
| GET | `/users/saved` | Get saved posts |
| GET | `/users/liked-posts` | Get liked posts |

### Post (`/post-api`)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/posts` | Create post |
| GET | `/posts` | Get own posts |
| GET | `/posts/:id` | Get post by ID |
| PUT | `/posts` | Edit post |
| PATCH | `/posts` | Toggle post status |
| PATCH | `/posts/:id/like` | Like / unlike post |
| PUT | `/posts/comments` | Add comment |
| DELETE | `/posts/:postId/comments/:commentId` | Delete comment |

---

## 🗂️ Post Categories

| Category |
|----------|
| Music |
| Art |
| Food |
| Travel |
| Fitness |
| Gaming |
| Thoughts |
| Other |

---

## 🌍 Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

---
