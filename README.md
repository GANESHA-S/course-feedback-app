Course Feedback App

A full-stack MERN application for students to submit feedback on courses and for admins to manage responses.

Live Links
1.Frontend (Vercel):** https://course-feedback-app.vercel.app  
2.Backend (Render):** https://course-feedback-app.onrender.com  

Features
- Student Signup/Login with JWT authentication
- Submit course feedback with ratings and comments
- Admin dashboard to view and filter feedback
- MongoDB Atlas for cloud database
- Cloudinary for profile image uploads
- Fully deployed on Render (backend) + Vercel (frontend)

Technologies Used
 - Frontend: React (Vite), HTML, CSS, JavaScript
 - Backend: Node.js, Express.js
 - Database: MongoDB Atlas (cloud database)
 - Authentication: JWT (JSON Web Token)
 - File Storage: Cloudinary (for profile images)
Deployment:
 - Frontend → Vercel
 - Backend → Render

How to Run Locally

1.Clone the Repository
  git clone https://github.com/GANESHA-S/course-feedback-app.git
  cd course-feedback-app

2.cd backend
  npm install
  npm run dev

3.cd frontend
  npm install
  npm run dev   

4.MongoDB Setup
  Create a free cluster on MongoDB Atlas.
  Add a database user with username/password.
  Whitelist your IP address (or allow from anywhere).
  Copy the connection string and update it in .env.

5.backend/.env
  PORT=5000
  MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/feedbackDB
  JWT_SECRET=your_secret
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret

6.Test Logins
  You can either sign up as a new user on the deployed site, or use these sample credentials:
  
  Student
  Email: studentuser@mail.com
  Password: Studentuser@123
  
  Admin
  Email: admin@mail.com
  Password: Admin@12

