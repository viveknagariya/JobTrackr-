<div align="center">

# 💼 JobTrackr — Career Pipeline & Job Application Tracker

An intelligent, full-stack **MERN Application** designed to streamline job search workflows, track interview pipelines, monitor salary CTC offerings, and alert candidates on pending follow-ups with interactive visual analytics.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Git & GitHub Push Guide](#-git--github-push-guide)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview

During an active job search, keeping track of dozens of applications across job boards, referral emails, HR calls, and scheduled interviews quickly becomes overwhelming. **JobTrackr** resolves this by providing a centralized command center to:

- Organize applications by their real-time status (`Applied`, `Interviewing`, `Offer`, `Rejected`).
- Never miss an interview check-in or email reply through **automated urgent follow-up notifications**.
- Gain visual insights into monthly application velocity and status conversion rates using **interactive charts**.
- Record resume iterations, salary offers (CTC), and recruiter notes in one place.

---

## 🚀 Key Features

- **🔐 Secure Authentication**: JWT-based user login & registration with salted bcrypt password hashing and protected API middleware.
- **📊 Real-time Analytics Dashboard**:
  - Top KPI stat cards (Total Applications, In Review, Interviewing, Offers, Rejections).
  - Dynamic Bar Chart for monthly application velocity.
  - Interactive Donut / Pie Chart for status distribution breakdown using **Recharts**.
- **⏰ Actionable Follow-Up Alerts**: Automatically detects upcoming or overdue follow-up dates to prompt the user to contact recruiters.
- **⚡ Advanced Filtering & Search**:
  - Live search by Company name and Job Role.
  - Filter applications by status (`All`, `Applied`, `Interviewing`, `Offer`, `Rejected`).
  - Sort by latest submission date or status priority.
  - Client & server-side pagination support.
- **📝 Complete Application Management (CRUD)**:
  - Add, view, edit, and delete job applications.
  - Fields for Company, Role, Salary/CTC, Status, Follow-up date, Resume file version, and detailed notes.
- **🎨 Glassmorphic Modern UI**: Crafted with Tailwind CSS, Lucide icons, responsive grids, and subtle elevation aesthetics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with automatic JWT bearer token interceptors)

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Environment Management**: dotenv
- **CORS**: cors middleware

---

## 📂 Project Architecture

```text
JobTrackr/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile
│   │   └── jobController.js      # Job CRUD logic, filters, and stats aggregation
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & route protection
│   ├── models/
│   │   ├── Job.js                # Job application schema & validation
│   │   └── User.js               # User auth schema & password hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── jobRoutes.js          # /api/jobs routes
│   ├── .env.example              # Sample environment configuration
│   ├── package.json              # Backend dependencies & npm scripts
│   └── server.js                 # Express server entry point
│
├── frontend/
│   └── client/
│       ├── public/               # Static assets & icons
│       ├── src/
│       │   ├── api/
│       │   │   └── axios.js      # Axios instance with auth interceptor
│       │   ├── components/
│       │   │   ├── JobModal.jsx  # Add/Edit application modal
│       │   │   └── StatsCharts.jsx # Recharts visualization components
│       │   ├── context/
│       │   │   └── AuthContext.jsx # Global user authentication state
│       │   ├── pages/
│       │   │   ├── Dashboard.jsx # Main analytics & jobs pipeline page
│       │   │   ├── Login.jsx     # User login screen
│       │   │   └── Register.jsx  # New user registration screen
│       │   ├── App.jsx           # App routes & auth guards
│       │   ├── index.css         # Global Tailwind and custom styles
│       │   └── main.jsx          # React DOM entry point
│       ├── package.json          # Frontend dependencies & scripts
│       └── vite.config.js        # Vite build tool configuration
│
├── .gitignore                    # Git ignore file for secrets and dependencies
└── README.md                     # Project documentation
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local MongoDB instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/your-username/JobTrackr.git
cd JobTrackr
```

---

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt, use `copy .env.example .env`)*

4. Update your `.env` values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/jobtrackr
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd frontend/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open on `http://localhost:5173`.*

---

## 🔑 Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port number for Express backend | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/jobtrackr` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_secret_key` |

> ⚠️ **Important**: Never commit `.env` files to public GitHub repositories. Keep secrets safe.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (Bearer Token) |

### 💼 Jobs Pipeline (`/api/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Get paginated jobs with search & filters | Private |
| `POST` | `/api/jobs` | Create a new job application | Private |
| `GET` | `/api/jobs/stats` | Aggregate stats & follow-up alerts | Private |
| `PATCH` | `/api/jobs/:id` | Update an existing job application | Private |
| `DELETE` | `/api/jobs/:id` | Remove a job application | Private |

---

## 📤 Git & GitHub Push Guide

Follow these simple steps in your terminal to initialize and push this project to your GitHub repository:

```bash
# 1. Open project root folder
cd "e:\MERN STACK\JobTrackr"

# 2. Initialize Git
git init

# 3. Add all files (the .gitignore will protect your node_modules and .env files)
git add .

# 4. Commit files
git commit -m "feat: initial commit - complete JobTrackr MERN stack application"

# 5. Rename branch to main
git branch -M main

# 6. Link to your GitHub repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 7. Push to GitHub
git push -u origin main
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
