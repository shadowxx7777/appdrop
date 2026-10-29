import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowUpLeft, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { apps } from "../data/apps";

function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark${small ? " brand-mark-small" : ""}`} aria-hidden="true"><i /><i /><i /></span>;
}

function AppCard({ app }: { app: (typeof apps)[number] }) {
  return (
    <article className="app-card">
      <div className="app-card-top">
        <div className="app-icon" style={{ background: `linear-gradient(145deg, ${app.accent}, #181321)` }}><span>{app.icon}</span></div>
        <span className="app-version">{app.version}</span>
      </div>
      <div className="app-card-copy">
        <span className="app-platform">{app.platform}</span>
        <h3>{app.name}</h3>
        <p>{app.shortDescription}</p>
      </div>
      <div className="app-card-bottom">
        <Link href={`/apps/${app.slug}`} className="app-details-link">التفاصيل <ArrowLeft size={15} /></Link>
        {app.downloadUrl ? <a href={app.downloadUrl} className="mini-download" aria-label={`تحميل ${app.name}`}><ArrowDownToLine size={17} /></a> : <span className="mini-download is-disabled"><ArrowDownToLine size={17} /></span>}
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState("الكل");
  const platforms = useMemo(() => ["الكل", ...new Set(apps.map((app) => app.platform))], []);
  const filteredApps = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ar");
    return apps.filter((app) => {
      const matchesPlatform = activePlatform === "الكل" || app.platform === activePlatform;
      const searchable = `${app.name} ${app.shortDescription} ${app.platform} ${app.category}`.toLocaleLowerCase("ar");
      return matchesPlatform && (!term || searchable.includes(term));
    });
  }, [activePlatform, query]);

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="تطبيقاتي"><BrandMark /><span>تطبيقاتي</span></a>
        <nav className="main-nav"><a href="#apps">التطبيقات</a></nav>
        <a href="#apps" className="header-cta">استكشف <ArrowUpLeft size={15} /></a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><i /> معرض التطبيقات</span>
            <h1>أفكار صنعتها.<br /><span className="gold-text">والآن حمّلها.</span></h1>
            <p>تطبيقاتي في مكان واحد.</p>
            <a href="#apps" className="button-primary">شاهد التطبيقات <ArrowLeft size={16} /></a>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-ring ring-one" /><div className="hero-ring ring-two" />
            <div className="hero-orb"><BrandMark /></div>
            <div className="hero-tile tile-one"><span>01</span><i /></div>
            <div className="hero-tile tile-two"><Sparkles size={16} /></div>
            <span className="hero-caption">MY APPS</span>
          </div>
        </section>

        <section className="catalog-section" id="apps">
          <div className="section-heading"><div><span className="eyebrow"><i /> المكتبة</span><h2>التطبيقات</h2></div><span className="catalog-count">{String(apps.length).padStart(2, "0")}</span></div>
          <div className="catalog-toolbar">
            <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن تطبيق" aria-label="ابحث عن تطبيق" /></label>
            <div className="filter-list" aria-label="تصفية حسب المنصة">{platforms.map((platform) => <button key={platform} className={`filter-chip${activePlatform === platform ? " active" : ""}`} onClick={() => setActivePlatform(platform)}>{platform}</button>)}</div>
          </div>
          {filteredApps.length ? <div className="app-grid">{filteredApps.map((app) => <AppCard key={app.slug} app={app} />)}</div> : (
            <div className="empty-state"><div className="empty-icon"><BrandMark small /></div><h3>{apps.length ? "ما لقينا تطبيقًا." : "المعرض جاهز."}</h3><p>{apps.length ? "جرّب بحثًا آخر." : "أرسل تطبيقاتك لإضافتها هنا."}</p>{apps.length > 0 && <button className="clear-filter" onClick={() => { setQuery(""); setActivePlatform("الكل"); }}>عرض الكل</button>}</div>
          )}
        </section>
      </main>
      <footer className="site-footer"><a className="brand footer-brand" href="#top"><BrandMark small /><span>تطبيقاتي</span></a><span>© 2026</span><a href="#top" className="back-to-top">للأعلى ↑</a></footer>
    </div>
  );
}
