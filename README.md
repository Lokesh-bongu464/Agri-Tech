# Agri-Tech
AgriTech is a modern, full-stack agriculture management platform built with Node.js, Express, MongoDB, and React. It enables users to manage farms, products, crops, and bookings, with robust user/admin roles and clean UI/UX.

Features
User and admin authentication

User dashboard: manage farms, crops, bookings,products,weather

Admin dashboard: manage products, all users, farms, bookings,weather

Add/Edit/Delete products, farms, cropsinfo

Custom dialog confirmations for destructive actions

Responsive UI with React and Tailwind CSS

RESTful API using Express/MongoDB with secure validation

Tech Stack
Frontend: React, Tailwind CSS, Vite

Backend: Node.js, Express, Mongoose

Database: MongoDB

Auth: JWT, Context API

Other: Axios, Moment.js, Helmet, CORS

Getting Started
1. Clone the repository
bash
git clone https://github.com/Lokesh-bongu464/Agri-Tech.git
cd Agri-Tech
2. Install dependencies
Go to both frontend and backend directories and run:

bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
3. Setup environment variables
Create a .env (or use config.js) files in both backend and frontend folders as needed.
For backend, configure at minimum:

text
MONGODB_URI=mongodb://localhost:27017/agritech
JWT_SECRET=your_jwt_secret
PORT=7000

4. Run development servers
Backend:

bash
cd backend
npm run dev

Frontend:

bash
cd frontend
npm run dev
Backend runs on http://localhost:7000 by default

Frontend runs on http://localhost:5173 (or as configured by Vite)

6. Access the App
Open your browser and navigate to the frontend dev URL. Register as a user or login as admin.

Folder Structure (recommended)
text
/backend
  /controllers
  /models
  /routes
  /config
  server.js
  ...
/frontend
  /src
    /Components
    /User
    /Admin
    /context
    /services
    App.jsx
    ...
  ...
README.md
Useful Scripts
npm run dev – Start dev server

npm run build – Build production frontend

npm start – Start backend server
