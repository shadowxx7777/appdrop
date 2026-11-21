export type AppItem = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  installNotice?: string;
  icon: string;
  iconImage?: string;
  accent: string;
  platform: string;
  category: string;
  version: string;
  updatedAt: string;
  downloadUrl: string;
  directDownloadUrl?: string;
  releaseTagPrefix: string;
  releaseAssetName: string;
  fallbackReleaseUrl: string;
  screenshots: string[];
};

/** أضف بيانات التطبيقات هنا، واحفظ ملفات التنزيل الاحتياطية في client/public/downloads/. */
const publicAsset = (path: string) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};

const appData: AppItem[] = [
  {
    slug: "munasbati",
    name: "مناسباتي ✨",
    shortDescription: "أعياد الميلاد والذكريات والمناسبات في مكان واحد.",
    description: "أعياد الميلاد والذكريات السنوية والمناسبات الخاصة، مع تنبيهات محلية متكررة.",
    installNotice: "الإصدار 1.1 موقّع بمفتاح جديد ولا يمكن تثبيته فوق الإصدار 1.0. احذف النسخة القديمة أولًا؛ حذف التطبيق يمسح المناسبات والحسابات المحفوظة على هذا الجهاز.",
    icon: "✨",
    iconImage: "/app-icons/munasbati.png",
    accent: "#7650b5",
    platform: "Android",
    category: "مناسبات",
    version: "1.1",
    updatedAt: "15 نوفمبر 2026",
    downloadUrl: "https://github.com/shadowxx7777/appdrop/releases/download/munasbati-v1.1/munasbati-v1.1.apk",
    releaseTagPrefix: "munasbati-v",
    releaseAssetName: "munasbati-v1.1.apk",
    fallbackReleaseUrl: "https://github.com/shadowxx7777/appdrop/releases/download/munasbati-v1.1/munasbati-v1.1.apk",
    screenshots: [],
  },
  {
    slug: "talabatbayt",
    name: "طلبات البيت",
    shortDescription: "عرض أفضل لأعضاء المجموعة",
    description: "تحسين واجهة أعضاء المجموعة بعرض الأسماء والأدوار وحالة الاتصال وعدد الأعضاء بشكل واضح ومتجاوب مع الهاتف والويب.",
    icon: "🛒",
    accent: "#8d6bd1",
    platform: "Android",
    category: "أدوات",
    version: "1.13",
    updatedAt: "21 نوفمبر 2026",
    directDownloadUrl: "/downloads/talabatbayt.apk",
    downloadUrl: "https://github.com/shadowxx7777/appdrop/releases/download/talabatbayt-v1.13/talabatbayt-v1.13.apk",
    releaseTagPrefix: "talabatbayt-v",
    releaseAssetName: "talabatbayt-v1.13.apk",
    fallbackReleaseUrl: "https://github.com/shadowxx7777/appdrop/releases/download/talabatbayt-v1.13/talabatbayt-v1.13.apk",
    screenshots: [],
  },
];

export const apps: AppItem[] = appData.map((app) => ({
  ...app,
  iconImage: app.iconImage ? publicAsset(app.iconImage) : undefined,
  downloadUrl: app.downloadUrl ? publicAsset(app.downloadUrl) : "",
  fallbackReleaseUrl: app.fallbackReleaseUrl ? publicAsset(app.fallbackReleaseUrl) : "",
  screenshots: app.screenshots.map(publicAsset),
}));
