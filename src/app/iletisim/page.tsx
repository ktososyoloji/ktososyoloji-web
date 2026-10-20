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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { sendMessage } from '@/lib/actions/contact';

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

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendMessage(formData);

      if (!res.success) {
        setErrorMessage(
          typeof res.error === 'string'
            ? res.error
            : 'Mesaj iletilemedi. Lütfen tekrar deneyin.'
        );
        return;
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Mesajınız iletilirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
                      href="mailto:sosyolojitoplulugu@karatay.edu.tr"
                      className="text-xs sm:text-sm font-bold text-s-navy hover:text-s-blue underline"
                    >
                      sosyolojitoplulugu@karatay.edu.tr
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
                  href="https://www.instagram.com/ktokarataysosyolojitoplulugu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-white hover:bg-s-pink hover:text-white text-s-navy font-bold text-xs border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram (@ktokarataysosyolojitoplulugu)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://chat.whatsapp.com/Khno8BGGJqS4Gdw5WwMiwT?s=cl&p=a&mlu=4&ilr=4&iam=0"
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

            {/* Hata Bildirimi */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-3.5 bg-red-50 border-2 border-red-500 text-red-900 text-sm font-semibold flex items-start gap-2.5 shadow-[2px_2px_0px_#11375C]"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-center space-y-3 shadow-[2px_2px_0px_#11375C]">
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
                  className="mt-3 px-4 py-2 bg-white text-emerald-900 border-2 border-emerald-600 font-bold text-xs shadow-[2px_2px_0px_#065f46] hover:bg-emerald-100 transition-colors cursor-pointer"
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
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn. Selin Yılmaz"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue text-sm disabled:opacity-60"
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
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@ogrenci.karatay.edu.tr"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue text-sm disabled:opacity-60"
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
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Etkinlik fikrinizi, okuma grubu talebinizi veya iletmek istediğiniz konuyu yazın..."
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue text-sm resize-y disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-s-yellow hover:bg-s-navy text-s-navy hover:text-white font-black text-sm border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>İletiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Mesajı İlet</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
