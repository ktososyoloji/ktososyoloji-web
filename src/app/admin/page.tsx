import {
  Calendar,
  FileText,
  BookOpen,
  Users,
  PenTool,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";

interface DashboardModule {
  title: string;
  description: string;
  icon: typeof Calendar;
  href: string;
  badgeColor: string;
  adminOnly?: boolean;
}

const DASHBOARD_MODULES: DashboardModule[] = [
  {
    title: "Etkinlik Yönetimi",
    description:
      "Yaklaşan ve geçmiş topluluk etkinliklerini ekleyin, afiş ve katılım formlarını yönetin.",
    icon: Calendar,
    href: "/admin/events",
    badgeColor: "bg-s-yellow",
  },
  {
    title: "İçerik Yönetimi",
    description:
      "Kitap incelemeleri, film tahlilleri, denemeler ve röportaj içeriklerini yayınlayın.",
    icon: FileText,
    href: "/admin/content",
    badgeColor: "bg-s-blue",
  },
  {
    title: "Köşe Yazıları",
    description:
      "Topluluk yazarları ve araştırmacıların kaleme aldığı köşe yazılarını yayınlayın.",
    icon: PenTool,
    href: "/admin/columns",
    badgeColor: "bg-emerald-300",
  },
  {
    title: "Sözlük Yönetimi",
    description:
      "Sosyolojik kavramları, kuramcı tanımlarını ve sözlük maddelerini düzenleyin.",
    icon: BookOpen,
    href: "/admin/dictionary",
    badgeColor: "bg-s-pink",
  },
  {
    title: "Ekip / Kullanıcılar",
    description:
      "Yönetici ve editör hesaplarını görüntüleyin, yetkilendirmeleri kontrol edin.",
    icon: Users,
    href: "/admin/team",
    badgeColor: "bg-purple-300",
    adminOnly: true,
  },
];

export default async function AdminDashboardPage() {
  const session = await getSession();
  const isEditor = session?.role === "EDITOR";

  // Editör rolü için Ekip Yönetimi modülünü gizle
  const availableModules = isEditor
    ? DASHBOARD_MODULES.filter((m) => !m.adminOnly)
    : DASHBOARD_MODULES;

  return (
    <div className="space-y-8">
      {/* Karşılama Başlığı */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
          Hoş Geldiniz 👋 {session ? `${session.name}` : ""}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          KTO Sosyoloji Topluluğu yönetim merkezindesiniz. Aşağıdaki modülleri kullanarak web sitesinin tüm dinamik içeriklerini yönetebilirsiniz.
        </p>
      </div>

      {/* Modül Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableModules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.title}
              className="bg-white border-2 border-s-navy shadow-brutal p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div
                  className={`w-12 h-12 ${module.badgeColor} border-2 border-s-navy shadow-[2px_2px_0px_0px_#11375C] flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-s-navy" />
                </div>
                <h2 className="text-lg font-bold text-s-navy tracking-tight mb-2">
                  {module.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {module.description}
                </p>
              </div>

              <Link
                href={module.href}
                className="inline-flex items-center justify-between w-full px-3 py-2 bg-slate-50 hover:bg-s-navy hover:text-white text-s-navy font-bold text-xs sm:text-sm border-2 border-s-navy transition-colors group"
              >
                <span>Yönet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
