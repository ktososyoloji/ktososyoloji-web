'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase/client';

const BUCKET_NAME = 'posters';

// ─────────────────────────────────────────────
// 1. Afiş Görseli Yükleme
// ─────────────────────────────────────────────
export async function uploadEventPoster(file: File): Promise<string> {
  // Benzersiz dosya adı: timestamp + crypto random + orijinal uzantı
  const extension = file.name.split('.').pop() ?? 'jpg';
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uniqueName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Afiş yüklenemedi: ${error.message}`);
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
// 2. Etkinlik Oluşturma
// ─────────────────────────────────────────────
export async function createEvent(formData: FormData): Promise<void> {
  const title       = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dateRaw     = formData.get('date') as string;
  const location    = formData.get('location') as string | null;
  const formUrl     = formData.get('formUrl') as string | null;
  const posterFile  = formData.get('poster') as File | null;

  if (!title || !description || !dateRaw) {
    throw new Error('Başlık, açıklama ve tarih alanları zorunludur.');
  }

  const date = new Date(dateRaw);
  if (isNaN(date.getTime())) {
    throw new Error('Geçersiz tarih formatı.');
  }

  // Afiş varsa yükle
  let imageUrl: string | null = null;
  if (posterFile && posterFile.size > 0) {
    imageUrl = await uploadEventPoster(posterFile);
  }

  await prisma.event.create({
    data: {
      title,
      description,
      date,
      location:  location  || null,
      formUrl:   formUrl   || null,
      imageUrl:  imageUrl,
    },
  });

  revalidatePath('/');
  revalidatePath('/etkinlikler');
  revalidatePath('/admin/events');
}

// ─────────────────────────────────────────────
// 3. Etkinlik Güncelleme
// ─────────────────────────────────────────────
export async function updateEvent(id: string, formData: FormData): Promise<void> {
  if (!id) {
    throw new Error("Güncellenecek etkinliğin ID'si belirtilmedi.");
  }

  const title       = formData.get('title') as string | null;
  const description = formData.get('description') as string | null;
  const dateRaw     = formData.get('date') as string | null;
  const location    = formData.get('location') as string | null;
  const formUrl     = formData.get('formUrl') as string | null;
  const posterFile  = formData.get('poster') as File | null;
  const isPublished = formData.get('isPublished');

  const data: Record<string, unknown> = {};

  if (title) data.title = title;
  if (description) data.description = description;
  if (dateRaw) {
    const date = new Date(dateRaw);
    if (!isNaN(date.getTime())) {
      data.date = date;
    }
  }
  if (location !== null) data.location = location || null;
  if (formUrl !== null) data.formUrl = formUrl || null;
  if (isPublished !== null) {
    data.isPublished = isPublished === 'true' || isPublished === 'on';
  }

  if (posterFile && posterFile.size > 0) {
    data.imageUrl = await uploadEventPoster(posterFile);
  }

  await prisma.event.update({
    where: { id },
    data,
  });

  revalidatePath('/');
  revalidatePath('/etkinlikler');
  revalidatePath('/admin/events');
}

// ─────────────────────────────────────────────
// 4. Etkinlik Silme
// ─────────────────────────────────────────────
export async function deleteEvent(id: string): Promise<void> {
  if (!id) {
    throw new Error('Silinecek etkinliğin ID\'si belirtilmedi.');
  }

  await prisma.event.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/etkinlikler');
  revalidatePath('/admin/events');
}

// ─────────────────────────────────────────────
// 4. Tüm Etkinlikleri Getirme
// ─────────────────────────────────────────────
export async function getEvents() {
  return prisma.event.findMany({
    orderBy: { date: 'asc' }, // en yakın tarihten uzağa
  });
}
