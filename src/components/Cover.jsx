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
  const cover = data.cover;
  const pos = `${cover.fx ?? 50}% ${cover.fy ?? 50}%`;
  const date = formatDate(data.date);

  const Photo = ({ style }) => (
    <div className="cv-photo" style={style}>
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
  const Enter = () => (
    <button className="cv-enter" onClick={onEnter} style={{ fontFamily: fontStack(t.descFont), color: t.textColor }}>
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
    default:
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
  }
}
