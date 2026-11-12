/* =========================================================================
   Kuch Bhi Prints — cart & wishlist stores (localStorage)
   ========================================================================= */
(function () {
  'use strict';
  const KB = (window.KB = window.KB || {});

  /* Safe storage: works even when localStorage is blocked (private mode). */
  const memory = {};
  const store = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set(key, value) {
      memory[key] = value;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* storage unavailable — in-memory only */ }
    }
  };
  KB.store = store;

  function emitter() {
    const fns = [];
    return {
      on(fn) { fns.push(fn); },
      emit(data) { fns.forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); }
    };
  }

  /* ---------------- Cart ----------------
     Line item: { key, id, colour, size, custom, qty }
  ----------------------------------------- */
  const CART_KEY = 'kb_cart_v1';
  const cartEvents = emitter();
  const MAX_QTY = 20;

  function readCart() {
    const items = store.get(CART_KEY, []);
    // Drop items whose product no longer exists in the catalogue
    return Array.isArray(items) ? items.filter((i) => i && KB.findProduct(i.id)) : [];
  }
  function writeCart(items) {
    store.set(CART_KEY, items);
    cartEvents.emit(items);
  }
  const lineKey = (id, colour, size, custom) => [id, colour || '', size || '', (custom || '').trim()].join('|');

  KB.cart = {
    items: readCart,
    onChange: cartEvents.on,

    add(id, opts = {}) {
      const p = KB.findProduct(id);
      if (!p) return null;
      const colour = opts.colour || (p.colours[0] && p.colours[0].name) || '';
      const size = opts.size || (p.sizes && p.sizes[0] ? p.sizes[0].label : '');
      const custom = (opts.custom || '').trim();
      const qty = Math.max(1, Math.min(MAX_QTY, parseInt(opts.qty, 10) || 1));
      const key = lineKey(id, colour, size, custom);
      const items = readCart();
      const existing = items.find((i) => i.key === key);
      if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
      else items.push({ key, id, colour, size, custom, qty });
      writeCart(items);
      return key;
    },

    setQty(key, qty) {
      const items = readCart();
      const line = items.find((i) => i.key === key);
      if (!line) return;
      const n = parseInt(qty, 10);
      if (!n || n < 1) return KB.cart.remove(key);
      line.qty = Math.min(MAX_QTY, n);
      writeCart(items);
    },

    remove(key) {
      writeCart(readCart().filter((i) => i.key !== key));
    },

    clear() { writeCart([]); },

    count() { return readCart().reduce((n, i) => n + i.qty, 0); },

    detail(line) {
      const p = KB.findProduct(line.id);
      const unit = KB.unitPrice(p, line.size);
      const colourObj = p && p.colours.find((c) => c.name === line.colour);
      return { product: p, unit, total: unit * line.qty, colourHex: colourObj ? colourObj.hex : null };
    },

    subtotal() {
      return readCart().reduce((sum, line) => sum + KB.cart.detail(line).total, 0);
    },

    MAX_QTY
  };

  /* ---------------- Wishlist ---------------- */
  const WISH_KEY = 'kb_wishlist_v1';
  const wishEvents = emitter();
  const readWish = () => {
    const ids = store.get(WISH_KEY, []);
    return Array.isArray(ids) ? ids.filter((id) => KB.findProduct(id)) : [];
  };

  KB.wishlist = {
    ids: readWish,
    onChange: wishEvents.on,
    has: (id) => readWish().includes(id),
    toggle(id) {
      const ids = readWish();
      const i = ids.indexOf(id);
      if (i > -1) ids.splice(i, 1);
      else ids.unshift(id);
      store.set(WISH_KEY, ids);
      wishEvents.emit(ids);
      return i === -1; // true = added
    },
    remove(id) {
      const ids = readWish().filter((x) => x !== id);
      store.set(WISH_KEY, ids);
      wishEvents.emit(ids);
    },
    count: () => readWish().length
  };

  /* Keep multiple open tabs in sync */
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) cartEvents.emit(readCart());
    if (e.key === WISH_KEY) wishEvents.emit(readWish());
  });
})();
