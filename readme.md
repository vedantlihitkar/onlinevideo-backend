# 🎬 Online Video App Backend

This is the backend for the **Online Video Streaming App**, built using **Node.js**, **Express**, and **MongoDB**. It handles user authentication, video and playlist management, and provides RESTful APIs for the frontend.

## 🚀 Features

- User Registration & Login with JWT Authentication
- Secure Password Hashing using Bcrypt
- Refresh Token and Logout Support
- Create, Update, and Delete Playlists
- Add and Remove Videos in Playlists
- MongoDB Database with Mongoose ODM
- RESTful API Structure
- Error Handling and Validation

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Tokens)**
- **Bcrypt**
- **dotenv**
- **Cloudinary** (if you're storing video thumbnails or videos in the cloud)

## 📁 Folder Structure
onlinevideo-backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── .env
├── server.js
└── package.json


## 🔐 Environment Variables

Create a `.env` file in the root and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret




📦 Installation

git clone https://github.com/vedantlihitkar/onlinevideo-backend.git
cd onlinevideo-backend
npm install
npm run dev



---Created by Vedant Lihitkar ---






