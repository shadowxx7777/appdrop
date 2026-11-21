#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPS_FILE = path.join(ROOT, "client/src/data/apps.ts");
const OWNER = "shadowxx7777";
const REPO = "appdrop";

function fail(message) {
  console.error(`\nخطأ: ${message}`);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") args.help = true;
    else if (token === "--dry-run") args.dryRun = true;
    else if (token === "--no-push") args.noPush = true;
    else if (token === "--skip-build") args.skipBuild = true;
    else if (token.startsWith("--")) {
      const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`القيمة مفقودة للخيار ${token}`);
      args[key] = value;
      i += 1;
    } else {
      throw new Error(`خيار غير معروف: ${token}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`
رفع إصدار APK إلى متجر تطبيقات شادو

الاستخدام:
  pnpm publish:apk --file ./app.apk --slug my-app --name "اسم التطبيق" --version 1.0

الخيارات المطلوبة:
  --file PATH                 ملف APK المحلي
  --slug SLUG                 معرف التطبيق بالإنجليزية، مثل talabatbayt
  --name NAME                 اسم التطبيق الظاهر في المتجر
  --version VERSION           رقم الإصدار، مثل 1.0

خيارات اختيارية:
  --short-description TEXT    الوصف القصير في بطاقة المتجر
  --description TEXT          الوصف في صفحة التفاصيل
  --category TEXT             التصنيف، الافتراضي: أدوات
  --icon TEXT                 رمز نصي، الافتراضي: ✦
  --accent COLOR              اللون، الافتراضي: #7650b5
  --icon-image PATH           مسار صورة الأيقونة داخل client/public
  --install-notice TEXT       تنبيه يظهر قبل التثبيت
  --release-notes TEXT        ملاحظات الإصدار في GitHub Release
  --dry-run                   عرض ما سيحدث دون رفع أو تعديل أو دفع
  --no-push                   نفّذ التعديل والبناء دون git push
  --skip-build                لا تعِد بناء GitHub Pages

المتطلبات:
  gh auth login               نفّذها مرة واحدة على جهازك فقط إذا لم يكن gh مسجلًا.
  pnpm install

مثال تحديث تطبيق موجود:
  pnpm publish:apk --file ./talabatbayt-1.0.apk --slug talabatbayt --name "طلبات البيت" --version 1.0 --short-description "قائمة مشتريات العائلة المشتركة" --category "أدوات"
`);
}

function shell(command, args, options = {}) {
  const output = execFileSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    env: options.env ? { ...process.env, ...options.env } : process.env,
    stdio: options.silent ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  return typeof output === "string" ? output.trim() : "";
}

function quote(value) {
  return JSON.stringify(value);
}

function replaceField(block, key, value, { array = false } = {}) {
  const line = `    ${key}: ${array ? `[${value.map(quote).join(", ")}]` : quote(value)},`;
  const pattern = new RegExp(`^    ${key}:.*$`, "m");
  if (pattern.test(block)) return block.replace(pattern, line);
  return `${block}\n${line}`;
}

function removeField(block, key) {
  return block.replace(new RegExp(`^    ${key}:.*\\n`, "m"), "");
}

function findAppBlocks(source) {
  const start = source.indexOf("const appData: AppItem[] = [");
  const end = source.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error("تعذر تحديد مصفوفة التطبيقات في apps.ts");
  const body = source.slice(start, end);
  const matches = [];
  const objectPattern = /^  \{[\s\S]*?^  \},?$/gm;
  let match;
  while ((match = objectPattern.exec(body))) {
    matches.push({ start: start + match.index, end: start + match.index + match[0].length, text: match[0] });
  }
  return { start, end, matches };
}

function buildAppBlock(options, releaseUrl, releaseAssetName, updatedAt) {
  const iconImage = options.iconImage ? `\n    iconImage: ${quote(options.iconImage)},` : "";
  const installNotice = options.installNotice ? `\n    installNotice: ${quote(options.installNotice)},` : "";
  return `  {\n    slug: ${quote(options.slug)},\n    name: ${quote(options.name)},\n    shortDescription: ${quote(options.shortDescription || options.description || options.name)},\n    description: ${quote(options.description || options.shortDescription || options.name)},${installNotice}\n    icon: ${quote(options.icon || "✦")},${iconImage}\n    accent: ${quote(options.accent || "#7650b5")},\n    platform: "Android",\n    category: ${quote(options.category || "أدوات")},\n    version: ${quote(options.version)},\n    updatedAt: ${quote(updatedAt)},\n    downloadUrl: ${quote(releaseUrl)},\n    releaseTagPrefix: ${quote(`${options.slug}-v`)},\n    releaseAssetName: ${quote(releaseAssetName)},\n    fallbackReleaseUrl: ${quote(releaseUrl)},\n    screenshots: [],\n  },`;
}

function updateAppsFile(options, releaseUrl, releaseAssetName, updatedAt) {
  const source = fs.readFileSync(APPS_FILE, "utf8");
  const { start, end, matches } = findAppBlocks(source);
  const existing = matches.find((match) => new RegExp(`^    slug: ${quote(options.slug)},$`, "m").test(match.text));
  let next;
  if (existing) {
    let block = existing.text;
    const fields = {
      name: options.name,
      shortDescription: options.shortDescription || options.description || options.name,
      description: options.description || options.shortDescription || options.name,
      accent: options.accent || "#7650b5",
      category: options.category || "أدوات",
      version: options.version,
      updatedAt,
      downloadUrl: releaseUrl,
      releaseAssetName,
      fallbackReleaseUrl: releaseUrl,
    };
    for (const [key, value] of Object.entries(fields)) block = replaceField(block, key, value);
    block = options.iconImage ? replaceField(block, "iconImage", options.iconImage) : block;
    block = options.installNotice ? replaceField(block, "installNotice", options.installNotice) : block;
    next = source.slice(0, existing.start) + block + source.slice(existing.end);
    console.log(`تحديث التطبيق الموجود: ${options.slug}`);
  } else {
    const block = buildAppBlock(options, releaseUrl, releaseAssetName, updatedAt);
    next = source.slice(0, end) + `\n${block}` + source.slice(end);
    console.log(`إضافة تطبيق جديد: ${options.slug}`);
  }
  fs.writeFileSync(APPS_FILE, next);
}

function validate(options) {
  for (const key of ["file", "slug", "name", "version"]) {
    if (!options[key]) throw new Error(`الخيار --${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} مطلوب`);
  }
  if (!/^[a-z][a-z0-9-]{1,48}$/.test(options.slug)) throw new Error("slug يجب أن يحتوي أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط");
  if (!/^\d+(?:\.\d+){0,3}(?:[-+][0-9A-Za-z.-]+)?$/.test(options.version)) throw new Error("version يجب أن يكون بصيغة مثل 1.0 أو 1.2.3");
  const file = path.resolve(process.cwd(), options.file);
  if (!fs.existsSync(file)) throw new Error(`ملف APK غير موجود: ${file}`);
  if (path.extname(file).toLowerCase() !== ".apk") throw new Error("الملف يجب أن يكون بصيغة .apk");
  options.file = file;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();
  validate(options);

  const releaseAssetName = `${options.slug}-v${options.version}.apk`;
  const releaseTag = `${options.slug}-v${options.version}`;
  const releaseUrl = `https://github.com/${OWNER}/${REPO}/releases/download/${releaseTag}/${releaseAssetName}`;
  const updatedAt = new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const notes = options.releaseNotes || `إصدار ${options.name} ${options.version}`;

  console.log(`\nسيتم نشر: ${options.name} v${options.version}`);
  console.log(`الملف: ${options.file}`);
  console.log(`Release: ${releaseTag}`);
  console.log(`الرابط: ${releaseUrl}`);
  if (options.dryRun) return console.log("\nDry run: لم يتم رفع أو تعديل أي ملف.");

  shell("gh", ["auth", "status"]);
  const releaseExists = (() => {
    try {
      shell("gh", ["release", "view", releaseTag, "--repo", `${OWNER}/${REPO}`], { silent: true });
      return true;
    } catch {
      return false;
    }
  })();
  if (releaseExists) throw new Error(`يوجد Release بالوسم ${releaseTag} مسبقًا. استخدم رقم إصدار جديد.`);

  const notesFile = path.join(ROOT, `.release-notes-${process.pid}.md`);
  fs.writeFileSync(notesFile, notes, "utf8");
  try {
    shell("gh", ["release", "create", releaseTag, `${options.file}#${releaseAssetName}`, "--repo", `${OWNER}/${REPO}`, "--title", `${options.name} v${options.version}`, "--notes-file", notesFile]);
  } finally {
    fs.rmSync(notesFile, { force: true });
  }

  updateAppsFile(options, releaseUrl, releaseAssetName, updatedAt);
  shell("pnpm", ["check"]);
  if (!options.skipBuild) {
    shell("pnpm", ["build:static"], { silent: false, env: { GITHUB_PAGES: "true" } });
    fs.rmSync(path.join(ROOT, "docs/assets"), { recursive: true, force: true });
    fs.cpSync(path.join(ROOT, "dist/public/assets"), path.join(ROOT, "docs/assets"), { recursive: true });
    fs.copyFileSync(path.join(ROOT, "dist/public/index.html"), path.join(ROOT, "docs/index.html"));
    fs.mkdirSync(path.join(ROOT, "docs/api/platform"), { recursive: true });
    fs.copyFileSync(path.join(ROOT, "dist/public/api/platform/config.js"), path.join(ROOT, "docs/api/platform/config.js"));
  }
  fs.writeFileSync(path.join(ROOT, "docs/manus-routes.json"), JSON.stringify({ routes: [
    { path: "/", title: "تطبيقات شادو — متجر التطبيقات" },
    { path: "/apps/:slug", title: "تفاصيل التطبيق" },
    { path: "/404", title: "الصفحة غير موجودة" },
  ] }) + "\n");

  shell("git", ["add", "client/src/data/apps.ts", "docs", "README.md"]);
  shell("git", ["commit", "-m", `Publish ${options.slug} v${options.version}`]);
  if (!options.noPush) shell("git", ["push", "origin", "main"]);
  console.log(`\nتم النشر بنجاح: ${releaseUrl}`);
  if (!options.noPush) console.log("سيبدأ GitHub Pages نشر التحديث تلقائيًا.");
}

try {
  main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
