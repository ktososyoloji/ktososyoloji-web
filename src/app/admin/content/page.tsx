'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FileText,
  BookOpen,
  Film,
  PenTool,
  MessagesSquare,
  PlusCircle,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  UserRound,
  ImageIcon,
  ChevronRight,
  LayoutDashboard,
  Calendar,
} from 'lucide-react';
import { createContent, deleteContent, getContents } from '@/lib/actions/content';

// ─────────────────────────────────────────────
// Tipler
// ─────────────────────────────────────────────
type ContentTypeEnum = 'BOOK' | 'MOVIE' | 'ESSAY' | 'INTERVIEW';

interface ContentItem {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  type: ContentTypeEnum;
  author: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Tür Yapılandırması ve Renk Rozetleri
// ─────────────────────────────────────────────
const TYPE_CONFIG: Record<
  ContentTypeEnum,
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
    label: 'Makale / Deneme',
    badgeClass: 'bg-s-blue text-white border-s-navy',
    icon: PenTool,
  },
  INTERVIEW: {
    label: 'Röportaj',
    badgeClass: 'bg-emerald-300 text-s-navy border-s-navy',
    icon: MessagesSquare,
  },
};

// ─────────────────────────────────────────────
// Alt Bileşen: Ekmek Kırıntısı (Breadcrumb)
// ─────────────────────────────────────────────
function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-6">
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-s-navy transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <ChevronRight className="w-4 h-4 text-slate-300" />
      <span className="text-s-navy flex items-center gap-1">
        <FileText className="w-4 h-4" />
        İçerik Yönetimi
      </span>
    </nav>
  );
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
// Alt Bileşen: İçerik Kartı Satırı
// ─────────────────────────────────────────────
function ContentRow({
  item,
  onDelete,
  isDeleting,
}: {
  item: ContentItem;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const typeMeta = TYPE_CONFIG[item.type] || TYPE_CONFIG.BOOK;
  const TypeIcon = typeMeta.icon;

  const dateObj = new Date(item.createdAt);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-4 bg-white border-2 border-s-navy p-4 hover:-translate-y-0.5 transition-transform">
      {/* Kapak Görseli */}
      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border-2 border-s-navy overflow-hidden relative">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <TypeIcon className="w-7 h-7 text-slate-400" />
          </div>
        )}
      </div>

      {/* Bilgiler */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 border ${typeMeta.badgeClass}`}
          >
            <TypeIcon className="w-3 h-3" />
            {typeMeta.label}
          </span>
          {item.author && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
              <UserRound className="w-3.5 h-3.5 text-s-blue" />
              {item.author}
            </span>
          )}
        </div>

        <h3 className="font-bold text-s-navy text-sm sm:text-base truncate">
          {item.title}
        </h3>

        {item.summary && (
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {item.summary}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Sil Butonu */}
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        disabled={isDeleting}
        aria-label={`${item.title} içeriğini sil`}
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
export default function AdminContentPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | ContentTypeEnum>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // ── İçerikleri Yükle ──
  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await getContents();
      setContents(data as ContentItem[]);
    } catch {
      // sessiz hata
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  // ── Görsel Seçimi ve Önizleme ──
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    } else {
      setCoverPreview(null);
    }
  };

  // ── Form Gönderimi ──
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createContent(formData);
        formRef.current?.reset();
        setCoverPreview(null);
        setFormSuccess(true);
        await fetchContents();
        setTimeout(() => setFormSuccess(false), 4000);
      } catch (err) {
        setFormError(
          err instanceof Error
            ? err.message
            : 'İçerik kaydedilirken beklenmedik bir hata oluştu.'
        );
      }
    });
  };

  // ── Silme İşlemi ──
  const handleDelete = async (id: string) => {
    if (!confirm('Bu içeriği kalıcı olarak silmek istediğinizden emin misiniz?')) return;
    setDeletingId(id);
    try {
      await deleteContent(id);
      await fetchContents();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Silme işlemi sırasında hata oluştu.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filtrelenmiş Liste ──
  const filteredContents = contents.filter((item) => {
    const matchesTab = activeTab === 'ALL' || item.type === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.author ?? '').toLowerCase().includes(q) ||
      (item.summary ?? '').toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  // ─────────────── RENDER ───────────────
  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Sayfa Başlığı */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-s-blue border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
            İçerik & Kütüphane Yönetimi
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Kitap incelemeleri, film tahlilleri, makaleler ve röportaj içeriklerini yayınlayın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── SOL: Yeni İçerik Ekleme Formu ── */}
        <section className="lg:col-span-2 bg-white border-2 border-s-navy shadow-brutal p-6">
          <h2 className="text-lg font-bold text-s-navy mb-5 pb-3 border-b-2 border-s-navy flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-s-blue" />
            Yeni İçerik Ekle
          </h2>

          {/* Hata Bildirimi */}
          {formError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-800 text-sm font-medium flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Başarı Bildirimi */}
          {formSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-sm font-medium flex items-start gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>İçerik başarıyla yayınlandı!</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {/* Başlık */}
            <FieldWrapper
              label="İçerik Başlığı"
              htmlFor="title"
              icon={<FileText className="w-4 h-4" />}
            >
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Örn. Modernite ve Müphemlik İncelemesi"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Tür ve Yazar Alanları - 2 Kolon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* İçerik Türü */}
              <FieldWrapper
                label="İçerik Türü"
                htmlFor="type"
                icon={<BookOpen className="w-4 h-4" />}
              >
                <select
                  id="type"
                  name="type"
                  required
                  defaultValue="BOOK"
                  disabled={isPending}
                  className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60 font-semibold"
                >
                  <option value="BOOK">Kitap İncelemesi</option>
                  <option value="MOVIE">Film / Belgesel Tahlili</option>
                  <option value="ESSAY">Makale / Deneme</option>
                  <option value="INTERVIEW">Röportaj</option>
                </select>
              </FieldWrapper>

              {/* Yazar / Katkıda Bulunan */}
              <FieldWrapper
                label="Yazar / İnceleyen"
                htmlFor="author"
                icon={<UserRound className="w-4 h-4" />}
                optional
              >
                <input
                  id="author"
                  name="author"
                  type="text"
                  placeholder="Örn. Zygmunt Bauman"
                  disabled={isPending}
                  className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
                />
              </FieldWrapper>
            </div>

            {/* Kısa Özet */}
            <FieldWrapper
              label="Kısa Özet"
              htmlFor="summary"
              icon={<PlusCircle className="w-4 h-4" />}
              optional
            >
              <textarea
                id="summary"
                name="summary"
                rows={2}
                placeholder="İçeriğin listelerde ve önizlemelerde görünecek kısa özeti..."
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm resize-none disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Detaylı İçerik Metni */}
            <FieldWrapper
              label="Detaylı Metin / İnceleme"
              htmlFor="body"
              icon={<PenTool className="w-4 h-4" />}
            >
              <textarea
                id="body"
                name="body"
                required
                rows={7}
                placeholder="İnceleme, tahlil veya röportaj metninin tamamını buraya yazın..."
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm resize-y min-h-[140px] disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Kapak Görseli */}
            <FieldWrapper
              label="Kapak Görseli"
              htmlFor="coverImage"
              icon={<ImageIcon className="w-4 h-4" />}
              optional
            >
              <label
                htmlFor="coverImage"
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-s-navy bg-slate-50 hover:bg-s-yellow/10 transition-colors cursor-pointer p-4 gap-2"
              >
                {coverPreview ? (
                  <div className="w-full aspect-video relative overflow-hidden border border-slate-200">
                    <Image
                      src={coverPreview}
                      alt="Kapak önizleme"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                    <span className="text-xs text-slate-500 text-center">
                      Kapak görseli yüklemek için tıklayın
                      <br />
                      <span className="text-slate-400">JPG, PNG, WEBP · Maks 5 MB</span>
                    </span>
                  </>
                )}
                <input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  disabled={isPending}
                  className="sr-only"
                />
              </label>
              {coverPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview(null);
                    const input = document.getElementById('coverImage') as HTMLInputElement;
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
              id="submit-content-btn"
              disabled={isPending}
              className="w-full py-3 px-4 bg-s-blue hover:bg-s-navy text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Yayınlanıyor...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>İçeriği Yayınla</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── SAĞ: İçerik Listesi ve Filtreler ── */}
        <section className="lg:col-span-3 flex flex-col gap-4">

          {/* Tür Bazlı Filtreleme Butonları */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'BOOK', label: 'Kitap' },
              { id: 'MOVIE', label: 'Film / Belgesel' },
              { id: 'ESSAY', label: 'Makale' },
              { id: 'INTERVIEW', label: 'Röportaj' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'ALL' | ContentTypeEnum)}
                  className={`px-3 py-1.5 text-xs font-bold border-2 border-s-navy transition-all cursor-pointer ${
                    isActive
                      ? 'bg-s-navy text-white shadow-[2px_2px_0px_0px_#11375C]'
                      : 'bg-white text-s-navy hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Arama Çubuğu */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="content-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Başlık, yazar veya özet ara..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm"
            />
          </div>

          {/* Liste Kutusu */}
          <div className="bg-white border-2 border-s-navy shadow-brutal">
            {/* Liste Başlığı */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-s-navy">
              <h2 className="text-lg font-bold text-s-navy flex items-center gap-2">
                <FileText className="w-5 h-5 text-s-blue" />
                Mevcut İçerikler
              </h2>
              {!loading && (
                <div className="flex items-center gap-2">
                  {(searchQuery || activeTab !== 'ALL') && (
                    <span className="text-xs font-semibold text-slate-500">
                      {filteredContents.length} / {contents.length}
                    </span>
                  )}
                  <span className="text-xs font-bold text-white bg-s-blue border-2 border-s-navy px-2 py-0.5">
                    {contents.length}
                  </span>
                </div>
              )}
            </div>

            {/* İçerik Kartları */}
            <div className="divide-y-2 divide-s-navy/20">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
                  <p className="text-sm font-semibold text-s-navy">
                    İçerikler yükleniyor...
                  </p>
                </div>
              ) : filteredContents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                  <div className="w-14 h-14 bg-slate-100 border-2 border-s-navy flex items-center justify-center">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-s-navy">
                      {searchQuery || activeTab !== 'ALL'
                        ? 'Kriterlere uygun içerik bulunamadı'
                        : 'Henüz içerik yayınlanmamış'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery || activeTab !== 'ALL'
                        ? 'Filtreleri sıfırlamayı veya farklı bir arama yapmayı deneyin.'
                        : 'Sol formu kullanarak ilk içeriğinizi yayınlayın.'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredContents.map((item) => (
                  <ContentRow
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    isDeleting={deletingId === item.id}
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
