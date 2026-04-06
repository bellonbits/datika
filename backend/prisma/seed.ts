import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin User
  const adminPassword = 'AdminPassword123!';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@datika.com' },
    update: {},
    create: {
      email: 'admin@datika.com',
      name: 'System Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  console.log(`✅ Admin created: ${admin.email} / ${adminPassword}`);

  // 2. Create Instructor User
  const instructorPassword = 'InstructorPassword123!';
  const instructorPasswordHash = await bcrypt.hash(instructorPassword, 12);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@datika.com' },
    update: {},
    create: {
      email: 'instructor@datika.com',
      name: 'Jane Doe',
      passwordHash: instructorPasswordHash,
      role: Role.INSTRUCTOR,
      emailVerified: true,
    },
  });

  console.log(`✅ Instructor created: ${instructor.email} / ${instructorPassword}`);

  // 3. Create Student User (optional, for testing)
  const studentPassword = 'StudentPassword123!';
  const studentPasswordHash = await bcrypt.hash(studentPassword, 12);

  const student = await prisma.user.upsert({
    where: { email: 'student@datika.com' },
    update: {},
    create: {
      email: 'student@datika.com',
      name: 'John Smith',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      emailVerified: true,
    },
  });

  console.log(`✅ Student created: ${student.email} / ${studentPassword}`);

  console.log('🚀 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
