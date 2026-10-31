import { useState } from "react";
import GalleryView from "../components/GalleryView";
import { Logo } from "../components/Cover";
import { Icon, IconBtn } from "../components/ui";
import { FREE_SHIPPING_OVER, PRODUCTS, SHIPPING, TAX_RATE, unitPrice, usd, usd2 } from "../lib/store";
import { img } from "../lib/theme";
import "../styles/store.css";

/** CSS product mockup: orientation follows the photo, proportions follow the chosen size. */
export function Mockup({ product, sizeId, opts = {}, photo, box = 220 }) {
  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
  const landscape = photo.w > photo.h && product.kind !== "album";
  const [a, b] = size.ratio;
  const ratio = landscape ? Math.max(a, b) / Math.min(a, b) : Math.min(a, b) / Math.max(a, b);
  const w = ratio >= 1 ? box : box * ratio;
  const h = ratio >= 1 ? box / ratio : box;
  const src = img(photo, 600);

  if (product.kind === "frame") {
    const fc = product.options[0].choices.find((c) => c.id === opts.frame)?.swatch || "#1a1a1a";
    const mat = opts.mat !== "No mat";
    return (
      <div className="mk mk-frame" style={{ width: w, height: h, border: `${box * 0.05}px solid ${fc}`, background: "var(--ui-color-grey-0)", padding: mat ? box * 0.08 : 0 }}>
        <img src={src} alt="" />
      </div>
    );
  }
  if (product.kind === "album") {
    const cc = product.options[0].choices.find((c) => c.id === opts.cover)?.swatch || "#d6cfc4";
    return (
      <div className="mk mk-album" style={{ width: box * 0.9, height: box * 0.9, background: cc }}>
        <div style={{ width: "62%", height: "62%", padding: 4, background: "var(--ui-color-grey-0)" }}>
          <img src={src} alt="" />
        </div>
      </div>
    );
  }
  return (
    <div className={`mk ${product.kind === "canvas" ? "mk-canvas" : "mk-print"}`} style={{ width: w, height: h }}>
      <img src={src} alt="" />
    </div>
  );
}

const defaultOpts = (p) => Object.fromEntries(p.options.map((o) => [o.id, o.choices[0].id]));

function StoreHome({ brand, photos, onClose, onPick, cartCount, onCart, accent }) {
  return (
    <>
      <div className="topbar">
        <IconBtn icon="close" onClick={onClose} label="Close store" />
        <div className="title t-h4">Print Store</div>
        <IconBtn icon="shopping_bag" onClick={onCart} label="Bag">
          {cartCount > 0 && <span className="count" style={{ background: accent }}>{cartCount}</span>}
        </IconBtn>
      </div>
      <div className="scroll">
        <div className="st-hero">
          {brand && <div style={{ marginBottom: 6 }}><Logo brand={brand} height={24} /></div>}
          <span className="t-h2">Bring your favourite moments home</span>
          <span className="t-b13 c2">Professionally printed, packed with care and shipped to your door.</span>
        </div>
        <div className="st-cats">
          {PRODUCTS.map((p, i) => {
            const photo = photos[(i * 3) % photos.length];
            return (
              <button key={p.id} className="st-cat" onClick={() => onPick(p, photo)}>
                <div className="stage">
                  <Mockup product={p} sizeId={p.sizes[Math.min(2, p.sizes.length - 1)].id} opts={defaultOpts(p)} photo={photo} box={110} />
                </div>
                <span className="col" style={{ gap: 2 }}>
                  <span className="t-h4">{p.name}</span>
                  <span className="t-b12 c2">From {usd(p.sizes[0].price)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="st-trust t-l11">
          <div><Icon name="workspace_premium" size={20} />Pro-lab quality</div>
          <div><Icon name="local_shipping" size={20} />Free shipping over {usd(FREE_SHIPPING_OVER)}</div>
          <div><Icon name="verified_user" size={20} />Secure checkout</div>
        </div>
      </div>
    </>
  );
}

function Product({ product, initialPhoto, photos, onBack, onAdd, cartCount, onCart, accent }) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [sizeId, setSize] = useState(product.sizes[Math.min(2, product.sizes.length - 1)].id);
  const [opts, setOpts] = useState(defaultOpts(product));
  const [qty, setQty] = useState(1);
  const price = unitPrice(product, sizeId, opts);

  return (
    <>
      <div className="topbar">
        <IconBtn icon="arrow_back" onClick={onBack} label="Back" />
        <div className="title t-h4">{product.name}</div>
        <IconBtn icon="shopping_bag" onClick={onCart} label="Bag">
          {cartCount > 0 && <span className="count" style={{ background: accent }}>{cartCount}</span>}
        </IconBtn>
      </div>
      <div className="scroll">
        <div className="st-stage-lg">
          <Mockup product={product} sizeId={sizeId} opts={opts} photo={photo} box={220} />
        </div>
        <div className="col gap-20" style={{ padding: 20 }}>
          <div className="col" style={{ gap: 4 }}>
            <span className="t-h2">{usd(price)}</span>
            <span className="t-b13 c2">{product.blurb}</span>
          </div>

          <div className="col gap-8">
            <span className="t-l12 c2">{product.kind === "album" ? "Cover photo" : "Photo"}</span>
            <div className="st-photos hide-scrollbar">
              {photos.map((p) => (
                <button key={p.id} className={photo.id === p.id ? "on" : ""} onClick={() => setPhoto(p)}>
                  <img src={img(p, 160)} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="col gap-8">
            <span className="t-l12 c2">Size</span>
            <div className="opt-grid">
              {product.sizes.map((s) => (
                <button key={s.id} className={`opt ${sizeId === s.id ? "on" : ""}`} onClick={() => setSize(s.id)}>
                  <span className="t-l13">{s.label}</span>
                  <span className="t-b12 c2">{usd(s.price + (unitPrice(product, s.id, opts) - s.price))}</span>
                </button>
              ))}
            </div>
          </div>

          {product.options.map((o) => (
            <div key={o.id} className="col gap-8">
              <span className="t-l12 c2">{o.label}</span>
              <div className="opt-grid">
                {o.choices.map((c) => (
                  <button key={c.id} className={`opt ${opts[o.id] === c.id ? "on" : ""}`} onClick={() => setOpts((x) => ({ ...x, [o.id]: c.id }))}>
                    <span className="t-l13">
                      {c.swatch && <i className="sw" style={{ background: c.swatch }} />}
                      {c.id}
                    </span>
                    {c.add > 0 && <span className="t-b12 c2">+{usd(c.add)}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="row between">
            <span className="t-l12 c2">Quantity</span>
            <div className="stepper">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer"><Icon name="remove" size={16} /></button>
              <span className="t-l14">{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="More"><Icon name="add" size={16} /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <button
          className="btn btn-lg btn-block"
          style={{ background: accent, color: "var(--ui-type-white)" }}
          onClick={() => onAdd({ key: `${product.id}-${photo.id}-${sizeId}-${Object.values(opts).join("-")}-${Date.now()}`, product, photo, sizeId, opts, qty, price })}
        >
          <Icon name="shopping_bag" size={20} fill /> Add to bag · {usd(price * qty)}
        </button>
      </div>
    </>
  );
}

const totals = (cart, shipId = "standard") => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipBase = SHIPPING.find((s) => s.id === shipId).price;
  const shipping = shipId === "standard" && subtotal >= FREE_SHIPPING_OVER ? 0 : shipBase;
  const tax = subtotal * TAX_RATE;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
};

const Summary = ({ t }) => (
  <div className="col t-b14" style={{ gap: 2 }}>
    <div className="sum-row"><span className="c2">Subtotal</span><span>{usd2(t.subtotal)}</span></div>
    <div className="sum-row"><span className="c2">Shipping</span><span>{t.shipping === 0 ? "Free" : usd2(t.shipping)}</span></div>
    <div className="sum-row"><span className="c2">Estimated tax</span><span>{usd2(t.tax)}</span></div>
    <div className="sum-row t-h3" style={{ paddingTop: 10, borderTop: "1px solid var(--ui-edge-6)", marginTop: 6 }}><span>Total</span><span>{usd2(t.total)}</span></div>
  </div>
);

const sizeLabel = (i) => i.product.sizes.find((s) => s.id === i.sizeId).label;

function Cart({ cart, setCart, onBack, onCheckout, accent }) {
  const t = totals(cart);
  const setQty = (key, q) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: q } : i)).filter((i) => i.qty > 0));
  return (
    <>
      <div className="topbar">
        <IconBtn icon="arrow_back" onClick={onBack} label="Back" />
        <div className="title t-h4">Your bag</div>
        <span style={{ width: 40 }} />
      </div>
      <div className="scroll">
        {cart.length === 0 ? (
          <div className="col center gap-12" style={{ padding: 48, textAlign: "center" }}>
            <Icon name="shopping_bag" size={24} className="c3" />
            <span className="t-h3">Your bag is empty</span>
            <span className="t-b13 c2">Pick a favourite photo and turn it into a print.</span>
            <button className="btn btn-secondary" onClick={onBack}>Browse products</button>
          </div>
        ) : (
          <>
            {cart.map((i) => (
              <div key={i.key} className="cart-item">
                <div className="th"><Mockup product={i.product} sizeId={i.sizeId} opts={i.opts} photo={i.photo} box={56} /></div>
                <div className="col grow" style={{ gap: 2, minWidth: 0 }}>
                  <span className="t-h4">{i.product.name}</span>
                  <span className="t-b12 c2">{sizeLabel(i)} · {Object.values(i.opts).join(" · ")}</span>
                  <div className="row between" style={{ marginTop: 6 }}>
                    <div className="stepper">
                      <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Fewer"><Icon name={i.qty === 1 ? "delete" : "remove"} size={16} /></button>
                      <span className="t-l13">{i.qty}</span>
                      <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="More"><Icon name="add" size={16} /></button>
                    </div>
                    <span className="t-l14">{usd2(i.price * i.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: 20 }}>
              {t.subtotal < FREE_SHIPPING_OVER && (
                <div className="t-b12 c2" style={{ marginBottom: 12 }}>
                  Add {usd2(FREE_SHIPPING_OVER - t.subtotal)} more for free standard shipping.
                </div>
              )}
              <Summary t={t} />
            </div>
          </>
        )}
      </div>
      {cart.length > 0 && (
        <div className="footer-bar">
          <button className="btn btn-lg btn-block" style={{ background: accent, color: "var(--ui-type-white)" }} onClick={onCheckout}>
            <Icon name="lock" size={16} fill /> Checkout · {usd2(t.total)}
          </button>
        </div>
      )}
    </>
  );
}

function Checkout({ cart, onBack, onPlace, accent }) {
  const [ship, setShip] = useState("standard");
  const [f, setF] = useState({ email: "", name: "", address: "", city: "", state: "", zip: "" });
  const [placing, setPlacing] = useState(false);
  const t = totals(cart, ship);
  const inp = (k, ph, extra = {}) => <input className="input" placeholder={ph} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} {...extra} />;

  const place = () => {
    setPlacing(true);
    setTimeout(() => onPlace({ id: `AS-${Math.floor(10000 + Math.random() * 89999)}`, items: cart, totals: t, email: f.email }), 1100);
  };

  return (
    <>
      <div className="topbar">
        <IconBtn icon="arrow_back" onClick={onBack} label="Back" />
        <div className="title t-h4">Checkout</div>
        <span style={{ width: 40 }} />
      </div>
      <div className="scroll">
        <div className="section">
          <span className="t-h3">Contact</span>
          {inp("email", "Email for order updates", { type: "email" })}
        </div>
        <div className="section">
          <span className="t-h3">Ship to</span>
          {inp("name", "Full name")}
          {inp("address", "Street address")}
          <div className="row gap-8">
            {inp("city", "City")}
            <div style={{ width: 90, flexShrink: 0 }}>{inp("state", "State")}</div>
          </div>
          {inp("zip", "ZIP code", { inputMode: "numeric" })}
        </div>
        <div className="section">
          <span className="t-h3">Delivery</span>
          {SHIPPING.map((s) => {
            const free = s.id === "standard" && t.subtotal >= FREE_SHIPPING_OVER;
            return (
              <button key={s.id} className={`radio-card ${ship === s.id ? "on" : ""}`} onClick={() => setShip(s.id)}>
                <Icon name={ship === s.id ? "radio_button_checked" : "radio_button_unchecked"} size={20} />
                <span className="col grow" style={{ gap: 2 }}>
                  <span className="t-l14">{s.label}</span>
                  <span className="t-b12 c2">{s.eta}</span>
                </span>
                <span className="t-l14">{free ? "Free" : usd2(s.price)}</span>
              </button>
            );
          })}
        </div>
        <div className="section">
          <span className="t-h3">Payment</span>
          <div className="pay-box">
            <Icon name="credit_card" size={24} />
            <span className="t-b13">Card, Apple Pay and Google Pay are collected by the secure payment sheet in the live product. Nothing is charged in this prototype.</span>
          </div>
        </div>
        <div className="section">
          <span className="t-h3">Order summary</span>
          <span className="t-b13 c2">{cart.reduce((n, i) => n + i.qty, 0)} items</span>
          <Summary t={t} />
        </div>
      </div>
      <div className="footer-bar">
        <button className="btn btn-lg btn-block" style={{ background: accent, color: "var(--ui-type-white)" }} disabled={placing} onClick={place}>
          {placing ? <span className="spinner" style={{ borderColor: "rgba(255 255 255 / 0.3)", borderTopColor: "#fff" }} /> : <Icon name="lock" size={16} fill />}
          {placing ? "Placing order…" : `Place order · ${usd2(t.total)}`}
        </button>
      </div>
    </>
  );
}

function Confirmed({ order, onBack, onFinish, accent }) {
  return (
    <>
      <div className="scroll col" style={{ alignItems: "center", textAlign: "center", padding: "56px 24px 24px", gap: 12 }}>
        <div className="check-burst" style={{ background: accent }}><Icon name="check" size={24} /></div>
        <span className="t-h2" style={{ marginTop: 8 }}>Thank you for your order!</span>
        <span className="t-b14 c2">Order {order.id} is confirmed. {order.email ? `A receipt is on its way to ${order.email}.` : "A receipt is on its way to your inbox."}</span>
        <div className="card col" style={{ width: "100%", marginTop: 16, textAlign: "left", background: "var(--ui-surface-1)" }}>
          {order.items.map((i) => (
            <div key={i.key} className="row gap-12" style={{ padding: 12, borderBottom: "1px solid var(--ui-edge-6)" }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}><Mockup product={i.product} sizeId={i.sizeId} opts={i.opts} photo={i.photo} box={40} /></div>
              <span className="col grow" style={{ gap: 2 }}>
                <span className="t-l13">{i.qty} × {i.product.name}</span>
                <span className="t-b12 c2">{sizeLabel(i)}</span>
              </span>
              <span className="t-l13">{usd2(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="row between t-h4" style={{ padding: 12 }}><span>Total paid</span><span>{usd2(order.totals.total)}</span></div>
        </div>
        <span className="t-b12 c3" style={{ marginTop: 8 }}>Estimated delivery in 5–7 business days.</span>
      </div>
      <div className="footer-bar" style={{ flexDirection: "column" }}>
        <button className="btn btn-lg btn-block" style={{ background: accent, color: "var(--ui-type-white)" }} onClick={onFinish}>Finish tour</button>
        <button className="btn btn-ghost btn-block" onClick={onBack}>Back to gallery</button>
      </div>
    </>
  );
}

export default function Store({ back, draft, brand, cart, setCart, onOrdered, onFinish, toast }) {
  const [view, setView] = useState(null); // null = gallery, else home | product | cart | checkout | done
  const [prev, setPrev] = useState("home");
  const [sel, setSel] = useState(null);
  const [order, setOrder] = useState(null);
  const [tip, setTip] = useState(true);
  const [inLb, setInLb] = useState(false);
  const [past, setPast] = useState(false);
  const accent = brand?.primary && brand.primary !== "#18181B" ? brand.primary : "#18181B";
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const data = { name: draft.name, description: draft.description, date: draft.date, cover: draft.cover, photos: draft.photos, setName: draft.setName };

  const openProduct = (product, photo) => {
    setSel({ product, photo });
    setPrev(view || "gallery");
    setView("product");
  };
  const openCart = () => {
    setPrev(view || "gallery");
    setView("cart");
  };
  const backTo = (v) => setView(v === "gallery" ? null : v);

  return (
    <div className="screen" style={{ background: "#fff" }}>
      <GalleryView
        data={data}
        theme={draft.theme}
        brand={brand}
        fallbackLogo={brand ? null : draft.fallbackLogo}
        onToast={toast}
        bottomPad={tip ? 200 : 40}
        onLightbox={setInLb}
        coverInset={tip ? 196 : 0}
        onScroll={({ pastCover }) => setPast(pastCover)}
        store={{ enabled: true, cartCount: count, onOpenStore: () => setView("home"), onBuy: (p) => openProduct(PRODUCTS[0], p) }}
      />

      {!view && !inLb && (
        <>
          {!past && (
            <div className="float-top">
              <IconBtn icon="arrow_back" solid onClick={back} label="Back" />
              <span className="pill t-l12"><Icon name="storefront" size={16} /> Client view · Store on</span>
            </div>
          )}
          {tip && (
            <div className="float-bar" style={{ background: "var(--ui-surface-0)" }}>
              <div className="tip">
                <span className="ic"><Icon name="storefront" size={16} fill /></span>
                <span className="col grow" style={{ gap: 2 }}>
                  <span className="t-h4 c0">Your print store is live</span>
                  <span className="t-b12 c2">This is what clients see. Tap the bag, the shop banner, or “Buy print” on any photo.</span>
                </span>
                <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setTip(false)} aria-label="Dismiss"><Icon name="close" size={16} /></button>
              </div>
              <div className="row gap-8">
                <button className="btn btn-secondary btn-lg grow" onClick={onFinish}>Finish</button>
                <button className="btn btn-primary btn-lg grow" onClick={() => setView("home")}><Icon name="shopping_bag" size={20} fill /> Open store</button>
              </div>
            </div>
          )}
        </>
      )}

      {view && (
        <div className="st theme-light">
          {view === "home" && <StoreHome brand={brand} photos={draft.photos} onClose={() => setView(null)} onPick={openProduct} cartCount={count} onCart={openCart} accent={accent} />}
          {view === "product" && sel && (
            <Product
              key={sel.product.id + sel.photo.id}
              product={sel.product}
              initialPhoto={sel.photo}
              photos={draft.photos}
              accent={accent}
              cartCount={count}
              onCart={openCart}
              onBack={() => backTo(prev === "product" ? "home" : prev)}
              onAdd={(item) => {
                setCart((c) => [...c, item]);
                toast("Added to bag", "shopping_bag");
                setPrev("home");
                setView("cart");
              }}
            />
          )}
          {view === "cart" && <Cart cart={cart} setCart={setCart} accent={accent} onBack={() => backTo(prev === "cart" ? "home" : prev)} onCheckout={() => setView("checkout")} />}
          {view === "checkout" && (
            <Checkout
              cart={cart}
              accent={accent}
              onBack={() => setView("cart")}
              onPlace={(o) => {
                setOrder(o);
                onOrdered(o);
                setView("done");
              }}
            />
          )}
          {view === "done" && order && <Confirmed order={order} accent={accent} onBack={() => setView(null)} onFinish={onFinish} />}
        </div>
      )}
    </div>
  );
}
