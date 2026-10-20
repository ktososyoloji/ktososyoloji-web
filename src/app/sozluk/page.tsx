import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  BookOpen,
  ArrowLeft,
  UserRound,
  Quote,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DictionaryPage() {
  const terms = await prisma.dictionary.findMany({
    orderBy: { term: 'asc' },
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
          <span className="text-xs font-bold text-s-navy bg-s-yellow px-2.5 py-0.5 border border-s-navy shadow-[2px_2px_0px_#11375C]">
            {terms.length} Kavram
          </span>
        </div>

        {/* Başlık Başlığı */}
        <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-s-navy" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
                Sosyoloji Sözlüğü
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Temel sosyolojik kavramlar, kuramlar ve düşünürlerin tanımları.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-s-navy">
            <span className="bg-white px-3 py-1 border border-s-navy">
              A-Z Alfabetik İndeks
            </span>
          </div>
        </div>

        {/* Sözlük Kartları Izgarası */}
        {terms.length === 0 ? (
          <div className="bg-white border-2 border-s-navy shadow-brutal p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-s-pink/30 border-2 border-s-navy flex items-center justify-center mb-3">
              <BookOpen className="w-8 h-8 text-s-navy" />
            </div>
            <h2 className="text-lg font-black text-s-navy">Sözlük henüz boş</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
              Topluluk editörlerimiz kavram girişlerine devam ediyor. Yakında zengin bir sosyoloji terimler arşivi burada olacak!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {terms.map((item) => {
              const firstLetter = item.term.charAt(0).toLocaleUpperCase('tr-TR');

              return (
                <article
                  key={item.id}
                  className="bg-white border-2 border-s-navy shadow-brutal p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform relative"
                >
                  <div>
                    {/* Üst Kısım: Harf ve Düşünür Bilgisi */}
                    <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b-2 border-s-navy/20">
                      <div className="w-9 h-9 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-base select-none">
                        {firstLetter}
                      </div>

                      {item.createdBy ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-s-navy bg-s-pink/20 border border-s-pink px-2 py-0.5 max-w-[180px] truncate">
                          <UserRound className="w-3 h-3 shrink-0" />
                          <span className="truncate">{item.createdBy}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">
                          Genel Kavram
                        </span>
                      )}
                    </div>

                    {/* Terim Başlığı */}
                    <h2 className="text-xl font-black text-s-navy tracking-tight mb-2">
                      {item.term}
                    </h2>

                    {/* Tanım Metni */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {item.definition}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t-2 border-s-navy/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                      <Quote className="w-3 h-3 text-s-yellow" />
                      Kavramsal Analiz
                    </span>
                    <Sparkles className="w-3 h-3 text-s-pink" />
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
