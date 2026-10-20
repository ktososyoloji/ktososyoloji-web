'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Link2,
  ImageIcon,
  PlusCircle,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import { createEvent, deleteEvent, getEvents } from '@/lib/actions/events';

// ─────────────────────────────────────────────
// Tipler
// ─────────────────────────────────────────────
interface EventItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string | null;
  imageUrl: string | null;
  formUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Alt Bileşen: Form Alanı Sarmalayıcı
// ─────────────────────────────────────────────
function FieldWrapper({
  label,
  htmlFor,
  icon,
  children,
  optional = false,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-bold text-s-navy mb-1.5"
      >
        {icon}
        {label}
        {optional && (
          <span className="text-xs font-normal text-slate-400">(opsiyonel)</span>
        )}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Alt Bileşen: Etkinlik Kart Satırı
// ─────────────────────────────────────────────
function EventRow({
  event,
  onDelete,
  isDeleting,
}: {
  event: EventItem;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center gap-4 bg-white border-2 border-s-navy p-4 hover:-translate-y-0.5 transition-transform">
      {/* Afiş */}
      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border-2 border-s-navy overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-slate-400" />
          </div>
        )}
      </div>

      {/* Bilgiler */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-s-navy text-sm sm:text-base truncate">
          {event.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-s-blue" />
            {formattedDate} — {formattedTime}
          </span>
          {event.location && (
            <span className="flex items-center gap-1 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-s-pink" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* Sil Butonu */}
      <button
        type="button"
        onClick={() => onDelete(event.id)}
        disabled={isDeleting}
        aria-label={`${event.title} etkinliğini sil`}
        className="shrink-0 p-2 sm:px-3 sm:py-2 bg-white hover:bg-red-500 text-s-navy hover:text-white border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Sil</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Ana Sayfa Bileşeni
// ─────────────────────────────────────────────
export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Etkinlikleri sunucudan çek
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await getEvents();
      setEvents(data as EventItem[]);
    } catch {
      // sessiz hata — listede gösterilecek mesaj yok
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Afiş önizleme
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPosterPreview(url);
    } else {
      setPosterPreview(null);
    }
  };

  // Form gönderimi
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createEvent(formData);
        formRef.current?.reset();
        setPosterPreview(null);
        setFormSuccess(true);
        await fetchEvents();
        // Başarı mesajını 4 saniye sonra gizle
        setTimeout(() => setFormSuccess(false), 4000);
      } catch (err) {
        setFormError(
          err instanceof Error
            ? err.message
            : 'Etkinlik kaydedilirken beklenmedik bir hata oluştu.'
        );
      }
    });
  };

  // Silme işlemi
  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    setDeletingId(id);
    try {
      await deleteEvent(id);
      await fetchEvents();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Silme işlemi sırasında hata oluştu.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ─────────────── RENDER ───────────────
  return (
    <div className="space-y-8">

      {/* Sayfa Başlığı */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center shrink-0">
          <CalendarDays className="w-6 h-6 text-s-navy" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
            Etkinlik Yönetimi
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Yeni etkinlik ekleyin, afiş yükleyin ve mevcut etkinlikleri yönetin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── SOL: Yeni Etkinlik Formu ── */}
        <section className="lg:col-span-2 bg-white border-2 border-s-navy shadow-brutal p-6">
          <h2 className="text-lg font-bold text-s-navy mb-5 pb-3 border-b-2 border-s-navy flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-s-pink" />
            Yeni Etkinlik Ekle
          </h2>

          {/* Hata Mesajı */}
          {formError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-800 text-sm font-medium flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Başarı Mesajı */}
          {formSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-sm font-medium flex items-start gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Etkinlik başarıyla yayınlandı!</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {/* Başlık */}
            <FieldWrapper
              label="Etkinlik Başlığı"
              htmlFor="title"
              icon={<CalendarDays className="w-4 h-4" />}
            >
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Örn. Sosyoloji Okumaları #12"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Açıklama */}
            <FieldWrapper
              label="Açıklama"
              htmlFor="description"
              icon={<PlusCircle className="w-4 h-4" />}
            >
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                placeholder="Etkinlik hakkında kısa bir açıklama yazın..."
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm resize-none disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Tarih & Saat */}
            <FieldWrapper
              label="Tarih ve Saat"
              htmlFor="date"
              icon={<Calendar className="w-4 h-4" />}
            >
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Konum */}
            <FieldWrapper
              label="Konum"
              htmlFor="location"
              icon={<MapPin className="w-4 h-4" />}
              optional
            >
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Örn. KTO Karatay Üniversitesi A-Blok"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Katılım Formu Linki */}
            <FieldWrapper
              label="Katılım Formu Linki"
              htmlFor="formUrl"
              icon={<Link2 className="w-4 h-4" />}
              optional
            >
              <input
                id="formUrl"
                name="formUrl"
                type="url"
                placeholder="https://forms.gle/... veya https://tally.so/..."
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Afiş Görseli */}
            <FieldWrapper
              label="Afiş Görseli"
              htmlFor="poster"
              icon={<ImageIcon className="w-4 h-4" />}
              optional
            >
              <label
                htmlFor="poster"
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-s-navy bg-slate-50 hover:bg-s-yellow/10 transition-colors cursor-pointer p-4 gap-2"
              >
                {posterPreview ? (
                  <div className="w-full aspect-video relative overflow-hidden border border-slate-200">
                    <Image
                      src={posterPreview}
                      alt="Afiş önizleme"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                    <span className="text-xs text-slate-500 text-center">
                      Görsel seçmek için tıklayın
                      <br />
                      <span className="text-slate-400">JPG, PNG, WEBP · Maks 5 MB</span>
                    </span>
                  </>
                )}
                <input
                  id="poster"
                  name="poster"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  disabled={isPending}
                  className="sr-only"
                />
              </label>
              {posterPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPosterPreview(null);
                    const input = document.getElementById('poster') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  className="mt-1.5 text-xs text-red-600 hover:underline font-medium"
                >
                  Görseli kaldır
                </button>
              )}
            </FieldWrapper>

            {/* Gönder Butonu */}
            <button
              type="submit"
              id="submit-event-btn"
              disabled={isPending}
              className="w-full py-3 px-4 bg-s-pink hover:bg-s-navy text-s-navy hover:text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Etkinlik Yayınla</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── SAĞ: Etkinlik Listesi ── */}
        <section className="lg:col-span-3">
          <div className="bg-white border-2 border-s-navy shadow-brutal">
            {/* Liste Başlığı */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-s-navy">
              <h2 className="text-lg font-bold text-s-navy flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-s-blue" />
                Mevcut Etkinlikler
              </h2>
              {!loadingEvents && (
                <span className="text-xs font-bold text-white bg-s-blue border-2 border-s-navy px-2 py-0.5">
                  {events.length}
                </span>
              )}
            </div>

            {/* Liste İçeriği */}
            <div className="divide-y-2 divide-s-navy/20">
              {loadingEvents ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
                  <p className="text-sm font-semibold text-s-navy">
                    Etkinlikler yükleniyor...
                  </p>
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                  <div className="w-14 h-14 bg-slate-100 border-2 border-s-navy flex items-center justify-center">
                    <CalendarDays className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-s-navy">Henüz etkinlik yok</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Sol formu kullanarak ilk etkinliğinizi ekleyin.
                    </p>
                  </div>
                </div>
              ) : (
                events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onDelete={handleDelete}
                    isDeleting={deletingId === event.id}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
