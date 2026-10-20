import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Sparkles,
  PenTool,
  BookmarkCheck,
} from 'lucide-react';
import { getColumnArticleBySlug } from '@/lib/actions/columns';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getColumnArticleBySlug(slug);

  if (!article) {
    return { title: 'Köşe Yazısı Bulunamadı | KTO Sosyoloji Topluluğu' };
  }

  return {
    title: `${article.title} - ${article.authorName} | KTO Sosyoloji Topluluğu`,
    description:
      article.excerpt || `${article.title} - KTO Karatay Sosyoloji Fikir Kürsüsü.`,
  };
}

export default async function ColumnArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getColumnArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const dateStr = new Date(article.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const firstLetter = article.authorName.charAt(0).toUpperCase();

  return (
    <div className="w-full bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── GERİ DÖNÜŞ BUTONU ── */}
        <div className="flex items-center justify-between border-b-2 border-s-navy pb-4">
          <Link
            href="/kose-yazilari"
            className="px-4 py-2 bg-white hover:bg-s-yellow text-s-navy font-bold text-xs sm:text-sm border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all inline-flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Tüm Köşe Yazılarına Dön</span>
          </Link>

          <span className="text-xs font-bold text-s-navy hidden sm:flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-emerald-600" />
            Fikir Kürsüsü & Gazete Köşesi
          </span>
        </div>

        {/* ── ANA GAZETE MAKALESİ KARTI ── */}
        <article className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-10 lg:p-12 space-y-8">

          {/* Üst Kısım: Yazar Bilgi Kartı */}
          <div className="p-4 sm:p-5 bg-slate-50 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {article.authorImage ? (
                <div className="w-16 h-16 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] overflow-hidden shrink-0 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.authorImage}
                    alt={article.authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-2xl shrink-0">
                  {firstLetter}
                </div>
              )}

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-s-pink text-white border border-s-navy inline-block mb-1">
                  Köşe Yazarı
                </span>
                <h3 className="text-lg sm:text-xl font-black text-s-navy leading-tight">
                  {article.authorName}
                </h3>
                {article.authorRole && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-s-blue" />
                    <span>{article.authorRole}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="sm:text-right flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white border border-s-navy px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-s-pink" />
              <span>{dateStr}</span>
            </div>
          </div>

          {/* Büyük Manşet Başlığı */}
          <div className="space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 text-xs font-bold">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sosyolojik Düşünce & Yorum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-s-navy leading-tight tracking-tight">
              {article.title}
            </h1>
          </div>

          {/* Varsa Alıntı / Giriş Özeti */}
          {article.excerpt && (
            <div className="border-l-4 border-s-pink pl-4 sm:pl-5 py-2 bg-s-pink/5 border-y border-r border-s-navy/20 italic text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
              &ldquo;{article.excerpt}&rdquo;
            </div>
          )}

          {/* Köşe Yazısı Metin Alanı (Body) */}
          <div className="text-slate-800 leading-relaxed font-normal text-base sm:text-lg whitespace-pre-line space-y-4 pt-4 border-t-2 border-s-navy/15">
            {article.body}
          </div>

          {/* Yazı Sonu: Topluluk İmzası ve Kapanış Rozeti */}
          <div className="pt-8 border-t-2 border-s-navy flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-5 border">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-s-pink border border-s-navy inline-block" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-s-navy block">
                  KTO Karatay Üniversitesi Sosyoloji Topluluğu
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Bağımsız Öğrenci Fikir Kürsüsü
                </span>
              </div>
            </div>

            <Link
              href="/kose-yazilari"
              className="px-4 py-2 bg-s-navy hover:bg-s-blue text-white font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-s-yellow" />
              <span>Diğer Köşe Yazılarını İncele</span>
            </Link>
          </div>

        </article>

      </div>
    </div>
  );
}
