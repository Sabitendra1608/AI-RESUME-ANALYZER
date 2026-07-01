# AI Resume Analyzer

A full-stack AI-powered resume analysis platform that evaluates resumes for ATS compatibility, identifies skills, compares resumes against job descriptions, and provides AI-generated improvement suggestions.

## Live Demo

Frontend: https://ai-resume-analyzer-sabitendra.vercel.app
Backend: https://ai-resume-analyzer-bae8.onrender.com

## Features

* User registration and login with JWT authentication
* Secure password hashing using bcrypt
* Protected routes for authenticated users
* Resume PDF upload and text extraction
* ATS score calculation with score breakdown
* Skills detection and missing skill identification
* Job description match score
* Matched and missing job-specific skills
* Gemini AI resume summary, strengths, weaknesses, and suggestions
* Downloadable PDF analysis report
* Save resume analyses in MongoDB
* Dashboard with analysis statistics
* Analysis history with search, view, and delete functionality
* Premium black and blue SaaS-style UI

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React
* jsPDF

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Multer
* pdf-parse
* Google Gemini API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## Local Setup

### 1. Clone repository

```bash
git clone <your-repository-url>
cd ai-resume-analyzer
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## Project Flow

```text
Register/Login
→ Upload Resume PDF
→ Paste Job Description
→ ATS + AI Analysis
→ Save Report to MongoDB
→ View History and Download PDF
```

## Security

* Passwords are hashed before storage.
* JWT tokens protect private routes.
* API keys and database credentials are stored in environment variables.
* Users can access and delete only their own analyses.
