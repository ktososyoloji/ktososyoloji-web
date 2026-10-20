import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Film,
  Search,
  Users,
  Compass,
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Hakkımızda | KTO Sosyoloji Topluluğu',
  description:
    'KTO Karatay Üniversitesi Sosyoloji Topluluğu manifestosu, amaçları, faaliyet alanları ve ekip üyeleri.',
};

interface TeamMemberItem {
  id: string;
  name: string;
  title?: string | null;
}

export default async function AboutPage() {
  // Prisma üzerinden kayıtlı ekip üyelerini çek
  const teamMembers = (await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })) as TeamMemberItem[];

  const pillars = [
    {
      title: 'Akademik Okumalar & Seminerler',
      description:
        'Klasik ve çağdaş sosyoloji metinlerini derinlemesine incelediğimiz, kuramsal tartışmalar yürüttüğümüz haftalık okuma halkaları.',
      icon: BookOpen,
      badgeColor: 'bg-s-yellow text-s-navy',
    },
    {
      title: 'Film & Belgesel Tahlilleri',
      description:
        'Sinema ve belgeselleri ideoloji, iktidar, sınıf ve kimlik perspektifinden sosyolojik bir gözle çözümlediğimiz gösterimler.',
      icon: Film,
      badgeColor: 'bg-s-pink text-white',
    },
    {
      title: 'Saha Gözlemleri & Araştırma',
      description:
        'Konya ve çevresinde kentsel dönüşüm, göç, gençlik ve kültürel miras alanlarında küçük çaplı saha okuma ve gözlem çalışmaları.',
      icon: Search,
      badgeColor: 'bg-s-blue text-white',
    },
    {
      title: 'Öğrenci Atölyeleri & Paneller',
      description:
        'Akademisyenler ve uzman konukların katılımıyla düzenlenen açık paneller, soru-cevap söyleşileri ve interaktif çalıştaylar.',
      icon: Users,
      badgeColor: 'bg-emerald-300 text-s-navy',
    },
  ];

  const accentColors = ['bg-s-yellow', 'bg-s-pink', 'bg-s-blue', 'bg-emerald-300'];

  return (
    <div className="w-full bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── ÜST BAŞLIK VE ETİKET ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-s-navy pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-s-pink border border-s-navy inline-block" />
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-s-navy">
              KTO Karatay Üniversitesi Sosyoloji Topluluğu
            </span>
          </div>
          <span className="bg-s-yellow px-2.5 py-0.5 border border-s-navy text-xs font-bold text-s-navy shadow-[2px_2px_0px_#11375C]">
            Biz Kimiz?
          </span>
        </div>

        {/* ── MANİFESTO & GİRİŞ HERO ALANI ── */}
        <section className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-10 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-s-pink text-white border-2 border-s-navy shadow-[2px_2px_0px_#11375C] text-xs font-black uppercase mb-4 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            Manifestomuz
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-s-navy tracking-tight leading-tight max-w-4xl mb-6">
            Sadece izleyen değil, anlamlandıran ve eleştirel düşünen bir öğrenci topluluğu.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-slate-700 leading-relaxed font-medium pt-4 border-t-2 border-s-navy/20">
            <p>
              KTO Karatay Üniversitesi Sosyoloji Topluluğu; amfilerde öğrenilen teorik bilgiyi
              kampüs sınırlarının ötesine taşımak, gündelik hayatı ve toplumsal yapıları
              sorgulamak amacıyla kurulmuş bağımsız ve çoğulcu bir öğrenci kulübüdür.
            </p>
            <p>
              Bizler sosyolojiyi yalnızca bir lisans disiplini olarak değil; dünyayı, insan ilişkilerini,
              iktidarı ve kültürü anlama refleksi olarak görüyoruz. Topluluğumuzda hiyerarşi değil,
              özgür tartışma ve ortak merak esastır.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t-2 border-s-navy/10 text-xs font-bold text-s-navy">
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-s-blue" />
              Eleştirel Düşünce
            </span>
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-s-yellow" />
              Kavramsal Derinlik
            </span>
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-s-pink" />
              Kolektif Üretim
            </span>
            <span className="px-3 py-1 bg-slate-100 border-2 border-s-navy flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              Akademik Merak
            </span>
          </div>
        </section>

        {/* ── FAALİYET ALANLARIMIZ (4 BENTO SÜTUNU) ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-s-navy">
            <div className="w-6 h-6 bg-s-blue border-2 border-s-navy flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xl font-black text-s-navy uppercase tracking-wide">
              Faaliyet Alanlarımız
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border-2 border-s-navy shadow-brutal p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div
                      className={`w-12 h-12 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center mb-4 ${pillar.badgeColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-s-navy text-base leading-snug mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── EKİP ÜYELERİMİZ (DİNAMİK VERİTABANI KARTLARI) ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-s-navy">
            <div className="w-6 h-6 bg-s-yellow border-2 border-s-navy flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-s-navy" />
            </div>
            <h2 className="text-xl font-black text-s-navy uppercase tracking-wide">
              Ekip Üyelerimiz
            </h2>
          </div>

          {teamMembers.length === 0 ? (
            <div className="bg-white border-2 border-s-navy shadow-brutal p-8 text-center text-slate-500 font-medium text-sm">
              Henüz ekip üyesi bilgisi eklenmemiştir.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => {
                const accentColor = accentColors[index % accentColors.length];
                const firstLetter = member.name.charAt(0).toUpperCase();

                return (
                  <div
                    key={member.id}
                    className="bg-white border-2 border-s-navy shadow-brutal p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform"
                  >
                    <div>
                      {/* Renkli Neo-Brutalist Avatar */}
                      <div
                        className={`w-12 h-12 ${accentColor} border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-xl mb-4`}
                      >
                        {firstLetter}
                      </div>

                      {/* 1. Üyenin Adı Soyadı */}
                      <h3 className="text-lg font-black text-s-navy leading-snug">
                        {member.name}
                      </h3>

                      {/* 2. Görevi / Unvanı */}
                      <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1.5">
                        {member.title || 'Topluluk Yönetim Kurulu Üyesi'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── ÇAĞRI KUTUSU (ARAMIZA KATIL) ── */}
        <section className="bg-s-pink border-2 border-s-navy shadow-brutal p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-2xl">
            <span className="bg-white text-s-navy text-xs font-black uppercase px-2.5 py-0.5 border border-s-navy shadow-[2px_2px_0px_#11375C] inline-block mb-2">
              Birlikte Düşünelim
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Sen de toplumsal meselelere kafa yormak ister misin?
            </h2>
            <p className="text-sm font-medium mt-2 text-white/90">
              Bölümün veya sınıfın ne olursa olsun, sosyal bilimlere ve düşünmeye ilgi duyan
              tüm KTO Karatay öğrencilerine kapımız sonuna kadar açık.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="px-6 py-3.5 bg-s-navy text-white hover:bg-s-blue font-black text-sm border-2 border-s-navy shadow-[3px_3px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all inline-flex items-center gap-2"
            >
              <span>İletişime Geç</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
