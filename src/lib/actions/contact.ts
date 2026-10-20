'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export interface SendMessageInput {
  name: string;
  email: string;
  message: string;
}

// ─────────────────────────────────────────────
// 1. İletişim Mesajı Gönderme
// ─────────────────────────────────────────────
export async function sendMessage(
  formData: SendMessageInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData?.name?.trim();
    const email = formData?.email?.trim();
    const message = formData?.message?.trim();

    if (!name || !email || !message) {
      return {
        success: false,
        error: 'Lütfen ad, e-posta ve mesaj alanlarını eksiksiz doldurun.',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Lütfen geçerli bir e-posta adresi girin.',
      };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase(),
        message,
        isRead: false,
      },
    });

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('Mesaj gönderilirken hata oluştu:', error);
    return {
      success: false,
      error: 'Mesajınız gönderilirken bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
    };
  }
}

// ─────────────────────────────────────────────
// 2. Tüm Mesajları Getirme (Yeniden Eskiye)
// ─────────────────────────────────────────────
export async function getMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Mesajlar getirilirken hata oluştu:', error);
    return [];
  }
}

// ─────────────────────────────────────────────
// 3. Mesaj Silme
// ─────────────────────────────────────────────
export async function deleteMessage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Silinecek mesaj ID belirtilmedi.' };
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('Mesaj silinirken hata oluştu:', error);
    return {
      success: false,
      error: 'Mesaj silinirken bir hata oluştu.',
    };
  }
}

// ─────────────────────────────────────────────
// 4. Mesajın Okundu Durumunu Güncelleme
// ─────────────────────────────────────────────
export async function markAsRead(
  id: string,
  isRead: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Mesaj ID belirtilmedi.' };
  }

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('Mesaj okundu durumu güncellenirken hata oluştu:', error);
    return {
      success: false,
      error: 'Mesaj durumu güncellenirken bir hata oluştu.',
    };
  }
}
