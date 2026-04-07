#!/bin/sh
set -e

echo "Creating datika schema if not exists..."
npx prisma db execute --stdin --url "$DATABASE_URL" <<'SQL'
CREATE SCHEMA IF NOT EXISTS datika;
SQL

echo "Pushing database schema..."
npx prisma db push --skip-generate --accept-data-loss

echo "Seeding users..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  const users = [
    { email: 'admin@datika.com',      name: 'System Admin', password: 'AdminPassword123!',      role: 'ADMIN' },
    { email: 'instructor@datika.com', name: 'Jane Doe',     password: 'InstructorPassword123!', role: 'INSTRUCTOR' },
    { email: 'student@datika.com',    name: 'John Smith',   password: 'StudentPassword123!',    role: 'STUDENT' },
  ];
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, passwordHash, role: u.role, emailVerified: true },
    });
    console.log('Ready:', u.email);
  }
}
seed().catch(e => console.error('Seed warning:', e.message)).finally(() => prisma.\$disconnect());
" || true

echo "Starting server..."
exec node dist/main
