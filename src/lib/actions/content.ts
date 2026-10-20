'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase/client';
import { ContentType } from '@prisma/client';

const BUCKET_NAME = 'posters';

// ─────────────────────────────────────────────
// Türkçe Karakter Destekli Slug Üretici
// ─────────────────────────────────────────────
export async function generateSlug(text: string): Promise<string> {
  const trMap: Record<string, string> = {
    ç: 'c', Ç: 'c',
    ğ: 'g', Ğ: 'g',
    ı: 'i', I: 'i', İ: 'i',
    ö: 'o', Ö: 'o',
    ş: 's', Ş: 's',
    ü: 'u', Ü: 'u',
  };

  return text
    .split('')
    .map((char) => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─────────────────────────────────────────────
// 1. Kapak Görseli Yükleme
// ─────────────────────────────────────────────
export async function uploadContentCover(file: File): Promise<string> {
  const extension = file.name.split('.').pop() ?? 'jpg';
  const uniqueName = `content-${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uniqueName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Kapak görseli yüklenemedi: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(uniqueName);

  if (!data?.publicUrl) {
    throw new Error('Yüklenen dosyanın public URL\'si alınamadı.');
  }

  return data.publicUrl;
}

// ─────────────────────────────────────────────
// 2. İçerik Türü Eşleyici
// ─────────────────────────────────────────────
function parseContentType(rawType: string): ContentType {
  switch (rawType.toUpperCase()) {
    case 'FILM':
    case 'MOVIE':
      return ContentType.MOVIE;
    case 'ARTICLE':
    case 'ESSAY':
      return ContentType.ESSAY;
    case 'INTERVIEW':
      return ContentType.INTERVIEW;
    case 'BOOK':
    default:
      return ContentType.BOOK;
  }
}

// ─────────────────────────────────────────────
// 3. İçerik Oluşturma
// ─────────────────────────────────────────────
export async function createContent(formData: FormData): Promise<void> {
  const title = (formData.get('title') as string)?.trim();
  const rawType = (formData.get('type') as string)?.trim();
  const author = (formData.get('author') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const body = (formData.get('body') as string || formData.get('content') as string)?.trim();
  const coverFile = (formData.get('coverImage') as File || formData.get('image') as File | null);

  if (!title || !body) {
    throw new Error('İçerik başlığı ve detaylı metin alanları zorunludur.');
  }

  // Temiz slug üretimi
  const slug = await generateSlug(title);
  void slug; // İleride modelde slug alanı açıldığında doğrudan kullanılabilir

  const contentType = parseContentType(rawType || 'BOOK');

  // Kapak görseli varsa Supabase Storage'a yükle
  let imageUrl: string | null = null;
  if (coverFile && coverFile.size > 0) {
    imageUrl = await uploadContentCover(coverFile);
  }

  await prisma.content.create({
    data: {
      title,
      type: contentType,
      author,
      summary,
      content: body,
      imageUrl,
      isPublished: true,
    },
  });

  revalidatePath('/admin/content');
  revalidatePath('/icerikler');
}

// ─────────────────────────────────────────────
// 4. İçerik Silme
// ─────────────────────────────────────────────
export async function deleteContent(id: string): Promise<void> {
  if (!id) {
    throw new Error('Silinecek içeriğin ID\'si belirtilmedi.');
  }

  await prisma.content.delete({ where: { id } });

  revalidatePath('/admin/content');
  revalidatePath('/icerikler');
}

// ─────────────────────────────────────────────
// 5. Tüm İçerikleri Getirme (Yeniden Eskiye)
// ─────────────────────────────────────────────
export async function getContents() {
  return prisma.content.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
