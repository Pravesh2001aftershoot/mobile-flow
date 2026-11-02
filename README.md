# Galleries onboarding — mobile prototype

A mobile-first onboarding flow for new Aftershoot Galleries users. It runs from signup to their first branded, shoppable gallery. It's built with React and Vite, and styled with Aftershoot DS v2 tokens (`src/styles/tokens.css`).

## Flow

| # | Screen | File |
|---|---|---|
| 1 | Welcome | `src/screens/Welcome.jsx` |
| 2 | Sample galleries: carousel with category chips (Wedding, Portraits, Family, Other) | `src/screens/Samples.jsx` |
| 3 | Sample gallery in client view: cover, grid, full-screen photos, favourites. Has guided tips plus **Edit this one** and **Create your own** | `src/screens/SampleViewer.jsx` |
| 4 | Upload: up to 10 photos that stay in the browser. "Use sample photos" is a fallback | `src/screens/Upload.jsx` |
| 5 | Building animation | `src/screens/Building.jsx` |
| 6 | Design editor: Cover (the 3 styles the sample galleries use: Editorial Love, Side Note, Side Story; cover photo), Grid (Vertical/Horizontal, size, spacing), Type, Colour | `src/screens/Editor.jsx` |
| 7 | "Want to personalise it?" prompt, then brand kit: logo, studio name, colours, fonts, contact, socials, watermark | `src/screens/Prompts.jsx`, `src/screens/BrandKit.jsx` |
| 8 | Final reveal with a share link | `src/screens/Reveal.jsx` |
| 9 | "Want to monetise it?" prompt, then the client print store: products, options, bag, checkout, confirmation | `src/screens/Store.jsx` |
| 10 | Done recap | `src/screens/Done.jsx` |

The client gallery renderer (cover templates, masonry/justified grid, lightbox, watermark, branded footer) is in `src/components/`.

## Data

- **Sample galleries.** `src/data/samples.json` was pulled from 8 public client galleries on `aftershootgalleriesstudio.gallery.aftershoot.com`. It holds each gallery's real `albumTheme` (cover template, fonts, grid) and up to 48 photo paths, served through the ImageKit CDN.
- **Print store.** Prices are in USD, in `src/lib/store.js`. The store is the client-side experience only. Checkout places no charge.
- **Uploads.** Uploaded photos never leave the device; they are shown from object URLs.

## Run

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # outputs to dist/
```

On desktop the app renders inside a phone-sized frame. On a phone it fills the screen.

### Deep links (QA / sharing one step)

`?jump=<screen>&sample=<key>` opens any screen with demo data. For example:

- `/?jump=editor&sample=forever-begins-here`
- `/?jump=brandkit`
- `/?jump=reveal`
- `/?jump=store&sample=family-shoot`

Screens: `samples`, `viewer`, `upload`, `editor`, `personalize`, `brandkit`, `reveal`, `monetize`, `store`, `done`.
Sample keys: `gallery`, `forever-begins-here`, `savannah-sean`, `portrait-sample-gallery`, `wedding-gallery`, `family-shoot`, `goldeen-hour-family`, `chasing-light`.

## Deploy

This is a static Vite app. On Vercel, import the GitHub repo. The framework preset (Vite), build command (`npm run build`) and output directory (`dist`) are detected automatically.
