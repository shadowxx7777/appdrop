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
const publicAsset = (path: string) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};

const appData: AppItem[] = [
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

export const apps: AppItem[] = appData.map((app) => ({
  ...app,
  iconImage: app.iconImage ? publicAsset(app.iconImage) : undefined,
  downloadUrl: app.downloadUrl ? publicAsset(app.downloadUrl) : "",
  screenshots: app.screenshots.map(publicAsset),
}));
