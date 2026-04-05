# Datika Backend — Architecture Guide

## Stack

- **Runtime**: Node.js 20+
- **Framework**: NestJS (modular, decorator-based)
- **ORM**: Prisma (type-safe, PostgreSQL)
- **Authentication**: JWT (access + refresh tokens) + Google OAuth 2.0
- **API Style**: RESTful JSON API
- **Validation**: class-validator + class-transformer
- **File Storage**: AWS S3 (via @aws-sdk/client-s3)
- **Payments**: Safaricom Daraja API (M-Pesa STK Push)
- **AI**: OpenAI API (gpt-4o for content generation, gpt-4o-mini for grading/feedback)
- **PDF Generation**: @react-pdf/renderer or puppeteer (certificates)
- **Queue**: Bull + Redis (async AI jobs)

## Module Architecture

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Bootstrap
├── prisma/
│   └── prisma.service.ts   # PrismaClient singleton
├── common/
│   ├── guards/             # JwtAuthGuard, RolesGuard
│   ├── decorators/         # @Roles(), @CurrentUser()
│   ├── filters/            # GlobalExceptionFilter
│   ├── interceptors/       # ResponseInterceptor, LoggingInterceptor
│   └── pipes/              # ValidationPipe
├── auth/                   # JWT + Google OAuth
├── users/                  # User CRUD + profile
├── courses/                # Course + Section + Lesson management
├── enrollments/            # Student enrollment + progress
├── ai/                     # AI service orchestration
│   ├── notes/              # Academic content generation
│   ├── quiz/               # Quiz generation
│   ├── assignment/         # Assignment generation
│   ├── grading/            # Submission evaluation
│   ├── feedback/           # Personalized feedback
│   └── chat/               # AI tutor chat
├── payments/               # M-Pesa STK Push + callbacks
├── certificates/           # PDF certificate generation
├── submissions/            # Student assignment/quiz submissions
└── storage/                # S3 file upload service
```

## Security Requirements

- All routes must be protected by `JwtAuthGuard` unless explicitly marked `@Public()`
- Role-based access control via `@Roles(Role.ADMIN, Role.INSTRUCTOR)`
- Rate limiting on all AI endpoints (max 10 req/min per user)
- Input validation on all DTOs via `class-validator`
- SQL injection impossible via Prisma parameterized queries
- M-Pesa callbacks must validate IP whitelist (Safaricom IPs only)

## API Response Format

All endpoints return a uniform envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "string",
  "timestamp": "ISO8601"
}
```

Errors:
```json
{
  "success": false,
  "error": { "code": "string", "message": "string", "details": {} },
  "timestamp": "ISO8601"
}
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/datika
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=datika-assets
AWS_REGION=af-south-1
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://api.datika.co.ke/payments/mpesa/callback
REDIS_URL=redis://localhost:6379
FRONTEND_URL=https://datika.co.ke
PORT=3001
```
