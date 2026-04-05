# Datika LMS

**AI-powered data science education platform for Africa.**

Datika is a full-stack Learning Management System built for the next generation of African data professionals. It delivers structured data science curricula (SQL, Python, pandas, ML), AI-generated content, real-time AI tutoring, M-Pesa payments, and verifiable certificates — all in a single platform.

---

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Overview

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL (Aiven) |
| Cache / Queues | Redis, BullMQ |
| AI | Groq (Llama 4 Scout), LangChain, Pinecone |
| Payments | Lipana M-Pesa API (Safaricom Daraja) |
| Storage | MinIO (S3-compatible) |
| Auth | JWT (access + refresh tokens), Google OAuth 2.0 |
| Docs | Swagger / OpenAPI (auto-generated, dev only) |

---

## Project Structure

```
datika/
├── backend/               # NestJS API
│   ├── src/
│   │   ├── ai/            # AI tutor, grading, quiz & notes generation
│   │   ├── auth/          # JWT auth, Google OAuth, refresh tokens
│   │   ├── certificates/  # PDF certificate generation (Puppeteer)
│   │   ├── courses/       # Course, section, lesson CRUD
│   │   ├── enrollments/   # Enrollment & lesson progress tracking
│   │   ├── payments/      # Lipana M-Pesa STK push + webhook
│   │   ├── storage/       # MinIO file upload / presigned URLs
│   │   ├── submissions/   # Quiz and assignment submission + AI grading
│   │   └── users/         # User profile management
│   └── prisma/
│       └── schema.prisma  # Full database schema
│
└── frontend/              # Next.js application
    └── src/
        ├── app/
        │   ├── (auth)/            # Login, register pages
        │   ├── (dashboard)/       # Student, instructor, admin dashboards
        │   ├── (marketing)/       # All public-facing pages (18 pages)
        │   └── courses/           # Course catalogue
        ├── components/ui/         # DatikaLogo, MarketingNav, MarketingFooter
        └── lib/
            ├── api/               # Typed API client (auth, courses, AI, payments)
            └── store/             # Zustand auth store
```

---

## Features

### Platform
- Role-based access control: Student, Instructor, Admin
- Course catalogue with levels (Beginner / Intermediate / Advanced)
- Section and lesson ordering, video and text lesson types
- Lesson progress tracking per enrollment
- Verifiable certificates with QR codes and unique verification IDs

### AI
- AI Tutor chat with course-aware context (Groq Llama 4 Scout)
- AI-generated lesson notes, quizzes, and assignments
- Automatic quiz and assignment grading with structured feedback
- Practice problem generation on demand

### Payments
- M-Pesa STK Push via Lipana API
- Webhook handler with HMAC signature verification
- Payment status polling and automatic enrollment on success

### Frontend
- Dark design system: `#070b16` background, `#00d4ff` cyan accent, `#f97316` orange CTA
- 18 fully-built marketing pages with shared layout (nav + footer)
- Student, instructor, and admin dashboards
- Animated components with Framer Motion
- Fully responsive

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (local or [Aiven](https://aiven.io))
- Redis (local or [Upstash](https://upstash.com))
- MinIO (local Docker or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/bellonbits/datika.git
cd datika
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values (see Environment Variables section below)

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed

# Start dev server
npm run start:dev
```

The API will be available at `http://localhost:3001/api/v1`.
Swagger docs: `http://localhost:3001/api/docs`

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL

npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | 256-bit random string for access tokens |
| `JWT_REFRESH_SECRET` | Separate secret for refresh tokens |
| `JWT_EXPIRES_IN` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL |
| `GROQ_API_KEY` | Groq API key (get at console.groq.com) |
| `GROQ_MODEL_CONTENT` | Model for content generation (e.g. `meta-llama/llama-4-scout-17b-16e-instruct`) |
| `GROQ_MODEL_GRADING` | Model for grading |
| `MINIO_ENDPOINT` | MinIO server URL |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |
| `MINIO_BUCKET` | Bucket name (e.g. `datika-assets`) |
| `LIPANA_SECRET_KEY` | Lipana API secret key |
| `LIPANA_WEBHOOK_SECRET` | Webhook HMAC secret from Lipana dashboard |
| `REDIS_URL` | Redis connection URL |
| `PORT` | API port (default: `3001`) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:3000`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:3001/api/v1`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_APP_URL` | Frontend base URL |

---

## Database Schema

Key models:

- **User** — roles: `STUDENT`, `INSTRUCTOR`, `ADMIN`
- **Course** — status: `DRAFT`, `PUBLISHED`, `ARCHIVED`; levels: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- **Section / Lesson** — ordered content with types: `VIDEO`, `TEXT`, `FILE`, `AI_NOTES`, `QUIZ`, `ASSIGNMENT`
- **Enrollment + LessonProgress** — per-student progress tracking (0–100%)
- **AiNotes / Quiz / Assignment** — AI-generated content linked to lessons
- **Submission** — student answers with AI grading results (`score`, `grade`, `feedback`)
- **Payment** — M-Pesa STK push with `checkoutRequestId`, `mpesaReceiptNumber`
- **Certificate** — unique `verificationCode` + PDF URL
- **ChatSession + ChatMessage** — persistent AI tutor conversations

Run `npm run db:studio` to open Prisma Studio and browse the database.

---

## API Endpoints

| Module | Prefix | Key endpoints |
|---|---|---|
| Auth | `/api/v1/auth` | `POST /register`, `POST /login`, `POST /refresh`, `GET /google` |
| Users | `/api/v1/users` | `GET /me`, `PATCH /me`, `GET /:id` |
| Courses | `/api/v1/courses` | `GET /`, `POST /`, `GET /:slug`, `PATCH /:id`, `DELETE /:id` |
| Lessons | `/api/v1/lessons` | `POST /`, `GET /:id`, `PATCH /:id`, `POST /:id/complete` |
| AI | `/api/v1/ai` | `POST /chat`, `POST /generate/notes`, `POST /generate/quiz`, `POST /generate/assignment`, `POST /grade` |
| Payments | `/api/v1/payments` | `POST /initiate`, `GET /status/:id`, `POST /webhook` |
| Submissions | `/api/v1/submissions` | `POST /`, `GET /:id`, `GET /my` |
| Certificates | `/api/v1/certificates` | `GET /my`, `GET /verify/:code` |

Full interactive documentation is available at `/api/docs` in development.

---

## Docker

A `Dockerfile` is provided for both `backend/` and `frontend/`. To run the backend in Docker:

```bash
cd backend
docker build -t datika-api .
docker run -p 3001:3001 --env-file .env datika-api
```

---

## Marketing Pages

The frontend includes 18 fully-built public pages:

| Route | Page |
|---|---|
| `/` | Homepage |
| `/courses` | Course catalogue |
| `/pricing` | Plans and pricing |
| `/about` | About Datika |
| `/careers` | Open roles |
| `/contact` | Contact form |
| `/community` | Community hub |
| `/technology` | Technology stack |
| `/ai-tutor` | AI Tutor feature |
| `/certificates` | Certificates program |
| `/live-sessions` | Live sessions |
| `/blog` | Blog |
| `/press` | Press and media |
| `/partners` | Partners |
| `/docs` | Help centre and documentation |
| `/status` | System status |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/cookies` | Cookie Policy |

---

## License

MIT License. Copyright 2026 Datika Learning Ltd.
