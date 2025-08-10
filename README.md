🌱 AgriTech – Full-Stack Agriculture Management Platform

Demo App: https://agri-tech-chi.vercel.app/

AgriTech is a modern, full-stack agriculture management platform built with Node.js, Express, MongoDB, and React.
It enables users to manage farms, products, crops, and bookings — with robust user/admin roles and a clean UI/UX.

✨ Features
👤 User Features
Secure user authentication

Dashboard to manage:

Farms

Crops

Bookings

Products

Weather updates

🛠 Admin Features
Manage:

All products

All users

All farms

Bookings

Weather info

Add / Edit / Delete products, farms, crop info

Custom dialog confirmations for destructive actions

💻 General
Fully Responsive UI with React + Tailwind CSS

RESTful API with validation & security best practices

Role-based authentication with JWT

Smooth UX for both desktop and mobile

🛠 Tech Stack
Frontend: React, Tailwind CSS, Vite
Backend: Node.js, Express, Mongoose
Database: MongoDB
Authentication: JWT, Context API
Other Libraries: Axios, Moment.js, Helmet, CORS

🚀 Getting Started
1. Clone the Repository
  git clone https://github.com/Lokesh-bongu464/Agri-Tech.git
  cd Agri-Tech
2. Install Dependencies
Backend:
  cd backend
  npm install
Frontend:
  cd ../frontend
  npm install
3. Setup Environment Variables
Backend .env:
  MONGODB_URI=mongodb://localhost:27017/agritech
  JWT_SECRET=your_jwt_secret
  PORT=7000
  Setup frontend environment/config if needed.

4. Run Development Servers
Backend:
  cd backend
  npm run dev
  Runs at: http://localhost:7000

Frontend:
  cd frontend
  npm run dev
  Runs at: http://localhost:5173 (default Vite port)

📂 Recommended Folder Structure
/backend
  /controllers
  /models
  /routes
  /config
  server.js

/frontend
  /src
    /Components
    /User
    /Admin
    /context
    /services
  App.jsx
🔧 Useful Scripts
npm run dev – Start development server

npm run build – Build frontend for production

npm start – Start backend server

