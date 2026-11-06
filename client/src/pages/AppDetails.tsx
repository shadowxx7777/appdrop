import { ArrowDownToLine, ArrowRight, CalendarDays, ChevronLeft, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useParams } from "wouter";
import { apps, type AppItem } from "../data/apps";
import { downloadApk } from "../lib/download";
import { formatDownloadCount, formatReleaseDate } from "../lib/github-releases";
import { useAppRelease } from "../lib/useAppRelease";
import NotFound from "./NotFound";

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true"><i /><i /><i /></span>;
}

function AppDetailsContent({ app }: { app: AppItem }) {
  const { release, loading, error } = useAppRelease(app);
  const downloadUrl = release?.downloadUrl ?? (loading ? "" : app.fallbackReleaseUrl || app.downloadUrl);
  const qrUrl = release?.downloadUrl ?? (loading ? "" : app.fallbackReleaseUrl || app.downloadUrl);
  const version = release?.version ?? app.version;
  const downloadCount = release ? formatDownloadCount(release.downloadCount) : loading ? "…" : "غير متاح";
  const releaseNotes = release?.notes.trim();

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header">
        <Link className="brand" href="/"><BrandMark /><span>تطبيقاتي</span></Link>
        <nav className="main-nav"><Link href="/#apps">التطبيقات</Link></nav>
        <Link href="/" className="header-cta"><ArrowRight size={15} /> رجوع</Link>
      </header>
      <main className="details-main">
        <div className="breadcrumbs"><Link href="/">التطبيقات</Link><ChevronLeft size={14} /><span>{app.name}</span></div>
        <section className="details-hero">
          <div className="details-hero-copy">
            <span className="eyebrow"><i /> {app.platform}</span>
            <div className="details-app-title-row"><div className="app-icon details-app-icon" style={{ background: `linear-gradient(145deg, ${app.accent}, #181321)` }}>{app.iconImage ? <img className="app-icon-image" src={app.iconImage} alt="" /> : <span>{app.icon}</span>}</div><h1>{app.name}</h1></div>
            <p className="details-lead">{app.shortDescription}</p>
            {downloadUrl ? (
              <a href={downloadUrl} className="button-primary download-button" onClick={(event) => { event.preventDefault(); void downloadApk(downloadUrl, `${app.name}.apk`).catch(() => { window.location.assign(downloadUrl); }); }}>
                <ArrowDownToLine size={18} /> تحميل <span>v{version}</span>
              </a>
            ) : (
              <button type="button" className="button-primary download-button button-disabled" disabled aria-busy="true"><ArrowDownToLine size={18} /> جاري جلب الإصدار…</button>
            )}
          </div>
          <div className="details-visual"><div className="details-halo" /><div className="details-app-tile" style={{ background: `linear-gradient(145deg, ${app.accent}, #181321)` }}>{app.iconImage ? <img className="details-tile-image" src={app.iconImage} alt="" /> : <span>{app.icon}</span>}</div></div>
        </section>
        <section className="details-info-grid">
          <article className="details-description"><span className="eyebrow"><i /> عن التطبيق</span><p>{app.description}</p></article>
          <aside className="version-panel">
            <div className="version-row"><span>الإصدار الأخير</span><strong>v{version}</strong></div>
            <div className="version-row"><span>المنصة</span><strong>{app.platform}</strong></div>
            <div className="version-row"><span>تاريخ الإصدار</span><strong><CalendarDays size={13} /> {release ? formatReleaseDate(release.publishedAt) : app.updatedAt}</strong></div>
            <div className="version-row"><span>التنزيلات على GitHub</span><strong><Download size={13} /> {downloadCount}</strong></div>
          </aside>
        </section>
        <section className="release-section" aria-label="معلومات أحدث إصدار">
          <article className="release-notes-card">
            <div className="release-card-heading"><span className="eyebrow"><i /> WHAT'S NEW</span>{release && <span className="app-version">v{release.version}</span>}</div>
            <h2>أحدث التغييرات</h2>
            {loading ? (
              <p className="release-notes-text">جاري جلب ملاحظات الإصدار…</p>
            ) : releaseNotes ? (
              <p className="release-notes-text">{releaseNotes}</p>
            ) : (
              <p className="release-notes-text">{error ? "تعذّر جلب ملاحظات الإصدار من GitHub الآن." : "لا توجد ملاحظات لهذا الإصدار."}</p>
            )}
            {release?.releaseUrl && <a className="release-page-link" href={release.releaseUrl} target="_blank" rel="noreferrer">عرض الإصدار على GitHub <ArrowRight size={14} /></a>}
          </article>
          <aside className="release-qr-card">
            <div className="release-qr-copy"><span className="eyebrow"><i /> تنزيل مباشر</span><h2>حمّله من هاتفك</h2><p>امسح الرمز بكاميرا الهاتف لفتح ملف APK.</p></div>
            {qrUrl ? (
              <div className="release-qr-wrap"><QRCodeSVG value={qrUrl} size={152} level="M" includeMargin bgColor="#ffffff" fgColor="#09080d" title={`رابط تنزيل ${app.name}`} /></div>
            ) : (
              <div className="release-qr-placeholder" aria-live="polite">جاري جلب رابط الإصدار…</div>
            )}
            {error && <span className="release-fallback-note">الرابط الاحتياطي للإصدار المتاح</span>}
          </aside>
        </section>
        <section className="screenshots-section"><div className="screenshots-heading"><h2>صور التطبيق</h2></div>{app.screenshots.length ? <div className="screenshots-grid">{app.screenshots.map((src, index) => <figure key={src}><img src={src} alt={`${app.name} ${index + 1}`} loading="lazy" /></figure>)}</div> : <div className="screenshot-empty">لا توجد صور بعد</div>}</section>
        <div className="details-back"><Link href="/"><ArrowRight size={16} /> كل التطبيقات</Link></div>
      </main>
      <footer className="site-footer"><Link className="brand footer-brand" href="/"><BrandMark small /><span>تطبيقاتي</span></Link><span>© 2026</span><Link href="/" className="back-to-top">رجوع</Link></footer>
    </div>
  );
}

export default function AppDetails() {
  const { slug } = useParams<{ slug: string }>();
  const app = apps.find((item) => item.slug === slug);
  if (!app) return <NotFound />;
  return <AppDetailsContent app={app} />;
}
