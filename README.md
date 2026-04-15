# NYXS Sphere

> **Where students build the future** — A modern, focused community platform for students and aspiring founders to share ideas, write blogs, collaborate, and build in public.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-4.21-green?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.6-green?logo=mongodb)](https://www.mongodb.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black?logo=socket.io)](https://socket.io)

## ✨ Features

### 🔐 Authentication & Profiles
- **Email-based signup/login** with JWT authentication (httpOnly cookies)
- **User profiles** with bio, skills, interests, and follower system
- **Founder badge** for users marking themselves as builders
- **Build in Public mode** — Share your journey with the community

### 📝 Content & Discovery
- **Posts** — Long-form blogs with titles and tags or quick thoughts
- **Tagging system** — #buildinpublic, #startup, #collaborate, #feedback, etc.
- **Search & filter** — Find posts by tags, users, or keywords
- **Like, comment, save** — Full engagement with threaded comments

### 💬 Real-time Communication
- **1:1 Direct messaging** — Real-time chat via Socket.io
- **Typing indicators** — See when someone is typing
- **Message history** — All conversations persisted in MongoDB

### 🔔 Notifications
- Likes, comments, and replies on your posts
- Follow notifications
- Direct message alerts
- In-app notification center with read/unread status

### 📱 User Experience
- **Mobile-first design** with bottom navigation
- **Responsive layouts** for all screen sizes
- **Dark theme** optimized for reduced eye strain
- **Smooth animations** and transitions throughout

## 🛠️ Tech Stack

| Layer         | Technology                    | Version |
|---------------|-------------------------------|---------|
| **Frontend**  | Next.js 14 (App Router)       | 14.2.35 |
| **Styling**  | Tailwind CSS + PostCSS        | 3.4.10  |
| **Backend**  | Express.js                    | 4.21.0  |
| **Database** | MongoDB + Mongoose            | 8.6.1   |
| **Auth**     | JWT (jsonwebtoken)            | 9.0.2   |
| **Realtime** | Socket.io                     | 4.7.5   |
| **File Upload** | Multer                     | 1.4.5   |
| **Password**  | bcryptjs                      | 2.4.3   |

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nyxs-sphere.git
cd nyxs-sphere

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# Edit .env with:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A random 32+ character string
```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/nyxs-sphere

# Auth
JWT_SECRET=your-super-secret-jwt-key-change-this

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NODE_ENV=development

# Server
CLIENT_URL=http://localhost:3000
```

### Running Locally

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:5000 (Express + Socket.io)

### Build & Production

```bash
# Build Next.js
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
nyxs-sphere/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (auth)/            # Login/signup pages
│   │   ├── (main)/            # Protected pages (home, explore, etc.)
│   │   ├── globals.css        # Global styles & custom components
│   │   └── layout.js          # Root layout with providers
│   ├── components/            # Reusable React components
│   │   ├── AuthForm.js
│   │   ├── PostCard.js
│   │   ├── MobileNav.js
│   │   └── ...
│   ├── context/               # React context (auth state)
│   └── lib/
│       ├── api.js             # API client functions
│       └── utils.js           # Helper utilities
├── server/
│   ├── routes/                # Express route handlers
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── messages.js
│   │   ├── users.js
│   │   └── notifications.js
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── middleware/            # Express middleware
│   ├── lib/db.js              # MongoDB connection
│   └── index.js               # Express server setup
├── .env.example               # Environment template
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login user
- `POST /api/auth/logout` — Logout user
- `GET /api/auth/me` — Get current user

### Users
- `GET /api/users/:id` — Get user profile
- `PUT /api/users/:id` — Update profile
- `POST /api/users/:id/follow` — Follow user
- `GET /api/users/:id/followers` — Get followers
- `GET /api/users/suggestions` — Get user suggestions

### Posts
- `GET /api/posts` — Get feed (with filters)
- `POST /api/posts` — Create post
- `GET /api/posts/:id` — Get post details
- `POST /api/posts/:id/like` — Like post
- `POST /api/posts/:id/save` — Save post
- `GET /api/posts/:id/comments` — Get comments
- `POST /api/posts/:id/comments` — Add comment

### Messages
- `GET /api/messages/conversations` — Get conversations
- `GET /api/messages/:userId` — Get messages with user
- `POST /api/messages` — Send message

### Notifications
- `GET /api/notifications` — Get notifications
- `GET /api/notifications/unread-count` — Unread count
- `POST /api/notifications/read-all` — Mark all as read

## 🌐 Deployment

### Frontend (Vercel - Recommended)
1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → Your production backend URL
   - `NEXT_PUBLIC_SOCKET_URL` → Your production backend URL
4. Deploy

### Backend (Render, Railway, or Heroku)
1. Create new Web Service
2. Connect GitHub repo
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Set environment variables:
   - `MONGODB_URI` → Production MongoDB URI (MongoDB Atlas)
   - `JWT_SECRET` → Strong random string
   - `CLIENT_URL` → Your production frontend URL
   - `NODE_ENV` → `production`

### Database (MongoDB Atlas)
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add in `.env` as `MONGODB_URI`
4. ✅ Ready to use

## 🛡️ Security

- **JWT Authentication** — Secure token-based auth
- **httpOnly Cookies** — Tokens stored securely (not accessible via JS)
- **Password Hashing** — bcryptjs with salt rounds
- **CORS Protection** — Restricted to allowed origins
- **Input Validation** — Mongoose schema validation
- **MongoDB Injection Protection** — Via Mongoose

## 📋 Available Scripts

```bash
npm run dev              # Start dev server (both client & server)
npm run dev:client      # Start Next.js only
npm run dev:server      # Start Express only
npm run build           # Build for production
npm start               # Start production server
```

## 🐛 Troubleshooting

**MongoDB connection fails**
- Ensure MongoDB is running or MongoDB Atlas cluster is active
- Check `MONGODB_URI` in `.env`
- Verify IP whitelist in MongoDB Atlas

**Port 5000 already in use**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend shows blank page**
- Check browser console (F12) for errors
- Verify backend is running on correct port
- Check Network tab for failed API calls

**Styles not loading**
- Delete `.next` folder and rebuild: `rm -r .next && npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Mongoose](https://mongoosejs.com)
- [Socket.io Documentation](https://socket.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License — Feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Built with ❤️ by [Your Name]

---

**Made with Next.js, Express, MongoDB, and Tailwind CSS** 🚀