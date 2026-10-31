import { useEffect, useRef, useState } from "react";

export const Icon = ({ name, size = 20, fill = false, className = "", style }) => (
  <span className={`material-symbols-outlined ${fill ? "icon-fill" : ""} ${className}`} style={{ fontSize: size, ...style }}>
    {name}
  </span>
);

export const IconBtn = ({ icon, onClick, label, solid, size = 20, fill, className = "", style, children }) => (
  <button className={`icon-btn ${solid ? "solid" : ""} ${className}`} onClick={onClick} aria-label={label} style={style}>
    <Icon name={icon} size={size} fill={fill} />
    {children}
  </button>
);

const STEPS = ["Upload", "Design", "Brand", "Share", "Sell"];

/** Builder progress — shown from upload onwards. `step` is 1-based. */
export const Progress = ({ step }) => (
  <>
    <div className="progress-label row between">
      <span className="t-sub c3">
        Step {step} of {STEPS.length}
      </span>
      <span className="t-l12 c2">{STEPS[step - 1]}</span>
    </div>
    <div className="progress">
      {STEPS.map((s, i) => (
        <span key={s} className={i < step ? "on" : ""} />
      ))}
    </div>
  </>
);

export const TopBar = ({ onBack, title, right, icon = "arrow_back" }) => (
  <div className="topbar">
    {onBack ? <IconBtn icon={icon} onClick={onBack} label="Back" /> : <span style={{ width: 40 }} />}
    <div className="title t-h4 c0">{title}</div>
    {right || <span style={{ width: 40 }} />}
  </div>
);

export const Seg = ({ value, onChange, options }) => (
  <div className="seg">
    {options.map((o) => (
      <button key={o.value} className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>
        {o.icon && <Icon name={o.icon} size={16} />}
        {o.label}
      </button>
    ))}
  </div>
);

export const Toggle = ({ on, onChange }) => (
  <button className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} />
);

export const Swatches = ({ value, onChange, colors, custom = true }) => (
  <div className="row gap-10" style={{ flexWrap: "wrap", gap: "var(--ui-spacing-10)" }}>
    {colors.map((c) => (
      <button key={c} className={`swatch ${value.toUpperCase() === c.toUpperCase() ? "on" : ""}`} style={{ background: c }} onClick={() => onChange(c)} aria-label={c} />
    ))}
    {custom && (
      <label
        className={`swatch ${colors.every((c) => c.toUpperCase() !== value.toUpperCase()) ? "on" : ""}`}
        style={{ background: "conic-gradient(#f43f5e, #f59e0b, #22c55e, #3b82f6, #a855f7, #f43f5e)" }}
        aria-label="Custom colour"
      >
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    )}
  </div>
);

/** Track an element's width (used by the justified grid and scaled previews). */
export const useWidth = () => {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
};

/** Read a File into an object URL plus natural dimensions. */
export const loadImageFile = (file) =>
  new Promise((resolve) => {
    const src = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => resolve({ id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`, src, w: im.naturalWidth, h: im.naturalHeight, name: file.name });
    im.onerror = () => resolve(null);
    im.src = src;
  });
