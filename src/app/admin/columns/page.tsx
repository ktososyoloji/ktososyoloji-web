'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import {
  PenTool,
  PlusCircle,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  User,
  GraduationCap,
  FileText,
  AlignLeft,
  Image as ImageIcon,
  Calendar,
  BookOpen,
} from 'lucide-react';
import {
  createColumnArticle,
  deleteColumnArticle,
  getColumnArticles,
} from '@/lib/actions/columns';

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

function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-6"
    >
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-s-navy transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <ChevronRight className="w-4 h-4 text-slate-300" />
      <span className="text-s-navy flex items-center gap-1 font-bold">
        <PenTool className="w-4 h-4" />
        Köşe Yazıları Yönetimi
      </span>
    </nav>
  );
}

export default function AdminColumnsPage() {
  const [articles, setArticles] = useState<ColumnArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getColumnArticles();
      setArticles(data as ColumnArticleItem[]);
    } catch {
      // sessiz hata
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createColumnArticle(formData);
        formRef.current?.reset();
        setFileName(null);
        setFormSuccess(true);
        await fetchArticles();
        setTimeout(() => setFormSuccess(false), 5000);
      } catch (err) {
        setFormError(
          err instanceof Error
            ? err.message
            : 'Köşe yazısı kaydedilirken bir hata oluştu.'
        );
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" başlıklı köşe yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteColumnArticle(id);
      await fetchArticles();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Yazı silinirken bir hata meydana geldi.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Sayfa Başlığı */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-300 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
            <PenTool className="w-6 h-6 text-s-navy" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
              Köşe Yazıları Yönetimi
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Öğrencilerin ve araştırmacıların kaleme aldığı köşe yazılarını yayınlayın ve yönetin.
            </p>
          </div>
        </div>

        {!loading && (
          <div className="px-3.5 py-1.5 bg-s-yellow border-2 border-s-navy text-xs font-black text-s-navy shadow-[2px_2px_0px_#11375C]">
            {articles.length} Yazı Kayıtlı
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* ── SOL: Yeni Köşe Yazısı Ekleme Formu ── */}
        <section className="lg:col-span-2 bg-white border-2 border-s-navy shadow-brutal p-6">
          <h2 className="text-lg font-bold text-s-navy mb-4 pb-3 border-b-2 border-s-navy flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-500" />
            Yeni Köşe Yazısı Ekle
          </h2>

          {/* Hata Bildirimi */}
          {formError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-800 text-xs sm:text-sm font-medium flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Başarı Bildirimi */}
          {formSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs sm:text-sm font-medium flex items-start gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Köşe yazısı başarıyla yayınlandı!</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Yazı Başlığı */}
            <div>
              <label
                htmlFor="title"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy mb-1"
              >
                <FileText className="w-4 h-4 text-s-blue" />
                Yazı Başlığı
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Örn. Modern Kentte Yalnızlık ve Mekan"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </div>

            {/* Yazar Adı Soyadı */}
            <div>
              <label
                htmlFor="authorName"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy mb-1"
              >
                <User className="w-4 h-4 text-s-pink" />
                Yazar Adı Soyadı
              </label>
              <input
                id="authorName"
                name="authorName"
                type="text"
                required
                placeholder="Örn. Selin Yılmaz"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </div>

            {/* Yazar Unvanı / Sınıfı */}
            <div>
              <label
                htmlFor="authorRole"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy mb-1"
              >
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                Yazar Unvanı / Sınıfı
                <span className="text-[11px] font-normal text-slate-400">(opsiyonel)</span>
              </label>
              <input
                id="authorRole"
                name="authorRole"
                type="text"
                placeholder="Örn. Sosyoloji 4. Sınıf veya Araştırmacı"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </div>

            {/* Yazar Fotoğrafı */}
            <div>
              <label
                htmlFor="authorImage"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy mb-1"
              >
                <ImageIcon className="w-4 h-4 text-s-yellow" />
                Yazar Fotoğrafı
                <span className="text-[11px] font-normal text-slate-400">(opsiyonel)</span>
              </label>
              <div className="relative">
                <input
                  id="authorImage"
                  name="authorImage"
                  type="file"
                  accept="image/*"
                  disabled={isPending}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileName(file ? file.name : null);
                  }}
                  className="w-full px-3 py-2 bg-white border-2 border-s-navy text-s-navy text-xs file:mr-3 file:py-1.5 file:px-3 file:border-2 file:border-s-navy file:text-xs file:font-bold file:bg-s-yellow file:text-s-navy file:cursor-pointer hover:file:bg-amber-300 disabled:opacity-60"
                />
              </div>
              {fileName && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 truncate">
                  Seçilen dosya: {fileName}
                </p>
              )}
            </div>

            {/* Kısa Giriş / Özet */}
            <div>
              <label
                htmlFor="excerpt"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy mb-1"
              >
                <AlignLeft className="w-4 h-4 text-slate-500" />
                Kısa Giriş / Özet
                <span className="text-[11px] font-normal text-slate-400">(2-3 satır)</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                placeholder="Yazının ana fikrini belirten kısa bir ön izleme metni..."
                disabled={isPending}
                className="w-full px-3 py-2 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60 resize-y"
              />
            </div>

            {/* Köşe Yazısı Metni */}
            <div>
              <label
                htmlFor="body"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-s-navy mb-1"
              >
                <BookOpen className="w-4 h-4 text-s-blue" />
                Köşe Yazısı Metni
              </label>
              <textarea
                id="body"
                name="body"
                rows={8}
                required
                placeholder="Köşe yazısının tüm içeriğini buraya yazın veya yapıştırın..."
                disabled={isPending}
                className="w-full px-3 py-2 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60 resize-y"
              />
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-emerald-300 hover:bg-s-navy text-s-navy hover:text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-3"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Yayınlanıyor...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Yazıyı Yayınla</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── SAĞ: Mevcut Köşe Yazıları Listesi ── */}
        <section className="lg:col-span-3">
          <div className="bg-white border-2 border-s-navy shadow-brutal">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-s-navy">
              <h2 className="text-lg font-bold text-s-navy flex items-center gap-2">
                <PenTool className="w-5 h-5 text-s-blue" />
                Kayıtlı Köşe Yazıları
              </h2>
            </div>

            <div className="divide-y-2 divide-s-navy/20">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
                  <p className="text-sm font-semibold text-s-navy">
                    Köşe yazıları yükleniyor...
                  </p>
                </div>
              ) : articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                  <div className="w-14 h-14 bg-slate-100 border-2 border-s-navy flex items-center justify-center">
                    <PenTool className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-s-navy">Henüz köşe yazısı eklenmemiş</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Sol taraftaki formu kullanarak topluluk yazarlarının ilk köşe yazısını sisteme ekleyin.
                    </p>
                  </div>
                </div>
              ) : (
                articles.map((article) => {
                  const dateStr = new Date(article.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={article.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        {/* Yazar Fotoğrafı veya Avatar Harf */}
                        {article.authorImage ? (
                          <div className="w-12 h-12 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] overflow-hidden shrink-0 bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.authorImage}
                              alt={article.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-lg shrink-0">
                            {article.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <h3 className="font-black text-s-navy text-base leading-snug break-words">
                            {article.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-s-navy">
                              {article.authorName}
                            </span>
                            {article.authorRole && (
                              <span className="px-1.5 py-0.2 bg-slate-100 border border-s-navy text-slate-600 font-medium text-[11px]">
                                {article.authorRole}
                              </span>
                            )}
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {dateStr}
                            </span>
                          </div>

                          {article.excerpt && (
                            <p className="text-xs text-slate-600 line-clamp-2 pt-1 font-medium leading-relaxed">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sil Butonu */}
                      <div className="shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          aria-label={`"${article.title}" yazısını sil`}
                          className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-red-500 text-s-navy hover:text-white border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === article.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">Sil</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
