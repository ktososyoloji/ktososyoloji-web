export const VALID_TITLES = [
  'Danışman Hoca',
  'Topluluk Başkanı',
  'Topluluk Başkan Yardımcısı',
  'Topluluk Yönetim Kurulu Üyesi',
] as const;

export type ValidTitle = (typeof VALID_TITLES)[number];

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  title: string;
  role: 'ADMIN' | 'EDITOR';
  mustChangePassword: boolean;
}

export function getRoleForTitle(title: string): 'ADMIN' | 'EDITOR' {
  switch (title) {
    case 'Danışman Hoca':
    case 'Topluluk Başkanı':
    case 'Topluluk Başkan Yardımcısı':
      return 'ADMIN';
    case 'Topluluk Yönetim Kurulu Üyesi':
    default:
      return 'EDITOR';
  }
}
