# إضافة تطبيق وإصدار جديد

يُرفع كل APK إلى GitHub Release في المستودع `shadowxx7777/appdrop`. لا يحتاج الموقع إلى خادم أو مفتاح API؛ يقرأ قائمة الإصدارات العامة مباشرة من GitHub، ويعرض أحدث إصدار وعدّاد تنزيل ملفه.

للتطبيق الحالي «مناسباتي ✨»، اسم ملف الإصدار هو `munasbati.apk`، ووسم الإصدار يبدأ بـ`munasbati-v` مثل `munasbati-v1.1`. ارفع ملف APK باسم `munasbati.apk`، واكتب ملاحظات الإصدار في وصف الـRelease؛ تظهر هذه الملاحظات في قسم **What's New**. يحفظ رابط التحميل المباشر عدّاد تنزيلات GitHub، ويشير رمز QR إلى ملف الإصدار نفسه.

لإضافة تطبيق آخر، أضف سجلًا إلى المصفوفة `apps` في `client/src/data/apps.ts`، مع `releaseTagPrefix` بصيغة `<slug>-v` و`releaseAssetName` المطابق تمامًا لاسم ملف APK. أضف أيضًا `fallbackReleaseUrl` إلى أول إصدار منشور للتطبيق. يمكن وضع نسخة احتياطية من الملف في `client/public/downloads/`، ولقطات الشاشة في `client/public/screenshots/`.

مثال لحقول الإصدار في سجل التطبيق:

```ts
{
  slug: "my-app",
  name: "اسم التطبيق",
  shortDescription: "وصف قصير يظهر في بطاقة المعرض.",
  description: "شرح مختصر للتطبيق.",
  icon: "✦",
  accent: "#7650b5",
  platform: "Android",
  category: "أدوات",
  version: "1.0",
  updatedAt: "غير محدد",
  downloadUrl: "/downloads/my-app.apk",
  releaseTagPrefix: "my-app-v",
  releaseAssetName: "my-app.apk",
  fallbackReleaseUrl: "https://github.com/shadowxx7777/appdrop/releases/download/my-app-v1.0/my-app.apk",
  screenshots: [],
}
```

الموقع يختار أحدث Release منشور غير تجريبي يطابق بادئة التطبيق، ويقرأ `download_count` للملف المطابق. الطلبات مباشرة من متصفح الزائر وبلا خادم؛ يحدّث الموقع النتيجة المخبأة محليًا كل دقيقة. GitHub يقيّد الطلبات العامة غير المسجّلة إلى 60 طلبًا في الساعة لكل عنوان IP، لذلك يعرض الموقع رابط الإصدار الاحتياطي عند تعذّر قراءة API.

عند إرسال APK جديد ومعلوماته وملاحظات الإصدار، أستطيع إضافة التطبيق أو تحديثه على الموقع نفسه.

## مراجع GitHub الرسمية

يعيد GitHub Releases API بيانات الإصدار ووسمه وملاحظاته ورابط كل ملف وعدّاد تنزيلاته. يمكن طلب الإصدارات العامة بلا تسجيل دخول، وتدعم واجهة GitHub API طلبات CORS من المتصفح. حد الطلبات العامة غير المسجّلة هو 60 طلبًا في الساعة لكل عنوان IP.

- [قائمة إصدارات GitHub وحقول Release assets](https://docs.github.com/en/rest/releases/releases)
- [ملفات الإصدارات والتنزيل عبر browser_download_url](https://docs.github.com/en/rest/releases/assets)
- [CORS وطلبات المتصفح إلى GitHub API](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests)
- [حدود طلبات REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
