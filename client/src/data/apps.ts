export type AppItem = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  iconImage?: string;
  accent: string;
  platform: string;
  category: string;
  version: string;
  updatedAt: string;
  downloadUrl: string;
  screenshots: string[];
};

/** أضف تطبيقاتك وملفاتها في مجلد client/public/downloads/. */
export const apps: AppItem[] = [
  {
    slug: "munasbati",
    name: "مناسباتي ✨",
    shortDescription: "تطبيق أندرويد بصيغة APK.",
    description: "ملف APK لتطبيق مناسباتي على أندرويد.",
    icon: "✨",
    iconImage: "/app-icons/munasbati.png",
    accent: "#7650b5",
    platform: "Android",
    category: "مناسبات",
    version: "1.0",
    updatedAt: "غير محدد",
    downloadUrl: "/downloads/munasbati.apk",
    screenshots: [],
  },
];
