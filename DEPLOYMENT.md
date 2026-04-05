# Datika LMS — Deployment Guide

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)
- AWS account (S3 bucket in af-south-1)
- Safaricom Daraja API credentials
- OpenAI API key
- Google OAuth credentials

---

## 1. Local Development Setup

### Clone and install

```bash
# Backend
cd backend
npm install
cp .env.example .env         # Fill in your values
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local   # Fill in your values
npm run dev
```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- Swagger docs: http://localhost:3001/api/docs
- Prisma Studio: `cd backend && npm run db:studio`

---

## 2. Docker Compose (Staging/Production)

```bash
# Copy and fill environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

---

## 3. Environment Configuration

### Required Backend Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | 256-bit random string |
| `JWT_REFRESH_SECRET` | 256-bit random string (different) |
| `OPENAI_API_KEY` | OpenAI API key (gpt-4o access required) |
| `MPESA_CONSUMER_KEY` | Daraja API consumer key |
| `MPESA_CONSUMER_SECRET` | Daraja API consumer secret |
| `MPESA_SHORTCODE` | Business shortcode (174379 for sandbox) |
| `MPESA_PASSKEY` | Lipa na M-Pesa online passkey |
| `MPESA_CALLBACK_URL` | Public URL for M-Pesa callbacks |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_S3_BUCKET` | S3 bucket name |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

---

## 4. M-Pesa Setup (Daraja API)

1. Register at https://developer.safaricom.co.ke
2. Create a new app under **Lipa Na M-Pesa Online** product
3. Get Consumer Key, Consumer Secret, and Passkey
4. Set `MPESA_ENV=sandbox` for testing, `production` for live
5. Register your callback URL in the Daraja dashboard
6. Whitelist Safaricom IPs in your firewall for callback security

### Test Numbers (Sandbox)
- Phone: `254708374149`
- PIN: `1234`

---

## 5. Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client (Web application)
4. Add authorized redirect URI: `http://localhost:3001/api/v1/auth/google/callback`
5. For production: `https://api.datika.co.ke/api/v1/auth/google/callback`

---

## 6. AWS S3 Setup

```bash
# Create bucket
aws s3 mb s3://datika-assets --region af-south-1

# Set bucket policy for public read (course thumbnails)
# Upload assets under: courses/, avatars/, certificates/
```

---

## 7. Production Deployment (DigitalOcean / AWS EC2)

```bash
# Install Docker on Ubuntu
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone repo
git clone https://github.com/your-org/datika.git
cd datika

# Configure env files
vim backend/.env
vim frontend/.env

# Start with nginx profile
docker-compose --profile production up -d

# SSL with Certbot (Let's Encrypt)
certbot --nginx -d datika.co.ke -d api.datika.co.ke
```

---

## 8. Build Order (Development)

Follow this strict order to avoid dependency issues:

1. `docker-compose up postgres redis`
2. `cd backend && npm run db:migrate`
3. `cd backend && npm run start:dev`
4. `cd frontend && npm run dev`

---

## 9. AI Cost Management

- Academic notes use `gpt-4o` (expensive) — rate limited to 5/min per instructor
- Grading and chat use `gpt-4o-mini` (cheaper) — higher limits
- All AI endpoints are throttled globally
- Monitor token usage in OpenAI dashboard

Estimated cost: ~$0.02–$0.08 per notes generation, ~$0.001 per grading call.
