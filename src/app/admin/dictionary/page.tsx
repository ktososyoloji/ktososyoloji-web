'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  PlusCircle,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  UserRound,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import {
  createDictionaryTerm,
  deleteDictionaryTerm,
  getDictionaryTerms,
} from '@/lib/actions/dictionary';

// ─────────────────────────────────────────────
// Tipler
// ─────────────────────────────────────────────
interface DictionaryTerm {
  id: string;
  term: string;
  definition: string;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
        <BookOpen className="w-4 h-4" />
        Sözlük Yönetimi
      </span>
    </nav>
  );
}

// ─────────────────────────────────────────────
// Alt Bileşen: Form Alan Sarmalayıcı
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
// Alt Bileşen: Terim Kartı
// ─────────────────────────────────────────────
function TermCard({
  term,
  onDelete,
  isDeleting,
}: {
  term: DictionaryTerm;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  // Tanımı 160 karakterde kes
  const shortDef =
    term.definition.length > 160
      ? term.definition.slice(0, 160) + '…'
      : term.definition;

  return (
    <div className="bg-white border-2 border-s-navy p-4 flex items-start gap-4 hover:-translate-y-0.5 transition-transform">
      {/* Alfabe Rozeti */}
      <div className="shrink-0 w-10 h-10 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-base select-none">
        {term.term.charAt(0).toUpperCase()}
      </div>

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-black text-s-navy text-sm sm:text-base">
            {term.term}
          </span>
          {term.createdBy && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-s-navy bg-s-pink/30 border border-s-pink px-2 py-0.5">
              <UserRound className="w-3 h-3" />
              {term.createdBy}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {shortDef}
        </p>
      </div>

      {/* Sil Butonu */}
      <button
        type="button"
        onClick={() => onDelete(term.id)}
        disabled={isDeleting}
        aria-label={`${term.term} terimini sil`}
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
export default function AdminDictionaryPage() {
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // ── Terimleri Yükle ──
  const fetchTerms = async () => {
    setLoadingTerms(true);
    try {
      const data = await getDictionaryTerms();
      setTerms(data as DictionaryTerm[]);
    } catch {
      // sessiz hata
    } finally {
      setLoadingTerms(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  // ── Client-side Arama Filtresi ──
  const filteredTerms = terms.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      (t.createdBy ?? '').toLowerCase().includes(q)
    );
  });

  // ── Form Gönderimi ──
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createDictionaryTerm(formData);
        formRef.current?.reset();
        setFormSuccess(true);
        await fetchTerms();
        setTimeout(() => setFormSuccess(false), 4000);
      } catch (err) {
        setFormError(
          err instanceof Error
            ? err.message
            : 'Terim kaydedilirken beklenmedik bir hata oluştu.'
        );
      }
    });
  };

  // ── Silme İşlemi ──
  const handleDelete = async (id: string) => {
    if (!confirm('Bu terimi silmek istediğinizden emin misiniz?')) return;
    setDeletingId(id);
    try {
      await deleteDictionaryTerm(id);
      await fetchTerms();
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
    <div className="space-y-6">
      <Breadcrumb />

      {/* Sayfa Başlığı */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-s-pink border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-s-navy" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
            Sözlük Yönetimi
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Sosyolojik kavramları, kuramcı tanımlarını ve sözlük maddelerini yönetin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── SOL: Yeni Terim Formu ── */}
        <section className="lg:col-span-2 bg-white border-2 border-s-navy shadow-brutal p-6">
          <h2 className="text-lg font-bold text-s-navy mb-5 pb-3 border-b-2 border-s-navy flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-s-yellow" />
            Yeni Terim Ekle
          </h2>

          {/* Hata */}
          {formError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-800 text-sm font-medium flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Başarı */}
          {formSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-sm font-medium flex items-start gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Terim başarıyla eklendi!</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {/* Terim Adı */}
            <FieldWrapper
              label="Terim Adı"
              htmlFor="term"
              icon={<BookOpen className="w-4 h-4" />}
            >
              <input
                id="term"
                name="term"
                type="text"
                required
                placeholder="Örn. Anomi, Hegemonya, Habitus"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* İlişkili Düşünür */}
            <FieldWrapper
              label="İlişkili Düşünür / Sosyolog"
              htmlFor="author"
              icon={<UserRound className="w-4 h-4" />}
              optional
            >
              <input
                id="author"
                name="author"
                type="text"
                placeholder="Örn. Émile Durkheim, Pierre Bourdieu"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Tanım */}
            <FieldWrapper
              label="Tanım"
              htmlFor="definition"
              icon={<PlusCircle className="w-4 h-4" />}
            >
              <textarea
                id="definition"
                name="definition"
                required
                rows={5}
                placeholder="Kavramın sosyolojik tanımını buraya yazın..."
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm resize-none disabled:opacity-60"
              />
            </FieldWrapper>

            {/* Gönder Butonu */}
            <button
              type="submit"
              id="submit-term-btn"
              disabled={isPending}
              className="w-full py-3 px-4 bg-s-yellow hover:bg-s-navy text-s-navy hover:text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Terim Ekle</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── SAĞ: Terim Listesi ── */}
        <section className="lg:col-span-3 flex flex-col gap-4">

          {/* Arama Çubuğu */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="dictionary-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Terim, tanım veya düşünür ara..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm"
            />
          </div>

          {/* Liste Kutusu */}
          <div className="bg-white border-2 border-s-navy shadow-brutal">
            {/* Liste Başlığı */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-s-navy">
              <h2 className="text-lg font-bold text-s-navy flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-s-blue" />
                Sözlük Maddeleri
              </h2>
              {!loadingTerms && (
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <span className="text-xs font-semibold text-slate-500">
                      {filteredTerms.length} / {terms.length}
                    </span>
                  )}
                  <span className="text-xs font-bold text-white bg-s-blue border-2 border-s-navy px-2 py-0.5">
                    {terms.length}
                  </span>
                </div>
              )}
            </div>

            {/* Terimler */}
            <div className="divide-y-2 divide-s-navy/20">
              {loadingTerms ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
                  <p className="text-sm font-semibold text-s-navy">
                    Terimler yükleniyor...
                  </p>
                </div>
              ) : filteredTerms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                  <div className="w-14 h-14 bg-slate-100 border-2 border-s-navy flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-s-navy">
                      {searchQuery ? 'Eşleşen terim bulunamadı' : 'Henüz terim yok'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery
                        ? 'Farklı bir arama terimi deneyin.'
                        : 'Sol formu kullanarak ilk terimi ekleyin.'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredTerms.map((term) => (
                  <TermCard
                    key={term.id}
                    term={term}
                    onDelete={handleDelete}
                    isDeleting={deletingId === term.id}
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
