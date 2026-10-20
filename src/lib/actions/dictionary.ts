'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// ─────────────────────────────────────────────
// 1. Terim Oluşturma
// ─────────────────────────────────────────────
export async function createDictionaryTerm(formData: FormData): Promise<void> {
  const term       = (formData.get('term') as string)?.trim();
  const definition = (formData.get('definition') as string)?.trim();
  const createdBy  = (formData.get('author') as string)?.trim() || null;

  if (!term || !definition) {
    throw new Error('Terim adı ve tanım alanları zorunludur.');
  }

  await prisma.dictionary.create({
    data: {
      term,
      definition,
      createdBy,
    },
  });

  revalidatePath('/admin/dictionary');
  revalidatePath('/sozluk');
  revalidatePath('/');
}

// ─────────────────────────────────────────────
// 2. Terim Silme
// ─────────────────────────────────────────────
export async function deleteDictionaryTerm(id: string): Promise<void> {
  if (!id) {
    throw new Error('Silinecek terimin ID\'si belirtilmedi.');
  }

  await prisma.dictionary.delete({ where: { id } });

  revalidatePath('/admin/dictionary');
  revalidatePath('/sozluk');
  revalidatePath('/');
}

// ─────────────────────────────────────────────
// 3. Tüm Terimleri Getirme (Alfabetik)
// ─────────────────────────────────────────────
export async function getDictionaryTerms() {
  return prisma.dictionary.findMany({
    orderBy: { term: 'asc' },
  });
}
