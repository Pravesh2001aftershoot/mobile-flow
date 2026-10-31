import { useCallback, useEffect, useRef, useState } from "react";
import samples from "./data/samples.json";
import { DEFAULT_THEME } from "./lib/theme";
import { Icon } from "./components/ui";
import Welcome from "./screens/Welcome";
import Samples from "./screens/Samples";
import SampleViewer from "./screens/SampleViewer";
import Upload from "./screens/Upload";
import Building from "./screens/Building";
import Editor from "./screens/Editor";
import { PersonalizePrompt, MonetizePrompt } from "./screens/Prompts";
import BrandKit from "./screens/BrandKit";
import Reveal from "./screens/Reveal";
import Store from "./screens/Store";
import Done from "./screens/Done";

export const EMPTY_BRAND = {
  logo: null,
  logoInvert: false,
  name: "",
  primary: "#18181B",
  accent: "#F43F5E",
  headingFont: null,
  bodyFont: null,
  email: "",
  phone: "",
  website: "",
  instagram: "",
  facebook: "",
  x: "",
  watermark: { enabled: false, type: "text", text: "", position: "bottom-right", opacity: 0.6 },
};

const draftFromSample = (s) => ({
  source: "sample",
  name: s.name,
  description: s.description,
  date: s.eventDate,
  cover: s.cover,
  photos: s.photos.slice(0, 30),
  setName: s.setName,
  theme: { ...DEFAULT_THEME, ...s.theme },
  fallbackLogo: { dark: s.photographer.logoDark, light: s.photographer.logoLight },
});

// `?jump=<screen>` opens a screen directly with demo data (QA / sharing a single step).
const JUMP = new URLSearchParams(location.search).get("jump");
const JUMP_SAMPLE = samples.find((s) => s.key === (new URLSearchParams(location.search).get("sample") || "chasing-light")) || samples[0];
const DEMO_BRAND = {
  ...EMPTY_BRAND_DEFAULTS(),
  name: "Golden Hour Studio",
  primary: "#8A6E4B",
  email: "hello@goldenhour.studio",
  website: "goldenhour.studio",
  instagram: "goldenhour.studio",
};
function EMPTY_BRAND_DEFAULTS() {
  return JSON.parse(JSON.stringify(EMPTY_BRAND));
}

export default function App() {
  const [stack, setStack] = useState(() => (JUMP ? ["welcome", JUMP] : ["welcome"]));
  const screen = stack[stack.length - 1];
  const [visited, setVisited] = useState(() => new Set());
  const [sample, setSample] = useState(JUMP ? JUMP_SAMPLE : null);
  const [draft, setDraft] = useState(JUMP && !["welcome", "samples", "viewer", "upload"].includes(JUMP) ? draftFromSample(JUMP_SAMPLE) : null);
  const [brand, setBrand] = useState(JUMP && ["reveal", "monetize", "store", "done"].includes(JUMP) ? DEMO_BRAND : null);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  // Each forward step pushes a browser history entry, so the phone's back gesture walks the flow.
  const go = useCallback((s, { replace } = {}) => {
    if (!replace) history.pushState({ s }, "");
    setStack((st) => (replace ? [...st.slice(0, -1), s] : [...st, s]));
  }, []);
  const back = useCallback(() => history.back(), []);
  useEffect(() => {
    const onPop = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const reset = () => {
    setStack(["welcome"]);
    setDraft(null);
    setBrand(null);
    setCart([]);
    setOrder(null);
    setVisited(new Set());
  };

  const showToast = useCallback((msg, icon = "check_circle") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, icon, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const openSample = (s) => {
    setSample(s);
    setVisited((v) => new Set(v).add(s.key));
    go("viewer");
  };

  const props = { go, back, toast: showToast };

  return (
    <div className="frame-outer">
      <div className="frame">
        {screen === "welcome" && <Welcome {...props} samples={samples} />}
        {screen === "samples" && <Samples {...props} samples={samples} visited={visited} onOpen={openSample} />}
        {screen === "viewer" && sample && (
          <SampleViewer
            {...props}
            sample={sample}
            onCreate={() => go("upload")}
            onEdit={() => {
              setDraft(draftFromSample(sample));
              go("editor");
            }}
          />
        )}
        {screen === "upload" && (
          <Upload
            {...props}
            samples={samples}
            onDone={(d) => {
              setDraft({ source: "upload", setName: "Highlights", theme: { ...DEFAULT_THEME }, fallbackLogo: null, ...d });
              go("building");
            }}
          />
        )}
        {screen === "building" && draft && <Building draft={draft} onDone={() => go("editor", { replace: true })} />}
        {screen === "editor" && draft && <Editor {...props} draft={draft} setDraft={setDraft} onNext={() => go("personalize")} />}
        {screen === "personalize" && draft && (
          <PersonalizePrompt {...props} draft={draft} onYes={() => go("brandkit")} onNo={() => go("reveal")} />
        )}
        {screen === "brandkit" && draft && (
          <BrandKit
            {...props}
            draft={draft}
            initial={brand || EMPTY_BRAND}
            onDone={(b) => {
              setBrand(b);
              setDraft((d) => ({
                ...d,
                theme: { ...d.theme, font: b.headingFont || d.theme.font, descFont: b.bodyFont || d.theme.descFont },
              }));
              go("reveal");
            }}
          />
        )}
        {screen === "reveal" && draft && <Reveal {...props} draft={draft} brand={brand} onNext={() => go("monetize")} />}
        {screen === "monetize" && draft && (
          <MonetizePrompt {...props} draft={draft} brand={brand} onYes={() => go("store")} onNo={() => go("done")} />
        )}
        {screen === "store" && draft && (
          <Store
            {...props}
            draft={draft}
            brand={brand}
            cart={cart}
            setCart={setCart}
            onOrdered={(o) => {
              setOrder(o);
              setCart([]);
            }}
            onFinish={() => go("done")}
          />
        )}
        {screen === "done" && <Done draft={draft} brand={brand} order={order} onRestart={reset} />}

        {toast && (
          <div key={toast.id} className="toast t-l13">
            <Icon name={toast.icon} size={16} fill />
            {toast.msg}
          </div>
        )}
      </div>
      <p className="frame-hint t-b12">Mobile-first prototype. Open on a phone or keep this window narrow for the real feel.</p>
    </div>
  );
}
