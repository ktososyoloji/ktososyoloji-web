'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  BookOpen,
  Users,
  PenTool,
  Film,
  MessagesSquare,
} from 'lucide-react';

export interface SliderEvent {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  location?: string | null;
  imageUrl?: string | null;
  formUrl?: string | null;
}

export interface SliderContent {
  id: string;
  title: string;
  summary?: string | null;
  type: 'BOOK' | 'MOVIE' | 'ESSAY' | 'INTERVIEW';
  author?: string | null;
  imageUrl?: string | null;
  slug: string;
}

interface HeroSliderProps {
  latestEvent?: SliderEvent | null;
  featuredContent?: SliderContent | null;
}

const TYPE_CONFIG = {
  BOOK: { label: 'Kitap İncelemesi', color: 'bg-s-yellow text-s-navy', icon: BookOpen },
  MOVIE: { label: 'Film / Belgesel', color: 'bg-s-pink text-white', icon: Film },
  ESSAY: { label: 'Makale & Deneme', color: 'bg-s-blue text-white', icon: PenTool },
  INTERVIEW: { label: 'Röportaj', color: 'bg-emerald-300 text-s-navy', icon: MessagesSquare },
};

export default function HeroSlider({ latestEvent, featuredContent }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Toplam slayt sayısı: 1 (Manifesto) + varsa Etkinlik (1) + varsa İçerik (1)
  const slidesCount = 1 + (latestEvent ? 1 : 0) + (featuredContent ? 1 : 0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  }, [slidesCount]);

  // Otomatik geçiş (7 saniyede bir, üzerine gelince duraklat)
  useEffect(() => {
    if (isPaused || slidesCount <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slidesCount]);

  return (
    <section
      aria-label="KTO Sosyoloji Vitrini"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full h-[calc(100vh-66px)] flex flex-col justify-between bg-white border-b-2 border-s-navy relative overflow-hidden select-none"
    >
      {/* ── ARKA PLAN NEO-BRUTALIST DEKORATİF ÇİZGİLER & DAİRELER ── */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-s-yellow/15 rounded-full border-2 border-s-navy/10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-16 left-0 w-80 h-80 bg-s-pink/10 rounded-full border-2 border-s-navy/10 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* ── SLAYT İÇERİK ALANI (DİKEYDE TAM ORTALI, ÜSTTEN GÜVENLİ BOŞLUKLU) ── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 flex flex-col justify-center relative z-10 overflow-hidden pt-4 sm:pt-6 pb-2 sm:pb-4">

        {/* SLIDE 1: MANİFESTO & VİTRİN */}
        {currentSlide === 0 && (
          <div className="space-y-3 sm:space-y-6 lg:space-y-8 animate-fadeIn max-w-5xl my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-s-pink text-white border-2 border-s-navy shadow-[2px_2px_0px_#11375C] sm:shadow-[3px_3px_0px_#11375C] text-[11px] sm:text-sm font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span>Eleştirel Düşünce & Sosyolojik Tahayyül</span>
            </div>

            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-s-navy tracking-tight leading-[1.1]">
              Toplumu anlamak, dünyaya farklı bir gözle bakmak.
            </h1>

            <p className="text-xs sm:text-base md:text-xl text-slate-700 font-medium leading-relaxed max-w-3xl line-clamp-3 sm:line-clamp-none">
              KTO Karatay Üniversitesi Sosyoloji Topluluğu; amfilerdeki teorik bilgiyi
              sahaya, kültüre ve gündelik hayata taşıyan bağımsız bir öğrenci platformudur.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="/etkinlikler"
                className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-s-navy text-white hover:bg-s-blue font-black text-xs sm:text-sm border-2 border-s-navy shadow-[3px_3px_0px_#FFCE5D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all inline-flex items-center gap-2 group"
              >
                <span>Etkinlik Takvimini Gör</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <a
                href="https://chat.whatsapp.com/Khno8BGGJqS4Gdw5WwMiwT?s=cl&p=a&mlu=4&ilr=4&iam=0"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-s-yellow text-s-navy hover:bg-white font-black text-xs sm:text-sm border-2 border-s-navy shadow-[3px_3px_0px_#11375C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Topluluğa Katıl</span>
              </a>
            </div>
          </div>
        )}

        {/* SLIDE 2: EN YENİ ETKİNLİK (MOBİL VE MASAÜSTÜNDE ORANTILI YERLEŞİM) */}
        {currentSlide === 1 && latestEvent && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 items-center my-auto animate-fadeIn">
            {/* Metin Bloğu */}
            <div className="md:col-span-7 space-y-2 sm:space-y-3.5 order-1 md:order-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 bg-s-yellow text-s-navy border-2 border-s-navy shadow-[2px_2px_0px_#11375C] text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Öne Çıkan Topluluk Buluşması</span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-s-navy tracking-tight leading-snug line-clamp-2">
                {latestEvent.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 font-medium leading-relaxed max-w-2xl">
                {latestEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-s-navy py-0.5">
                <span className="flex items-center gap-1.5 bg-slate-100 border border-s-navy px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-[1px_1px_0px_#11375C]">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-s-blue" />
                  {new Date(latestEvent.date).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {latestEvent.location && (
                  <span className="flex items-center gap-1.5 bg-slate-100 border border-s-navy px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-[1px_1px_0px_#11375C]">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-s-pink" />
                    {latestEvent.location}
                  </span>
                )}
              </div>

              <div className="pt-1">
                <Link
                  href="/etkinlikler"
                  className="py-2.5 px-5 bg-s-pink text-white hover:bg-s-navy font-black text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all inline-flex items-center gap-1.5 group"
                >
                  <span>Etkinliği İncele & Kayıt Ol</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Afiş Görseli (Her ekranda orantılı görünür) */}
            <div className="w-full max-w-sm md:max-w-none mx-auto md:col-span-5 order-2 md:order-2">
              <div className="w-full aspect-[16/9] max-h-[130px] sm:max-h-[170px] md:max-h-[240px] lg:max-h-[300px] bg-slate-100 border-2 border-s-navy shadow-[3px_3px_0px_#11375C] relative overflow-hidden">
                {latestEvent.imageUrl ? (
                  <Image
                    src={latestEvent.imageUrl}
                    alt={latestEvent.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 40vw, 450px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-s-yellow/30">
                    <Calendar className="w-8 h-8 text-s-navy mb-1" />
                    <span className="font-black text-s-navy text-xs">Topluluk Etkinliği</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: ÖNE ÇIKAN İÇERİK (MOBİL VE MASAÜSTÜNDE ORANTILI YERLEŞİM) */}
        {((currentSlide === 2 && featuredContent) ||
          (currentSlide === 1 && !latestEvent && featuredContent)) && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 items-center my-auto animate-fadeIn">
              {/* Metin Bloğu */}
              <div className="md:col-span-7 space-y-2 sm:space-y-3.5 order-1 md:order-1">
                {(() => {
                  const meta =
                    TYPE_CONFIG[featuredContent.type] || TYPE_CONFIG.BOOK;
                  const Icon = meta.icon;
                  return (
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] text-[10px] sm:text-xs font-black uppercase tracking-wider ${meta.color}`}
                    >
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{meta.label}</span>
                    </div>
                  );
                })()}

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-s-navy tracking-tight leading-snug line-clamp-2">
                  {featuredContent.title}
                </h2>

                {featuredContent.author && (
                  <p className="text-xs sm:text-sm font-black text-s-blue">
                    Yazar / İnceleyen: {featuredContent.author}
                  </p>
                )}

                {featuredContent.summary && (
                  <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 font-medium leading-relaxed max-w-2xl">
                    {featuredContent.summary}
                  </p>
                )}

                <div className="pt-1">
                  <Link
                    href={`/icerikler/${featuredContent.slug}`}
                    className="py-2.5 px-5 bg-s-blue text-white hover:bg-s-navy font-black text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all inline-flex items-center gap-1.5 group"
                  >
                    <span>Yazının Tamamını Oku</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Kapak Görseli (Her ekranda orantılı görünür) */}
              <div className="w-full max-w-sm md:max-w-none mx-auto md:col-span-5 order-2 md:order-2">
                <div className="w-full aspect-[16/9] max-h-[130px] sm:max-h-[170px] md:max-h-[240px] lg:max-h-[300px] bg-slate-100 border-2 border-s-navy shadow-[3px_3px_0px_#11375C] relative overflow-hidden">
                  {featuredContent.imageUrl ? (
                    <Image
                      src={featuredContent.imageUrl}
                      alt={featuredContent.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 40vw, 450px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-s-blue/20">
                      <BookOpen className="w-8 h-8 text-s-navy mb-1" />
                      <span className="font-black text-s-navy text-xs">Topluluk Kütüphanesi</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

      </div>

      {/* ── ALT KONTROL VE GEZİNTİ ÇUBUĞU (EN ALTA SABİT BRUTALİST BAR, 60px) ── */}
      <div className="w-full h-14 sm:h-16 shrink-0 border-t-2 border-s-navy bg-slate-50 px-5 sm:px-10 lg:px-16 flex items-center justify-between relative z-20 mt-auto">
        {/* Slayt Çubukları */}
        <div className="flex items-center gap-2 sm:gap-3">
          {Array.from({ length: slidesCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slayt ${index + 1}`}
              className={`h-3 sm:h-3.5 transition-all border-2 border-s-navy cursor-pointer ${currentSlide === index
                ? 'w-8 sm:w-14 bg-s-navy shadow-[2px_2px_0px_#FB7996]'
                : 'w-3 sm:w-4 bg-white hover:bg-s-yellow'
                }`}
            />
          ))}
          <span className="text-xs sm:text-sm font-black text-s-navy ml-2 sm:ml-3 select-none">
            0{currentSlide + 1} / 0{slidesCount}
          </span>
        </div>

        {/* Sağ - Sol Ok Butonları */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Önceki Slayt"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white hover:bg-s-yellow text-s-navy border-2 border-s-navy shadow-[2px_2px_0px_#11375C] sm:shadow-[3px_3px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Sonraki Slayt"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white hover:bg-s-yellow text-s-navy border-2 border-s-navy shadow-[2px_2px_0px_#11375C] sm:shadow-[3px_3px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
