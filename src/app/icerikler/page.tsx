import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import {
  FileText,
  BookOpen,
  Film,
  PenTool,
  MessagesSquare,
  ArrowLeft,
  Calendar,
  UserRound,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

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

export default async function ContentArchivePage() {
  const contents = await prisma.content.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Ekmek Kırıntısı / Geri Dönüş */}
        <div className="flex items-center justify-between border-b-2 border-s-navy pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy hover:text-s-blue transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <span className="text-xs font-bold text-s-navy bg-s-blue text-white px-2.5 py-0.5 border border-s-navy shadow-[2px_2px_0px_#11375C]">
            {contents.length} İçerik
          </span>
        </div>

        {/* Başlık Başlığı */}
        <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-s-blue border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
                Kütüphane & İncelemeler
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Kitap incelemeleri, film tahlilleri, denemeler ve röportaj arşivi.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-s-navy">
            <span className="bg-s-yellow px-3 py-1 border border-s-navy">
              Topluluk Arşivi
            </span>
          </div>
        </div>

        {/* İçerik Listesi Izgarası */}
        {contents.length === 0 ? (
          <div className="bg-white border-2 border-s-navy shadow-brutal p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-s-blue/20 border-2 border-s-navy flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-s-navy" />
            </div>
            <h2 className="text-lg font-black text-s-navy">Henüz yayınlanmış bir içerik yok</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
              Topluluğumuzun tahlil ve inceleme yazıları yakında burada paylaşılacaktır.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item) => {
              const meta = CONTENT_TYPE_META[item.type] || CONTENT_TYPE_META.BOOK;
              const Icon = meta.icon;
              const createdDate = new Date(item.createdAt);
              const detailSlug = slugify(item.title);

              return (
                <article
                  key={item.id}
                  className="bg-white border-2 border-s-navy shadow-brutal flex flex-col justify-between hover:-translate-y-1 transition-transform group"
                >
                  <div>
                    {/* Kapak Görseli */}
                    <Link
                      href={`/icerikler/${detailSlug}`}
                      className="block w-full aspect-[16/10] bg-slate-100 border-b-2 border-s-navy relative overflow-hidden"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-4 text-center">
                          <Icon className="w-10 h-10 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-500">{meta.label}</span>
                        </div>
                      )}

                      {/* Tür Rozeti */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 border shadow-[1px_1px_0px_#11375C] ${meta.badgeClass}`}
                        >
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </div>
                    </Link>

                    {/* İçerik Bilgileri */}
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                        {item.author ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-s-navy truncate">
                            <UserRound className="w-3.5 h-3.5 text-s-blue shrink-0" />
                            <span className="truncate">{item.author}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Topluluk Yayını</span>
                        )}

                        <span className="inline-flex items-center gap-1 text-slate-400 shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          {createdDate.toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h2 className="text-lg font-black text-s-navy leading-snug mb-2 group-hover:text-s-blue transition-colors">
                        <Link href={`/icerikler/${detailSlug}`}>
                          {item.title}
                        </Link>
                      </h2>

                      {item.summary && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Alt İşlem Butonları */}
                  <div className="p-5 pt-0 border-t-2 border-s-navy/10 flex items-center justify-between">
                    <Link
                      href={`/icerikler/${detailSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-s-navy hover:text-s-blue group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>İncelemeyi Oku</span>
                      <ArrowRight className="w-3.5 h-3.5 text-s-pink" />
                    </Link>

                    <Link
                      href={`/icerikler/${detailSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Yeni sekmede aç"
                      className="p-1.5 text-slate-400 hover:text-s-navy hover:bg-slate-100 border border-transparent hover:border-s-navy transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
