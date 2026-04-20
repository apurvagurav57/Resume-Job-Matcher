# ResuMatch

ResuMatch is an AI-powered MERN application that parses resumes, finds jobs, scores job-fit using Gemini, and tracks applications with a Kanban workflow.

## Tech Stack

| Layer     | Tech                                          |
| --------- | --------------------------------------------- |
| Frontend  | React, Vite, TailwindCSS, Axios, React Router |
| Backend   | Node.js, Express, MongoDB, Mongoose           |
| AI & APIs | Gemini API, JSearch RapidAPI                  |
| Storage   | Cloudinary                                    |
| Auth      | JWT                                           |

## Prerequisites

- Node.js 18+
- MongoDB Atlas URI
- Gemini API key
- RapidAPI JSearch key
- Cloudinary account
- Brevo SMTP credentials (optional welcome emails)

## Installation

1. Clone repository
2. Install backend dependencies
   - `cd server`
   - `npm install`
3. Install frontend dependencies
   - `cd ../client`
   - `npm install`

## Environment Variables

### Server (`server/.env`)

| Key                   | Description                   |
| --------------------- | ----------------------------- |
| PORT                  | Backend port (default `5000`) |
| NODE_ENV              | `development` or `production` |
| CLIENT_URL            | Frontend URL                  |
| MONGODB_URI           | MongoDB connection string     |
| JWT_SECRET            | JWT signing secret            |
| GEMINI_API_KEY        | Gemini API key                |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name         |
| CLOUDINARY_API_KEY    | Cloudinary API key            |
| CLOUDINARY_API_SECRET | Cloudinary API secret         |
| JSEARCH_API_KEY       | RapidAPI JSearch key          |
| BREVO_SMTP_USER       | Brevo SMTP username           |
| BREVO_API_KEY         | Brevo SMTP/API key            |
| FROM_EMAIL            | Sender email                  |

### Client (`client/.env`)

| Key          | Description                                    |
| ------------ | ---------------------------------------------- |
| VITE_API_URL | API base URL, e.g. `http://localhost:5000/api` |

## Run Locally

1. Start backend:
   - `cd server`
   - `npm run dev`
2. Start frontend in another terminal:
   - `cd client`
   - `npm run dev`

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Deployment Guide

## Production URLs

- Frontend (Primary): `https://resumejobmatcher-puce.vercel.app`
- Frontend (Preview): `https://resumejobmatcher-git-main-apurvagurav57s-projects.vercel.app`
- Frontend (Preview): `https://resumejobmatcher-afbgradec-apurvagurav57s-projects.vercel.app`
- Backend: `https://resume-job-matcher-quzh.onrender.com`
- Backend Health: `https://resume-job-matcher-quzh.onrender.com/health`

## Production Environment Setup

### Render Backend Environment Variables

- `CLIENT_URLS=https://resumejobmatcher-puce.vercel.app,https://resumejobmatcher-git-main-apurvagurav57s-projects.vercel.app,https://resumejobmatcher-afbgradec-apurvagurav57s-projects.vercel.app`

### Vercel Frontend Environment Variables

- `VITE_API_URL=https://resume-job-matcher-quzh.onrender.com/api`

### Render (Backend)

1. Create a new Web Service on Render from this repo.
2. Root directory: `server`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add all server environment variables in Render dashboard.

### Vercel (Frontend)

1. Import project in Vercel.
2. Root directory: `client`.
3. Framework preset: Vite.
4. Add `VITE_API_URL` pointing to your Render backend `/api` URL.

## API Endpoints

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| POST   | `/api/auth/register`    | Register user      |
| POST   | `/api/auth/login`       | Login user         |
| GET    | `/api/auth/me`          | Get current user   |
| POST   | `/api/resume/upload`    | Upload resume file |
| POST   | `/api/resume/paste`     | Paste resume text  |
| GET    | `/api/resume/me`        | Get active resume  |
| POST   | `/api/jobs/match`       | Find job matches   |
| POST   | `/api/jobs/save/:jobId` | Save job           |
| GET    | `/api/jobs/saved`       | Get saved jobs     |
| GET    | `/api/applications`     | List applications  |
| POST   | `/api/applications`     | Create application |
| PUT    | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

## Screenshots

- Landing page: `docs/screenshots/landing.png`
- Dashboard: `docs/screenshots/dashboard.png`
- Job matches: `docs/screenshots/matches.png`
- Tracker: `docs/screenshots/tracker.png`
