import { ArrowDownToLine, ArrowRight, ArrowUpLeft, CalendarDays, Check, ChevronLeft, Code2, Package, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import { apps } from "../data/apps";
import NotFound from "./NotFound";

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true"><span /><span /><span /></span>;
}

export default function AppDetails() {
  const { slug } = useParams<{ slug: string }>();
  const app = apps.find((item) => item.slug === slug);
  if (!app) return <NotFound />;

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header">
        <Link className="brand" href="/"><BrandMark /><span className="brand-name">تطبيقاتي<span className="brand-period">.</span></span></Link>
        <nav className="main-nav" aria-label="التنقل الرئيسي"><Link href="/#apps">المعرض</Link><a href="/#about">عن الموقع</a></nav>
        <Link href="/" className="header-cta"><ArrowRight size={16} /> العودة للمعرض</Link>
      </header>
      <main className="details-main">
        <div className="breadcrumbs"><Link href="/">المعرض</Link><ChevronLeft size={15} /><span>{app.name}</span></div>
        <section className="details-hero">
          <div className="details-hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> {app.category}</div>
            <div className="details-app-title-row"><div className="app-icon details-app-icon" style={{ background: `linear-gradient(145deg, ${app.accent}, #111827)` }}><span>{app.icon}</span></div><div><h1>{app.name}</h1><span className="details-platform"><span className="status-dot" /> {app.platform}</span></div></div>
            <p className="details-lead">{app.shortDescription}</p>
            <div className="details-actions">
              {app.downloadUrl ? <a href={app.downloadUrl} className="button-primary download-button"><ArrowDownToLine size={19} /> حمّل التطبيق <span>الإصدار {app.version}</span></a> : <span className="button-primary download-button button-disabled"><ArrowDownToLine size={19} /> سيُضاف رابط التحميل <span>الإصدار {app.version}</span></span>}
              <span className="safe-download"><ShieldCheck size={16} /> رابط التحميل الرسمي</span>
            </div>
          </div>
          <div className="details-visual">
            <div className="details-grid-lines" />
            <div className="details-app-tile" style={{ background: `linear-gradient(145deg, ${app.accent}, #111827)` }}><span>{app.icon}</span><i>{app.version}</i></div>
            <span className="details-visual-caption">صُمّم للاستخدام اليومي</span>
            <div className="details-float-code"><Code2 size={19} /></div>
          </div>
        </section>

        <section className="details-info-grid">
          <article className="details-description"><span className="eyebrow"><span className="eyebrow-line" /> عن التطبيق</span><h2>فكرة تستحق<br /><span className="gradient-text">أن تجرّبها.</span></h2><p>{app.description}</p></article>
          <aside className="version-panel"><div className="version-panel-head"><Package size={19} /><span>معلومات الإصدار</span></div><div className="version-row"><span>رقم الإصدار</span><strong>{app.version}</strong></div><div className="version-row"><span>المنصة</span><strong>{app.platform}</strong></div><div className="version-row"><span>آخر تحديث</span><strong><CalendarDays size={14} /> {app.updatedAt}</strong></div><div className="verified-note"><Check size={16} /> تفاصيل التطبيق محدثة</div></aside>
        </section>

        <section className="screenshots-section"><div className="screenshots-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> لمحة من الداخل</span><h2>لقطات شاشة</h2></div><span>صور من تجربة التطبيق</span></div>
          {app.screenshots.length ? <div className="screenshots-grid">{app.screenshots.map((src, index) => <figure key={src}><img src={src} alt={`${app.name} — لقطة شاشة ${index + 1}`} loading="lazy" /></figure>)}</div> : <div className="screenshot-empty"><div><BrandMark small /><span>لقطات الشاشة ستظهر هنا</span></div></div>}
        </section>

        <div className="details-back"><Link href="/"><ArrowRight size={17} /> العودة إلى جميع التطبيقات</Link><span>صُنع بشغف، وجاهز للمشاركة.</span><a href="#top">أعلى الصفحة <ArrowUpLeft size={16} /></a></div>
      </main>
      <footer className="site-footer"><a className="brand footer-brand" href="/"><BrandMark small /><span className="brand-name">تطبيقاتي<span className="brand-period">.</span></span></a><span>صُنع بشغف، وجاهز للمشاركة.</span><Link href="/" className="back-to-top">العودة للمعرض ←</Link></footer>
    </div>
  );
}
