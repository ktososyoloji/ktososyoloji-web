import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  UserRound,
  BookOpen,
  Film,
  PenTool,
  MessagesSquare,
  Sparkles,
  Share2,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const CONTENT_TYPE_META: Record<
  string,
  { label: string; badgeClass: string; icon: typeof BookOpen }
> = {
  BOOK: {
    label: 'Kitap İncelemesi',
    badgeClass: 'bg-s-yellow text-s-navy border-s-navy',
    icon: BookOpen,
  },
  MOVIE: {
    label: 'Film / Belgesel Tahlili',
    badgeClass: 'bg-s-pink text-white border-s-navy',
    icon: Film,
  },
  ESSAY: {
    label: 'Makale & Deneme',
    badgeClass: 'bg-s-blue text-white border-s-navy',
    icon: PenTool,
  },
  INTERVIEW: {
    label: 'Röportaj',
    badgeClass: 'bg-emerald-300 text-s-navy border-s-navy',
    icon: MessagesSquare,
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  let content = await prisma.content.findUnique({
    where: { id: slug },
  });

  if (!content) {
    const all = await prisma.content.findMany({ where: { isPublished: true } });
    content = all.find((c) => slugify(c.title) === slug) || null;
  }

  if (!content) return { title: 'İçerik Bulunamadı | KTO Sosyoloji Topluluğu' };

  return {
    title: `${content.title} | KTO Sosyoloji Topluluğu`,
    description: content.summary || `${content.title} - KTO Sosyoloji Topluluğu yayını.`,
  };
}

export default async function ContentDetailPage({ params }: Props) {
  const { slug } = await params;

  // 1. Önce doğrudan id ile ara
  let content = await prisma.content.findUnique({
    where: { id: slug },
  });

  // 2. Bulunamazsa slugify(title) ile eşleştir
  if (!content) {
    const all = await prisma.content.findMany({
      where: { isPublished: true },
    });
    content = all.find((c) => slugify(c.title) === slug) || null;
  }

  if (!content) {
    notFound();
  }

  const meta = CONTENT_TYPE_META[content.type] || CONTENT_TYPE_META.BOOK;
  const TypeIcon = meta.icon;
  const createdDate = new Date(content.createdAt);

  return (
    <div className="w-full bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── GERİ DÖNÜŞ BUTONU ── */}
        <div className="flex items-center justify-between border-b-2 border-s-navy pb-4">
          <Link
            href="/icerikler"
            className="px-4 py-2 bg-white hover:bg-s-yellow text-s-navy font-bold text-xs sm:text-sm border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Tüm İçeriklere Dön</span>
          </Link>

          <span className="text-xs font-bold text-s-navy hidden sm:inline">
            KTO Sosyoloji Kütüphanesi
          </span>
        </div>

        {/* ── ANA İÇERİK MAKALE KARTI ── */}
        <article className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-10 lg:p-12 space-y-8">

          {/* Tür Rozeti ve Üst Bilgiler */}
          <div className="space-y-4 border-b-2 border-s-navy/20 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] ${meta.badgeClass}`}
              >
                <TypeIcon className="w-3.5 h-3.5" />
                {meta.label}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-s-navy px-2.5 py-1">
                KTO Sosyoloji Topluluğu Yayını
              </span>
            </div>

            {/* Büyük Başlık */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-s-navy tracking-tight leading-tight">
              {content.title}
            </h1>

            {/* Yazar ve Yayın Tarihi */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-slate-600 pt-1">
              {content.author && (
                <div className="flex items-center gap-1.5 text-s-navy">
                  <UserRound className="w-4 h-4 text-s-blue" />
                  <span>İnceleyen / Yazar: <span className="font-black">{content.author}</span></span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4 text-s-pink" />
                <span>
                  {createdDate.toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Varsa Büyük Kapak Görseli */}
          {content.imageUrl && (
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] border-2 border-s-navy overflow-hidden relative bg-slate-100 shadow-[3px_3px_0px_#11375C]">
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Özet Alanı (Vurgulu Kutu) */}
          {content.summary && (
            <div className="bg-s-yellow/20 border-l-4 border-s-navy p-5 sm:p-6 border-y-2 border-r-2 border-s-navy/30">
              <span className="text-[11px] font-black uppercase tracking-wider text-s-navy block mb-1">
                Özet & Giriş
              </span>
              <p className="text-sm sm:text-base text-s-navy/90 font-medium leading-relaxed italic">
                &ldquo;{content.summary}&rdquo;
              </p>
            </div>
          )}

          {/* Detaylı Metin / Body */}
          <div className="prose max-w-none text-slate-800 leading-relaxed font-normal text-base sm:text-lg whitespace-pre-line space-y-4 pt-2">
            {content.content}
          </div>

          {/* Makale Altı Paylaşım ve Topluluk İmzası */}
          <div className="pt-8 border-t-2 border-s-navy flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-s-pink border border-s-navy inline-block" />
              <span className="text-xs font-black uppercase tracking-wider text-s-navy">
                KTO Karatay Üniversitesi Sosyoloji Topluluğu
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/icerikler"
                className="px-4 py-2 bg-slate-100 hover:bg-s-navy hover:text-white font-bold text-xs border-2 border-s-navy transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-s-yellow" />
                <span>Diğer İncelemeler</span>
              </Link>
            </div>
          </div>
        </article>

      </div>
    </div>
  );
}
