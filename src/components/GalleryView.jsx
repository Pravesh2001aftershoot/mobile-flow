import { useEffect, useMemo, useRef, useState } from "react";
import Cover, { Logo } from "./Cover";
import { Icon, IconBtn, useWidth } from "./ui";
import { MASONRY_COLS, ROW_HEIGHT, SPACING, fontStack, img } from "../lib/theme";

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
      if (rowW >= W) {
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
  return (
    <div className="lb">
      <div className="lb-top">
        <IconBtn icon="close" onClick={onClose} label="Close" />
        <span className="t-l13" style={{ opacity: 0.8 }}>
          {index + 1} / {photos.length}
        </span>
        <IconBtn icon="favorite" fill={liked} onClick={() => toggleLike(p.id)} label="Favourite" style={liked ? { color: brand?.accent || "#f43f5e" } : undefined} />
      </div>
      <div
        className="lb-stage"
        ref={stageRef}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - (touch.current ?? 0);
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <div style={{ position: "relative", maxWidth: "100%", maxHeight: "100%", display: "flex" }}>
          <img key={p.id} src={img(p, 1000)} alt="" width={p.w} height={p.h} style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: stageH, objectFit: "contain", aspectRatio: `${p.w} / ${p.h}`, backgroundImage: `url("${img(p, 500)}")`, backgroundSize: "cover" }} />
          <Watermark brand={brand} scale={1.6} />
        </div>
        <IconBtn icon="chevron_left" className="lb-nav" style={{ left: 4 }} onClick={() => go(-1)} label="Previous" />
        <IconBtn icon="chevron_right" className="lb-nav" style={{ right: 4 }} onClick={() => go(1)} label="Next" />
      </div>
      <div className="lb-bottom">
        <IconBtn icon="download" onClick={() => onToast?.("Download started (demo)")} label="Download" />
        <IconBtn icon="ios_share" onClick={() => onToast?.("Share sheet opens here (demo)")} label="Share" />
        {store?.enabled && (
          <button className="lb-buy" style={{ background: brand?.primary || "#2563eb" }} onClick={() => store.onBuy(p)}>
            <Icon name="shopping_bag" size={16} fill /> Buy print
          </button>
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
  const hasContact = b.email || b.phone || b.website;
  const socials = [
    b.instagram && { icon: "photo_camera", label: "Instagram" },
    b.facebook && { icon: "thumb_up", label: "Facebook" },
    b.x && { icon: "tag", label: "X" },
  ].filter(Boolean);

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

        <div className="gv-nav">
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
          <Logo brand={brand} fallbackLogo={fallbackLogo} height={32} theme={theme} />
          {brand?.name && <span className="t-h4" style={{ color: "var(--ui-color-grey-900)" }}>{brand.name}</span>}
          {hasContact && (
            <div className="col gap-6 t-b13">
              {b.email && <a href={`mailto:${b.email}`}><Icon name="mail" size={16} />{b.email}</a>}
              {b.phone && <a href={`tel:${b.phone}`}><Icon name="call" size={16} />{b.phone}</a>}
              {b.website && <a href="#" onClick={(e) => e.preventDefault()}><Icon name="language" size={16} />{b.website}</a>}
            </div>
          )}
          {socials.length > 0 && (
            <div className="socials t-l12">
              {socials.map((s) => (
                <span key={s.label} className="row gap-4"><Icon name={s.icon} size={12} />{s.label}</span>
              ))}
            </div>
          )}
          <span className="gv-powered t-b12">Powered by Aftershoot</span>
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
