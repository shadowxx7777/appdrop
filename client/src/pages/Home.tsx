import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Code2,
  Download,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Link } from "wouter";
import { apps } from "../data/apps";

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function AppCard({ app }: { app: (typeof apps)[number] }) {
  return (
    <article className="app-card">
      <div className="app-card-top">
        <div className="app-icon" style={{ background: `linear-gradient(145deg, ${app.accent}, #111827)` }}>
          <span>{app.icon}</span>
        </div>
        <span className="app-version">الإصدار {app.version}</span>
      </div>
      <div className="app-card-copy">
        <div className="app-card-meta"><span className="status-dot" />{app.platform}</div>
        <h3>{app.name}</h3>
        <p>{app.shortDescription}</p>
      </div>
      <div className="app-card-bottom">
        <Link href={`/apps/${app.slug}`} className="app-details-link">التفاصيل <ArrowLeft size={16} /></Link>
        {app.downloadUrl ? (
          <a href={app.downloadUrl} className="mini-download" aria-label={`تحميل ${app.name}`}>
            <ArrowDownToLine size={17} />
          </a>
        ) : (
          <span className="mini-download is-disabled" aria-label="رابط التحميل سيضاف قريبًا">
            <ArrowDownToLine size={17} />
          </span>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState("الكل");
  const platforms = useMemo(() => ["الكل", ...new Set(apps.map((app) => app.platform))], []);
  const filteredApps = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ar");
    return apps.filter((app) => {
      const matchesPlatform = activePlatform === "الكل" || app.platform === activePlatform;
      const text = `${app.name} ${app.shortDescription} ${app.platform} ${app.category}`.toLocaleLowerCase("ar");
      return matchesPlatform && (!normalized || text.includes(normalized));
    });
  }, [activePlatform, query]);

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="تطبيقاتي — الصفحة الرئيسية">
          <BrandMark />
          <span className="brand-name">تطبيقاتي<span className="brand-period">.</span></span>
        </a>
        <nav className="main-nav" aria-label="التنقل الرئيسي">
          <a href="#apps">المعرض</a>
          <a href="#about">عن الموقع</a>
        </nav>
        <a href="#apps" className="header-cta">تصفّح التطبيقات <ArrowUpLeft size={16} /></a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> مساحة لكل فكرة صنعتها</div>
            <h1>من شغفك<br />إلى <span className="gradient-text">تحميلٍ واحد.</span></h1>
            <p className="hero-description">معرض يجمع تطبيقاتك في مكان واحد. اكتشف الفكرة، تعرّف على تفاصيلها، وحمّل الإصدار الذي يناسبك.</p>
            <div className="hero-actions">
              <a href="#apps" className="button-primary">استكشف التطبيقات <ArrowLeft size={17} /></a>
              <span className="hero-note"><ShieldCheck size={15} /> ملفات وروابط مباشرة</span>
            </div>
            <div className="hero-stats" aria-label="إحصاءات المعرض">
              <div><strong>{String(apps.length).padStart(2, "0")}</strong><span>تطبيقات</span></div>
              <span className="stat-divider" />
              <div><strong>01</strong><span>مكان لكل فكرة</span></div>
              <span className="stat-divider" />
              <div><strong><Check size={18} /></strong><span>تحميل سهل</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="رسم توضيحي لمعرض التطبيقات">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-glow" />
            <div className="visual-card">
              <div className="visual-card-top"><span className="visual-dots"><i /><i /><i /></span><span>مكتبة التطبيقات</span><span className="live-pill"><i /> جاهز</span></div>
              <div className="visual-card-main">
                <div className="visual-monogram"><BrandMark small /></div>
                <div><span className="visual-kicker">مساحتك الرقمية</span><h2>كل فكرة<br />لها أيقونة.</h2></div>
              </div>
              <div className="visual-list-row"><span className="row-icon cyan"><Code2 size={18} /></span><span className="row-copy"><b>مشروعك القادم</b><small>بانتظار الإطلاق</small></span><span className="row-tag">قريبًا</span></div>
              <div className="visual-list-row"><span className="row-icon violet"><Terminal size={18} /></span><span className="row-copy"><b>إصدارك الأول</b><small>من الفكرة إلى جهازك</small></span><Sparkles size={16} className="row-spark" /></div>
              <div className="visual-card-footer"><span><span className="status-dot" /> معرض مفتوح للجميع</span><span>APP / LIBRARY</span></div>
            </div>
            <div className="floating-chip chip-download"><Download size={15} /><span>تحميل مباشر</span></div>
            <div className="floating-chip chip-code"><Code2 size={16} /></div>
            <span className="visual-index">01 — YOUR WORKSPACE</span>
          </div>
        </section>

        <section className="catalog-section" id="apps">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> المكتبة</div>
              <h2>التطبيقات <span className="muted-heading">المتاحة</span></h2>
              <p>تصفّح المشاريع، أو ابحث مباشرةً عن التطبيق الذي تريده.</p>
            </div>
            <div className="catalog-count"><span>{String(apps.length).padStart(2, "0")}</span><small>عنصر في المعرض</small></div>
          </div>

          <div className="catalog-toolbar">
            <label className="search-box">
              <Search size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن تطبيق..." aria-label="ابحث عن تطبيق" />
              <kbd>⌘ K</kbd>
            </label>
            <div className="filter-list" aria-label="تصفية حسب المنصة">
              {platforms.map((platform) => (
                <button key={platform} className={`filter-chip${activePlatform === platform ? " active" : ""}`} onClick={() => setActivePlatform(platform)}>{platform}</button>
              ))}
            </div>
          </div>

          {filteredApps.length ? (
            <div className="app-grid">{filteredApps.map((app) => <AppCard key={app.slug} app={app} />)}</div>
          ) : (
            <div className="empty-state">
              <div className="empty-orbit"><div className="empty-icon"><BrandMark small /></div><span className="empty-spark spark-a">✳</span><span className="empty-spark spark-b">✦</span></div>
              <span className="empty-label">مساحة جاهزة</span>
              <h3>{apps.length === 0 ? "معرضك ينتظر أول تطبيق." : "ما لقينا تطبيقًا بهذا الاسم."}</h3>
              <p>{apps.length === 0 ? "أرسل اسم التطبيق ووصفه وملف التحميل أو رابطه، وسنضيفه إلى المعرض." : "جرّب كلمة بحث ثانية أو أزل التصفية الحالية."}</p>
              {apps.length > 0 && <button className="clear-filter" onClick={() => { setQuery(""); setActivePlatform("الكل"); }}>عرض كل التطبيقات <ArrowLeft size={15} /></button>}
            </div>
          )}
        </section>

        <section className="about-strip" id="about">
          <div className="about-mark"><BrandMark /></div>
          <div className="about-copy"><span className="eyebrow"><span className="eyebrow-line" /> عن المعرض</span><h2>مكان واحد.<br /><span className="gradient-text">كل ما صنعت.</span></h2></div>
          <p>هنا تلتقي الأفكار بالتجربة. لكل تطبيق صفحة توضّح فكرته وإصداره، ورابط تحميل واضح يوصلها مباشرةً إلى أصحابها الجدد.</p>
          <a href="#apps" className="about-link">إلى المعرض <ArrowLeft size={17} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><BrandMark small /><span className="brand-name">تطبيقاتي<span className="brand-period">.</span></span></a>
        <span>صُنع بشغف، وجاهز للمشاركة.</span>
        <a href="#top" className="back-to-top">العودة للأعلى ↑</a>
      </footer>
    </div>
  );
}
