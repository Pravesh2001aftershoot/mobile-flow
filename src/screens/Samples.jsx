import { useRef, useState } from "react";
import { img } from "../lib/theme";
import { Icon, TopBar } from "../components/ui";

const CATS = ["All", "Wedding", "Portraits", "Family", "Other"];

export default function Samples({ back, go, samples, visited, onOpen }) {
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const list = cat === "All" ? samples : samples.filter((s) => s.category === cat);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const card = el.firstElementChild?.offsetWidth || 1;
    setActive(Math.round(el.scrollLeft / (card + 12)));
  };
  const pickCat = (c) => {
    setCat(c);
    setActive(0);
    ref.current?.scrollTo({ left: 0 });
  };

  return (
    <div className="screen">
      <TopBar onBack={back} />
      <div className="scroll col">
        <div className="pad col gap-8" style={{ marginBottom: 16 }}>
          <h1 className="t-h1 c0" style={{ margin: 0 }}>See it as your clients do</h1>
          <p className="t-b14 c2" style={{ margin: 0 }}>
            Open any gallery to scroll, favourite and view photos full-screen — exactly as a client would.
          </p>
        </div>

        <div className="row gap-8 hide-scrollbar" style={{ overflowX: "auto", padding: "0 20px 16px" }}>
          {CATS.map((c) => (
            <button key={c} className={`chip ${cat === c ? "active" : ""}`} onClick={() => pickCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <div ref={ref} className="carousel hide-scrollbar" onScroll={onScroll}>
          {list.map((s) => (
            <button key={s.key} className="sample-card" onClick={() => onOpen(s)}>
              <img className="bg" src={img(s.cover, 700)} alt="" style={{ objectPosition: `${s.cover.fx}% ${s.cover.fy}%` }} />
              <div className="shade" />
              <span className="badge t-l11">{s.category}</span>
              {visited.has(s.key) && (
                <span className="seen t-l11">
                  <Icon name="check" size={12} /> Viewed
                </span>
              )}
              <div className="meta">
                <span className="t-h2" style={{ fontFamily: `'${s.theme.font}', serif` }}>{s.name}</span>
                <span className="t-b12" style={{ opacity: 0.8 }}>
                  {s.imageCount} photos · {s.theme.layout === "masonry" ? "Vertical" : "Horizontal"} grid
                </span>
                <div className="row between">
                  <div className="thumbs">
                    {s.photos.slice(1, 4).map((p) => (
                      <img key={p.id} src={img(p, 120)} alt="" />
                    ))}
                  </div>
                  <span className="btn btn-white btn-sm">
                    Open <Icon name="arrow_forward" size={16} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="dots">
          {list.map((s, i) => (
            <span key={s.key} className={i === active ? "on" : ""} />
          ))}
        </div>
      </div>
      <div className="footer-bar" style={{ flexDirection: "column" }}>
        <span className="t-b12 c3" style={{ textAlign: "center" }}>
          {visited.size > 0 ? `You've explored ${visited.size} of ${samples.length}` : "Tip: swipe the cards to see more styles"}
        </span>
        <button className={`btn btn-lg btn-block ${visited.size > 0 ? "btn-primary" : "btn-secondary"}`} onClick={() => go("upload")}>
          <Icon name="add_photo_alternate" size={20} /> Create my own gallery
        </button>
      </div>
    </div>
  );
}
