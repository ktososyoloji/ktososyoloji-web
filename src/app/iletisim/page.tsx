'use client';

import { useState } from 'react';
import {
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  Phone,
  Sparkles,
} from 'lucide-react';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── ÜST BAŞLIK BİLGİSİ ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-s-navy pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-s-yellow border border-s-navy inline-block" />
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-s-navy">
              KTO Karatay Üniversitesi Sosyoloji Topluluğu
            </span>
          </div>
          <span className="bg-s-pink text-white px-2.5 py-0.5 border border-s-navy text-xs font-bold shadow-[2px_2px_0px_#11375C]">
            İletişim & Katılım
          </span>
        </div>

        {/* ── SAYFA BAŞLIK KARTI ── */}
        <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-s-navy" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
              Bizimle İletişime Geçin
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Etkinlikler, ortak projeler, soru ve görüşleriniz için topluluk koordinasyonuna ulaşın.
            </p>
          </div>
        </div>

        {/* ── İKİ KOLONLU BENTO DÜZENİ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* SOL: İletişim Bilgileri & Sosyal Medya (2 Kolon) */}
          <div className="lg:col-span-2 space-y-6">

            {/* İletişim Bilgileri Kutusu */}
            <div className="bg-white border-2 border-s-navy shadow-brutal p-6 space-y-5">
              <h2 className="text-base font-black text-s-navy uppercase tracking-wide pb-2 border-b-2 border-s-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-s-pink" />
                Resmi İletişim
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-s-blue text-white border-2 border-s-navy flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      E-Posta Adresi
                    </span>
                    <a
                      href="mailto:sosyoloji@karatay.edu.tr"
                      className="text-xs sm:text-sm font-bold text-s-navy hover:text-s-blue underline"
                    >
                      sosyoloji@karatay.edu.tr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-s-pink text-white border-2 border-s-navy flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      Kampüs Konumu
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-s-navy leading-snug">
                      KTO Karatay Üniversitesi, Sosyal ve Beşeri Bilimler Fakültesi, Akabe Mah. Alaaddin Kap Cad. No:130 Karatay / Konya
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-300 text-s-navy border-2 border-s-navy flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      Öğrenci Kulüpleri Birimi
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-s-navy">
                      Santral: 444 12 51
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sosyal Medya Bağlantı Kartları */}
            <div className="bg-white border-2 border-s-navy shadow-brutal p-6 space-y-4">
              <h2 className="text-base font-black text-s-navy uppercase tracking-wide pb-2 border-b-2 border-s-navy flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-s-blue" />
                Sosyal Medya & Topluluk
              </h2>

              <div className="space-y-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-white hover:bg-s-pink hover:text-white text-s-navy font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram (@ktosoyoloji)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-white hover:bg-s-blue hover:text-white text-s-navy font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <LinkedInIcon className="w-4 h-4" />
                    <span>LinkedIn Topluluk Sayfası</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://chat.whatsapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-white hover:bg-emerald-400 text-s-navy font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Topluluk Kanalı</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* SAĞ: İletişim / Öneri Formu (3 Kolon) */}
          <div className="lg:col-span-3 bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8">
            <h2 className="text-lg font-black text-s-navy mb-2">
              Bize Mesaj Gönderin
            </h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Topluluk etkinlikleri için fikirleriniz, atölye önerileriniz veya sorularınız için formu doldurabilirsiniz.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-400 border-2 border-emerald-700 flex items-center justify-center mx-auto shadow-[2px_2px_0px_#11375C]">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-black">Mesajınız Alındı!</h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Teşekkür ederiz. İlettiğiniz mesaj topluluk yönetim ekibimiz tarafından incelenip en kısa sürede geri dönüş yapılacaktır.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-3 px-4 py-2 bg-white text-emerald-900 border-2 border-emerald-600 font-bold text-xs shadow-[2px_2px_0px_#065f46]"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wider text-s-navy mb-1.5"
                  >
                    Adınız Soyadınız *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn. Selin Yılmaz"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-s-navy mb-1.5"
                  >
                    E-Posta Adresiniz *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@ogrenci.karatay.edu.tr"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold uppercase tracking-wider text-s-navy mb-1.5"
                  >
                    Mesajınız veya Öneriniz *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Etkinlik fikrinizi, okuma grubu talebinizi veya iletmek istediğiniz konuyu yazın..."
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue text-sm resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-s-yellow hover:bg-s-navy text-s-navy hover:text-white font-black text-sm border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı İlet</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
