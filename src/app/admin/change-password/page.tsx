'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ShieldAlert, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { changePasswordAction } from '@/lib/actions/team';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Yeni şifreler birbiriyle uyuşmuyor.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (formData.newPassword === '123456') {
      setError('Lütfen varsayılan "123456" şifresinden farklı, güvenli bir şifre belirleyin.');
      return;
    }

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append('currentPassword', formData.currentPassword);
      form.append('newPassword', formData.newPassword);
      form.append('confirmPassword', formData.confirmPassword);

      const result = await changePasswordAction(form);

      if (!result.success) {
        setError(result.error || 'Şifre güncellenirken bir hata oluştu.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch {
      setError('Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-[80vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8">
        
        {/* İkon ve Başlık */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center mb-3">
            <KeyRound className="w-7 h-7 text-s-navy" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-s-pink text-white border border-s-navy mb-2 shadow-[1px_1px_0px_#11375C]">
            İlk Giriş Zorunluluğu
          </span>
          <h1 className="text-2xl font-black text-s-navy tracking-tight">
            Şifrenizi Belirleyin
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs">
            Hesabınızın güvenliği için sistem tarafından atanan geçici şifrenizi (<strong>123456</strong>) yeni bir şifre ile güncelleyiniz.
          </p>
        </div>

        {/* Hata Bildirimi */}
        {error && (
          <div
            role="alert"
            className="mb-5 p-3 bg-red-50 border-2 border-red-500 text-red-800 text-xs sm:text-sm font-medium flex items-start gap-2"
          >
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Başarı Bildirimi */}
        {success && (
          <div
            role="status"
            className="mb-5 p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs sm:text-sm font-medium flex items-start gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Şifreniz başarıyla güncellendi! Yönetim paneline yönlendiriliyorsunuz...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mevcut Şifre */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-xs sm:text-sm font-bold text-s-navy mb-1"
            >
              Mevcut Şifre (Geçici)
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="123456"
                disabled={isLoading || success}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Yeni Şifre */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs sm:text-sm font-bold text-s-navy mb-1"
            >
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="En az 6 karakter"
                disabled={isLoading || success}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Yeni Şifre Tekrar */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs sm:text-sm font-bold text-s-navy mb-1"
            >
              Yeni Şifre (Tekrar)
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Yeni şifrenizi tekrar girin"
                disabled={isLoading || success}
                className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors text-sm disabled:opacity-60"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Gönder Butonu */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-3 px-4 bg-emerald-300 hover:bg-s-navy text-s-navy hover:text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Güncelleniyor...</span>
              </>
            ) : (
              <span>Şifremi Güncelle ve Panele Geç</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
