import { useState } from "react";
import GalleryView, { MiniCover, ScaledDevice } from "../components/GalleryView";
import { Icon, IconBtn, Progress, Seg, Swatches, TopBar } from "../components/ui";
import { BG_SWATCHES, DESC_FONTS, TEMPLATES, TITLE_FONTS, fontStack, img, textForBg } from "../lib/theme";

const TABS = [
  { id: "cover", label: "Cover", icon: "web_stories" },
  { id: "grid", label: "Grid", icon: "grid_view" },
  { id: "type", label: "Type", icon: "text_fields" },
  { id: "colour", label: "Colour", icon: "palette" },
];

export default function Editor({ back, draft, setDraft, onNext, toast }) {
  const [tab, setTab] = useState("cover");
  const [full, setFull] = useState(false);
  const t = draft.theme;
  const setTheme = (patch) => setDraft((d) => ({ ...d, theme: { ...d.theme, ...patch } }));
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const data = { name: draft.name, description: draft.description, date: draft.date, cover: draft.cover, photos: draft.photos, setName: draft.setName };
  const focus = tab === "grid" ? "grid" : "cover";

  if (full)
    return (
      <div className="screen" style={{ background: "#fff" }}>
        <GalleryView data={data} theme={t} fallbackLogo={draft.fallbackLogo} onToast={toast} />
        <div className="float-top">
          <IconBtn icon="close" solid onClick={() => setFull(false)} label="Close preview" />
          <span className="pill t-l12"><Icon name="visibility" size={16} /> Preview</span>
        </div>
      </div>
    );

  return (
    <div className="screen">
      <TopBar
        onBack={back}
        title="Design your gallery"
        right={<button className="btn btn-primary btn-sm" onClick={onNext}>Next</button>}
      />
      <Progress step={2} />

      <div className="editor-preview">
        <div className="device">
          <ScaledDevice>
            <GalleryView data={data} theme={t} fallbackLogo={draft.fallbackLogo} focus={focus} onToast={toast} />
          </ScaledDevice>
        </div>
        <IconBtn icon="open_in_full" solid size={16} className="collapse-btn" style={{ top: "auto", bottom: 12, right: 52, width: 32, height: 32 }} onClick={() => setFull(true)} label="Full-screen preview" />
      </div>

      <div className="sheet">
        <div className="tabs">
          {TABS.map((x) => (
            <button key={x.id} className={tab === x.id ? "on" : ""} onClick={() => setTab(x.id)}>
              <Icon name={x.icon} size={20} fill={tab === x.id} />
              {x.label}
            </button>
          ))}
        </div>

        <div className="sheet-body" key={tab}>
          {tab === "cover" && (
            <>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Cover style <span className="t-b12 c3">{TEMPLATES.find((x) => x.id === t.template)?.label}</span></span>
                <div className="hscroll hide-scrollbar">
                  {TEMPLATES.map((x) => (
                    <button key={x.id} className={`tpl ${t.template === x.id ? "on" : ""}`} onClick={() => setTheme({ template: x.id })}>
                      <div className="mini">
                        <MiniCover width={74} height={134} data={data} theme={{ ...t, template: x.id }} fallbackLogo={draft.fallbackLogo} />
                      </div>
                      <span className="t-l11">{x.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Cover photo</span>
                <div className="hscroll hide-scrollbar" style={{ gap: 8 }}>
                  {draft.photos.slice(0, 20).map((p) => (
                    <button key={p.id} className={`cover-pick ${draft.cover.id === p.id || draft.cover.path === p.path ? "on" : ""}`} onClick={() => set({ cover: { ...p, fx: 50, fy: 50 } })}>
                      <img src={img(p, 160)} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "grid" && (
            <>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Layout</span>
                <Seg value={t.layout} onChange={(v) => setTheme({ layout: v })} options={[{ value: "masonry", label: "Vertical", icon: "view_column" }, { value: "justified", label: "Horizontal", icon: "view_agenda" }]} />
              </div>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Thumbnail size</span>
                <Seg value={t.gridSize} onChange={(v) => setTheme({ gridSize: v })} options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }]} />
              </div>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Spacing</span>
                <Seg value={t.gridSpacing} onChange={(v) => setTheme({ gridSpacing: v })} options={[{ value: "none", label: "None" }, { value: "thin", label: "Thin" }, { value: "spaced", label: "Spaced" }, { value: "airy", label: "Airy" }]} />
              </div>
            </>
          )}

          {tab === "type" && (
            <>
              <div className="field">
                <label>Title</label>
                <input className="input" value={draft.name} onChange={(e) => set({ name: e.target.value })} />
              </div>
              <div className="field">
                <label>Description</label>
                <input className="input" value={draft.description} placeholder="A line about the day (optional)" onChange={(e) => set({ description: e.target.value })} />
              </div>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Title font</span>
                <div className="hscroll hide-scrollbar" style={{ gap: 8 }}>
                  {TITLE_FONTS.map((f) => (
                    <button key={f.name} className={`font-chip ${t.font === f.name ? "on" : ""}`} style={{ fontFamily: fontStack(f.name) }} onClick={() => setTheme({ font: f.name })}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col gap-8">
                <span className="ctrl-label t-l12">Description font</span>
                <div className="hscroll hide-scrollbar" style={{ gap: 8 }}>
                  {DESC_FONTS.map((f) => (
                    <button key={f.name} className={`font-chip ${t.descFont === f.name ? "on" : ""}`} style={{ fontFamily: fontStack(f.name), fontSize: 15 }} onClick={() => setTheme({ descFont: f.name })}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "colour" && (
            <>
              <div className="col gap-12">
                <span className="ctrl-label t-l12">Cover background</span>
                <Swatches value={t.bg} onChange={(c) => setTheme({ bg: c, ...textForBg(c) })} colors={BG_SWATCHES} />
                <span className="t-b12 c3">Shows behind the cover around the photo and text.</span>
              </div>
              <div className="col gap-12">
                <span className="ctrl-label t-l12">Title colour</span>
                <Swatches value={t.textColor} onChange={(c) => setTheme({ textColor: c })} colors={["#18181B", "#474747", "#8A6E4B", "#F5F5F5"]} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
