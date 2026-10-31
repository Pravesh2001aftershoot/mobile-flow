import { useEffect, useRef, useState } from "react";
import { img } from "../lib/theme";
import { Icon, Progress, TopBar, loadImageFile } from "../components/ui";

const MAX = 10;

export default function Upload({ back, toast, samples, onDone }) {
  const [name, setName] = useState("My first gallery");
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState({});
  const [drag, setDrag] = useState(false);
  const input = useRef(null);

  // Photos stay in the browser; this only animates a believable upload.
  useEffect(() => {
    const pending = photos.filter((p) => (progress[p.id] ?? 0) < 100);
    if (!pending.length) return;
    const t = setTimeout(() => {
      setProgress((pr) => {
        const n = { ...pr };
        pending.slice(0, 3).forEach((p) => (n[p.id] = Math.min(100, (n[p.id] ?? 0) + 18 + Math.random() * 22)));
        return n;
      });
    }, 90);
    return () => clearTimeout(t);
  }, [photos, progress]);

  const addFiles = async (files) => {
    const imgs = [...files].filter((f) => f.type.startsWith("image/"));
    const room = MAX - photos.length;
    if (imgs.length > room) toast(room > 0 ? `Max ${MAX} photos — added the first ${room}` : `You've hit the ${MAX}-photo limit`, "info");
    const loaded = (await Promise.all(imgs.slice(0, Math.max(0, room)).map(loadImageFile))).filter(Boolean);
    setPhotos((p) => [...p, ...loaded].slice(0, MAX));
  };

  const useSamples = () => {
    const s = samples.find((x) => x.key === "chasing-light");
    const picked = s.photos.slice(0, MAX).map((p) => ({ ...p, id: `demo-${p.id}` }));
    setPhotos(picked);
    setProgress({});
    setName("Chasing Light");
  };

  const remove = (id) => setPhotos((p) => p.filter((x) => x.id !== id));
  const uploading = photos.some((p) => (progress[p.id] ?? 0) < 100);

  const done = () => {
    const c = photos[0];
    onDone({
      name: name.trim() || "My first gallery",
      description: "",
      date: new Date().toISOString(),
      photos,
      cover: { ...c, fx: 50, fy: 50 },
    });
  };

  return (
    <div className="screen">
      <TopBar onBack={back} title="Create your gallery" />
      <Progress step={1} />
      <div className="scroll pad col gap-20" style={{ paddingTop: 8, paddingBottom: 24 }}>
        <div className="field">
          <label htmlFor="gname">Gallery name</label>
          <input id="gname" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emma & James" />
        </div>

        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

        {photos.length === 0 ? (
          <div
            className={`dropzone ${drag ? "drag" : ""}`}
            onClick={() => input.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          >
            <span className="big"><Icon name="add_photo_alternate" size={24} /></span>
            <span className="t-h3 c0">Add up to {MAX} photos</span>
            <span className="t-b13 c2">From your camera roll. They stay on this device — nothing is uploaded.</span>
            <span className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>Choose photos</span>
          </div>
        ) : (
          <div className="col gap-12">
            <div className="row between">
              <span className="t-h4 c0">{photos.length} of {MAX} photos</span>
              <span className="t-b12 c3">{uploading ? "Preparing…" : "First photo is your cover"}</span>
            </div>
            <div className="upgrid">
              {photos.map((p, i) => (
                <div key={p.id} className="cell">
                  <img src={img(p, 300)} alt="" />
                  <button className="x" onClick={() => remove(p.id)} aria-label="Remove"><Icon name="close" size={16} /></button>
                  {i === 0 && <span className="cover-tag t-l10">Cover</span>}
                  {(progress[p.id] ?? 0) < 100 && <div className="prog"><i style={{ width: `${progress[p.id] ?? 4}%` }} /></div>}
                </div>
              ))}
              {photos.length < MAX && (
                <button className="cell add" onClick={() => input.current.click()}>
                  <Icon name="add" size={24} />
                  <span className="t-l11">Add</span>
                </button>
              )}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <button className="btn btn-ghost btn-block" onClick={useSamples}>
            <Icon name="photo_library" size={16} /> No photos handy? Use sample photos
          </button>
        )}
      </div>
      <div className="footer-bar">
        <button className="btn btn-primary btn-lg btn-block" disabled={!photos.length || uploading} onClick={done}>
          Build my gallery <Icon name="arrow_forward" size={20} />
        </button>
      </div>
    </div>
  );
}
