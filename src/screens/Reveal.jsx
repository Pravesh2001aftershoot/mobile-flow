import { useMemo, useState } from "react";
import GalleryView from "../components/GalleryView";
import { Icon, IconBtn } from "../components/ui";
import { slugify } from "../lib/theme";

const CONFETTI = ["#3b82f6", "#f43f5e", "#f59e0b", "#10b981", "#a855f7", "#ffffff"];

export default function Reveal({ back, draft, brand, onNext, toast }) {
  const [collapsed, setCollapsed] = useState(false);
  const [inLb, setInLb] = useState(false);
  const [past, setPast] = useState(false);
  const studio = slugify(brand?.name || "yourstudio").replace(/-/g, "");
  const url = `https://${studio}.gallery.aftershoot.com/${slugify(draft.name)}`;
  const data = { name: draft.name, description: draft.description, date: draft.date, cover: draft.cover, photos: draft.photos, setName: draft.setName };
  const bits = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 600, color: CONFETTI[i % CONFETTI.length], rot: Math.random() * 180 })),
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    toast("Link copied");
  };

  return (
    <div className="screen" style={{ background: "#fff" }}>
      <GalleryView data={data} theme={draft.theme} brand={brand} fallbackLogo={brand ? null : draft.fallbackLogo} bottomPad={collapsed ? 90 : 240} coverInset={collapsed ? 76 : 214} onToast={toast} onLightbox={setInLb}
        onScroll={({ pastCover }) => {
          setPast(pastCover);
          if (pastCover && !past) setCollapsed(true);
        }}
      />
      <div className="confetti">
        {bits.map((c, i) => (
          <i key={i} style={{ left: `${c.left}%`, background: c.color, animationDelay: `${c.delay}ms`, transform: `rotate(${c.rot}deg)` }} />
        ))}
      </div>
      {!inLb && (
        <>
          {!past && (
            <div className="float-top">
              <IconBtn icon="arrow_back" solid onClick={back} label="Back" />
              <span className="pill t-l12"><Icon name="check_circle" size={16} fill /> Step 4 of 5 · Share</span>
            </div>
          )}
          <div className="float-bar" style={{ background: collapsed ? "var(--ui-surface-0)" : "transparent" }}>
            {collapsed ? (
              <div className="row gap-8">
                <button className="btn btn-secondary btn-lg grow" onClick={() => setCollapsed(false)}>
                  <Icon name="link" size={20} /> Share link
                </button>
                <button className="btn btn-primary btn-lg grow" onClick={onNext}>
                  Continue <Icon name="arrow_forward" size={20} />
                </button>
              </div>
            ) : (
              <div className="share-card">
                <div className="row between">
                  <span className="col" style={{ gap: 2 }}>
                    <span className="t-h3 c0">Your gallery is ready</span>
                    <span className="t-b12 c2">This is exactly what your client will see.</span>
                  </span>
                  <button className="icon-btn" onClick={() => setCollapsed(true)} aria-label="Minimise"><Icon name="keyboard_arrow_down" size={20} /></button>
                </div>
                <div className="link-row">
                  <Icon name="link" size={16} className="c2" />
                  <span className="u t-b13 c1">{url.replace("https://", "")}</span>
                  <button className="btn btn-secondary btn-sm" onClick={copy}><Icon name="content_copy" size={16} /> Copy</button>
                </div>
                <button className="btn btn-primary btn-lg btn-block" onClick={onNext}>
                  Continue <Icon name="arrow_forward" size={20} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
