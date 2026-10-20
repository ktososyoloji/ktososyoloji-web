import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { getLatestColumnArticle } from '@/lib/actions/columns';
import HeroSlider from '@/components/home/HeroSlider';
import {
  Calendar,
  MapPin,
  BookOpen,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Mail,
  PenTool,
  Film,
  MessagesSquare,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Tür Rozeti Yardımcısı
// ─────────────────────────────────────────────
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
    label: 'Film / Belgesel',
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

export default async function HomePage() {
  const now = new Date();

  // 1. Yaklaşan Etkinlikler (Öncelikle gelecekteki etkinlikler, yoksa son eklenenler)
  let upcomingEvents = await prisma.event.findMany({
    where: { isPublished: true, date: { gte: now } },
    orderBy: { date: 'asc' },
    take: 2,
  });

  if (upcomingEvents.length === 0) {
    upcomingEvents = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { date: 'desc' },
      take: 2,
    });
  }

  const primaryEvent = upcomingEvents[0] || null;

  // 2. Sözlükten Son / Günün Kavramı
  const dailyTerm = await prisma.dictionary.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  // 3. Son Eklenen İçerikler (En fazla 2 tane)
  const latestContents = await prisma.content.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  const featuredContent = latestContents[0] || null;

  // 4. En Son Yayınlanan Köşe Yazısı
  const latestColumn = await getLatestColumnArticle();

  // HeroSlider için veri hazırlığı
  const sliderEvent = primaryEvent
    ? {
        id: primaryEvent.id,
        title: primaryEvent.title,
        description: primaryEvent.description,
        date: primaryEvent.date,
        location: primaryEvent.location,
        imageUrl: primaryEvent.imageUrl,
        formUrl: primaryEvent.formUrl,
      }
    : null;

  const sliderContent = featuredContent
    ? {
        id: featuredContent.id,
        title: featuredContent.title,
        summary: featuredContent.summary,
        type: featuredContent.type,
        author: featuredContent.author,
        imageUrl: featuredContent.imageUrl,
        slug: slugify(featuredContent.title),
      }
    : null;

  return (
    <div className="w-full flex flex-col overflow-x-hidden">

      {/* ── 1. TAM VIEWPORT KİLİTLİ HERO VİTRİNİ ── */}
      <HeroSlider latestEvent={sliderEvent} featuredContent={sliderContent} />

      {/* ── 2. TOPLULUK NABZI (DÜZENLİ SIRALI BLOKLAR) ── */}
      <section className="w-full bg-[#FAFAF8] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-s-navy">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Bölüm Başlığı */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-s-navy">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-s-pink border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-s-navy uppercase tracking-wide">
                Topluluk Nabzı
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white border border-s-navy px-2.5 py-1">
              Etkinlikler, Kütüphane & Fikir Kürsüsü
            </span>
          </div>

          <div className="space-y-6">

            {/* ── 1. SIRA: YAKLAŞAN ETKİNLİK (TAM GENİŞLİK YATAY KART) ── */}
            <div className="w-full bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b-2 border-s-navy mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-s-pink border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-s-navy uppercase tracking-wide">
                    Yaklaşan Etkinlik
                  </h3>
                </div>
                <Link
                  href="/etkinlikler"
                  className="text-xs sm:text-sm font-bold text-s-blue hover:text-s-navy hover:underline flex items-center gap-1"
                >
                  Tüm Etkinlikler <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {primaryEvent ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Afiş Görseli */}
                  <div className="md:col-span-4 w-full aspect-[16/10] bg-slate-100 border-2 border-s-navy overflow-hidden relative shadow-[2px_2px_0px_#11375C]">
                    {primaryEvent.imageUrl ? (
                      <Image
                        src={primaryEvent.imageUrl}
                        alt={primaryEvent.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-s-yellow/30">
                        <Calendar className="w-12 h-12 text-s-navy mb-2" />
                        <span className="text-xs font-bold text-s-navy">Topluluk Buluşması</span>
                      </div>
                    )}
                  </div>

                  {/* Etkinlik Bilgileri & Butonlar */}
                  <div className="md:col-span-8 space-y-3.5">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-s-navy">
                      <span className="flex items-center gap-1.5 bg-slate-100 border border-s-navy px-2.5 py-1">
                        <Calendar className="w-3.5 h-3.5 text-s-blue" />
                        <span>
                          {new Date(primaryEvent.date).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>

                      {primaryEvent.location && (
                        <span className="flex items-center gap-1.5 bg-slate-100 border border-s-navy px-2.5 py-1">
                          <MapPin className="w-3.5 h-3.5 text-s-pink" />
                          <span className="truncate">{primaryEvent.location}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-s-navy leading-snug">
                      {primaryEvent.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {primaryEvent.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        href="/etkinlikler"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-s-navy text-white hover:bg-s-blue font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group"
                      >
                        <span>Etkinliği İncele</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {primaryEvent.formUrl && (
                        <a
                          href={primaryEvent.formUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-s-pink text-white hover:bg-s-navy font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                        >
                          <span>Kayıt Formu</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-s-yellow/30 border-2 border-s-navy flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6 text-s-navy" />
                  </div>
                  <p className="text-sm font-bold text-s-navy">Yeni etkinlik hazırlığı sürüyor!</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Yakında duyurulacak atölye ve paneller için takipte kalın.
                  </p>
                </div>
              )}
            </div>

            {/* ── 2. SIRA: TOPLULUK KÜTÜPHANESİNDEN SON YAZILAR (TAM GENİŞLİK YATAY KART) ── */}
            <div className="w-full bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b-2 border-s-navy mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-s-blue border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-s-navy uppercase tracking-wide">
                    Topluluk Kütüphanesinden Son Yazılar
                  </h3>
                </div>
                <Link
                  href="/icerikler"
                  className="text-xs sm:text-sm font-bold text-s-blue hover:text-s-navy hover:underline flex items-center gap-1"
                >
                  Tüm Kütüphane <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {featuredContent ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Kapak Görseli */}
                  <div className="md:col-span-4 w-full aspect-[16/10] bg-slate-100 border-2 border-s-navy overflow-hidden relative shadow-[2px_2px_0px_#11375C]">
                    {featuredContent.imageUrl ? (
                      <Image
                        src={featuredContent.imageUrl}
                        alt={featuredContent.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-s-blue/20">
                        <BookOpen className="w-12 h-12 text-s-navy mb-2" />
                        <span className="text-xs font-bold text-s-navy">Kütüphane İçeriği</span>
                      </div>
                    )}
                  </div>

                  {/* İçerik Bilgileri & Buton */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const meta =
                          CONTENT_TYPE_META[featuredContent.type] ||
                          CONTENT_TYPE_META.BOOK;
                        const Icon = meta.icon;
                        return (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border ${meta.badgeClass}`}
                          >
                            <Icon className="w-3 h-3" />
                            {meta.label}
                          </span>
                        );
                      })()}
                      {featuredContent.author && (
                        <span className="text-xs text-slate-600 font-bold">
                          {featuredContent.author}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-s-navy leading-snug">
                      {featuredContent.title}
                    </h4>

                    {featuredContent.summary && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {featuredContent.summary}
                      </p>
                    )}

                    <div className="pt-2">
                      <Link
                        href={`/icerikler/${slugify(featuredContent.title)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-s-navy text-white hover:bg-s-blue font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group"
                      >
                        <span>Yazıyı Oku</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs font-bold text-slate-500">
                  Henüz yayınlanmış bir içerik bulunmuyor.
                </div>
              )}
            </div>

            {/* ── 3. SIRA: 2 EŞİT SÜTUN (SOL: FİKİR KÜRSÜSÜNDEN SON YAZI | SAĞ: GÜNÜN KAVRAMI) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">

              {/* SOL SÜTUN: FİKİR KÜRSÜSÜNDEN SON YAZI */}
              <div className="h-full bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  {/* Kart Üst Barı */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-s-navy mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-emerald-300 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center">
                        <PenTool className="w-4 h-4 text-s-navy" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-s-navy bg-emerald-100 border border-emerald-400 px-2 py-0.5">
                        Köşe Yazısı / Fikir Kürsüsü
                      </span>
                    </div>

                    <Link
                      href="/kose-yazilari"
                      className="text-xs sm:text-sm font-bold text-s-blue hover:text-s-navy hover:underline flex items-center gap-1"
                    >
                      Tüm Yazılar <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {latestColumn ? (
                    <div className="space-y-4">
                      {/* Yazar Bilgisi */}
                      <div className="flex items-center gap-3">
                        {latestColumn.authorImage ? (
                          <div className="w-12 h-12 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] overflow-hidden shrink-0 bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={latestColumn.authorImage}
                              alt={latestColumn.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-lg shrink-0">
                            {latestColumn.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h5 className="font-black text-s-navy text-sm sm:text-base leading-tight truncate">
                            {latestColumn.authorName}
                          </h5>
                          {latestColumn.authorRole && (
                            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 truncate mt-0.5">
                              <GraduationCap className="w-3.5 h-3.5 text-s-blue shrink-0" />
                              <span className="truncate">{latestColumn.authorRole}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {new Date(latestColumn.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Başlık ve Alıntı / Özet */}
                      <div className="space-y-1.5 pt-1">
                        <Link href={`/kose-yazilari/${latestColumn.slug}`} className="group">
                          <h4 className="line-clamp-2 font-black text-s-navy text-xl md:text-2xl leading-snug group-hover:text-s-blue transition-colors">
                            {latestColumn.title}
                          </h4>
                        </Link>

                        {latestColumn.excerpt && (
                          <p className="line-clamp-2 text-slate-700 text-sm font-medium leading-relaxed italic">
                            &ldquo;{latestColumn.excerpt}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs font-bold text-slate-500">
                      Henüz yayınlanmış bir köşe yazısı bulunmuyor.
                    </div>
                  )}
                </div>

                {/* Alt Kısım: Buton */}
                {latestColumn && (
                  <div className="mt-6 pt-4 border-t-2 border-s-navy/20">
                    <Link
                      href={`/kose-yazilari/${latestColumn.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-s-yellow hover:bg-s-navy text-s-navy hover:text-white font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group cursor-pointer"
                    >
                      <span>Yazıyı Oku</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>

              {/* SAĞ SÜTUN: GÜNÜN KAVRAMI (SÖZLÜK) */}
              <div className="h-full bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b-2 border-s-navy mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-s-navy" />
                      </div>
                      <h3 className="text-lg font-black text-s-navy uppercase tracking-wide">
                        Günün Kavramı
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-s-navy px-2 py-0.5">
                      Sosyoloji Sözlüğü
                    </span>
                  </div>

                  {dailyTerm ? (
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <h4 className="text-2xl font-black text-s-navy">
                          {dailyTerm.term}
                        </h4>
                        {dailyTerm.createdBy && (
                          <span className="text-xs font-bold text-s-navy bg-s-pink/20 border border-s-pink px-2.5 py-0.5">
                            {dailyTerm.createdBy}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                        {dailyTerm.definition}
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-xs font-bold text-slate-500">Sözlük henüz boş.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t-2 border-s-navy/20">
                  <Link
                    href="/sozluk"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-s-navy hover:text-s-blue group transition-colors"
                  >
                    <span>Tüm Sözlüğü İncele</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

          {/* ── 4. YATAY KATILIM & BAĞLANTIDA KAL ÇAĞRI BANDI ── */}
          <div className="w-full bg-white border-2 border-s-navy shadow-brutal p-6 md:p-8 mt-10 md:mt-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Sol Alan */}
            <div className="space-y-1.5 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                <div className="w-7 h-7 bg-emerald-300 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center">
                  <MessagesSquare className="w-4 h-4 text-s-navy" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-s-navy tracking-tight">
                  Toplulukla Bağlantıda Kal
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                Topluluk duyuruları, okuma grupları ve etkinlik kayıtları için kanallarımızı takip edin.
              </p>
            </div>

            {/* Sağ Alan: 3 Neo-Brutal Buton */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 shrink-0">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-white hover:bg-s-pink hover:text-white text-s-navy font-bold text-xs sm:text-sm border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram (@ktosoyoloji)</span>
              </a>

              <a
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-white hover:bg-emerald-400 text-s-navy font-bold text-xs sm:text-sm border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Grubu</span>
              </a>

              <a
                href="mailto:sosyoloji@karatay.edu.tr"
                className="py-2.5 px-4 bg-white hover:bg-s-yellow text-s-navy font-bold text-xs sm:text-sm border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>E-Posta İletişim</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
