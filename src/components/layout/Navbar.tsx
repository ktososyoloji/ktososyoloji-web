"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/kose-yazilari", label: "Köşe Yazıları" },
  { href: "/icerikler", label: "İçerikler" },
  { href: "/sozluk", label: "Sözlük" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Admin paneli sayfalarında ziyaretçi menüsünü render etme
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-s-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Topluluk Başlığı */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-base sm:text-lg font-black tracking-tight text-s-navy hover:text-s-blue transition-colors flex items-center gap-2"
          >

            <div className="relative -mb-3 bg-white border-2 border-s-navy px-3 py-1 shadow-brutal">
              <img
                src="/logo.jpeg"
                className="h-14 md:h-16 w-auto object-contain"
                alt="logo"
              />
            </div>
          </Link>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Ana Menü">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors px-2 py-1 ${isActive
                    ? "bg-s-yellow text-s-navy border-2 border-s-navy shadow-[2px_2px_0px_#11375C]"
                    : "text-s-navy hover:text-s-pink"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobil Menü Butonu */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
              className="p-2 text-s-navy hover:text-s-blue focus:outline-none transition-colors border-2 border-s-navy shadow-[2px_2px_0px_#11375C]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Açılır Menü */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-s-navy bg-white px-4 pt-3 pb-5 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block py-2 px-3 text-sm font-bold border-2 border-s-navy transition-colors ${isActive
                  ? "bg-s-yellow text-s-navy shadow-[2px_2px_0px_#11375C]"
                  : "text-s-navy hover:bg-slate-50 hover:text-s-pink"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
