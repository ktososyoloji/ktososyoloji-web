"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { getCurrentAdminUser, logoutAdminAction } from "@/lib/actions/team";
import type { AuthSession } from "@/lib/team-constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/change-password";

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // 1. Prisma & Cookie tabanlı admin oturumunu kontrol et
        const adminUser = await getCurrentAdminUser();

        // 2. Supabase auth oturumunu kontrol et (varsa)
        const {
          data: { session: supabaseSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        const hasActiveSession = Boolean(adminUser || supabaseSession);

        if (!hasActiveSession && pathname !== "/admin/login") {
          router.replace("/admin/login");
          return;
        }

        if (adminUser) {
          setCurrentUser(adminUser);

          // İlk girişte zorunlu şifre değiştirme yönlendirmesi
          if (adminUser.mustChangePassword && pathname !== "/admin/change-password" && pathname !== "/admin/login") {
            router.replace("/admin/change-password");
            return;
          }
        } else if (supabaseSession?.user) {
          setCurrentUser({
            userId: supabaseSession.user.id,
            email: supabaseSession.user.email || "",
            name: (supabaseSession.user.user_metadata?.name as string) || "Yönetici",
            title: "Topluluk Yöneticisi",
            role: "ADMIN",
            mustChangePassword: false,
          });
        }
      } catch {
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();
  }, [router, pathname]);

  // Login veya Şifre Değiştirme sayfasındaysa admin üst barını gösterme
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Oturum kontrol edilirken gösterilecek yükleniyor ekranı
  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
        <p className="text-sm font-semibold text-s-navy">Oturum ve yetki kontrol ediliyor...</p>
      </div>
    );
  }

  // Oturum yoksa yönlendirme gerçekleşene kadar boş dön
  if (!currentUser) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await logoutAdminAction();
      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/login");
    }
  };

  const isAdmin = currentUser.role === "ADMIN";

  return (
    <div className="min-h-full flex-1 flex flex-col bg-slate-50">
      {/* Admin Üst Çubuğu */}
      <header className="bg-white border-b-2 border-s-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Sol: Başlık / Pano Linki */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-s-pink border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-s-navy" />
              </div>
              <Link
                href="/admin"
                className="text-lg font-bold text-s-navy hover:text-s-blue transition-colors flex items-center gap-2"
              >
                <span>Yönetim Paneli</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 border border-s-navy ${
                    isAdmin ? "bg-s-pink text-white" : "bg-s-blue text-white"
                  }`}
                >
                  {currentUser.role}
                </span>
              </Link>
            </div>

            {/* Sağ: Kullanıcı Bilgisi & Çıkış Yap Butonu */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-s-navy leading-none">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {currentUser.title || currentUser.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-s-pink hover:bg-rose-500 text-s-navy hover:text-white text-xs sm:text-sm font-bold border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin İçerik Alanı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {children}
      </main>
    </div>
  );
}
