import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'datika_access_secret_change_in_production'
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? 'datika_refresh_secret_change_in_production'
);

export interface JwtPayload {
  sub: string;      // user id
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export async function signAccessToken(payload: Omit<JwtPayload, 'type'>) {
  return new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: Omit<JwtPayload, 'type'>) {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as unknown as JwtPayload;
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload as unknown as JwtPayload;
}

/** Extract and verify the Bearer token from a request. Returns the payload or null. */
export async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    return await verifyAccessToken(auth.slice(7));
  } catch {
    return null;
  }
}

/** Helper: return 401 JSON response */
export function unauthorized(message = 'Unauthorized') {
  return Response.json({ message }, { status: 401 });
}

/** Helper: return 403 JSON response */
export function forbidden(message = 'Forbidden') {
  return Response.json({ message }, { status: 403 });
}

/** Helper: wrap data in standard response shape */
export function ok(data: unknown, message = 'Success', status = 200) {
  return Response.json({ data, message }, { status });
}

/** Helper: return error response */
export function err(message: string, status = 400) {
  return Response.json({ message }, { status });
}
