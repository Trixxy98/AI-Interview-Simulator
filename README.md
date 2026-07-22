# 🎙️ AI Interview Simulator

A full-stack AI-powered mock interview platform that helps job seekers practise technical and behavioural interviews with real-time webcam analysis, AI-generated questions, and detailed post-session reports.

![AI Interview Simulator](./client/src/assets/hero.png)

---

## ✨ Features

- 🤖 **AI-Generated Questions** — Dynamic interview questions tailored to job role and level, powered by OpenAI / Groq
- 🎯 **Real-Time Webcam Analysis** — Eye contact and head stability tracking using MediaPipe FaceMesh (runs locally, no video stored)
- 🎤 **Speech-to-Text Answer Input** — Speak or type your answers freely
- 📊 **Post-Interview Report** — Detailed scoring with feedback per question and downloadable PDF
- 🔐 **JWT Authentication** — Secure access & refresh token flow with Redis token blacklisting
- 📈 **Dashboard & History** — View past sessions and analytics over time

---

## 🛠️ Tech Stack

### Frontend (`/client`)

| Tech | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool & dev server |
| TailwindCSS v4 | Styling |
| shadcn/ui | Component library |
| Zustand | Global auth state |
| TanStack Query | Server state & caching |
| React Hook Form + Zod | Form validation |
| MediaPipe FaceMesh | Local face tracking |
| Recharts | Analytics charts |
| React Router v7 | Client-side routing |

### Backend (`/server`)

| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Primary database |
| Redis (Upstash) | Refresh token store / blacklist |
| OpenAI / Groq SDK | AI question & feedback generation |
| JWT (jsonwebtoken) | Authentication |
| bcrypt | Password hashing |
| PDFKit | PDF report generation |
| Zod | Request validation |
| Helmet + Rate Limit | Security hardening |

---

## 📁 Project Structure

```
AI-Interview/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/
│   │   │   ├── auth/        # useLogin, useLogout, useRefreshToken
│   │   │   ├── data/        # useAnalytics, useReport, useInterviewHistory
│   │   │   ├── interview/   # useInterview, useStartInterview, useSubmitAnswer
│   │   │   └── vision/      # useMediaPipe, useWebcam, useEyeContact, useHeadPose
│   │   ├── pages/           # LoginPage, RegisterPage, Dashboard, InterviewPage, ReportPage
│   │   ├── services/        # Axios instance (with interceptors)
│   │   └── store/           # Zustand auth store
│   └── index.html
│
└── server/                  # Express backend
    └── src/
        ├── config/          # MongoDB & Redis connection
        ├── controllers/     # auth, interview, answer, camera, report
        ├── middleware/      # JWT auth, Zod validation
        ├── models/          # User, Interview, Question, Answer, Report, CameraAnalysis
        ├── routes/          # auth, interview, camera, report, user
        ├── services/        # AI service, report generation
        └── utils/           # Zod validation schemas
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- MongoDB Atlas account
- Redis instance (e.g. [Upstash](https://upstash.com))
- OpenAI or Groq API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/AI-Interview.git
cd AI-Interview
```

### 2. Setup the backend

```bash
cd server
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # Runs on http://localhost:5000
```

### 3. Setup the frontend

```bash
cd client
cp .env.example .env    # Set VITE_API_URL
npm install
npm run dev             # Runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### `server/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-interview
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
REDIS_URL=redis://:password@your-upstash-url:6379
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout & blacklist token |
| POST | `/api/interviews/start` | Start new interview session |
| POST | `/api/interviews/:id/submit` | Submit answer for a question |
| GET | `/api/interviews` | Get interview history |
| GET | `/api/report/:id` | Get full interview report |
| GET | `/api/report/:id/pdf` | Download report as PDF |
| POST | `/api/camera/analysis` | Save camera analysis data |

---

## 🎥 Webcam Privacy

> All face analysis is done **entirely in the browser** using MediaPipe FaceMesh.  
> No video frames or images are ever sent to the server.  
> Only computed metrics (eye contact %, head stability %) are stored.

---

## 📄 License

MIT — feel free to use, fork, and improve.
