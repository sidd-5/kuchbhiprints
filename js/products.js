/* =========================================================================
   Kuch Bhi Prints — site configuration & product catalogue
   -------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE PRODUCTS.

   ⚠ PREVIEW DATA: Instagram research could only verify the brand name,
   bio, location and the general themes of recent posts. Every product
   name, price, size and spec below is SAMPLE content and must be replaced
   with real catalogue data before launch. When done, set
   `previewMode: false` to remove the "placeholder" labels.

   Real photos: put them in assets/images/products/ and list them in a
   product's `images` array (front, alternate angle, detail). If `images`
   is empty, a generated SVG render is shown instead.
   ========================================================================= */
(function () {
  'use strict';
  const KB = (window.KB = window.KB || {});

  /* ---------- Brand & site configuration ---------- */
  KB.config = {
    brand: 'Kuch Bhi Prints',
    handle: 'kuchbhiprints',
    instagramUrl: 'https://www.instagram.com/kuchbhiprints/',
    dmUrl: 'https://ig.me/m/kuchbhiprints',
    location: 'Lucknow, India',

    // Verified from the Instagram bio
    taglineHi: 'Socho kuch bhi. Print hum karenge!',
    taglineEn: 'Your imagination, our creation.',

    // Leave empty until verified — empty values are hidden on the site.
    email: '',
    phone: '',
    whatsapp: '', // digits incl. country code, e.g. '9198XXXXXXXX'. If set, orders go to WhatsApp.

    // true = show "sample catalogue / placeholder render" labels
    previewMode: true,

    // Optional endpoint (e.g. Formspree / Mailchimp form action). Empty = no backend.
    newsletterEndpoint: '',

    // Announcement bar — only verified messages
    announcements: [
      'Socho kuch bhi. Print hum karenge!',
      '3D-printed gifts & décor — made in Lucknow',
      'Got an idea? Send us a custom print request'
    ],

    // Shown on product & cart pages until real policies are confirmed
    shippingNote:
      'Shipping charges, delivery timelines and payment are confirmed with you directly on Instagram before you pay anything.',

    // Replace with real posts: { image: 'assets/images/banners/ig-1.jpg', url: 'https://www.instagram.com/p/XXXX/', alt: '...' }
    instagramPosts: [],

    // Add genuine reviews only: { name, city, text, product, rating (1–5), source: 'Instagram DM' }
    reviews: []
  };

  /* ---------- Filament colours used in the sample catalogue ---------- */
  const C = {
    vermilion: { name: 'Vermilion', hex: '#E5562A' },
    marigold: { name: 'Marigold', hex: '#F2B33D' },
    ivory: { name: 'Ivory', hex: '#EFE6D6' },
    charcoal: { name: 'Charcoal', hex: '#2B2825' },
    teal: { name: 'Deep Teal', hex: '#3F6E64' },
    lilac: { name: 'Lilac', hex: '#9C86D6' },
    sky: { name: 'Sky Blue', hex: '#5B8FD1' },
    rose: { name: 'Rose', hex: '#E28A9B' },
    sage: { name: 'Sage', hex: '#8FAE8B' },
    gold: { name: 'Antique Gold', hex: '#C9A040' },
    pearl: { name: 'Pearl White', hex: '#F4F1EC' }
  };
  KB.colours = C;

  /* ---------- Categories (derived from research — see README) ---------- */
  KB.categories = [
    {
      id: 'lamps',
      name: 'Lamps & Lanterns',
      short: 'Light, filtered through layers.',
      description: 'Lattice lanterns and glow lamps that throw patterned light across a room.',
      art: { shape: 'lantern', color: '#E5562A', bg: '#24211E', lit: true }
    },
    {
      id: 'festive',
      name: 'Festive & Devotional',
      short: 'For pujas, Diwali and every celebration.',
      description: 'Diyas, tealight holders and miniature mandirs made for the festive season.',
      art: { shape: 'diya', color: '#F2B33D', bg: '#F3E3C4' }
    },
    {
      id: 'decor',
      name: 'Home Décor',
      short: 'Objects that make a shelf interesting.',
      description: 'Vases, planters and figurines with shapes only a printer can make.',
      art: { shape: 'vase', color: '#3F6E64', bg: '#E3E7DF' }
    },
    {
      id: 'gifts',
      name: 'Gifts',
      short: 'Small things, made with thought.',
      description: 'Keychains, desk pieces and keepsakes — easy to gift, easy to personalise.',
      art: { shape: 'keychain', color: '#9C86D6', bg: '#ECE6F5', text: 'K' }
    },
    {
      id: 'custom',
      name: 'Custom Prints',
      short: 'Socho kuch bhi. We print it.',
      description: 'Name plates, personalised pieces and one-off ideas — tell us what you imagine.',
      art: { shape: 'nameplate', color: '#2B2825', bg: '#F2D9CF', text: 'Your Name' },
      href: 'custom.html'
    }
  ];

  /* ---------- Products (SAMPLE DATA — replace before launch) ----------
     stock: 'in' | 'low' | 'made-to-order' | 'out'
     tags:  'new' | 'trending' | 'bestseller' | 'featured'
     specs: leave a field null when it isn't verified — it won't be shown.
     sizes: price `delta` is added to the base price.
  -------------------------------------------------------------------- */
  KB.products = [
    {
      id: 'jaali-lattice-lantern',
      name: 'Jaali Lattice Lantern',
      category: 'lamps',
      price: 1299,
      compareAt: null,
      tagline: 'Arched jaali windows, built layer by layer.',
      description:
        'A tall lantern with rows of arched jaali windows. Pop an LED tealight inside and it throws a soft, patterned glow across the room — a quiet showpiece for a console, balcony or puja corner.',
      colours: [C.pearl, C.vermilion, C.charcoal],
      sizes: [{ label: 'Medium', delta: 0 }, { label: 'Large', delta: 400 }],
      specs: { dimensions: 'Approx. 12 × 12 × 24 cm (Medium)', material: null, finish: 'Matte, visible layer texture', weight: null },
      care: 'For use with LED tealights only — not with open flames.',
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['bestseller', 'featured', 'trending'],
      added: '2026-10-29',
      art: { shape: 'lantern', bg: '#24211E', lit: true },
      images: []
    },
    {
      id: 'mushroom-glow-lamp',
      name: 'Mushroom Glow Lamp',
      category: 'lamps',
      price: 1499,
      compareAt: null,
      tagline: 'A soft dome of light for bedside tables.',
      description:
        'A playful mushroom-shaped lamp with a domed shade and a slim stem. The printed layers catch the light and give the shade a gentle, ribbed texture.',
      colours: [C.rose, C.marigold, C.sage],
      sizes: null,
      specs: { dimensions: 'Approx. 18 × 18 × 22 cm', material: null, finish: 'Matte', weight: null },
      care: null,
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['trending', 'new'],
      added: '2026-11-04',
      art: { shape: 'lamp', bg: '#F3E3C4' },
      images: []
    },
    {
      id: 'haathi-tealight-holder',
      name: 'Haathi Tealight Holder',
      category: 'festive',
      price: 699,
      compareAt: null,
      tagline: 'A little elephant carrying the light.',
      description:
        'A decorative elephant with a saddle and a tealight cradle on its back. Made for Diwali tables, gifting and every evening in between.',
      colours: [C.gold, C.pearl, C.vermilion],
      sizes: null,
      specs: { dimensions: 'Approx. 14 × 6 × 11 cm', material: null, finish: 'Matte, visible layer texture', weight: null },
      care: 'For use with LED tealights only — not with open flames.',
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['bestseller', 'trending'],
      added: '2026-10-28',
      art: { shape: 'elephant', bg: '#EDE6DA', flame: true },
      images: []
    },
    {
      id: 'layered-diya-set',
      name: 'Layered Diya Set',
      category: 'festive',
      price: 449,
      compareAt: null,
      tagline: 'Reusable diyas for every festival.',
      description:
        'Decorative diyas with a classic spout and a dotted band around the bowl. Pair them with LED flames for a reusable festive setup that lasts season after season.',
      colours: [C.marigold, C.vermilion, C.gold],
      sizes: [{ label: 'Set of 2', delta: 0 }, { label: 'Set of 4', delta: 399 }],
      specs: { dimensions: 'Approx. 9 × 7 × 4 cm (each)', material: null, finish: 'Matte', weight: null },
      care: 'Decorative — use with LED flames, not oil or open flames.',
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['trending', 'featured'],
      added: '2026-10-24',
      art: { shape: 'diya', bg: '#F3E3C4' },
      images: []
    },
    {
      id: 'miniature-mandir',
      name: 'Miniature Mandir',
      category: 'festive',
      price: 1199,
      compareAt: null,
      tagline: 'A shikhara silhouette for your home altar.',
      description:
        'A miniature temple with a stepped plinth, an arched doorway and a tiered shikhara topped with a flag. Sized for shelves, desks and small puja spaces.',
      colours: [C.pearl, C.gold, C.vermilion],
      sizes: null,
      specs: { dimensions: 'Approx. 15 × 10 × 26 cm', material: null, finish: 'Matte, visible layer texture', weight: null },
      care: null,
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['new', 'featured'],
      added: '2026-11-11',
      art: { shape: 'temple', bg: '#F2D9CF' },
      images: []
    },
    {
      id: 'spiral-bud-vase',
      name: 'Spiral Bud Vase',
      category: 'decor',
      price: 799,
      compareAt: null,
      tagline: 'A twist that only a printer can make.',
      description:
        'A slim vase with spiralling ribs that wrap around its curved body. Made for dried flowers and single stems.',
      colours: [C.teal, C.pearl, C.rose],
      sizes: null,
      specs: { dimensions: 'Approx. 10 × 10 × 22 cm', material: null, finish: 'Matte, visible layer texture', weight: null },
      care: 'Decorative — best with dried or artificial stems.',
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['trending', 'featured'],
      added: '2026-09-18',
      art: { shape: 'vase', bg: '#E3E7DF' },
      images: []
    },
    {
      id: 'hex-succulent-planter',
      name: 'Hex Succulent Planter',
      category: 'decor',
      price: 549,
      compareAt: null,
      tagline: 'Faceted home for a small green friend.',
      description:
        'A faceted planter with a crisp rim, sized for succulents and small cacti. Looks just as good empty on a desk.',
      colours: [C.pearl, C.charcoal, C.sage],
      sizes: [{ label: 'Small', delta: 0 }, { label: 'Medium', delta: 250 }],
      specs: { dimensions: 'Approx. 9 × 9 × 8 cm (Small)', material: null, finish: 'Matte', weight: null },
      care: null,
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: [],
      added: '2026-09-02',
      art: { shape: 'planter', bg: '#EDE6DA' },
      images: []
    },
    {
      id: 'haathi-shelf-figurine',
      name: 'Haathi Shelf Figurine',
      category: 'decor',
      price: 599,
      compareAt: null,
      tagline: 'A small elephant with a big personality.',
      description:
        'A standing elephant figurine with a decorated saddle, curled trunk and tusk. Made for bookshelves, study tables and gifting.',
      colours: [C.charcoal, C.sky, C.gold],
      sizes: null,
      specs: { dimensions: 'Approx. 14 × 6 × 10 cm', material: null, finish: 'Matte, visible layer texture', weight: null },
      care: null,
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['bestseller'],
      added: '2026-08-20',
      art: { shape: 'elephant', bg: '#E3E9F2' },
      images: []
    },
    {
      id: 'name-initial-keychain',
      name: 'Initial Keychain',
      category: 'gifts',
      price: 249,
      compareAt: null,
      tagline: 'Your letter, raised in layers.',
      description:
        'A chunky, rounded keychain with a raised initial. Pick a colour and tell us the letter (or two) you want — an easy gift that feels personal.',
      colours: [C.lilac, C.vermilion, C.sky, C.charcoal],
      sizes: null,
      specs: { dimensions: 'Approx. 4 × 6 cm', material: null, finish: 'Matte', weight: null },
      care: null,
      productionTime: null,
      customisable: true,
      customLabel: 'Initial(s) — up to 2 letters',
      customMax: 2,
      stock: 'in',
      tags: ['bestseller', 'trending'],
      added: '2026-08-01',
      art: { shape: 'keychain', bg: '#ECE6F5', text: 'A' },
      images: []
    },
    {
      id: 'custom-name-plate',
      name: 'Custom Name Plate',
      category: 'custom',
      price: 899,
      compareAt: null,
      tagline: 'Your family name, at your door.',
      description:
        'A standing name plate with a raised border and your name in bold lettering. Tell us the name and colour; we confirm the design with you before printing.',
      colours: [C.charcoal, C.pearl, C.teal],
      sizes: [{ label: 'Standard', delta: 0 }, { label: 'Large', delta: 500 }],
      specs: { dimensions: 'Approx. 20 × 12 cm (Standard)', material: null, finish: 'Matte', weight: null },
      care: null,
      productionTime: null,
      customisable: true,
      customLabel: 'Name to print',
      customMax: 16,
      stock: 'made-to-order',
      tags: ['featured', 'new'],
      added: '2026-11-07',
      art: { shape: 'nameplate', bg: '#F2D9CF', text: 'Sharma' },
      images: []
    },
    {
      id: 'tri-cup-desk-organiser',
      name: 'Tri-Cup Desk Organiser',
      category: 'gifts',
      price: 649,
      compareAt: null,
      tagline: 'Three heights, zero clutter.',
      description:
        'Three joined cups at different heights for pens, brushes and tools. A tidy, sculptural piece for a study or work desk.',
      colours: [C.sage, C.charcoal, C.marigold],
      sizes: null,
      specs: { dimensions: 'Approx. 16 × 9 × 12 cm', material: null, finish: 'Matte', weight: null },
      care: null,
      productionTime: null,
      customisable: false,
      stock: 'in',
      tags: ['new'],
      added: '2026-11-01',
      art: { shape: 'organiser', bg: '#E3E7DF' },
      images: []
    },
    {
      id: 'pocket-lantern-night-light',
      name: 'Pocket Lantern Night Light',
      category: 'lamps',
      price: 899,
      compareAt: null,
      tagline: 'A tiny lantern for late nights.',
      description:
        'A compact take on our lattice lantern, made for bedside tables and kids’ rooms. Use with a small LED light for a warm, patterned glow.',
      colours: [C.marigold, C.rose, C.pearl],
      sizes: null,
      specs: { dimensions: 'Approx. 8 × 8 × 14 cm', material: null, finish: 'Matte, visible layer texture', weight: null },
      care: 'For use with LED lights only — not with open flames.',
      productionTime: null,
      customisable: false,
      stock: 'low',
      tags: ['new'],
      added: '2026-10-31',
      art: { shape: 'lantern', bg: '#1F2A2A', lit: true },
      images: []
    }
  ];

  /* ---------- Helpers ---------- */
  KB.STOCK_LABEL = {
    in: 'In stock',
    low: 'Only a few left',
    'made-to-order': 'Made to order',
    out: 'Sold out'
  };

  KB.findProduct = (id) => KB.products.find((p) => p.id === id) || null;
  KB.findCategory = (id) => KB.categories.find((c) => c.id === id) || null;
  KB.categoryName = (id) => (KB.findCategory(id) || { name: '' }).name;
  KB.formatINR = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
  KB.unitPrice = (p, sizeLabel) => {
    if (!p) return 0;
    const s = p.sizes && p.sizes.find((x) => x.label === sizeLabel);
    return p.price + (s ? s.delta : 0);
  };
  KB.byTag = (tag) => KB.products.filter((p) => p.tags.includes(tag));
  KB.newest = () => KB.products.slice().sort((a, b) => b.added.localeCompare(a.added));
})();
