"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { loginAdminAction } from "@/lib/actions/team";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Prisma & Hash tabanlı yönetim girişi ve RBAC oturumu
      const form = new FormData();
      form.append("email", formData.email);
      form.append("password", formData.password);

      const res = await loginAdminAction(form);

      if (!res.success) {
        setError(res.error || "E-posta adresi veya şifre hatalı.");
        setIsLoading(false);
        return;
      }

      // 2. İsteğe bağlı: Supabase auth oturumunu da senkronize başlatmayı dene
      try {
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      } catch {
        // Supabase tarafında kullanıcı doğrudan mevcut değilse veya e-posta onayı bekliyorsa sessizce geç
      }

      // 3. İlk girişte zorunlu şifre değiştirme yönlendirmesi
      if (res.mustChangePassword) {
        router.push("/admin/change-password");
      } else {
        router.push("/admin");
      }
      router.refresh();
    } catch {
      setError("Giriş yapılırken beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8">
        {/* Başlık ve İkon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-s-yellow border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-s-navy" />
          </div>
          <h1 className="text-2xl font-bold text-s-navy tracking-tight">
            Yönetici & Editör Girişi
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            KTO Sosyoloji Topluluğu Yönetim Paneli
          </p>
        </div>

        {/* Hata Mesajı Kutucuğu */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-3 bg-red-50 border-2 border-red-500 text-red-800 text-sm font-medium flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-s-navy mb-1"
            >
              E-posta Adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ornek@karatay.edu.tr"
              disabled={isLoading}
              className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-s-navy mb-1"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full px-3 py-2.5 bg-white border-2 border-s-navy text-s-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-s-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            />
          </div>



          {/* Gönder Butonu */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-s-blue hover:bg-s-navy text-white font-bold border-2 border-s-navy shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Doğrulanıyor...</span>
              </>
            ) : (
              <span>Giriş Yap</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
