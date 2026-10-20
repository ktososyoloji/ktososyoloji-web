import { Mail } from "lucide-react";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
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

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-s-navy text-white border-t-2 border-s-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Sol: Topluluk Bilgisi ve Telif Hakkı */}
          <div>
            <p className="font-semibold text-base tracking-wide">
              KTO Sosyoloji Topluluğu
            </p>
            <p className="text-xs text-slate-300 mt-1">
              &copy; {currentYear} Tüm hakları saklıdır.
            </p>
          </div>

          {/* Sağ: Sosyal Medya & İletişim Yer Tutucuları */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram sayfamız"
              className="p-2 rounded hover:text-s-pink transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="mailto:iletisim@ktosoyoloji.com"
              aria-label="E-posta gönder"
              className="p-2 rounded hover:text-s-yellow transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
