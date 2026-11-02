import { useState } from "react";
import GalleryView from "../components/GalleryView";
import { Icon, IconBtn } from "../components/ui";

const TIPS = [
  { icon: "auto_awesome", title: "This is the cover", body: "Your client's first impression. Scroll down to open the gallery." },
  { icon: "touch_app", title: "Tap any photo", body: "It opens full-screen. Swipe to browse, tap the heart to favourite." },
  { icon: "favorite", title: "Clients can favourite & download", body: "Hearts sync back to you, so you know which shots they love." },
];

export default function SampleViewer({ back, sample, onCreate, onEdit, toast }) {
  const [tip, setTip] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [inLightbox, setInLightbox] = useState(false);
  const [seenGrid, setSeenGrid] = useState(false);
  const [past, setPast] = useState(false);

  const data = {
    name: sample.name,
    description: sample.description,
    date: sample.eventDate,
    cover: sample.cover,
    photos: sample.photos,
    setName: sample.setName,
  };

  const showTip = !dismissed && !inLightbox && TIPS[tip];

  return (
    <div className="screen" style={{ background: "#fff" }}>
      <GalleryView
        data={data}
        theme={sample.theme}
        fallbackLogo={{ dark: sample.photographer.logoDark, light: sample.photographer.logoLight, links: sample.photographer }}
        bottomPad={170}
        coverInset={136}
        navInset={past ? 64 : 0}
        onToast={toast}
        onScroll={({ pastCover }) => {
          setPast(pastCover);
          if (pastCover && !seenGrid) {
            setSeenGrid(true);
            if (tip === 0) setTip(1);
          }
        }}
        onLightbox={(open) => {
          setInLightbox(open);
          if (open && tip === 1) setTip(2);
        }}
      />

      {!inLightbox && (
        <>
          <div className="float-top">
            <IconBtn icon="arrow_back" solid onClick={back} label="Back to samples" style={past ? { marginTop: -6 } : undefined} />
            {!past && (
              <span className="pill t-l12">
                <Icon name="visibility" size={16} /> Client view · {sample.category}
              </span>
            )}
          </div>
          {showTip && <div style={{ position: "absolute", top: past ? 60 : 64, left: 12, right: 12, zIndex: 20 }}><div className="tip">
                <span className="ic">
                  <Icon name={showTip.icon} size={16} fill />
                </span>
                <span className="col grow gap-2" style={{ gap: 2 }}>
                  <span className="t-h4 c0">{showTip.title}</span>
                  <span className="t-b12 c2">{showTip.body}</span>
                </span>
                <IconBtn icon="close" size={16} onClick={() => setDismissed(true)} label="Dismiss tip" style={{ width: 28, height: 28 }} />
              </div></div>}
          <div className="float-bar" style={{ background: "var(--ui-surface-0)" }}>
            <button className="btn btn-primary btn-lg btn-block" onClick={onCreate}>
              <Icon name="add_photo_alternate" size={20} fill /> Create your own
            </button>
            <button className="btn btn-secondary btn-lg btn-block" onClick={onEdit}>
              <Icon name="tune" size={20} /> Edit this one
            </button>
          </div>
        </>
      )}
    </div>
  );
}
