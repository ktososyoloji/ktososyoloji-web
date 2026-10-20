'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

const BUCKET_NAME = 'posters';

export interface ColumnArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  authorName: string;
  authorRole: string | null;
  authorImage: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// IDE dil sunucusu önbelleği için tip güvenli model erişimi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columnDb = (prisma as any).columnArticle;

/**
 * Yazar görselini Supabase Storage'a yükler ve genel erişim URL'sini döner.
 */
async function uploadAuthorPhoto(file: File): Promise<string> {
  const extension = file.name.split('.').pop() ?? 'jpg';
  const uniqueName = `authors/author-${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uniqueName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Yazar görseli yüklenemedi: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(uniqueName);

  if (!data?.publicUrl) {
    throw new Error("Yüklenen dosyanın public URL'si alınamadı.");
  }

  return data.publicUrl;
}

// ─────────────────────────────────────────────
// 1. Yeni Köşe Yazısı Oluşturma
// ─────────────────────────────────────────────
export async function createColumnArticle(formData: FormData): Promise<void> {
  const title = (formData.get('title') as string)?.trim();
  const authorName = (formData.get('authorName') as string || formData.get('author') as string)?.trim();
  const authorRole = (formData.get('authorRole') as string)?.trim() || null;
  const excerpt = (formData.get('excerpt') as string || formData.get('summary') as string)?.trim() || null;
  const body = (formData.get('body') as string || formData.get('content') as string)?.trim();
  const imageFile = formData.get('authorImage') as File | null;
  const imageUrlString = (formData.get('authorImageUrl') as string)?.trim() || null;

  if (!title) {
    throw new Error('Yazı başlığı zorunludur.');
  }

  if (!authorName) {
    throw new Error('Yazar adı zorunludur.');
  }

  if (!body) {
    throw new Error('Yazı metni (içerik) zorunludur.');
  }

  // Benzersiz slug türetme
  let baseSlug = slugify(title);
  if (!baseSlug) {
    baseSlug = `yazi-${Date.now().toString().slice(-6)}`;
  }

  let uniqueSlug = baseSlug;
  const existing = await columnDb.findUnique({
    where: { slug: uniqueSlug },
  });

  if (existing) {
    uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  // Yazar görselini yükleme veya URL alma
  let authorImage: string | null = imageUrlString;
  if (imageFile && imageFile.size > 0 && typeof imageFile !== 'string') {
    authorImage = await uploadAuthorPhoto(imageFile);
  }

  await columnDb.create({
    data: {
      title,
      slug: uniqueSlug,
      excerpt,
      body,
      authorName,
      authorRole,
      authorImage,
      published: true,
    },
  });

  revalidatePath('/kose-yazilari');
  revalidatePath('/admin/columns');
  revalidatePath('/');
}

// ─────────────────────────────────────────────
// 2. Köşe Yazısını Silme
// ─────────────────────────────────────────────
export async function deleteColumnArticle(id: string): Promise<void> {
  if (!id) {
    throw new Error('Silinecek yazının ID değeri belirtilmedi.');
  }

  await columnDb.delete({
    where: { id },
  });

  revalidatePath('/kose-yazilari');
  revalidatePath('/admin/columns');
  revalidatePath('/');
}

// ─────────────────────────────────────────────
// 3. Tüm Köşe Yazılarını Getirme (Tarihe Göre Azalan)
// ─────────────────────────────────────────────
export async function getColumnArticles(): Promise<ColumnArticleItem[]> {
  return columnDb.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// ─────────────────────────────────────────────
// 4. Slug Üzerinden Tekil Köşe Yazısını Getirme
// ─────────────────────────────────────────────
export async function getColumnArticleBySlug(slug: string): Promise<ColumnArticleItem | null> {
  if (!slug) return null;

  return columnDb.findUnique({
    where: { slug },
  });
}

// ─────────────────────────────────────────────
// 5. En Son Yayınlanan Köşe Yazısını Getirme
// ─────────────────────────────────────────────
export async function getLatestColumnArticle(): Promise<ColumnArticleItem | null> {
  return columnDb.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
}
