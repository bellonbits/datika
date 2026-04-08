import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) return err('Both passwords are required');
    if (newPassword.length < 8) return err('New password must be at least 8 characters');

    const user = await prisma.user.findUnique({ where: { id: auth.sub } });
    if (!user?.passwordHash) return err('Cannot change password for OAuth accounts', 400);

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return err('Current password is incorrect', 401);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: auth.sub }, data: { passwordHash } });

    return ok(null, 'Password changed successfully');
  } catch (e) {
    console.error('[change-password]', e);
    return err('Failed to change password', 500);
  }
}
