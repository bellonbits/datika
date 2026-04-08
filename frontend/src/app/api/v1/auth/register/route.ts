import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { signAccessToken, signRefreshToken, ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return err('Name, email and password are required');
    if (password.length < 8) return err('Password must be at least 8 characters');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return err('Email already registered', 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'STUDENT', emailVerified: false },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      signRefreshToken({ sub: user.id, email: user.email, role: user.role }),
    ]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    return ok({ user, tokens: { accessToken, refreshToken } }, 'Registered successfully', 201);
  } catch (e) {
    console.error('[register]', e);
    return err('Registration failed', 500);
  }
}
