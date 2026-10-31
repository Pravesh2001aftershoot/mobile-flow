// Client-side print store catalogue. Prices in USD.

export const PRODUCTS = [
  {
    id: "prints",
    name: "Photo Prints",
    blurb: "Archival lustre, matte or glossy paper.",
    kind: "print",
    sizes: [
      { id: "4x6", label: '4 × 6"', ratio: [4, 6], price: 4 },
      { id: "5x7", label: '5 × 7"', ratio: [5, 7], price: 8 },
      { id: "8x10", label: '8 × 10"', ratio: [8, 10], price: 15 },
      { id: "11x14", label: '11 × 14"', ratio: [11, 14], price: 28 },
      { id: "16x20", label: '16 × 20"', ratio: [16, 20], price: 45 },
      { id: "20x30", label: '20 × 30"', ratio: [20, 30], price: 75 },
    ],
    options: [{ id: "finish", label: "Paper", choices: [{ id: "Lustre", add: 0 }, { id: "Matte", add: 0 }, { id: "Glossy", add: 0 }, { id: "Fine Art", add: 6 }] }],
  },
  {
    id: "canvas",
    name: "Canvas Wraps",
    blurb: "Gallery-wrapped, ready to hang.",
    kind: "canvas",
    sizes: [
      { id: "8x10", label: '8 × 10"', ratio: [8, 10], price: 59 },
      { id: "11x14", label: '11 × 14"', ratio: [11, 14], price: 79 },
      { id: "16x20", label: '16 × 20"', ratio: [16, 20], price: 119 },
      { id: "20x30", label: '20 × 30"', ratio: [20, 30], price: 169 },
      { id: "24x36", label: '24 × 36"', ratio: [24, 36], price: 219 },
    ],
    options: [{ id: "depth", label: "Wrap depth", choices: [{ id: '0.75"', add: 0 }, { id: '1.5"', add: 15 }] }],
  },
  {
    id: "frames",
    name: "Framed Prints",
    blurb: "Hand-finished frames with a crisp white mat.",
    kind: "frame",
    sizes: [
      { id: "5x7", label: '5 × 7"', ratio: [5, 7], price: 39 },
      { id: "8x10", label: '8 × 10"', ratio: [8, 10], price: 59 },
      { id: "11x14", label: '11 × 14"', ratio: [11, 14], price: 89 },
      { id: "16x20", label: '16 × 20"', ratio: [16, 20], price: 129 },
    ],
    options: [
      { id: "frame", label: "Frame", choices: [{ id: "Black", add: 0, swatch: "#1a1a1a" }, { id: "White", add: 0, swatch: "#f4f4f5" }, { id: "Natural Oak", add: 10, swatch: "#c49a6c" }] },
      { id: "mat", label: "Mat", choices: [{ id: "With mat", add: 0 }, { id: "No mat", add: 0 }] },
    ],
  },
  {
    id: "albums",
    name: "Layflat Albums",
    blurb: "Seamless spreads, heirloom binding.",
    kind: "album",
    sizes: [
      { id: "8x8", label: '8 × 8"', ratio: [1, 1], price: 249 },
      { id: "10x10", label: '10 × 10"', ratio: [1, 1], price: 349 },
      { id: "12x12", label: '12 × 12"', ratio: [1, 1], price: 449 },
    ],
    options: [
      { id: "cover", label: "Cover", choices: [{ id: "Linen", add: 0, swatch: "#d6cfc4" }, { id: "Leather", add: 50, swatch: "#4a3426" }] },
      { id: "pages", label: "Pages", choices: [{ id: "20 pages", add: 0 }, { id: "30 pages", add: 60 }, { id: "40 pages", add: 120 }] },
    ],
  },
];

export const SHIPPING = [
  { id: "standard", label: "Standard", eta: "5–7 business days", price: 9.95 },
  { id: "express", label: "Express", eta: "2–3 business days", price: 24.95 },
];

export const FREE_SHIPPING_OVER = 150;
export const TAX_RATE = 0.08;

export const usd = (n) => `$${n.toFixed(2).replace(/\.00$/, "")}`;
export const usd2 = (n) => `$${n.toFixed(2)}`;

export const unitPrice = (product, sizeId, opts) => {
  const size = product.sizes.find((s) => s.id === sizeId);
  const add = product.options.reduce((sum, o) => sum + (o.choices.find((c) => c.id === opts[o.id])?.add || 0), 0);
  return size.price + add;
};
