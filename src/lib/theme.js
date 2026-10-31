// Gallery theme model — mirrors production `albumTheme` (coverTemplateId, fonts,
// backgroundColor, grid{gridSize, gridSpacing, layoutStrategy}).

export const IMG_BASE = "https://ik.imagekit.io/dwzdwysifn/cdnProd/";

/** Resolve a photo to a URL. Uploaded photos carry `src`; sample photos carry a CDN `path`. */
export const img = (p, w = 800) => (p?.src ? p.src : `${IMG_BASE}tr:w-${w},c-at_max,q-75/${p.path}`);

// Production template ids (subset that reads well on a phone).
export const TEMPLATES = [
  { id: "editorial-love", label: "Editorial Love" },
  { id: "side-note", label: "Side Note" },
  { id: "side-story", label: "Side Story" },
  { id: "center-stage", label: "Pure Elegance" },
  { id: "overlay-center", label: "Overlay Center" },
  { id: "overlay-bottom-center", label: "Overlay Bottom" },
  { id: "split-top", label: "Split Top" },
  { id: "framed-modern", label: "Framed Modern" },
  { id: "minimal-centered", label: "Minimal Arch" },
  { id: "bottom-story", label: "Bottom Story" },
];

export const TITLE_FONTS = [
  { name: "Playfair Display", cat: "serif" },
  { name: "Cormorant Garamond", cat: "serif" },
  { name: "DM Serif Display", cat: "serif" },
  { name: "Lora", cat: "serif" },
  { name: "Montserrat", cat: "sans-serif" },
  { name: "Plus Jakarta Sans", cat: "sans-serif" },
  { name: "Josefin Sans", cat: "sans-serif" },
  { name: "Noto Sans", cat: "sans-serif" },
  { name: "Great Vibes", cat: "cursive" },
];

export const DESC_FONTS = [
  { name: "Afacad", cat: "sans-serif" },
  { name: "Poppins", cat: "sans-serif" },
  { name: "Inter", cat: "sans-serif" },
  { name: "Montserrat", cat: "sans-serif" },
  { name: "Sen", cat: "sans-serif" },
  { name: "Lora", cat: "serif" },
  { name: "Noto Sans", cat: "sans-serif" },
];

const ALL_FONTS = [...TITLE_FONTS, ...DESC_FONTS, { name: "Geist", cat: "sans-serif" }];
export const fontStack = (name) => {
  const f = ALL_FONTS.find((x) => x.name === name);
  return `'${name}', ${f ? f.cat : "sans-serif"}`;
};

// Production swatches — background paints the cover only, like the live product.
export const BG_SWATCHES = ["#FFFFFF", "#F5F5F5", "#F0EDE5", "#1A1A1A", "#000000", "#3B3B3B"];

export const SPACING = { none: 0, thin: 4, spaced: 10, airy: 20 };
export const MASONRY_COLS = { small: 3, medium: 2, large: 1 };
export const ROW_HEIGHT = { small: 96, medium: 150, large: 230 };

export const isDark = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
};

/** Pick readable title/description colours for a background. */
export const textForBg = (bg) =>
  isDark(bg) ? { textColor: "#F5F5F5", descColor: "#C6C6C6" } : { textColor: "#474747", descColor: "#777777" };

export const DEFAULT_THEME = {
  template: "side-note",
  bg: "#FFFFFF",
  font: "Playfair Display",
  fontWeight: "500",
  textColor: "#474747",
  descFont: "Afacad",
  descColor: "#777777",
  gridSize: "medium",
  gridSpacing: "thin",
  layout: "masonry",
};

export const formatDate = (iso) => {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

export const slugify = (s) =>
  (s || "my-gallery").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-gallery";
