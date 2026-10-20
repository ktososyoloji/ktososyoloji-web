'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { Role } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
  getSession,
  setSessionCookie,
  clearSessionCookie,
} from '@/lib/auth';
import {
  VALID_TITLES,
  type ValidTitle,
  type AuthSession,
  getRoleForTitle,
} from '@/lib/team-constants';

// ─────────────────────────────────────────────
// 1. Ekip Üyesi / Yönetici Ekleme (Sadece ADMIN)
// ─────────────────────────────────────────────
export async function createTeamMember(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Yetki Kontrolü: Yalnızca ADMIN ekip üyesi ekleyebilir
    const session = await getSession();
    if (session && session.role !== Role.ADMIN) {
      return {
        success: false,
        error: 'Yetkisiz işlem! Yalnızca Topluluk Yöneticileri (ADMIN) yeni üye ekleyebilir.',
      };
    }

    const name = (formData.get('name') as string)?.trim();
    const title = (formData.get('title') as string)?.trim() as ValidTitle;
    let email = (formData.get('email') as string)?.trim();

    if (!name || !title) {
      return {
        success: false,
        error: 'Lütfen ad soyad ve görev alanlarını eksiksiz doldurun.',
      };
    }

    if (!VALID_TITLES.includes(title)) {
      return {
        success: false,
        error: `Geçersiz görev/unvan! Lütfen belirtilen 4 ünvandan birini seçiniz: ${VALID_TITLES.join(', ')}`,
      };
    }

    // Göreve göre sistem rolünü otomatik belirle
    const role: Role = getRoleForTitle(title);

    // Eğer e-posta belirtilmemişse otomatik kurumsal format oluştur
    if (!email) {
      email = `${slugify(name)}@karatay.edu.tr`;
    } else {
      email = email.toLowerCase();
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Lütfen geçerli bir kurumsal veya kişisel e-posta adresi girin.',
      };
    }

    // Mevcut e-posta çakışmasını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Bu e-posta adresiyle kayıtlı bir ekip üyesi zaten mevcut.',
      };
    }

    // Varsayılan geçici şifre: "123456" (güvenli hash)
    const defaultPasswordHash = hashPassword('123456');

    await prisma.user.create({
      data: {
        name,
        email,
        title,
        role,
        password: defaultPasswordHash,
        mustChangePassword: true, // İlk girişte şifre değiştirme zorunlu
      },
    });

    revalidatePath('/admin/team');
    revalidatePath('/admin');
    revalidatePath('/hakkimizda');

    return { success: true };
  } catch (err: unknown) {
    const errCode = (err as { code?: string })?.code;
    const errMsg = (err instanceof Error ? err.message : String(err)).toLowerCase();

    if (
      errCode === 'P2002' ||
      errMsg.includes('unique') ||
      errMsg.includes('already registered') ||
      errMsg.includes('already exists') ||
      errMsg.includes('email')
    ) {
      return {
        success: false,
        error: 'Bu e-posta adresiyle kayıtlı bir ekip üyesi zaten mevcut.',
      };
    }

    return {
      success: false,
      error: 'Kullanıcı eklenirken bir sunucu hatası oluştu. Lütfen tekrar deneyin.',
    };
  }
}

// ─────────────────────────────────────────────
// 2. Ekip Üyesi Silme (Sadece ADMIN)
// ─────────────────────────────────────────────
export async function deleteTeamMember(id: string): Promise<void> {
  const session = await getSession();
  if (session && session.role !== Role.ADMIN) {
    throw new Error('Yetkisiz işlem! Yalnızca Topluluk Yöneticileri (ADMIN) ekip üyesi silebilir.');
  }

  if (!id) {
    throw new Error('Silinecek üye ID\'si belirtilmedi.');
  }

  // Kendisini silmesini önle
  if (session && session.userId === id) {
    throw new Error('Kendi yönetici hesabınızı silemezsiniz.');
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath('/admin/team');
  revalidatePath('/admin');
  revalidatePath('/hakkimizda');
}

// ─────────────────────────────────────────────
// 3. Ekip Üyelerini Listeleme
// ─────────────────────────────────────────────
export async function getTeamMembers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      role: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ─────────────────────────────────────────────
// 4. Yönetici / Editör Giriş Kontrolü
// ─────────────────────────────────────────────
export async function loginAdminAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  mustChangePassword?: boolean;
}> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string);

  if (!email || !password) {
    return { success: false, error: 'E-posta ve şifre alanları zorunludur.' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: 'E-posta adresi veya şifre hatalı.' };
  }

  // Parola doğrulaması (varsayılan hash veya atanmış parola)
  const isMatch = verifyPassword(password, user.password);

  if (!isMatch) {
    // Özel durum: Eğer henüz parola atanmamış eski bir kullanıcı ise ve şifre 123456 girildiyse
    if (!user.password && password === '123456') {
      const initialHash = hashPassword('123456');
      await prisma.user.update({
        where: { id: user.id },
        data: { password: initialHash, mustChangePassword: true },
      });
    } else {
      return { success: false, error: 'E-posta adresi veya şifre hatalı.' };
    }
  }

  // Oturum oluştur
  const sessionData: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    title: user.title,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };

  await setSessionCookie(sessionData);

  return {
    success: true,
    mustChangePassword: user.mustChangePassword,
  };
}

// ─────────────────────────────────────────────
// 5. İlk Girişte Zorunlu Şifre Değiştirme
// ─────────────────────────────────────────────
export async function changePasswordAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' };
  }

  const currentPassword = (formData.get('currentPassword') as string);
  const newPassword = (formData.get('newPassword') as string);
  const confirmPassword = (formData.get('confirmPassword') as string);

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: 'Tüm alanların doldurulması zorunludur.' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'Yeni şifreniz en az 6 karakter uzunluğunda olmalıdır.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Yeni şifreler birbiriyle uyuşmuyor.' };
  }

  if (newPassword === '123456') {
    return { success: false, error: 'Lütfen varsayılan "123456" şifresinden farklı, güvenli bir şifre belirleyin.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return { success: false, error: 'Kullanıcı bulunamadı.' };
  }

  // Mevcut şifreyi doğrula (123456 veya kayıtlı şifre)
  const isCurrentValid = verifyPassword(currentPassword, user.password);
  if (!isCurrentValid && currentPassword !== '123456') {
    return { success: false, error: 'Mevcut şifreniz hatalı. (Varsayılan şifre: 123456)' };
  }

  // Yeni şifreyi hash'le ve mustChangePassword = false yap
  const newHash = hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHash,
      mustChangePassword: false,
    },
  });

  // Oturum çerezini mustChangePassword: false olarak güncelle
  await setSessionCookie({
    ...session,
    mustChangePassword: false,
  });

  revalidatePath('/admin');
  return { success: true };
}

// ─────────────────────────────────────────────
// 6. Oturumu Kapatma
// ─────────────────────────────────────────────
export async function logoutAdminAction(): Promise<void> {
  await clearSessionCookie();
}

// ─────────────────────────────────────────────
// 7. Mevcut Oturum Kullanıcısını Getirme
// ─────────────────────────────────────────────
export async function getCurrentAdminUser(): Promise<AuthSession | null> {
  return getSession();
}
