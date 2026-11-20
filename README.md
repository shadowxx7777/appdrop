# تطبيقات شادو — متجر التطبيقات

React / Express / tRPC / Drizzle starter, adapted from the Sandbox web-db-user template.

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.

## رفع APK وتحديث المتجر عبر CLI

بعد تثبيت المتطلبات وتسجيل الدخول إلى GitHub مرة واحدة على جهازك، ارفع أي إصدار جديد بهذا الأمر من جذر المستودع:

```sh
gh auth login
pnpm install
pnpm publish:apk --file ./talabatbayt-1.0.apk --slug talabatbayt --name "طلبات البيت" --version 1.0 --short-description "قائمة مشتريات العائلة المشتركة" --description "تطبيق بسيط يساعد أفراد العائلة على إضافة أغراض البيت وحجزها وإنهائها دون تكرار الشراء." --category "أدوات" --release-notes "الإصدار الأول من طلبات البيت."
```

يُنشىء الأمر GitHub Release عامًا في `appdrop`، ويرفع ملف APK باسمه القياسي، ثم يضيف التطبيق أو يحدّثه في `client/src/data/apps.ts`، ويبني نسخة GitHub Pages داخل `docs`، وينشئ commit ويدفعه إلى `main`. لا يحتاج السكربت إلى GitHub Token داخل ملف أو متغير بيئة؛ فهو يستخدم جلسة `gh` المحلية. اختر رقم إصدار جديدًا لكل رفع، لأن السكربت يرفض الكتابة فوق Release موجود.

للمعاينة دون رفع أو تعديل استخدم `--dry-run`، ولتحديث الملفات دون دفعها استخدم `--no-push`. وتظهر جميع الخيارات عبر:

```sh
pnpm publish:apk --help
```
