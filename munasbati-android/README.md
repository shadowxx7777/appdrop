# مناسباتي — مصدر تطبيق أندرويد 1.1

هذا المجلد يحوي صفحة التطبيق ومشروع Capacitor الذي ينتج APK بالهوية `com.shadow.occasions`. رقم النسخة 1.1 ورقم البناء 2.

## البناء

المتطلبات: Node.js وnpm، وJava 21، وAndroid SDK مع Android API 36 وBuild Tools 36.0.0.

```sh
npm ci
npm run android:release
```

مجلد `android/` موجود ضمن هذا المصدر، لذلك لا تشغّل `npx cap add android` أثناء إعادة البناء العادية. إذا حُذف مجلد Android، أنشئه مرة واحدة بهذا الأمر قبل البناء.

ينتج Gradle ملفًا غير موقّع في `android/app/build/outputs/apk/release/app-release-unsigned.apk`. لإعداد إصدار موقّع، استخدم المفتاح الخاص المحفوظ خارج Git ومتغيرات البيئة التي يقرأها `scripts/build-release.sh`. لا تضع المفتاح أو كلمة سره داخل المستودع أو في هذا الملف.

## الإشعارات

يستورد الجسر `@capacitor/local-notifications` صراحةً ثم يعرّضه إلى صفحة التطبيق، كي يعمل كود الإشعارات الأصلي مع Capacitor الحديث. يستمر كود الصفحة في تجاهل الإشعارات عند التشغيل على متصفح الويب. تتكرر إشعارات الميلاد والذكرى سنويًا (`every: 'year'`)، بينما تبقى المناسبة الخاصة مرة واحدة. يطلب التطبيق إذن الإشعارات عند أول جدولة على Android 13 وما بعده. لم نضف إذن المنبّه الدقيق تلقائيًا.

## الخطوط

أُضيفت أوزان Tajawal 400 و500 و700 و800 بصيغة WOFF2 إلى `www/fonts/` لتعمل الصفحة دون اتصال. يبقى رابط Google Fonts الاحتياطي كما ورد في ملف التحديث.

## مصادر رسمية

- [Android command-line tools وSDK packages](https://developer.android.com/tools)
- [Capacitor Android](https://capacitorjs.com/docs/android)
- [Capacitor Local Notifications](https://capacitorjs.com/docs/apis/local-notifications)
- [Google Fonts — Tajawal](https://fonts.google.com/specimen/Tajawal)
