import { img } from "../lib/theme";
import { Icon } from "../components/ui";

export default function Welcome({ go, samples }) {
  const pick = (k, i) => samples.find((s) => s.key === k)?.photos[i];
  const shots = [
    { p: samples.find((s) => s.key === "chasing-light").cover, style: { left: "6%", top: 40, width: "46%", height: 240, "--r": "-7deg", animationDelay: "0ms" } },
    { p: samples.find((s) => s.key === "family-shoot").cover, style: { right: "6%", top: 10, width: "44%", height: 220, "--r": "6deg", animationDelay: "120ms" } },
    { p: pick("forever-begins-here", 3) || samples[1].cover, style: { left: "27%", top: 140, width: "48%", height: 230, "--r": "-1deg", animationDelay: "240ms", zIndex: 2 } },
  ];
  return (
    <div className="screen">
      <div className="topbar">
        <span className="row gap-8 t-h4 c0" style={{ paddingLeft: 8 }}>
          <Icon name="photo_library" size={20} fill /> Aftershoot Galleries
        </span>
      </div>
      <div className="scroll col">
        <div className="collage">
          {shots.map((s, i) => (
            <img key={i} src={img(s.p, 600)} alt="" style={{ ...s.style, transform: `rotate(${s.style["--r"]})` }} />
          ))}
        </div>
        <div className="pad col gap-12" style={{ marginTop: 8 }}>
          <span className="t-sub c-accent">You're in — welcome</span>
          <h1 className="t-h1 c0" style={{ margin: 0 }}>Galleries your clients will love to open</h1>
          <p className="t-b14 c2" style={{ margin: 0 }}>
            Take a quick tour of real client galleries, then build your own in under two minutes — no setup needed.
          </p>
        </div>
      </div>
      <div className="footer-bar col" style={{ flexDirection: "column", borderTop: "none" }}>
        <button className="btn btn-primary btn-lg btn-block" onClick={() => go("samples")}>
          Explore sample galleries <Icon name="arrow_forward" size={20} />
        </button>
        <button className="btn btn-ghost btn-block" onClick={() => go("upload")}>
          Skip, I'll create my own
        </button>
      </div>
    </div>
  );
}
