import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Calendar,
  MapPin,
  ExternalLink,
  CalendarDays,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: 'desc' },
  });

  const now = new Date();

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
          <span className="text-xs font-bold text-s-navy bg-s-yellow px-2.5 py-0.5 border border-s-navy shadow-[2px_2px_0px_#11375C]">
            {events.length} Etkinlik
          </span>
        </div>

        {/* Başlık Başlığı */}
        <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-s-pink border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
                Topluluk Etkinlikleri
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Atölyeler, söyleşiler, film tahlilleri ve sosyoloji buluşmalarının takvimi.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-s-navy">
            <span className="bg-emerald-300 px-3 py-1 border border-s-navy">
              Açık Katılım
            </span>
          </div>
        </div>

        {/* Etkinlik Listesi Izgarası */}
        {events.length === 0 ? (
          <div className="bg-white border-2 border-s-navy shadow-brutal p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-s-yellow/30 border-2 border-s-navy flex items-center justify-center mb-3">
              <Calendar className="w-8 h-8 text-s-navy" />
            </div>
            <h2 className="text-lg font-black text-s-navy">Henüz planlanmış bir etkinlik yok</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
              Yeni dönem buluşmaları ve atölyeler için hazırlıklarımız sürüyor. Duyurular için sosyal medya hesaplarımızı takip edin!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < now;

              return (
                <article
                  key={event.id}
                  className="bg-white border-2 border-s-navy shadow-brutal flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    {/* Afiş Görseli */}
                    <div className="w-full aspect-video bg-slate-100 border-b-2 border-s-navy relative overflow-hidden">
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-s-yellow/20 p-4 text-center">
                          <Calendar className="w-10 h-10 text-s-navy mb-1" />
                          <span className="text-xs font-bold text-s-navy">Afiş Görseli Yok</span>
                        </div>
                      )}

                      {/* Durum Rozeti */}
                      <div className="absolute top-3 right-3">
                        {isPast ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 border border-s-navy shadow-[1px_1px_0px_#11375C]">
                            Geçmiş Etkinlik
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-s-yellow text-s-navy border border-s-navy shadow-[1px_1px_0px_#11375C] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-s-navy fill-s-navy" />
                            Yaklaşan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* İçerik */}
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 mb-2">
                        <span className="inline-flex items-center gap-1 text-s-navy">
                          <Calendar className="w-3.5 h-3.5 text-s-blue" />
                          {eventDate.toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-s-pink" />
                            {event.location}
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-black text-s-navy leading-snug mb-2">
                        {event.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Alt İşlem Çubuğu */}
                  <div className="p-5 pt-0">
                    {event.formUrl ? (
                      <a
                        href={event.formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 bg-s-pink hover:bg-s-navy text-white font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Katılım Formunu Doldur</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="text-center py-2 text-xs font-bold text-slate-400 border border-dashed border-slate-300">
                        Kayıt gerektirmez · Serbest katılım
                      </div>
                    )}
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
