import { ArrowDownToLine, ArrowRight, CalendarDays, ChevronLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { apps } from "../data/apps";
import { downloadApk } from "../lib/download";
import NotFound from "./NotFound";

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true"><i /><i /><i /></span>;
}

export default function AppDetails() {
  const { slug } = useParams<{ slug: string }>();
  const app = apps.find((item) => item.slug === slug);
  if (!app) return <NotFound />;

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
            {app.downloadUrl ? <a href={app.downloadUrl} download={`${app.name}.apk`} onClick={(event) => { event.preventDefault(); void downloadApk(app.downloadUrl, `${app.name}.apk`).catch(() => { window.location.assign(app.downloadUrl); }); }} className="button-primary download-button"><ArrowDownToLine size={18} /> تحميل <span>{app.version}</span></a> : <span className="button-primary download-button button-disabled"><ArrowDownToLine size={18} /> التحميل قريبًا</span>}
          </div>
          <div className="details-visual"><div className="details-halo" /><div className="details-app-tile" style={{ background: `linear-gradient(145deg, ${app.accent}, #181321)` }}>{app.iconImage ? <img className="details-tile-image" src={app.iconImage} alt="" /> : <span>{app.icon}</span>}</div></div>
        </section>
        <section className="details-info-grid">
          <article className="details-description"><span className="eyebrow"><i /> عن التطبيق</span><p>{app.description}</p></article>
          <aside className="version-panel"><div className="version-row"><span>الإصدار</span><strong>{app.version}</strong></div><div className="version-row"><span>المنصة</span><strong>{app.platform}</strong></div><div className="version-row"><span>التحديث</span><strong><CalendarDays size={13} /> {app.updatedAt}</strong></div></aside>
        </section>
        <section className="screenshots-section"><div className="screenshots-heading"><h2>صور التطبيق</h2></div>{app.screenshots.length ? <div className="screenshots-grid">{app.screenshots.map((src, index) => <figure key={src}><img src={src} alt={`${app.name} ${index + 1}`} loading="lazy" /></figure>)}</div> : <div className="screenshot-empty">لا توجد صور بعد</div>}</section>
        <div className="details-back"><Link href="/"><ArrowRight size={16} /> كل التطبيقات</Link></div>
      </main>
      <footer className="site-footer"><a className="brand footer-brand" href="/"><BrandMark small /><span>تطبيقاتي</span></a><span>© 2026</span><Link href="/" className="back-to-top">رجوع</Link></footer>
    </div>
  );
}
