import { useEffect, useMemo, useRef, useState } from "react";
import Cover from "./Cover";
import { Icon, IconBtn, useWidth } from "./ui";
import { MASONRY_COLS, MAX_PER_ROW, ROW_HEIGHT, SPACING, fontStack, img } from "../lib/theme";

function Watermark({ brand, scale = 1 }) {
  const wm = brand?.watermark;
  if (!wm?.enabled) return null;
  const mark = (k) =>
    wm.type === "logo" && brand.logo ? (
      <img key={k} src={brand.logo} alt="" style={{ height: 22 * scale, maxWidth: "50%" }} />
    ) : (
      <span key={k} style={{ fontSize: 12 * scale, fontFamily: fontStack(brand.headingFont || "Geist") }}>
        {wm.text || brand.name || "© Your Studio"}
      </span>
    );
  return (
    <div className={`wm ${wm.position}`} style={{ opacity: wm.opacity }}>
      {wm.position === "tiled" ? Array.from({ length: 9 }, (_, i) => mark(i)) : mark(0)}
    </div>
  );
}

function Tile({ p, w, h, onClick, liked, brand }) {
  return (
    <div className="gv-tile" style={{ width: w, height: h }} onClick={onClick}>
      <img src={img(p, w > 300 ? 900 : 500)} alt="" loading="lazy" />
      <Watermark brand={brand} scale={w > 250 ? 1 : 0.75} />
      {liked && <Icon name="favorite" fill size={16} className="fav" />}
    </div>
  );
}

/** Phosphor fill icons, as used by the production gallery footer. */
const FOOTER_ICONS = [
  { key: "website", d: "M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm87.62,96H175.79C174,83.49,159.94,57.67,148.41,42.4A88.19,88.19,0,0,1,215.63,120ZM96.23,136h63.54c-2.31,41.61-22.23,67.11-31.77,77C118.45,203.1,98.54,177.6,96.23,136Zm0-16C98.54,78.39,118.46,52.89,128,43c9.55,9.93,29.46,35.43,31.77,77Zm52.18,93.6c11.53-15.27,25.56-41.09,27.38-77.6h39.84A88.19,88.19,0,0,1,148.41,213.6Z" },
  { key: "facebook", d: "M232,128a104.16,104.16,0,0,1-91.55,103.26,4,4,0,0,1-4.45-4V152h24a8,8,0,0,0,8-8.53,8.17,8.17,0,0,0-8.25-7.47H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,8-8.53A8.17,8.17,0,0,0,167.73,80H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0-8,8.53A8.17,8.17,0,0,0,96.27,152H120v75.28a4,4,0,0,1-4.44,4A104.15,104.15,0,0,1,24.07,124.09c2-54,45.74-97.9,99.78-100A104.12,104.12,0,0,1,232,128Z" },
  { key: "instagram", d: "M176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24ZM128,176a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Zm60-96a12,12,0,1,1,12-12A12,12,0,0,1,188,80Zm-28,48a32,32,0,1,1-32-32A32,32,0,0,1,160,128Z" },
  { key: "x", d: "M48,32H96l112,192H160ZM64,224,144,140M112,116,192,32", stroke: true },
];

/** Vertical (column masonry) and Horizontal (justified rows) — production `layoutStrategy`. */
function Grid({ photos, theme, onOpen, likes, brand }) {
  const [ref, width] = useWidth();
  const gap = SPACING[theme.gridSpacing] ?? 4;
  const side = theme.gridSpacing === "none" ? 0 : gap;

  const layout = useMemo(() => {
    const W = width - side * 2;
    if (W <= 0) return null;
    if (theme.layout === "masonry") {
      const n = MASONRY_COLS[theme.gridSize] || 2;
      const colW = (W - gap * (n - 1)) / n;
      const cols = Array.from({ length: n }, () => ({ h: 0, items: [] }));
      photos.forEach((p, i) => {
        const c = cols.reduce((a, b) => (b.h < a.h ? b : a));
        const h = (colW * p.h) / p.w;
        c.items.push({ p, i, w: colW, h });
        c.h += h + gap;
      });
      return { type: "masonry", cols };
    }
    const target = ROW_HEIGHT[theme.gridSize] || 150;
    const rows = [];
    let cur = [];
    let ar = 0;
    photos.forEach((p, i) => {
      cur.push({ p, i });
      ar += p.w / p.h;
      const rowW = ar * target + gap * (cur.length - 1);
      if (rowW >= W || cur.length === MAX_PER_ROW) {
        const h = (W - gap * (cur.length - 1)) / ar;
        rows.push(cur.map((x) => ({ ...x, h, w: (h * x.p.w) / x.p.h })));
        cur = [];
        ar = 0;
      }
    });
    if (cur.length) rows.push(cur.map((x) => ({ ...x, h: target, w: (target * x.p.w) / x.p.h })));
    return { type: "rows", rows };
  }, [photos, theme.layout, theme.gridSize, gap, side, width]);

  return (
    <div ref={ref} className="gv-grid" style={{ padding: `0 ${side}px` }}>
      {layout?.type === "masonry" && (
        <div className="gv-masonry" style={{ gap }}>
          {layout.cols.map((c, ci) => (
            <div key={ci} style={{ gap }}>
              {c.items.map((t) => (
                <Tile key={t.p.id} {...t} brand={brand} liked={likes.has(t.p.id)} onClick={() => onOpen(t.i)} />
              ))}
            </div>
          ))}
        </div>
      )}
      {layout?.type === "rows" &&
        layout.rows.map((r, ri) => (
          <div key={ri} className="gv-row" style={{ gap, marginBottom: gap }}>
            {r.map((t) => (
              <Tile key={t.p.id} {...t} brand={brand} liked={likes.has(t.p.id)} onClick={() => onOpen(t.i)} />
            ))}
          </div>
        ))}
    </div>
  );
}

function Lightbox({ photos, index, setIndex, onClose, likes, toggleLike, brand, store, onToast }) {
  const p = photos[index];
  const touch = useRef(null);
  const stageRef = useRef(null);
  const [stageH, setStageH] = useState(400);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setStageH(e.contentRect.height));
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);
  const go = (d) => setIndex((index + d + photos.length) % photos.length);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const liked = likes.has(p.id);
  // Mirrors the production phone viewer: white, close + count + filename on top, actions centred below.
  return (
    <div className="lb">
      <div className="lb-top">
        <button className="lb-close" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        <span className="lb-count">{index + 1} / {photos.length}</span>
        <span className="lb-name">{p.name || `IMG_${String(index + 1).padStart(4, "0")}.jpg`}</span>
      </div>
      <div
        className="lb-stage"
        ref={stageRef}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - (touch.current ?? 0);
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        onClick={(e) => {
          // No arrows on phone in production: tap the left or right third to step, like a swipe.
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          if (x < 0.33) go(-1);
          else if (x > 0.67) go(1);
        }}
      >
        <div style={{ position: "relative", maxWidth: "100%", maxHeight: "100%", display: "flex" }}>
          <img key={p.id} src={img(p, 1000)} alt="" width={p.w} height={p.h} style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: stageH, objectFit: "contain", aspectRatio: `${p.w} / ${p.h}`, backgroundImage: `url("${img(p, 500)}")`, backgroundSize: "cover" }} />
          <Watermark brand={brand} scale={1.6} />
        </div>
      </div>
      <div className="lb-bottom">
        <button onClick={() => toggleLike(p.id)} aria-label="Favourite" style={liked ? { color: "#f43f5e" } : undefined}><Icon name="favorite" size={20} fill={liked} /></button>
        <button onClick={() => onToast?.("Share sheet opens here (demo)")} aria-label="Share"><Icon name="reply" size={20} style={{ transform: "scaleX(-1)" }} /></button>
        <button onClick={() => onToast?.("Download started (demo)")} aria-label="Download"><Icon name="download" size={20} /></button>
        {store?.enabled && (
          <button onClick={() => store.onBuy(p)} aria-label="Buy print" style={{ color: brand?.primary || "#2563eb" }}><Icon name="shopping_bag" size={20} /></button>
        )}
      </div>
    </div>
  );
}

/**
 * The client-facing gallery: cover → sticky nav → grid → footer, with a lightbox.
 * Used by the sample viewer, the editor preview, the final reveal and the store.
 */
export default function GalleryView({
  data,
  theme,
  brand,
  fallbackLogo,
  navInset,
  store,
  focus,
  bottomPad = 0,
  coverInset = 0,
  onScroll,
  onLightbox,
  onToast,
  scrollRef: externalRef,
}) {
  const innerRef = useRef(null);
  const scrollRef = externalRef || innerRef;
  const coverRef = useRef(null);
  const [lb, setLb] = useState(null);
  const [likes, setLikes] = useState(() => new Set());

  const toggleLike = (id) =>
    setLikes((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else {
        n.add(id);
        onToast?.("Added to favourites");
      }
      return n;
    });

  const enter = () => scrollRef.current?.scrollTo({ top: coverRef.current?.offsetHeight || 0, behavior: "smooth" });

  useEffect(() => {
    if (!focus) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: focus === "grid" ? coverRef.current?.offsetHeight || 0 : 0, behavior: "smooth" });
  }, [focus]);

  useEffect(() => onLightbox?.(lb !== null), [lb]);

  const accent = brand?.primary || "#18181b";
  const b = brand || {};
  // Production phone footer: a row of the photographer's link icons, nothing else.
  const links = brand || fallbackLogo?.links || {};
  const footerLinks = FOOTER_ICONS.filter((x) => links[x.key]);

  return (
    <div className="gv-wrap">
      <div
        ref={scrollRef}
        className="gv-scroll"
        onScroll={(e) => onScroll?.({ top: e.currentTarget.scrollTop, pastCover: e.currentTarget.scrollTop > (coverRef.current?.offsetHeight || 600) * 0.6 })}
      >
        <div ref={coverRef} style={{ height: coverInset ? `calc(100% - ${coverInset}px)` : "100%", minHeight: coverInset ? 460 : 0 }}>
          <Cover data={data} theme={theme} brand={brand} fallbackLogo={fallbackLogo} onEnter={enter} />
        </div>

        <div className="gv-nav" style={navInset ? { paddingLeft: navInset } : undefined}>
          <span className="name" style={{ fontFamily: fontStack(theme.font) }}>
            {data.name || "Untitled gallery"}
          </span>
          <IconBtn icon="favorite" label="Favourites" onClick={() => onToast?.(`${likes.size} favourite${likes.size === 1 ? "" : "s"} saved`)} />
          <IconBtn icon="ios_share" label="Share" onClick={() => onToast?.("Share sheet opens here (demo)")} />
          {store?.enabled && (
            <IconBtn icon="shopping_bag" label="Store" onClick={store.onOpenStore}>
              {store.cartCount > 0 && (
                <span className="count" style={{ background: accent }}>
                  {store.cartCount}
                </span>
              )}
            </IconBtn>
          )}
        </div>

        <div className="gv-sets t-l13">
          <span className="on">{data.setName || "Highlights"}</span>
          <span>{data.photos.length} photos</span>
        </div>

        {store?.enabled && (
          <button className="gv-shop" onClick={store.onOpenStore}>
            <span className="ic" style={{ background: accent }}>
              <Icon name="shopping_bag" fill size={20} />
            </span>
            <span className="col grow" style={{ gap: 2 }}>
              <span className="t-h4">Shop prints & albums</span>
              <span className="t-b12" style={{ color: "var(--ui-color-grey-550)" }}>
                Prints from $4 · Canvas · Frames · Albums
              </span>
            </span>
            <Icon name="chevron_right" size={20} />
          </button>
        )}

        <Grid photos={data.photos} theme={theme} onOpen={setLb} likes={likes} brand={brand} />

        <footer className="gv-footer">
          {footerLinks.map((l) => (
            <a key={l.key} href="#" onClick={(e) => e.preventDefault()} aria-label={l.key}>
              <svg width="16" height="16" viewBox="0 0 256 256" {...(l.stroke ? { fill: "none", stroke: "currentColor", strokeWidth: 20, strokeLinejoin: "round" } : { fill: "currentColor" })}><path d={l.d} /></svg>
            </a>
          ))}
        </footer>
        <div style={{ height: bottomPad }} />
      </div>

      {lb !== null && (
        <Lightbox
          photos={data.photos}
          index={lb}
          setIndex={setLb}
          onClose={() => setLb(null)}
          likes={likes}
          toggleLike={toggleLike}
          brand={brand}
          store={store}
          onToast={onToast}
        />
      )}
    </div>
  );
}

/** Renders children at true phone width (375px) and scales them to fit the box. */
export function ScaledDevice({ children }) {
  const ref = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const s = box.w ? box.w / 375 : 1;
  return (
    <div ref={ref} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      {box.w > 0 && (
        <div style={{ width: 375, height: box.h / s, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
      )}
    </div>
  );
}

/** A static, scaled-down cover — used for template thumbnails and prompt art. */
export function MiniCover({ width, height = (width * 667) / 375, ...props }) {
  const s = width / 375;
  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <div className="mini-inner" style={{ transform: `scale(${s})`, height: height / s }}>
        <Cover {...props} onEnter={() => {}} />
      </div>
    </div>
  );
}
