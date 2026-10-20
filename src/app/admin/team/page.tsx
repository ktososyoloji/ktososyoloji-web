'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  PlusCircle,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Mail,
  UserRound,
  ShieldAlert,
  KeyRound,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  getCurrentAdminUser,
} from '@/lib/actions/team';
import { VALID_TITLES, type ValidTitle, type AuthSession } from '@/lib/team-constants';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  role: 'ADMIN' | 'EDITOR';
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
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
        <Users className="w-4 h-4" />
        Ekip & Yetkili Yönetimi
      </span>
    </nav>
  );
}

export default function AdminTeamPage() {
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<ValidTitle>('Topluluk Yönetim Kurulu Üyesi');
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const fetchMembersAndUser = async () => {
    try {
      const [userData, membersData] = await Promise.all([
        getCurrentAdminUser(),
        getTeamMembers(),
      ]);
      setCurrentUser(userData);
      setMembers(membersData as TeamMember[]);
    } catch {
      // sessiz hata
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersAndUser();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFormSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await createTeamMember(formData);
        if (!res.success) {
          setErrorMessage(
            typeof res.error === 'string'
              ? res.error
              : 'İşlem gerçekleştirilemedi.'
          );
          return;
        }

        setErrorMessage(null);
        formRef.current?.reset();
        setSelectedTitle('Topluluk Yönetim Kurulu Üyesi');
        setFormSuccess(true);
        await fetchMembersAndUser();
        setTimeout(() => setFormSuccess(false), 5000);
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Kullanıcı eklenirken bir sunucu hatası oluştu. Lütfen tekrar deneyin.'
        );
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" adlı ekip üyesini silmek istediğinizden emin misiniz?`)) return;
    setDeletingId(id);
    try {
      await deleteTeamMember(id);
      await fetchMembersAndUser();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Silme işlemi sırasında hata oluştu.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Yükleme durumu
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
        <p className="text-sm font-semibold text-s-navy">Yetki ve ekip bilgileri yükleniyor...</p>
      </div>
    );
  }

  // RBAC Yetki Kısıtlaması: EDITÖR bu sayfaya erişemez
  if (currentUser && currentUser.role === 'EDITOR') {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="bg-white border-2 border-s-navy shadow-brutal p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 bg-red-100 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-s-navy">
            Erişim Yetkiniz Yok
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Ekip & Kullanıcı Yönetimi sayfası yalnızca <strong>Topluluk Yöneticileri (ADMIN)</strong> tarafından görüntülenebilir ve düzenlenebilir.
            Editör hesabınız ile İçerik, Etkinlik ve Sözlük modüllerini yönetebilirsiniz.
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-s-blue text-white font-bold border-2 border-s-navy shadow-brutal hover:bg-s-navy active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Yönetim Paneline Dön</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Sayfa Başlığı */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-300 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-s-navy" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
              Ekip & Rol Yönetimi
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Yöneticileri ve topluluk üyelerini yetkilendirin, yeni üye tanımlayın.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-s-yellow border-2 border-s-navy text-xs font-black text-s-navy shadow-[2px_2px_0px_#11375C]">
          <ShieldCheck className="w-4 h-4 text-s-navy" />
          <span>ADMIN YETKİSİ AKTİF</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* ── SOL: Yeni Üye Ekleme Formu ── */}
        <section className="lg:col-span-2 bg-white border-2 border-s-navy shadow-brutal p-6">
          <h2 className="text-lg font-bold text-s-navy mb-4 pb-3 border-b-2 border-s-navy flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-500" />
            Yeni Üye / Yönetici Tanımla
          </h2>

          {/* Hata Bildirimi */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 p-3.5 bg-red-50 border-2 border-red-500 text-red-900 text-sm font-semibold flex items-start gap-2.5 shadow-[2px_2px_0px_#11375C]"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Başarı Bildirimi */}
          {formSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-sm font-medium flex items-start gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ekip üyesi başarıyla oluşturuldu!</p>
                <p className="text-xs mt-0.5">Varsayılan şifre: <strong>123456</strong> (İlk girişte değiştirmesi zorunludur).</p>
              </div>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Ad Soyad */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-1.5 text-sm font-bold text-s-navy mb-1.5"
              >
                <UserRound className="w-4 h-4 text-s-blue" />
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Örn. Selin Yılmaz"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </div>

            {/* Görev / Unvan Seçimi (Sadece 4 seçenek) */}
            <div>
              <label
                htmlFor="title"
                className="flex items-center gap-1.5 text-sm font-bold text-s-navy mb-1.5"
              >
                <Briefcase className="w-4 h-4 text-s-pink" />
                Görevi / Unvanı
              </label>
              <select
                id="title"
                name="title"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value as ValidTitle)}
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60 font-semibold"
              >
                {VALID_TITLES.map((t) => (
                  <option key={t} value={t}>
                    {t} {t === 'Topluluk Yönetim Kurulu Üyesi' ? '(Otomatik EDITÖR)' : '(Otomatik ADMIN)'}
                  </option>
                ))}
              </select>

              {/* Dinamik Yetki Bilgi Rozeti */}
              <div className="mt-2 p-2.5 bg-slate-50 border border-s-navy text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-s-navy">
                  <ShieldCheck className="w-3.5 h-3.5 text-s-blue" />
                  Sistem Yetkisi:{' '}
                  <span
                    className={`px-1.5 py-0.2 border border-s-navy font-black ${
                      selectedTitle === 'Topluluk Yönetim Kurulu Üyesi'
                        ? 'bg-s-blue text-white'
                        : 'bg-s-pink text-white'
                    }`}
                  >
                    {selectedTitle === 'Topluluk Yönetim Kurulu Üyesi' ? 'EDITOR' : 'ADMIN'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {selectedTitle === 'Topluluk Yönetim Kurulu Üyesi'
                    ? 'İçerik, etkinlik ve sözlük modüllerini düzenleyebilir; ekip yönetim yetkisi bulunmaz.'
                    : 'Tüm yönetim paneline tam erişir, ekip üyesi ekleyip silebilir.'}
                </p>
              </div>
            </div>

            {/* E-posta Adresi */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-1.5 text-sm font-bold text-s-navy mb-1.5"
              >
                <Mail className="w-4 h-4 text-emerald-500" />
                E-Posta Adresi
                <span className="text-xs font-normal text-slate-400">(opsiyonel)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@karatay.edu.tr (boşsa oto üretilir)"
                disabled={isPending}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
            </div>

            {/* Şifreleme Bilgi Bandı */}
            <div className="p-3 bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">İlk Giriş Şifresi: 123456</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Yeni üye ilk girişinde zorunlu olarak kendi özel şifresini belirleyecektir.
                </p>
              </div>
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-emerald-300 hover:bg-s-navy text-s-navy hover:text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Ekibe Ekle</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* ── SAĞ: Mevcut Ekip Listesi ── */}
        <section className="lg:col-span-3">
          <div className="bg-white border-2 border-s-navy shadow-brutal">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-s-navy">
              <h2 className="text-lg font-bold text-s-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-s-blue" />
                Kayıtlı Ekip Üyeleri ({members.length})
              </h2>
            </div>

            <div className="divide-y-2 divide-s-navy/20">
              {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                  <div className="w-14 h-14 bg-slate-100 border-2 border-s-navy flex items-center justify-center">
                    <UserRound className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-s-navy">Henüz kayıtlı üye bulunmuyor</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Sol formu kullanarak ilk ekip üyesini ekleyin.
                    </p>
                  </div>
                </div>
              ) : (
                members.map((member) => {
                  const firstLetter = member.name.charAt(0).toUpperCase();
                  const isAdmin = member.role === 'ADMIN';

                  return (
                    <div
                      key={member.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Avatar */}
                        <div
                          className={`w-11 h-11 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black text-s-navy text-lg shrink-0 ${
                            isAdmin ? 'bg-s-pink text-white' : 'bg-s-yellow'
                          }`}
                        >
                          {firstLetter}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-s-navy text-sm sm:text-base">
                              {member.name}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 border border-s-navy shadow-[1px_1px_0px_#11375C] ${
                                isAdmin
                                  ? 'bg-s-pink text-white'
                                  : 'bg-s-blue text-white'
                              }`}
                            >
                              {isAdmin ? 'ADMIN' : 'EDITÖR'}
                            </span>
                            {member.mustChangePassword ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-400">
                                İlk Giriş Bekleniyor
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400">
                                Şifre Değiştirildi
                              </span>
                            )}
                          </div>

                          <div className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{member.title || 'Topluluk Yönetim Kurulu Üyesi'}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sil Butonu (Kendisi hariç) */}
                      {currentUser?.userId !== member.id && (
                        <button
                          type="button"
                          onClick={() => handleDelete(member.id, member.name)}
                          disabled={deletingId === member.id}
                          aria-label={`${member.name} üyesini sil`}
                          className="shrink-0 p-2 sm:px-3 sm:py-2 bg-white hover:bg-red-500 text-s-navy hover:text-white border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === member.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">Sil</span>
                        </button>
                      )}
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
