# 🏛️ KTO Sosyoloji Topluluğu Web Platformu (sosyo-site)

> *"Toplumu anlamak, dünyaya farklı bir gözle bakmak."*

KTO Karatay Üniversitesi Sosyoloji Topluluğu'nun kurumsal kimliğini, etkinliklerini, akademik ve kültürel yayınlarını dijital ortama taşıyan; topluluk üyeleri ve ziyaretçiler için geliştirilmiş modern, dinamik ve tam teşekküllü web platformu.

---

## 📌 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Proje Mimarisi ve Klasör Yapısı](#-proje-mimarisi-ve-klasör-yapısı)
- [Veritabanı Şeması ve Modeller](#-veritabanı-şeması-ve-modeller)
- [Yetkilendirme ve Roller](#-yetkilendirme-ve-roller)
- [Başlangıç ve Kurulum](#-başlangıç-ve-kurulum)
- [Ortam Değişkenleri (.env)](#-ortam-değişkenleri-env)
- [Kullanılabilir Komutlar](#-kullanılabilir-komutlar)
- [Yönetim Paneli Kullanımı](#-yönetim-paneli-kullanımı)
- [Katkıda Bulunma](#-katkıda-bulunma)

---

## ✨ Özellikler

### 🌐 Ziyaretçi Deneyimi (Kullanıcı Arayüzü)
- **Dinamik Anasayfa:** Öne çıkan hero kaydırıcı (slider), yaklaşan ve geçmiş etkinlikler, "Günün Sosyoloji Kavramı", son yayınlanan köşe yazıları ve güncel kültürel içerikler.
- **Etkinlik Takvimi (`/etkinlikler`):** Topluluk seminerleri, paneller, atölyeler ve buluşmaların tarihi, konumu, açıklaması ve kayıt formu entegrasyonu (`formUrl`).
- **Köşe Yazıları (`/kose-yazilari`):** Topluluk üyeleri ve akademisyenlerin kaleme aldığı sosyolojik makaleler, denemeler ve görüş yazıları (SEO dostu slug altyapısı ile).
- **Kültürel & Akademik İçerikler (`/icerikler`):**
  - 📚 Kitap İncelemeleri (`BOOK`)
  - 🎬 Film & Belgesel Değerlendirmeleri (`MOVIE`)
  - ✍️ Makale & Denemeler (`ESSAY`)
  - 🎙️ Röportajlar (`INTERVIEW`)
- **Sosyoloji Sözlüğü (`/sozluk`):** Temel ve ileri düzey sosyolojik kavramları, terimleri ve kuramsal açıklamaları barındıran aranabilir dijital sözlük.
- **Hakkımızda (`/hakkimizda`):** Topluluğun misyonu, vizyonu, danışman hoca, yönetim kurulu ve ekip tanıtımları.
- **İletişim (`/iletisim`):** Topluluğa ulaşım kanalları ve aktif sosyal medya yönlendirmeleri.

### 🛡️ Yönetim Paneli (`/admin`)
- **Güvenli Kimlik Doğrulama:** Oturum yönetimi, şifreli kimlik bilgileri ve zorunlu ilk giriş şifre değişimi mekanizması (`mustChangePassword`).
- **Rol Tabanlı Erişim:** `ADMIN` ve `EDITOR` düzeyinde yetki ayrımları.
- **Etkinlik Yönetimi:** Yeni etkinlik girişi, tarih/konum bilgisi, katılım bağlantısı, kapak görseli ve taslak/yayın durumu kontrolü.
- **İçerik Yönetimi:** Türüne göre filtrelenebilir zengin içerik ve yazı editörü.
- **Köşe Yazısı Yönetimi:** Yazı gövdesi, özet ve yazar profili düzenleme.
- **Sözlük Yönetimi:** Terim ve tanımların doğrudan sisteme eklenip güncellenmesi.
- **Ekip Yönetimi:** Yönetim kurulu üyelerinin unvanları, yetki rolleri ve erişim durumlarının yönetimi.

---

## 🛠️ Teknoloji Yığını

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router mimarisi, React Server Components (RSC) ve Server Actions |
| **Kütüphane** | [React 19](https://react.dev/) | En güncel React çekirdeği |
| **Veritabanı & ORM**| [PostgreSQL](https://www.postgresql.org/) & [Prisma 6](https://www.prisma.io/) | Tip güvenli sorgular, migration ve bağlantı havuzu desteği |
| **Bulut Veritabanı / Auth** | [Supabase](https://supabase.com/) | PostgreSQL altyapısı ve Supabase JS istemcisi |
| **Stil & Tasarım** | [Tailwind CSS v4](https://tailwindcss.com/) | Özelleştirilmiş renk paleti (`s-yellow`, `s-pink`, `s-blue`, `s-navy`) ile modern, estetik neo-brutalist / editoryal tipografi |
| **İkon Seti** | [Lucide React](https://lucide.dev/) | Modern ve hafif SVG ikon seti |
| **Tip Güvenliği** | [TypeScript](https://www.typescriptlang.org/) | Uçtan uca tip güvenliği |

---

## 📂 Proje Mimarisi ve Klasör Yapısı

```text
sosyo-site/
├── .env.example              # Çevre değişkenleri şablonu
├── prisma/
│   └── schema.prisma         # Prisma veritabanı şeması ve modelleri
├── public/                   # Statik medya ve görseller
├── src/
│   ├── app/                  # Next.js App Router sayfaları
│   │   ├── (public)/         # Ziyaretçi arayüzü
│   │   │   ├── page.tsx      # Anasayfa
│   │   │   ├── etkinlikler/  # Etkinlik sayfaları
│   │   │   ├── hakkimizda/   # Ekip ve topluluk bilgileri
│   │   │   ├── icerikler/    # Kitap, film, deneme ve röportajlar
│   │   │   ├── kose-yazilari/# Köşe yazıları ve yazı detayları
│   │   │   ├── sozluk/       # Sosyoloji sözlüğü
│   │   │   └── iletisim/     # İletişim sayfası
│   │   ├── admin/            # Yönetim Paneli
│   │   │   ├── login/        # Giriş sayfası
│   │   │   ├── events/       # Etkinlik yönetimi
│   │   │   ├── content/      # İçerik yönetimi
│   │   │   ├── columns/      # Köşe yazıları yönetimi
│   │   │   ├── dictionary/   # Sözlük yönetimi
│   │   │   ├── team/         # Ekip & yetki yönetimi
│   │   │   └── change-password/ # Şifre güncelleme
│   │   ├── layout.tsx        # Kök Layout (Navbar & Footer)
│   │   └── globals.css       # Tailwind CSS stilleri
│   ├── components/           # UI Bileşenleri
│   │   ├── home/             # Anasayfa özel bileşenleri (HeroSlider vb.)
│   │   ├── layout/           # Navbar, Footer ve ortak iskeletler
│   │   └── ui/               # Yeniden kullanılabilir atomik arayüz öğeleri
│   └── lib/                  # Yardımcı fonksiyonlar ve iş mantığı
│       ├── actions/          # Server Actions (CRUD işlemleri)
│       │   ├── events.ts     # Etkinlik sunucu aksiyonları
│       │   ├── content.ts    # İçerik sunucu aksiyonları
│       │   ├── columns.ts    # Köşe yazısı sunucu aksiyonları
│       │   ├── dictionary.ts # Sözlük sunucu aksiyonları
│       │   └── team.ts       # Ekip sunucu aksiyonları
│       ├── auth.ts           # Oturum ve kimlik doğrulama kontrolleri
│       ├── prisma.ts         # Prisma Client tekil örneği (Singleton)
│       ├── team-constants.ts # Ekip unvanları ve yetki eşleştirmeleri
│       └── utils.ts          # Slugify ve formatlama yardımcıları
└── package.json
```

---

## 🗄️ Veritabanı Şeması ve Modeller

Uygulama `prisma/schema.prisma` üzerinde tanımlanmış ilişkisel modellere dayanır:

- **`User`**: Admin ve editör kullanıcı hesapları.
  - `role`: `ADMIN` | `EDITOR`
  - `title`: `Danışman Hoca`, `Topluluk Başkanı`, `Topluluk Başkan Yardımcısı`, `Topluluk Yönetim Kurulu Üyesi`
  - `mustChangePassword`: İlk girişte şifre yenileme kontrolü
- **`Event`**: Topluluk etkinlikleri (başlık, açıklama, tarih, konum, afiş görseli, kayıt formu linki, yayın durumu).
- **`Content`**: Kültürel & akademik içerikler.
  - `type`: `BOOK` (Kitap), `MOVIE` (Film), `ESSAY` (Deneme), `INTERVIEW` (Röportaj)
- **`ColumnArticle`**: Köşe yazıları (başlık, benzersiz `slug`, özet, zengin metin gövdesi, yazar bilgileri, yayın durumu).
- **`Dictionary`**: Sosyolojik terim ve kavramların açıklamaları.

---

## 👥 Yetkilendirme ve Roller

Sistem iki temel rol ile yönetilir:

| Unvan | Rol | Yetki Kapsamı |
| :--- | :---: | :--- |
| **Danışman Hoca** | `ADMIN` | Tam yetki: İçerik, Etkinlik, Sözlük, Köşe Yazısı ve Ekip/Yetki Yönetimi |
| **Topluluk Başkanı** | `ADMIN` | Tam yetki: Tüm panellere erişim ve kullanıcı düzenleme |
| **Topluluk Başkan Yardımcısı** | `ADMIN` | Tam yetki: Tüm panellere erişim ve kullanıcı düzenleme |
| **Topluluk Yönetim Kurulu Üyesi**| `EDITOR` | İçerik, etkinlik, köşe yazısı ve sözlük ekleme/düzenleme |

---

## 🚀 Başlangıç ve Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Gereksinimler
- **Node.js** (v18.18 veya üzeri önerilir)
- **npm**, **pnpm** veya **yarn**
- **Supabase / PostgreSQL** hesabı veya yerel PostgreSQL veritabanı

### 2. Depoyu Klonlayın
```bash
git clone https://github.com/kullanici-adi/sosyo-site.git
cd sosyo-site
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
```
*(Kurulum sonrası `prisma generate` otomatik olarak tetiklenir.)*

### 4. Ortam Değişkenlerini Tanımlayın
Kök dizindeki `.env.example` dosyasını `.env` adıyla kopyalayın:
```bash
cp .env.example .env
```
Ardından `.env` dosyasını kendi veritabanı ve Supabase bağlantı bilgilerinizle doldurun.

### 5. Veritabanını Senkronize Edin
Veritabanı tablolarını oluşturmak için:
```bash
npx prisma db push
```

### 6. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek platformu görüntüleyebilirsiniz.

---

## 🔑 Ortam Değişkenleri (.env)

| Değişken | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL bağlantı havuzu (Transaction-mode pooler) URL'i |
| `DIRECT_URL` | Doğrudan veritabanı bağlantısı (Migration ve şema güncellemeleri için) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Proje API adresi |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonim istemci anahtarı |

---

## 📜 Kullanılabilir Komutlar

- `npm run dev`: Geliştirme (development) sunucusunu başlatır.
- `npm run build`: Canlı ortam için optimize edilmiş üretim (production) derlemesini oluşturur.
- `npm run start`: Derlenmiş projeyi başlatır.
- `npm run lint`: ESLint kontrollerini çalıştırır.
- `npx prisma studio`: Prisma Studio web arayüzünü açarak veritabanı kayıtlarını görsel olarak yönetmenizi sağlar.

---

## 🔐 Yönetim Paneli Kullanımı

1. Tarayıcınızdan `/admin` veya `/admin/login` sayfasına gidin.
2. Yetkili kullanıcı e-postası ve şifresi ile oturum açın.
3. Hesabınızda `mustChangePassword` bayrağı aktifse, güvenlik gereği doğrudan `/admin/change-password` sayfasına yönlendirilirsiniz.
4. Şifrenizi güncelledikten sonra yetki seviyenize uygun olarak sol menü üzerinden Etkinlikler, Köşe Yazıları, İçerikler, Sözlük veya Ekip sayfalarına erişebilirsiniz.

---

## 🤝 Katkıda Bulunma

1. Bu depoyu çatallayın (Fork).
2. Yeni bir özellik dalı açın (`git checkout -b feature/yeni-ozellik`).
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Yeni özellik eklendi'`).
4. Dalınıza push yapın (`git push origin feature/yeni-ozellik`).
5. Bir **Pull Request (PR)** oluşturun.

---

## 📄 Lisans

Bu proje **KTO Karatay Üniversitesi Sosyoloji Topluluğu** adına geliştirilmiştir. Tüm hakları saklıdır.
