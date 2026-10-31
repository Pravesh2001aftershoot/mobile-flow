import { useEffect, useState } from "react";
import { img } from "../lib/theme";
import { Icon } from "../components/ui";

const STEPS = ["Optimising your photos", "Choosing a cover", "Laying out the grid", "Adding finishing touches"];

export default function Building({ draft, onDone }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= STEPS.length) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI(i + 1), 650);
    return () => clearTimeout(t);
  }, [i]);

  const stack = draft.photos.slice(0, 3);
  return (
    <div className="screen col center gap-32" style={{ padding: 24, gap: "var(--ui-spacing-40)" }}>
      <div className="stack">
        {stack.map((p, k) => (
          <img key={p.id} src={img(p, 400)} alt="" style={{ "--r": `${(k - 1) * 6}deg`, animationDelay: `${k * 200}ms`, zIndex: k }} />
        ))}
      </div>
      <div className="col center gap-8" style={{ textAlign: "center" }}>
        <h2 className="t-h2 c0" style={{ margin: 0 }}>Building “{draft.name}”</h2>
        <p className="t-b14 c2" style={{ margin: 0 }}>{draft.photos.length} photos · this takes a few seconds</p>
      </div>
      <div className="build-steps">
        {STEPS.map((s, k) => (
          <div key={s} className={`s ${k < i ? "done" : k === i ? "on" : ""}`}>
            {k < i ? <Icon name="check_circle" size={20} fill className="c-success" /> : k === i ? <span className="spinner" /> : <Icon name="radio_button_unchecked" size={20} className="c3" />}
            <span className="t-l14 c1">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
