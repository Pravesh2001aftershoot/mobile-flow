import { MiniCover } from "../components/GalleryView";
import { Icon, TopBar } from "../components/ui";

function Prompt({ back, draft, brand, chips, eyebrow, title, body, yes, no, onYes, onNo, step }) {
  const data = { name: draft.name, description: draft.description, date: draft.date, cover: draft.cover, photos: draft.photos };
  return (
    <div className="screen">
      <TopBar onBack={back} />
      <div className="scroll col" style={{ justifyContent: "center", paddingBottom: 16 }}>
        <div className="prompt-art">
          <div className="phone">
            <MiniCover width={192} height={292} data={data} theme={draft.theme} brand={brand} fallbackLogo={draft.fallbackLogo} />
          </div>
          {chips.map((c, i) => (
            <span key={c.label} className="float t-l12 c0" style={{ ...c.pos, animationDelay: `${i * 400}ms` }}>
              <Icon name={c.icon} size={16} fill className="c-accent" /> {c.label}
            </span>
          ))}
        </div>
        <div className="pad col gap-8" style={{ marginTop: 32, textAlign: "center", alignItems: "center" }}>
          <span className="t-sub c-accent">{eyebrow}</span>
          <h1 className="t-h1 c0" style={{ margin: 0 }}>{title}</h1>
          <p className="t-b14 c2" style={{ margin: 0, maxWidth: 320 }}>{body}</p>
        </div>
      </div>
      <div className="footer-bar" style={{ flexDirection: "column", borderTop: "none" }}>
        <button className="btn btn-primary btn-lg btn-block" onClick={onYes}>{yes}</button>
        <button className="btn btn-ghost btn-block" onClick={onNo}>{no}</button>
        <span className="t-b12 c3" style={{ textAlign: "center" }}>Step {step} of 5 — you can change this any time</span>
      </div>
    </div>
  );
}

export const PersonalizePrompt = (p) => (
  <Prompt
    {...p}
    step={3}
    eyebrow="Looking good"
    title="Want to make it unmistakably yours?"
    body="Add your logo, brand colours and contact details once — they'll appear on every gallery you share."
    yes="Yes, set up my brand kit"
    no="Not now"
    chips={[
      { icon: "verified", label: "Your logo", pos: { left: -56, top: 40 } },
      { icon: "palette", label: "Brand colours", pos: { right: -64, top: 130 } },
      { icon: "contact_mail", label: "Contact info", pos: { left: -48, bottom: 40 } },
    ]}
  />
);

export const MonetizePrompt = (p) => (
  <Prompt
    {...p}
    step={5}
    eyebrow="One last question"
    title="Do you want to monetise this gallery?"
    body="Turn on a print store and clients can order prints, canvases, frames and albums right from their gallery. Printing and shipping are handled for you."
    yes="Yes, show me the client store"
    no="Maybe later"
    chips={[
      { icon: "shopping_bag", label: "Prints from $4", pos: { left: -60, top: 50 } },
      { icon: "payments", label: "You set the price", pos: { right: -70, top: 140 } },
      { icon: "local_shipping", label: "Shipped to clients", pos: { left: -56, bottom: 36 } },
    ]}
  />
);
