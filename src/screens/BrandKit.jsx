import { useRef, useState } from "react";
import { Logo } from "../components/Cover";
import { Icon, Progress, Seg, Swatches, Toggle, TopBar } from "../components/ui";
import { DESC_FONTS, TITLE_FONTS, fontStack, img } from "../lib/theme";

const BRAND_COLOURS = ["#18181B", "#2563EB", "#8A6E4B", "#B45309", "#0F766E", "#9F1239"];
const ACCENTS = ["#F43F5E", "#F59E0B", "#10B981", "#6366F1", "#EC4899", "#18181B"];

const Section = ({ icon, title, hint, children }) => (
  <div className="section">
    <div className="col gap-2" style={{ gap: 2 }}>
      <span className="row gap-8 t-h3 c0"><Icon name={icon} size={20} />{title}</span>
      {hint && <span className="t-b12 c3">{hint}</span>}
    </div>
    {children}
  </div>
);

const Field = ({ label, icon, ...rest }) => (
  <div className="field">
    {label && <label>{label}</label>}
    <div className="input-icon">
      <Icon name={icon} size={16} />
      <input className="input" {...rest} />
    </div>
  </div>
);

export default function BrandKit({ back, draft, initial, onDone }) {
  const [b, setB] = useState(initial);
  const set = (patch) => setB((x) => ({ ...x, ...patch }));
  const setWm = (patch) => setB((x) => ({ ...x, watermark: { ...x.watermark, ...patch } }));
  const file = useRef(null);

  const onLogo = (f) => {
    if (!f) return;
    set({ logo: URL.createObjectURL(f) });
  };

  const previewTheme = { ...draft.theme, font: b.headingFont || draft.theme.font, descFont: b.bodyFont || draft.theme.descFont };
  return (
    <div className="screen">
      <TopBar onBack={back} title="Brand kit" />
      <Progress step={3} />
      <div className="brand-preview theme-light" style={{ background: "var(--ui-color-grey-0)", color: "var(--ui-color-grey-900)" }}>
        <div className="row between" style={{ padding: "10px 12px", borderBottom: "var(--ui-stroke-2) solid var(--ui-color-grey-150)" }}>
          <Logo brand={b} height={22} theme={previewTheme} />
          {!b.logo && !b.name && <span className="t-l12" style={{ color: "var(--ui-color-grey-400)" }}>Your logo</span>}
          <span className="row gap-4" style={{ color: b.accent }}><Icon name="favorite" size={16} fill /></span>
        </div>
        <div className="row gap-12" style={{ padding: 12 }}>
          <img src={img(draft.cover, 200)} alt="" style={{ width: 64, height: 80, objectFit: "cover", borderRadius: 4, position: "relative" }} />
          <div className="col grow" style={{ gap: 4, minWidth: 0 }}>
            <span style={{ fontFamily: fontStack(previewTheme.font), fontSize: 20, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{draft.name}</span>
            <span style={{ fontFamily: fontStack(previewTheme.descFont), fontSize: 12, color: "var(--ui-color-grey-550)" }}>{b.email || b.website || "hello@yourstudio.com"}</span>
            <span className="row" style={{ marginTop: 4, alignSelf: "flex-start", gap: 4, background: b.primary, color: "var(--ui-type-white)", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>
              <Icon name="shopping_bag" size={12} fill /> Shop prints
            </span>
          </div>
        </div>
        <span className="pill t-l11" style={{ position: "absolute", bottom: 8, right: 8, height: 22 }}>Live preview</span>
      </div>

      <div className="scroll">
        <Section icon="verified" title="Logo" hint="PNG or SVG with a transparent background works best.">
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => onLogo(e.target.files[0])} />
          <div className="logo-drop" onClick={() => file.current.click()}>
            {b.logo ? <img src={b.logo} alt="Your logo" /> : (<><Icon name="upload" size={20} /><span className="t-l13">Upload logo</span></>)}
          </div>
          {b.logo && (
            <>
              <div className="logo-previews">
                <div style={{ background: "var(--ui-color-grey-0)" }}><img src={b.logo} alt="" /></div>
                <div style={{ background: "var(--ui-color-grey-950)" }}><img src={b.logo} alt="" style={{ filter: b.logoInvert ? "brightness(0) invert(1)" : "none" }} /></div>
              </div>
              <div className="row between">
                <span className="t-b13 c1">Make white on dark covers</span>
                <Toggle on={b.logoInvert} onChange={(v) => set({ logoInvert: v })} />
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => set({ logo: null })}>Remove logo</button>
            </>
          )}
        </Section>

        <Section icon="storefront" title="Studio name" hint="Used as a text logo if you don't upload one.">
          <Field icon="badge" placeholder="e.g. Golden Hour Studio" value={b.name} onChange={(e) => set({ name: e.target.value })} />
        </Section>

        <Section icon="palette" title="Brand colours">
          <div className="col gap-8">
            <span className="t-l12 c2">Primary — buttons and store</span>
            <Swatches value={b.primary} onChange={(c) => set({ primary: c })} colors={BRAND_COLOURS} />
          </div>
          <div className="col gap-8">
            <span className="t-l12 c2">Accent — favourites and badges</span>
            <Swatches value={b.accent} onChange={(c) => set({ accent: c })} colors={ACCENTS} />
          </div>
        </Section>

        <Section icon="text_fields" title="Brand fonts" hint="Applied to gallery titles and descriptions.">
          <div className="col gap-8">
            <span className="t-l12 c2">Heading</span>
            <div className="hscroll hide-scrollbar" style={{ gap: 8, margin: "0 -20px", padding: "2px 20px 4px" }}>
              {TITLE_FONTS.map((f) => (
                <button key={f.name} className={`font-chip ${(b.headingFont || draft.theme.font) === f.name ? "on" : ""}`} style={{ fontFamily: fontStack(f.name) }} onClick={() => set({ headingFont: f.name })}>{f.name}</button>
              ))}
            </div>
          </div>
          <div className="col gap-8">
            <span className="t-l12 c2">Body</span>
            <div className="hscroll hide-scrollbar" style={{ gap: 8, margin: "0 -20px", padding: "2px 20px 4px" }}>
              {DESC_FONTS.map((f) => (
                <button key={f.name} className={`font-chip ${(b.bodyFont || draft.theme.descFont) === f.name ? "on" : ""}`} style={{ fontFamily: fontStack(f.name), fontSize: 15 }} onClick={() => set({ bodyFont: f.name })}>{f.name}</button>
              ))}
            </div>
          </div>
        </Section>

        <Section icon="contact_mail" title="Contact details" hint="Shown in your gallery footer.">
          <Field icon="mail" type="email" placeholder="hello@yourstudio.com" value={b.email} onChange={(e) => set({ email: e.target.value })} />
          <Field icon="call" type="tel" placeholder="+1 555 010 2030" value={b.phone} onChange={(e) => set({ phone: e.target.value })} />
          <Field icon="language" placeholder="yourstudio.com" value={b.website} onChange={(e) => set({ website: e.target.value })} />
        </Section>

        <Section icon="share" title="Social links">
          <Field icon="photo_camera" placeholder="Instagram handle" value={b.instagram} onChange={(e) => set({ instagram: e.target.value })} />
          <Field icon="thumb_up" placeholder="Facebook page" value={b.facebook} onChange={(e) => set({ facebook: e.target.value })} />
          <Field icon="tag" placeholder="X / TikTok handle" value={b.x} onChange={(e) => set({ x: e.target.value })} />
        </Section>

        <Section icon="branding_watermark" title="Watermark" hint="Protect previews. Clients still download clean files you allow.">
          <div className="row between">
            <span className="t-b14 c1">Watermark photos</span>
            <Toggle on={b.watermark.enabled} onChange={(v) => setWm({ enabled: v })} />
          </div>
          {b.watermark.enabled && (
            <>
              <Seg value={b.watermark.type} onChange={(v) => setWm({ type: v })} options={[{ value: "text", label: "Text", icon: "title" }, { value: "logo", label: "Logo", icon: "verified" }]} />
              {b.watermark.type === "logo" && !b.logo && <span className="t-b12" style={{ color: "var(--ui-type-accent--default--warning)" }}>Upload a logo above to use it as a watermark.</span>}
              {b.watermark.type === "text" && (
                <Field icon="title" placeholder={`© ${b.name || "Your Studio"}`} value={b.watermark.text} onChange={(e) => setWm({ text: e.target.value })} />
              )}
              <div className="col gap-8">
                <span className="t-l12 c2">Position</span>
                <Seg value={b.watermark.position} onChange={(v) => setWm({ position: v })} options={[{ value: "center", label: "Center" }, { value: "bottom-right", label: "Corner" }, { value: "tiled", label: "Tiled" }]} />
              </div>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Opacity <span className="c3">{Math.round(b.watermark.opacity * 100)}%</span></span>
                <input type="range" min="0.2" max="1" step="0.05" value={b.watermark.opacity} onChange={(e) => setWm({ opacity: +e.target.value })} />
              </div>
            </>
          )}
        </Section>
      </div>
      <div className="footer-bar">
        <button className="btn btn-primary btn-lg btn-block" onClick={() => onDone(b)}>
          See my branded gallery <Icon name="arrow_forward" size={20} />
        </button>
      </div>
    </div>
  );
}
