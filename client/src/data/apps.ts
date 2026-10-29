export type AppItem = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  accent: string;
  platform: string;
  category: string;
  version: string;
  updatedAt: string;
  downloadUrl: string;
  screenshots: string[];
};

/**
 * أضف تطبيقاتك هنا، وضع الملفات القابلة للتنزيل داخل client/public/downloads/
 * أو استخدم رابط تنزيل مباشر في downloadUrl. أضف لقطات الشاشة من client/public/screenshots/.
 */
export const apps: AppItem[] = [];
