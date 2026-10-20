'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  ChevronRight,
  LayoutDashboard,
  UserRound,
  Loader2,
  RefreshCw,
  MailOpen,
  AlertCircle,
} from 'lucide-react';
import {
  getMessages,
  deleteMessage,
  markAsRead,
} from '@/lib/actions/contact';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
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
        <Inbox className="w-4 h-4" />
        Gelen Mesajlar
      </span>
    </nav>
  );
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAllMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data as MessageItem[]);
    } catch {
      setErrorMessage('Mesajlar yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    setErrorMessage(null);
    try {
      const res = await markAsRead(id, !currentStatus);
      if (!res.success) {
        setErrorMessage(
          typeof res.error === 'string'
            ? res.error
            : 'Mesaj durumu güncellenemedi.'
        );
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, isRead: !currentStatus } : msg
        )
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'İşlem sırasında bir hata oluştu.'
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" adlı kullanıcının mesajını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMessage(null);
    try {
      const res = await deleteMessage(id);
      if (!res.success) {
        setErrorMessage(
          typeof res.error === 'string'
            ? res.error
            : 'Mesaj silinemedi.'
        );
        return;
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Silme işlemi sırasında hata oluştu.'
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-s-blue" />
          <p className="text-sm font-semibold text-s-navy">Gelen kutusu yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* ── Üst Bar / Başlık Kartı ── */}
      <div className="bg-white border-2 border-s-navy shadow-brutal p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-300 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6 text-s-navy" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-s-navy tracking-tight">
              Gelen Kutusu & İletişim Mesajları
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              İletişim formundan ziyaretçilerin gönderdiği soruları, önerileri ve talepleri yönetin.
            </p>
          </div>
        </div>

        {/* Sayaç Rozetleri */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fetchAllMessages}
            title="Yenile"
            className="p-2 bg-white hover:bg-slate-100 text-s-navy border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="px-3 py-1.5 bg-s-yellow border-2 border-s-navy text-xs font-black text-s-navy shadow-[2px_2px_0px_#11375C]">
            Toplam: {totalCount}
          </span>
          <span className="px-3 py-1.5 bg-s-pink text-white border-2 border-s-navy text-xs font-black shadow-[2px_2px_0px_#11375C]">
            {unreadCount} Okunmamış
          </span>
        </div>
      </div>

      {/* Hata Bildirimi */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-red-50 border-2 border-red-500 text-red-900 text-sm font-semibold flex items-start gap-2.5 shadow-[2px_2px_0px_#11375C]"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* ── Mesaj Listesi ── */}
      {messages.length === 0 ? (
        <div className="bg-white border-2 border-s-navy shadow-brutal p-12 sm:p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-amber-100 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center mb-4 text-amber-700">
            <Inbox className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-s-navy">Gelen kutunuz boş</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
            Henüz iletişim formundan iletilen herhangi bir mesaj veya öneri bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const createdAtDate = new Date(msg.createdAt);
            const isActing = actionLoadingId === msg.id;

            return (
              <article
                key={msg.id}
                className={`bg-white border-2 border-s-navy shadow-brutal transition-all ${
                  msg.isRead ? 'opacity-90' : 'ring-2 ring-s-blue/40'
                }`}
              >
                {/* Kart Üst Bilgisi */}
                <div className="p-4 sm:p-5 border-b-2 border-s-navy/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 border-2 border-s-navy shadow-[2px_2px_0px_#11375C] flex items-center justify-center font-black shrink-0 ${
                        msg.isRead
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-s-yellow text-s-navy'
                      }`}
                    >
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-s-navy text-sm sm:text-base">
                          {msg.name}
                        </span>
                        {msg.isRead ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300">
                            Okundu
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-300 text-s-navy border border-s-navy shadow-[1px_1px_0px_#11375C] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                            Yeni Mesaj
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-s-blue shrink-0" />
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-s-blue underline truncate"
                        >
                          {msg.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Tarih */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 sm:self-center">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {createdAtDate.toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Mesaj Gövdesi */}
                <div className="p-5 sm:p-6">
                  <div className="bg-[#FAF9F5] border border-s-navy/30 p-4 text-xs sm:text-sm text-s-navy leading-relaxed whitespace-pre-line font-medium">
                    {msg.message}
                  </div>
                </div>

                {/* Alt Aksiyon Çubuğu */}
                <div className="px-5 py-3 border-t-2 border-s-navy/20 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isActing}
                    onClick={() => handleToggleRead(msg.id, msg.isRead)}
                    className="px-3 py-1.5 bg-white hover:bg-s-yellow text-s-navy text-xs font-bold border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isActing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : msg.isRead ? (
                      <Mail className="w-3.5 h-3.5 text-s-blue" />
                    ) : (
                      <MailOpen className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>
                      {msg.isRead
                        ? 'Okunmadı Olarak İşaretle'
                        : 'Okundu Olarak İşaretle'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isActing}
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="px-3 py-1.5 bg-white hover:bg-red-500 text-s-navy hover:text-white text-xs font-bold border-2 border-s-navy shadow-[2px_2px_0px_#11375C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isActing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 text-red-600 hover:text-white" />
                    )}
                    <span>Sil</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
