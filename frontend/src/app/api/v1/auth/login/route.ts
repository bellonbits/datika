import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { signAccessToken, signRefreshToken, ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return err('Email and password are required');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return err('Invalid credentials', 401);
    if (!user.isActive) return err('Account is deactivated', 403);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return err('Invalid credentials', 401);

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      signRefreshToken({ sub: user.id, email: user.email, role: user.role }),
    ]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl };
    return ok({ user: safeUser, tokens: { accessToken, refreshToken } }, 'Login successful');
  } catch (e) {
    console.error('[login]', e);
    return err('Login failed', 500);
  }
}
