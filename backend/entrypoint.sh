#!/bin/sh
set -e

echo "Pushing database schema..."
npx prisma db push --skip-generate

echo "Seeding admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  const users = [
    { email: 'admin@datika.com', name: 'System Admin', password: 'AdminPassword123!', role: 'ADMIN' },
    { email: 'instructor@datika.com', name: 'Jane Doe', password: 'InstructorPassword123!', role: 'INSTRUCTOR' },
    { email: 'student@datika.com', name: 'John Smith', password: 'StudentPassword123!', role: 'STUDENT' },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, passwordHash, role: u.role, emailVerified: true },
    });
    console.log('User ready:', u.email);
  }
}

seed().catch(console.error).finally(() => prisma.\$disconnect());
" || echo "Seed warning (non-fatal)"

echo "Starting server..."
# nest build outputs to dist/main.js (sourceRoot=src)
exec node dist/main
