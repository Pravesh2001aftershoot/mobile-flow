import { Icon } from "../components/ui";
import { usd2 } from "../lib/store";

export default function Done({ draft, brand, order, onRestart }) {
  const items = [
    { icon: "photo_library", label: `Gallery “${draft?.name || "My first gallery"}” created`, on: !!draft },
    { icon: "palette", label: "Cover, grid and fonts designed", on: !!draft },
    { icon: "verified", label: brand ? "Brand kit saved" : "Brand kit — skipped for now", on: !!brand },
    { icon: "storefront", label: order ? `Store tested · order ${order.id} (${usd2(order.totals.total)})` : "Print store — not turned on yet", on: !!order },
  ];
  return (
    <div className="screen">
      <div className="scroll col" style={{ padding: "64px 24px 24px", gap: 16 }}>
        <div className="check-burst"><Icon name="check" size={24} /></div>
        <h1 className="t-h1 c0" style={{ margin: "8px 0 0" }}>You're all set</h1>
        <p className="t-b14 c2" style={{ margin: 0 }}>Your first gallery is ready to share. Here's what you did:</p>
        <ul className="recap">
          {items.map((i) => (
            <li key={i.label}>
              <Icon name={i.on ? "check_circle" : i.icon} size={20} fill={i.on} className={i.on ? "c-success" : "c3"} />
              <span className={`t-b14 ${i.on ? "c1" : "c3"}`}>{i.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-bar" style={{ flexDirection: "column", borderTop: "none" }}>
        <button className="btn btn-primary btn-lg btn-block" onClick={onRestart}>
          Go to my dashboard <Icon name="arrow_forward" size={20} />
        </button>
        <button className="btn btn-ghost btn-block" onClick={onRestart}>
          <Icon name="replay" size={16} /> Restart the tour
        </button>
      </div>
    </div>
  );
}
