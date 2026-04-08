import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyRefreshToken, signAccessToken, signRefreshToken, ok, err } from '@/lib/db/auth';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) return err('Refresh token required', 401);

    const payload = await verifyRefreshToken(refreshToken).catch(() => null);
    if (!payload) return err('Invalid refresh token', 401);

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return err('Refresh token expired or revoked', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) return err('User not found', 401);

    // Rotate tokens
    const [newAccess, newRefresh] = await Promise.all([
      signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      signRefreshToken({ sub: user.id, email: user.email, role: user.role }),
    ]);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token: refreshToken } }),
      prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt } }),
    ]);

    return ok({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (e) {
    console.error('[refresh]', e);
    return err('Token refresh failed', 500);
  }
}
