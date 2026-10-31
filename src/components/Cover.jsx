import { fontStack, formatDate, img, isDark } from "../lib/theme";
import { Icon } from "./ui";

/** Brand logo → sample photographer logo → nothing. */
export function Logo({ brand, fallbackLogo, onDark, height = 28, theme }) {
  if (brand?.logo) return <img className="cv-logo-img" src={brand.logo} alt="" style={{ height, maxWidth: 160, filter: onDark && brand.logoInvert ? "brightness(0) invert(1)" : "none" }} />;
  if (brand?.name)
    return (
      <span style={{ fontFamily: fontStack(theme?.font || "Playfair Display"), fontSize: height * 0.7, letterSpacing: 2, textTransform: "uppercase", color: onDark ? "#ffffff" : brand.primary || "#18181b" }}>
        {brand.name}
      </span>
    );
  if (fallbackLogo) return <img className="cv-logo-img" src={onDark ? fallbackLogo.light : fallbackLogo.dark} alt="" style={{ height }} />;
  return null;
}

/**
 * Mobile renderings of production cover templates.
 * Fills its parent's height (the gallery scroll container, or a scaled mini preview).
 */
export default function Cover({ data, theme, brand, fallbackLogo, onEnter }) {
  const t = theme;
  const accent = brand?.primary || "#18181b";
  const cover = data.cover;
  const pos = `${cover.fx ?? 50}% ${cover.fy ?? 50}%`;
  const date = formatDate(data.date);

  const Photo = ({ style, radius }) => (
    <div className="cv-photo" style={{ borderRadius: radius, ...style }}>
      <img key={cover.src || cover.path} src={img(cover, 1200)} alt="" style={{ objectPosition: pos }} />
    </div>
  );

  const titleStyle = (size, color = t.textColor, align = "left") => ({
    fontFamily: fontStack(t.font),
    fontWeight: t.fontWeight,
    fontSize: t.font === "Great Vibes" ? size * 1.25 : size,
    lineHeight: 1.1,
    color,
    textAlign: align,
  });
  const descStyle = (color = t.descColor, align = "left", size = 15) => ({
    fontFamily: fontStack(t.descFont),
    fontSize: size,
    lineHeight: 1.4,
    color,
    textAlign: align,
  });
  const dateStyle = (color = t.descColor) => ({ fontFamily: fontStack(t.descFont), fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color });

  const Title = ({ size = 32, color, align }) => <h1 className="cv-title" style={titleStyle(size, color, align)}>{data.name || "Untitled gallery"}</h1>;
  const Desc = ({ color, align, size }) => (data.description ? <p className="cv-desc" style={descStyle(color, align, size)}>{data.description}</p> : null);
  const Date = ({ color }) => <span style={dateStyle(color)}>{date}</span>;
  const Enter = ({ variant = "link", color }) => (
    <button
      className={`cv-enter ${variant}`}
      onClick={onEnter}
      style={{ fontFamily: fontStack(t.descFont), color: variant === "solid" ? undefined : color || t.textColor, background: variant === "solid" ? accent : undefined }}
    >
      View gallery <Icon name="arrow_downward" size={16} />
    </button>
  );
  const dark = isDark(t.bg);

  switch (t.template) {
    case "editorial-love":
      return (
        <div className="cv" style={{ background: t.bg, padding: 16 }}>
          {Photo({ style: { flex: 1, minHeight: 0 } })}
          <div className="col" style={{ gap: 10, padding: "20px 4px 6px" }}>
            <div style={{ marginBottom: 4 }}><Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={26} theme={t} /></div>
            {Title({ size: 34 })}
            {Desc({})}
            <div style={{ marginTop: 6 }}>{Enter({})}</div>
          </div>
        </div>
      );

    case "side-note":
      return (
        <div className="cv" style={{ background: t.bg }}>
          {Photo({ style: { height: "60%" } })}
          <div className="col" style={{ gap: 10, padding: "24px 24px 20px", flex: 1, justifyContent: "center" }}>
            {Date({})}
            {Title({ size: 32 })}
            {Desc({})}
            <div className="row between" style={{ marginTop: 8 }}>
              {Enter({})}
              <Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={22} theme={t} />
            </div>
          </div>
        </div>
      );

    case "side-story":
      return (
        <div className="cv" style={{ background: t.bg, padding: "56px 36px 24px", alignItems: "center" }}>
          <div style={{ position: "absolute", top: 16, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={24} theme={t} />
          </div>
          {Photo({ style: { flex: 1, minHeight: 0, width: "100%" } })}
          <div className="col" style={{ gap: 10, paddingTop: 22, alignItems: "center" }}>
            {Title({ size: 28, align: "center" })}
            <span style={{ width: 32, height: 1, background: t.textColor, opacity: 0.4 }} />
            {Desc({ align: "center", size: 14 })}
            {Date({})}
          </div>
        </div>
      );

    case "center-stage":
      return (
        <div className="cv" style={{ background: t.bg, padding: "36px 24px 24px", alignItems: "center" }}>
          <Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={26} theme={t} />
          <div className="col" style={{ gap: 10, alignItems: "center", padding: "22px 0 22px" }}>
            {Title({ size: 34, align: "center" })}
            {Desc({ align: "center", size: 14 })}
            {Date({})}
          </div>
          {Photo({ style: { flex: 1, minHeight: 0, width: "100%" } })}
        </div>
      );

    case "overlay-center":
      return (
        <div className="cv" style={{ background: "#111" }}>
          {Photo({ style: { position: "absolute", inset: 0 } })}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0 0 0 / 0.34)" }} />
          <div className="col" style={{ position: "relative", flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 28 }}>
            <Logo brand={brand} fallbackLogo={fallbackLogo} onDark height={28} theme={t} />
            {Title({ size: 38, color: "#fff", align: "center" })}
            {Desc({ color: "rgba(255 255 255 / 0.85)", align: "center" })}
            <div style={{ marginTop: 10 }}>{Enter({ variant: "outline", color: "#fff" })}</div>
          </div>
        </div>
      );

    case "overlay-bottom-center":
      return (
        <div className="cv" style={{ background: "#111" }}>
          {Photo({ style: { position: "absolute", inset: 0 } })}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0 0 0 / 0.25) 0%, transparent 25%, transparent 45%, rgba(0 0 0 / 0.7) 100%)" }} />
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Logo brand={brand} fallbackLogo={fallbackLogo} onDark height={24} theme={t} />
          </div>
          <div className="col" style={{ position: "absolute", left: 0, right: 0, bottom: 28, alignItems: "center", gap: 10, padding: "0 28px" }}>
            {Date({ color: "rgba(255 255 255 / 0.8)" })}
            {Title({ size: 36, color: "#fff", align: "center" })}
            <button className="cv-enter cv-bounce" onClick={onEnter} style={{ color: "#fff", marginTop: 8 }} aria-label="View gallery">
              <Icon name="keyboard_arrow_down" size={24} />
            </button>
          </div>
        </div>
      );

    case "split-top":
      return (
        <div className="cv" style={{ background: t.bg }}>
          {Photo({ style: { height: "56%" } })}
          <div className="col" style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: "20px 28px" }}>
            <Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={24} theme={t} />
            {Title({ size: 30, align: "center" })}
            {Desc({ align: "center", size: 14 })}
            <div style={{ marginTop: 6 }}>{Enter({ variant: "solid" })}</div>
          </div>
        </div>
      );

    case "framed-modern":
      return (
        <div className="cv" style={{ background: t.bg, padding: "60px 18px 18px" }}>
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={24} theme={t} />
          </div>
          <div style={{ flex: 1, minHeight: 0, position: "relative", border: `8px solid ${dark ? "#2a2a2a" : "#ffffff"}`, boxShadow: "0 10px 30px rgba(0 0 0 / 0.18)" }}>
            {Photo({ style: { position: "absolute", inset: 0 } })}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(0 0 0 / 0.6))" }} />
            <div className="col" style={{ position: "absolute", left: 18, right: 18, bottom: 18, gap: 8 }}>
              {Date({ color: "rgba(255 255 255 / 0.8)" })}
              {Title({ size: 30, color: "#fff" })}
              {Enter({ color: "#fff" })}
            </div>
          </div>
        </div>
      );

    case "minimal-centered":
      return (
        <div className="cv" style={{ background: t.bg, padding: "28px 24px", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Logo brand={brand} fallbackLogo={fallbackLogo} onDark={dark} height={24} theme={t} />
          {Photo({ style: { width: "72%", aspectRatio: "3 / 4.1" }, radius: "999px 999px 0 0" })}
          <div className="col" style={{ gap: 8, alignItems: "center" }}>
            {Title({ size: 30, align: "center" })}
            {Desc({ align: "center", size: 14 })}
          </div>
          {Enter({})}
        </div>
      );

    case "bottom-story":
    default:
      return (
        <div className="cv" style={{ background: "#111" }}>
          {Photo({ style: { position: "absolute", inset: 0 } })}
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <Logo brand={brand} fallbackLogo={fallbackLogo} onDark height={24} theme={t} />
          </div>
          <div className="col" style={{ position: "absolute", left: 16, right: 16, bottom: 16, gap: 8, padding: 22, background: t.bg, borderRadius: 4 }}>
            {Date({})}
            {Title({ size: 28 })}
            {Desc({ size: 14 })}
            <div style={{ marginTop: 6 }}>{Enter({})}</div>
          </div>
        </div>
      );
  }
}
