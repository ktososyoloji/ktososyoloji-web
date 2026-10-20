import Link from 'next/link';
import {
  PenTool,
  Calendar,
  User,
  ArrowRight,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { getColumnArticles } from '@/lib/actions/columns';

export const metadata = {
  title: 'Köşe Yazıları & Fikir Kürsüsü | KTO Sosyoloji Topluluğu',
  description:
    'KTO Karatay Üniversitesi Sosyoloji Topluluğu öğrencilerinin ve araştırmacılarının kaleme aldığı güncel köşe yazıları ve toplumsal analizler.',
};

interface ColumnArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  authorName: string;
  authorRole: string | null;
  authorImage: string | null;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default async function ColumnArticlesPage() {
  const articles = (await getColumnArticles()) as ColumnArticleItem[];

  const accentColors = ['bg-s-yellow', 'bg-s-pink', 'bg-s-blue', 'bg-emerald-300'];

  return (
    <div className="w-full bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── ÜST BAŞLIK VE ETİKET ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-s-navy pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-400 border border-s-navy inline-block" />
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-s-navy">
              KTO Karatay Üniversitesi Sosyoloji Topluluğu
            </span>
          </div>
          <span className="bg-s-yellow px-2.5 py-0.5 border border-s-navy text-xs font-bold text-s-navy shadow-[2px_2px_0px_#11375C]">
            Topluluk Yayını
          </span>
        </div>

        {/* ── HERO BANNER: FİKİR KÜRSÜSÜ & MANİFESTO ── */}
        <section className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-10 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-300 text-s-navy border-2 border-s-navy shadow-[2px_2px_0px_#11375C] text-xs font-black uppercase mb-4 tracking-wide">
            <PenTool className="w-3.5 h-3.5" />
            FİKİR KÜRSÜSÜ & KÖŞE YAZILARI
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-s-navy tracking-tight leading-tight max-w-4xl mb-4">
            Toplumsal meselelere genç ve eleştirel bir sosyolojik bakış.
          </h1>

          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed font-medium">
            Öğrencilerimizin ve genç araştırmacılarımızın gündelik hayatı, kenti, kültürü ve güncel tartışmaları
            kendi kalemleriyle çözümlediği bağımsız düşünce ve yazı köşemiz.
          </p>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-s-navy/10 text-xs font-bold text-s-navy">
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-s-blue" />
              Özgün Analizler
            </span>
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-s-yellow" />
              Saha ve Teori
            </span>
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-s-pink" />
              Öğrenci Yazarları
            </span>
          </div>
        </section>

        {/* ── KÖŞE YAZILARI IZGARASI (2 SÜTUNLU KARTLAR) ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-s-navy pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-s-pink border-2 border-s-navy flex items-center justify-center">
                <PenTool className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-xl font-black text-s-navy uppercase tracking-wide">
                Yayınlanan Yazılar
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white border border-s-navy px-2.5 py-0.5 shadow-[1px_1px_0px_#11375C]">
              {articles.length} Yazı
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white border-2 border-s-navy shadow-brutal p-12 text-center max-w-lg mx-auto space-y-3">
              <div className="w-16 h-16 bg-slate-100 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center mx-auto text-slate-400">
                <PenTool className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-s-navy">Henüz Köşe Yazısı Yayınlanmadı</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Topluluk üyelerimizin hazırladığı ilk köşe yazıları çok yakında bu kürsüde yerini alacaktır.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article: ColumnArticleItem, index: number) => {
                const accentColor = accentColors[index % accentColors.length];
                const dateStr = new Date(article.createdAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                const firstLetter = article.authorName.charAt(0).toUpperCase();

                return (
                  <article
                    key={article.id}
                    className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-transform group"
                  >
                    <div className="space-y-4">
                      {/* Üst Kısım: Yazar Bilgisi & Fotoğrafı */}
                      <div className="flex items-center gap-3.5 pb-4 border-b-2 border-s-navy/15">
                        {article.authorImage ? (
                          <div className="w-14 h-14 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] overflow-hidden shrink-0 bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.authorImage}
                              alt={article.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-14 h-14 ${accentColor} border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-xl shrink-0`}
                          >
                            {firstLetter}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="font-black text-s-navy text-base leading-tight truncate">
                            {article.authorName}
                          </h4>

                          {article.authorRole && (
                            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5 truncate">
                              <GraduationCap className="w-3.5 h-3.5 text-s-blue shrink-0" />
                              <span className="truncate">{article.authorRole}</span>
                            </p>
                          )}

                          <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{dateStr}</span>
                          </p>
                        </div>
                      </div>

                      {/* Başlık ve Özet */}
                      <div className="space-y-2">
                        <Link href={`/kose-yazilari/${article.slug}`}>
                          <h3 className="text-xl sm:text-2xl font-black text-s-navy leading-snug group-hover:text-s-blue transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>

                        {article.excerpt && (
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alt Kısım: Oku Butonu */}
                    <div className="pt-6 mt-2 border-t-2 border-s-navy/10 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Köşe Yazısı
                      </span>

                      <Link
                        href={`/kose-yazilari/${article.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-s-yellow hover:bg-s-navy text-s-navy hover:text-white font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                      >
                        <span>Yazıyı Oku</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
