import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { AuthSession } from '@/lib/team-constants';

const SESSION_COOKIE_NAME = 'sosyo_admin_session';

/**
 * Parolayı crypto.scryptSync ve rastgele salt ile güvenli bir şekilde hash'ler.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Girilen parolanın saklanan hash ile eşleştiğini doğrular.
 */
export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  if (stored === password) return true; // Düz metin geri uyumluluğu

  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;

  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const keyBuf = Buffer.from(key, 'hex');
    const hashBuf = Buffer.from(hash, 'hex');
    if (keyBuf.length !== hashBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, hashBuf);
  } catch {
    return false;
  }
}

/**
 * Oturum çerezini şifreli/güvenli base64 olarak oluşturur.
 */
export async function setSessionCookie(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  const raw = Buffer.from(JSON.stringify(session)).toString('base64');
  cookieStore.set(SESSION_COOKIE_NAME, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

/**
 * Mevcut oturum bilgilerini çerezden okur.
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;

    const json = Buffer.from(cookie.value, 'base64').toString('utf8');
    const session = JSON.parse(json) as AuthSession;

    // Oturumdaki kullanıcının güncel durumunu veritabanından doğrula
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        role: true,
        mustChangePassword: true,
      },
    });

    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      title: user.title,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };
  } catch {
    return null;
  }
}

/**
 * Oturum çerezini siler.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
