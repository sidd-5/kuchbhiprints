# Kuch Bhi Prints — e-commerce website

> **Socho kuch bhi. Print hum karenge!** — 3D-printed gifts & décor from Lucknow.

A static e-commerce site built with HTML5, CSS3 and vanilla JavaScript only. There is no build step and no framework.

---

## ⚠ Status: preview build with a sample catalogue

When this site was built, the brand's Instagram (@kuchbhiprints) was only **partly accessible**: the bio, follower count and auto-generated image descriptions were visible, but captions, prices, highlights and product photos were not. To avoid inventing anything about the brand, the site separates **verified facts** from **placeholders**.

| Content | Status |
|---|---|
| Brand name, handle, Instagram URL | ✅ Verified |
| Bio: "Socho kuch bhi. Print hum karenge!", "Your imagination, our creation." | ✅ Verified |
| 3D-printed **gifts & décor**, based in **Lucknow, India** | ✅ Verified (bio) |
| Custom requests accepted | 🟡 Strongly implied by the bio ("Socho kuch bhi. Print hum karenge!") |
| Categories: Lamps & Lanterns, Festive & Devotional | 🟡 Inferred from recent post tags (lamp/lantern, Oct 29 2026; elephant + candle, Oct 28; temple/statue, Nov 11) |
| Product names, prices, sizes, specs | ❌ **Sample data**: replace in `js/products.js` |
| Product images | ❌ **Generated SVG renders**, labelled "PLACEHOLDER RENDER" |
| Bestseller / trending / new flags | ❌ Sample: set from real sales data |
| Customer reviews | ❌ None shown: clearly marked placeholder cards |
| Shipping / returns / terms | ❌ Draft placeholders in `policies.html` |
| Logo | ❌ Placeholder wordmark: replace with the official logo |
| Email / phone / WhatsApp | ❌ Not shown until added to config |
| Discounts / offers | ❌ None shown (no verified offers) |

The bottom-left **"Preview build"** pill explains this to visitors. Set `previewMode: false` once the real data is in.

### What we need from Kuch Bhi Prints
1. Product photos (front, another angle, close-up) and real names, prices, colours, sizes and dimensions.
2. The official logo file.
3. Which products really are bestsellers.
4. Genuine customer reviews (with permission).
5. Shipping, returns and payment policies, and production times.
6. Contact email, phone or WhatsApp number (optional).
7. 6–8 Instagram post images and their URLs for the gallery.

---

## Running it

Open `index.html` in a browser. Everything works over `file://`.

For clean URLs and the closest match to production, serve the folder:

```bash
# any one of these, from the project folder
npx serve .
python -m http.server 8080
```

To deploy, upload the folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages or shared hosting).

---

## Brand & visual direction

**Concept: "The print studio as a gallery."** Products are shown like objects in a design shop: large and calm, with plenty of space around them. One signature idea runs through the site: **the visible print layer**. Every render carries fine layer lines. The hero "prints" its objects bottom-up with a glowing nozzle line and a layer counter. The 3D Difference section has a loupe that magnifies the layers.

**Voice:** warm, playful Hinglish headlines taken from the bio ("Socho kuch bhi. Print hum karenge."), with clear English underneath.

### Colour palette

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F0E8` | Warm off-white background |
| `--paper-2` | `#EDE6DA` | Panels, image grounds |
| `--ink` | `#1C1A17` | Deep charcoal: text, dark sections |
| `--mute` | `#6F6860` | Secondary text |
| `--line` | `#DDD4C6` | Hairline borders |
| `--accent` | `#E5562A` | **Vermilion**: primary accent, CTAs |
| `--marigold` | `#F2B33D` | **Marigold**: secondary accent, highlights |
| `--glow` | `#FFD58A` | Lamp glow |

The accents were chosen for festive, Indian warmth (marigold and sindoor vermilion) because the logo colours couldn't be verified. Once the official logo is available, update the two accent tokens in `css/style.css` (`:root`).

### Typography (Google Fonts)
- **Unbounded**: geometric display face for headlines, wide and slightly playful, with a "3D object" feel.
- **Manrope**: clean geometric sans for body text and UI.
- **DM Mono**: product labels, eyebrows and spec tags, giving a "print-bed readout" feel.

---

## Folder structure

```
kuchbhiprints/
├── assets/
│   ├── images/
│   │   ├── products/        ← real product photos go here
│   │   ├── banners/         ← Instagram tiles / banners
│   │   └── branding/        ← logo-placeholder.svg, og-image.svg
│   └── icons/favicon.svg
├── css/
│   ├── style.css            ← tokens, components, layouts, motion
│   └── responsive.css       ← 1200 / 1024 / 860 / 640 / 400 breakpoints
├── js/
│   ├── products.js          ← ★ CONFIG + CATALOGUE (edit this)
│   ├── art.js               ← SVG placeholder render generator
│   ├── cart.js              ← cart & wishlist stores (localStorage)
│   ├── main.js              ← header, footer, drawers, search, modal, cards
│   ├── interactions.js      ← scroll reveal, header, tilt, carousel, zoom
│   └── pages/               ← home, shop, product, cart-page, custom, contact, about
├── index.html               ← homepage
├── shop.html                ← catalogue (filters, sort, search)
├── product.html             ← product detail (?id=…)
├── cart.html                ← bag + order request
├── custom.html              ← custom print request
├── about.html
├── contact.html
├── policies.html            ← shipping / returns / privacy / terms (drafts)
└── README.md
```

---

## Product data structure (`js/products.js`)

```js
{
  id: 'jaali-lattice-lantern',          // URL: product.html?id=jaali-lattice-lantern
  name: 'Jaali Lattice Lantern',
  category: 'lamps',                    // one of KB.categories[].id
  price: 1299,                          // INR, base price
  compareAt: null,                      // original price → shows a % badge (only if verified)
  tagline: '…',
  description: '…',
  colours: [{ name: 'Ivory', hex: '#EFE6D6' }],
  sizes: [{ label: 'Medium', delta: 0 }, { label: 'Large', delta: 400 }] | null,
  specs: { dimensions, material, finish, weight },   // null = hidden
  care: 'For use with LED tealights only' | null,
  productionTime: '3–5 days' | null,    // null = "confirmed when you order"
  customisable: false,                  // true → required text field + live preview
  customLabel: 'Name to print', customMax: 16,
  stock: 'in' | 'low' | 'made-to-order' | 'out',
  tags: ['new', 'trending', 'bestseller', 'featured'],
  added: '2026-10-29',                  // used for "Newest" sort
  art: { shape: 'lantern', bg: '#24211E', lit: true }, // placeholder render settings
  images: []                            // real photos → replace the render automatically
}
```

**Adding real photos:** put them in `assets/images/products/` and fill `images: ['…-front.webp', '…-angle.webp', '…-detail.webp']`. Cards, gallery, cart and search all switch to the photos automatically. Use 4:5 images (e.g. 1600×2000).

**Config** (`KB.config`): Instagram URLs, `email` / `phone` / `whatsapp` (hidden while empty), `announcements`, `shippingNote`, `instagramPosts`, `reviews`, `newsletterEndpoint` and `previewMode`.

---

## How ordering works (no fake payments)

There is no payment gateway, and the site **never simulates a payment**.

1. The customer adds items to the bag (stored in `localStorage`, so it survives a refresh).
2. On `cart.html` they enter their name and city, then tap **Send order request**.
3. The order is formatted as a message:
   - if `config.whatsapp` is set → WhatsApp opens with the message already filled in;
   - otherwise → the message is copied to the clipboard and a button opens an **Instagram DM** to @kuchbhiprints.
4. Kuch Bhi Prints confirms availability, shipping and payment with the customer directly.

Custom requests and contact messages use the same flow. Reference images are previewed in the browser only, never uploaded, and the customer attaches them in the chat.

To add real checkout later, wire `cart.html`'s submit handler (`js/pages/cart-page.js`) to a gateway such as Razorpay.

---

## Features

- **Homepage:** announcement marquee, sticky header that hides on scroll with a mega-menu, animated "printing" hero, category bento, trending carousel (drag, arrows, progress), bestseller bento, 3D Difference section with layer loupe, new arrivals, editorial showcase, custom-print marquee band, Instagram grid, review placeholders, newsletter, footer.
- **Shop:** category chips, filters (category, price buckets and min/max, availability, highlights, colour), search, 5 sort modes, active-filter chips, URL-synced state (`shop.html?cat=lamps&sort=price-asc`), mobile filter drawer, alternate-angle image on hover.
- **Product:** 3-view gallery (front, alternate angle, layer close-up) with hover zoom and swipe, colour swatches that recolour the render, size pills that update the price, live personalisation preview, quantity, Add to bag, Buy now, accordions (only verified specs shown), sticky mobile buy bar, related products, Product JSON-LD.
- **Cart:** drawer and page, quantity stepper, remove with undo, variants (colour, size, personalisation), subtotal and total, empty states, cross-tab sync.
- **Wishlist:** heart toggle everywhere, wishlist drawer, move to bag.
- **Search:** overlay with live results and suggestions.
- **Accessibility:** semantic landmarks, skip link, focus trapping in drawers and modals, Esc to close, ARIA states on toggles, radios and accordions, keyboard arrows in swatch groups, `prefers-reduced-motion` respected, visible focus rings.
- **SEO:** unique titles and meta descriptions, Open Graph, canonical links, JSON-LD (Store and Product), descriptive alt and aria-labels, lazy-loaded images.

## Browser support
Current Chrome, Edge, Safari and Firefox (iOS 15+ / Android). Uses `inert`, CSS `clip-path`, `aspect-ratio` and `backdrop-filter`, with graceful fallbacks.
