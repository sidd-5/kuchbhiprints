/* =========================================================================
   Kuch Bhi Prints — shared UI
   Header, footer, drawers (bag / wishlist / mobile nav), search, modal,
   toasts, product cards and global event delegation.
   ========================================================================= */
(function () {
  'use strict';
  const KB = (window.KB = window.KB || {});
  const cfg = KB.config;

  /* ---------- Utilities ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  KB.$ = $;
  KB.$$ = $$;
  KB.esc = esc;
  KB.page = document.body.dataset.page || '';
  KB.params = new URLSearchParams(window.location.search);
  KB.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icons (inline SVG, stroke-based) ---------- */
  const ic = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${extra}>${d}</svg>`;
  KB.icons = {
    search: ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    heart: ic('<path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.4 3.9 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.1 0 5.3 2.9 4.2 6.2C19.5 15.4 12 20 12 20Z"/>'),
    bag: ic('<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
    menu: ic('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    close: ic('<path d="M6 6l12 12M18 6 6 18"/>'),
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    arrowL: ic('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    minus: ic('<path d="M5 12h14"/>'),
    chevron: ic('<path d="m6 9 6 6 6-6"/>'),
    trash: ic('<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/>'),
    insta: ic('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'),
    pin: ic('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    chat: ic('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12Z"/>'),
    mail: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    phone: ic('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>'),
    filter: ic('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    upload: ic('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>'),
    check: ic('<path d="m5 12 5 5L20 7"/>'),
    sparkle: ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
    layers: ic('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 5 9-5" opacity=".5"/>'),
    star: ic('<path d="m12 3 2.7 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9L12 3Z"/>'),
    reel: ic('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 8h18M8 3l3 5M14 3l3 5"/><path d="m10 12 5 3-5 3v-6Z" fill="currentColor"/>'),
    grid: ic('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>')
  };
  const I = KB.icons;

  KB.logo = (cls = '') => `<span class="logo ${cls}">
    <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="11" fill="currentColor"/><rect x="9" y="11" width="22" height="4" rx="2" fill="var(--paper)"/><rect x="9" y="18" width="15" height="4" rx="2" fill="var(--paper)"/><rect x="9" y="25" width="22" height="4" rx="2" fill="var(--paper)"/><circle cx="30" cy="20" r="3" fill="var(--accent)"/></svg>
    <span class="logo__word">kuchbhi<b>prints</b></span>
  </span>`;

  /* ---------- Product imagery (real photo if provided, else render) ---------- */
  KB.productArt = function (p, opts = {}) {
    const view = opts.view || 0;
    const viewLabel = view === 1 ? ' — alternate angle' : view === 2 ? ' — layer detail close-up' : '';
    if (p.images && p.images.length) {
      const src = p.images[view] || p.images[0];
      return `<img src="${esc(src)}" alt="${esc(p.name + viewLabel)}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async" width="800" height="1000">`;
    }
    return KB.art.render(p.art.shape, Object.assign({}, p.art, {
      color: opts.color || (p.colours[0] && p.colours[0].hex),
      view,
      text: opts.text || p.art.text,
      label: `${p.name}${viewLabel} (placeholder render)`
    }));
  };

  KB.categoryArt = (cat, opts = {}) =>
    KB.art.render(cat.art.shape, Object.assign({}, cat.art, opts, { label: `${cat.name} (placeholder render)` }));

  /* ---------- Search ---------- */
  KB.search = function (q, list = KB.products) {
    const terms = String(q || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return list.slice();
    return list.filter((p) => {
      const hay = [p.name, KB.categoryName(p.category), p.tagline, p.description, p.tags.join(' '), p.colours.map((c) => c.name).join(' ')].join(' ').toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  };

  /* ---------- Product card ---------- */
  KB.badges = function (p) {
    const out = [];
    if (p.compareAt && p.compareAt > p.price) out.push(`<span class="badge badge--sale">−${Math.round((1 - p.price / p.compareAt) * 100)}%</span>`);
    if (p.tags.includes('new')) out.push('<span class="badge badge--new">New</span>');
    if (p.tags.includes('bestseller')) out.push('<span class="badge">Bestseller</span>');
    if (p.stock === 'low') out.push('<span class="badge badge--warn">Few left</span>');
    if (p.stock === 'made-to-order') out.push('<span class="badge badge--outline">Made to order</span>');
    if (p.stock === 'out') out.push('<span class="badge badge--muted">Sold out</span>');
    return out.slice(0, 2).join('');
  };

  KB.priceHTML = function (p) {
    const from = p.sizes && p.sizes.length > 1 ? '<span class="price__from">From</span> ' : '';
    const compare = p.compareAt && p.compareAt > p.price ? ` <s class="price__was">${KB.formatINR(p.compareAt)}</s>` : '';
    return `<span class="price">${from}<span class="price__now">${KB.formatINR(p.price)}</span>${compare}</span>`;
  };

  KB.card = function (p, opts = {}) {
    const href = `product.html?id=${encodeURIComponent(p.id)}`;
    const wished = KB.wishlist.has(p.id);
    const out = p.stock === 'out';
    const quick = out
      ? `<span class="card__quick is-disabled" aria-disabled="true">Sold out</span>`
      : p.customisable
        ? `<a class="card__quick" href="${href}">Personalise ${I.arrow}</a>`
        : `<button class="card__quick" type="button" data-quick-add="${p.id}">Quick add ${I.plus}</button>`;
    const swatches = p.colours.slice(0, 4).map((c) => `<span class="dot" style="--c:${c.hex}" title="${esc(c.name)}"></span>`).join('');
    return `<article class="card ${opts.cls || ''}" data-id="${p.id}">
  <div class="card__media">
    <a href="${href}" class="card__link" tabindex="-1" aria-hidden="true">
      <span class="card__img card__img--a">${KB.productArt(p, { view: 0 })}</span>
      <span class="card__img card__img--b">${KB.productArt(p, { view: 1 })}</span>
    </a>
    <div class="card__badges">${KB.badges(p)}</div>
    <button class="wish-btn" type="button" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${I.heart}</button>
    ${quick}
  </div>
  <div class="card__body">
    <p class="card__cat">${esc(KB.categoryName(p.category))}</p>
    <h3 class="card__title"><a href="${href}">${esc(p.name)}</a></h3>
    <div class="card__row">${KB.priceHTML(p)}<span class="card__dots" aria-label="${p.colours.length} colours">${swatches}</span></div>
  </div>
</article>`;
  };

  /* ---------- Header ---------- */
  function navLink(href, label, key) {
    const active = KB.page === key ? ' aria-current="page"' : '';
    return `<li><a href="${href}"${active}>${label}</a></li>`;
  }

  function renderHeader() {
    const mount = $('#site-header');
    if (!mount) return;
    const ann = cfg.announcements.map((a) => `<span>${esc(a)}</span><span class="announce__sep" aria-hidden="true">✦</span>`).join('');
    const mega = KB.categories.map((c) => `
      <a class="mega__item" href="${c.href || 'shop.html?cat=' + c.id}">
        <span class="mega__art">${KB.categoryArt(c, { noTag: true })}</span>
        <span class="mega__name">${esc(c.name)}</span>
        <span class="mega__desc">${esc(c.short)}</span>
      </a>`).join('');

    mount.outerHTML = `
<div class="announce" role="region" aria-label="Announcements">
  <div class="announce__track"><div class="announce__row">${ann}${ann}</div><div class="announce__row" aria-hidden="true">${ann}${ann}</div></div>
</div>
<header class="site-header" id="siteHeader">
  <div class="container header__inner">
    <button class="icon-btn header__burger" type="button" data-open="mobileNav" aria-label="Open menu" aria-controls="mobileNav" aria-expanded="false">${I.menu}</button>
    <a href="index.html" class="header__logo" aria-label="Kuch Bhi Prints — home">${KB.logo()}</a>
    <nav class="main-nav" aria-label="Primary">
      <ul>
        ${navLink('index.html', 'Home', 'home')}
        ${navLink('shop.html', 'Shop All', 'shop')}
        <li class="has-mega">
          <button type="button" class="mega-toggle" aria-expanded="false" aria-controls="megaMenu">Collections ${I.chevron}</button>
          <div class="mega" id="megaMenu">
            <div class="mega__inner">
              <div class="mega__intro">
                <p class="eyebrow">Collections</p>
                <p class="mega__title">Objects for every corner of your home.</p>
                <a class="link-arrow" href="shop.html">Shop everything ${I.arrow}</a>
              </div>
              <div class="mega__grid">${mega}</div>
            </div>
          </div>
        </li>
        ${navLink('custom.html', 'Custom Prints', 'custom')}
        ${navLink('about.html', 'About Us', 'about')}
        ${navLink('contact.html', 'Contact', 'contact')}
      </ul>
    </nav>
    <div class="header__actions">
      <button class="icon-btn" type="button" data-open="searchPanel" aria-label="Search products">${I.search}</button>
      <button class="icon-btn" type="button" data-open="wishDrawer" aria-label="Wishlist">${I.heart}<span class="count-badge" data-wish-count hidden>0</span></button>
      <button class="icon-btn icon-btn--bag" type="button" data-open="cartDrawer" aria-label="Shopping bag">${I.bag}<span class="count-badge" data-cart-count hidden>0</span></button>
    </div>
  </div>
</header>`;
  }

  /* ---------- Overlays: drawers, search, modal ---------- */
  function renderOverlays() {
    const cats = KB.categories.map((c) => `<li><a href="${c.href || 'shop.html?cat=' + c.id}"><span class="mnav__thumb">${KB.categoryArt(c, { noTag: true })}</span>${esc(c.name)}</a></li>`).join('');
    const html = `
<div class="scrim" id="scrim" hidden></div>

<aside class="drawer drawer--right" id="cartDrawer" aria-label="Shopping bag" role="dialog" aria-modal="true" inert>
  <div class="drawer__head"><h2 class="drawer__title">Your bag <span class="drawer__count" data-cart-count-text></span></h2><button class="icon-btn" type="button" data-close aria-label="Close bag">${I.close}</button></div>
  <div class="drawer__body" id="cartDrawerBody"></div>
  <div class="drawer__foot" id="cartDrawerFoot"></div>
</aside>

<aside class="drawer drawer--right" id="wishDrawer" aria-label="Wishlist" role="dialog" aria-modal="true" inert>
  <div class="drawer__head"><h2 class="drawer__title">Wishlist <span class="drawer__count" data-wish-count-text></span></h2><button class="icon-btn" type="button" data-close aria-label="Close wishlist">${I.close}</button></div>
  <div class="drawer__body" id="wishDrawerBody"></div>
</aside>

<aside class="drawer drawer--left mnav" id="mobileNav" aria-label="Menu" role="dialog" aria-modal="true" inert>
  <div class="drawer__head">${KB.logo()}<button class="icon-btn" type="button" data-close aria-label="Close menu">${I.close}</button></div>
  <div class="drawer__body">
    <nav aria-label="Mobile">
      <ul class="mnav__main">
        <li><a href="index.html">Home</a></li>
        <li><a href="shop.html">Shop All</a></li>
        <li><a href="custom.html">Custom Prints</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <p class="eyebrow mnav__label">Collections</p>
      <ul class="mnav__cats">${cats}</ul>
    </nav>
  </div>
  <div class="drawer__foot mnav__foot">
    <p class="mnav__tag">${esc(cfg.taglineHi)}</p>
    <a class="btn btn--ghost btn--sm" href="${cfg.instagramUrl}" target="_blank" rel="noopener">${I.insta} @${cfg.handle}</a>
  </div>
</aside>

<div class="search-panel" id="searchPanel" role="dialog" aria-modal="true" aria-label="Search products" inert>
  <div class="container search-panel__inner">
    <form class="search-panel__form" action="shop.html" method="get" role="search">
      <label for="searchInput" class="visually-hidden">Search products</label>
      ${I.search}
      <input id="searchInput" name="q" type="search" placeholder="Search lanterns, diyas, keychains…" autocomplete="off">
      <button class="icon-btn" type="button" data-close aria-label="Close search">${I.close}</button>
    </form>
    <div class="search-panel__suggest"><span class="eyebrow">Try</span>
      ${['Lantern', 'Diya', 'Haathi', 'Keychain', 'Name plate', 'Vase'].map((t) => `<button type="button" class="chip" data-suggest="${t}">${t}</button>`).join('')}
    </div>
    <div class="search-panel__results" id="searchResults" aria-live="polite"></div>
  </div>
</div>

<div class="modal" id="modalPanel" role="dialog" aria-modal="true" aria-labelledby="modalTitle" inert>
  <div class="modal__box">
    <button class="icon-btn modal__close" type="button" data-close aria-label="Close dialog">${I.close}</button>
    <div id="modalContent"></div>
  </div>
</div>

<div class="toasts" id="toasts" aria-live="polite" aria-atomic="false"></div>
${cfg.previewMode ? `<div class="preview-pill" id="previewPill"><button type="button" class="preview-pill__btn" aria-expanded="false" aria-controls="previewInfo">${I.info}<span>Preview build</span></button><div class="preview-pill__info" id="previewInfo" hidden><strong>Sample catalogue.</strong> Product names, prices, specs and images on this site are placeholders until Kuch Bhi Prints supplies real data. Brand name, bio and location are verified from Instagram. Edit <code>js/products.js</code> to update.</div></div>` : ''}`;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  /* Panel manager */
  let openPanelEl = null;
  let lastFocus = null;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  KB.openPanel = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (openPanelEl && openPanelEl !== el) KB.closePanel(true);
    lastFocus = lastFocus || document.activeElement;
    openPanelEl = el;
    el.inert = false;
    el.classList.add('is-open');
    $('#scrim').hidden = false;
    requestAnimationFrame(() => $('#scrim').classList.add('is-visible'));
    document.documentElement.classList.add('is-locked');
    $$(`[data-open="${id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    if (id === 'cartDrawer') renderCartDrawer();
    if (id === 'wishDrawer') renderWishDrawer();
    setTimeout(() => {
      const target = id === 'searchPanel' ? $('#searchInput') : el.querySelector(FOCUSABLE);
      if (target) target.focus({ preventScroll: true });
    }, 60);
  };

  KB.closePanel = function (keepFocus) {
    if (!openPanelEl) return;
    const el = openPanelEl;
    el.classList.remove('is-open');
    el.inert = true;
    $$(`[data-open="${el.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    openPanelEl = null;
    if (!keepFocus) {
      const scrim = $('#scrim');
      scrim.classList.remove('is-visible');
      setTimeout(() => { if (!openPanelEl) scrim.hidden = true; }, 300);
      document.documentElement.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      lastFocus = null;
    }
  };

  document.addEventListener('keydown', (e) => {
    if (!openPanelEl) return;
    if (e.key === 'Escape') { e.preventDefault(); KB.closePanel(); return; }
    if (e.key === 'Tab') {
      const f = $$(FOCUSABLE, openPanelEl).filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Modal ---------- */
  KB.modal = function ({ title, body, actions = [] }) {
    const acts = actions.map((a, i) => a.href
      ? `<a class="btn ${a.primary ? 'btn--primary' : 'btn--ghost'}" href="${esc(a.href)}" ${a.external ? 'target="_blank" rel="noopener"' : ''} data-modal-action="${i}">${a.label}</a>`
      : `<button class="btn ${a.primary ? 'btn--primary' : 'btn--ghost'}" type="button" data-modal-action="${i}">${a.label}</button>`).join('');
    $('#modalContent').innerHTML = `<h2 class="modal__title" id="modalTitle">${title}</h2><div class="modal__body">${body}</div>${acts ? `<div class="modal__actions">${acts}</div>` : ''}`;
    $$('[data-modal-action]', $('#modalContent')).forEach((b) => {
      const a = actions[+b.dataset.modalAction];
      if (a.onClick) b.addEventListener('click', (e) => a.onClick(e, b));
    });
    KB.openPanel('modalPanel');
  };

  /* ---------- Toasts ---------- */
  KB.toast = function (msg, action) {
    const wrap = $('#toasts');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast__icon">${I.check}</span><span class="toast__msg">${msg}</span>${action ? `<button type="button" class="toast__action">${esc(action.label)}</button>` : ''}`;
    if (action) t.querySelector('.toast__action').addEventListener('click', () => { action.onClick(); t.remove(); });
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-in'));
    setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 400); }, 3200);
  };

  /* ---------- Clipboard + messaging (orders & enquiries) ---------- */
  KB.copyText = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  /**
   * Hands a message to the brand: WhatsApp (pre-filled) if configured,
   * otherwise copies it and opens an Instagram DM. No payment is taken here.
   */
  KB.sendMessage = async function (text, { title = 'Almost there', intro = '' } = {}) {
    if (cfg.whatsapp) {
      const url = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
      KB.modal({
        title,
        body: `${intro ? `<p>${intro}</p>` : ''}<p>Your message is ready in WhatsApp. Send it and we’ll reply to confirm the details.</p>`,
        actions: [{ label: `Open WhatsApp ${I.arrow}`, href: url, external: true, primary: true }]
      });
      return;
    }
    const copied = await KB.copyText(text);
    KB.modal({
      title,
      body: `${intro ? `<p>${intro}</p>` : ''}
        <ol class="modal__steps">
          <li>${copied ? '<strong>Copied!</strong> Your message is on your clipboard.' : 'Copy the message below.'}</li>
          <li>Open a DM with <strong>@${cfg.handle}</strong> on Instagram and paste it.</li>
          <li>We’ll reply to confirm the details, shipping and payment.</li>
        </ol>
        <label class="visually-hidden" for="modalMsg">Message</label>
        <textarea id="modalMsg" class="modal__text" readonly rows="7">${esc(text)}</textarea>`,
      actions: [
        { label: `Open Instagram DM ${I.arrow}`, href: cfg.dmUrl, external: true, primary: true },
        {
          label: 'Copy again',
          onClick: async (e, btn) => {
            const ok = await KB.copyText(text);
            btn.textContent = ok ? 'Copied ✓' : 'Select & copy above';
          }
        }
      ]
    });
  };

  /* ---------- Cart drawer ---------- */
  KB.cartLineHTML = function (line, { compact = true } = {}) {
    const d = KB.cart.detail(line);
    const p = d.product;
    const href = `product.html?id=${encodeURIComponent(p.id)}`;
    const variant = [line.colour && `<span class="variant"><span class="dot" style="--c:${d.colourHex || '#ccc'}"></span>${esc(line.colour)}</span>`, line.size && `<span class="variant">${esc(line.size)}</span>`, line.custom && `<span class="variant">“${esc(line.custom)}”</span>`].filter(Boolean).join('');
    return `<li class="line ${compact ? 'line--compact' : ''}" data-key="${esc(line.key)}">
  <a class="line__img" href="${href}">${KB.productArt(p, { color: d.colourHex, text: line.custom || undefined })}</a>
  <div class="line__info">
    <div class="line__top"><a class="line__name" href="${href}">${esc(p.name)}</a><span class="line__price">${KB.formatINR(d.total)}</span></div>
    <div class="line__variants">${variant}</div>
    ${!compact ? `<p class="line__unit">${KB.formatINR(d.unit)} each</p>` : ''}
    <div class="line__actions">
      <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
        <button type="button" data-qty="-1" aria-label="Decrease quantity">${I.minus}</button>
        <input type="number" inputmode="numeric" min="1" max="${KB.cart.MAX_QTY}" value="${line.qty}" aria-label="Quantity" data-qty-input>
        <button type="button" data-qty="1" aria-label="Increase quantity" ${line.qty >= KB.cart.MAX_QTY ? 'disabled' : ''}>${I.plus}</button>
      </div>
      <button type="button" class="line__remove" data-remove aria-label="Remove ${esc(p.name)} from bag">Remove</button>
    </div>
  </div>
</li>`;
  };

  KB.emptyState = (title, text, cta = { label: 'Start exploring', href: 'shop.html' }) => `
<div class="empty">
  <div class="empty__art">${KB.art.render('lantern', { color: '#EFE6D6', bg: '#EDE6DA', lit: false, noTag: true, label: 'Empty' })}</div>
  <h3 class="empty__title">${title}</h3>
  <p class="empty__text">${text}</p>
  <a class="btn btn--primary" href="${cta.href}" ${cta.close ? 'data-close' : ''}>${cta.label} ${I.arrow}</a>
</div>`;

  function renderCartDrawer() {
    const body = $('#cartDrawerBody');
    const foot = $('#cartDrawerFoot');
    if (!body) return;
    const items = KB.cart.items();
    if (!items.length) {
      body.innerHTML = KB.emptyState('Your bag is empty', 'Lanterns, diyas, keepsakes — find something that makes you smile.');
      foot.innerHTML = '';
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = `<ul class="lines">${items.map((l) => KB.cartLineHTML(l)).join('')}</ul>`;
    foot.innerHTML = `
      <div class="sum-row sum-row--total"><span>Subtotal</span><strong>${KB.formatINR(KB.cart.subtotal())}</strong></div>
      <p class="fine">${esc(cfg.shippingNote)}</p>
      <a class="btn btn--primary btn--block" href="cart.html">View bag & checkout ${I.arrow}</a>
      <button class="btn btn--text btn--block" type="button" data-close>Continue shopping</button>`;
  }
  KB.renderCartDrawer = renderCartDrawer;

  function renderWishDrawer() {
    const body = $('#wishDrawerBody');
    if (!body) return;
    const ids = KB.wishlist.ids();
    if (!ids.length) {
      body.innerHTML = KB.emptyState('Nothing saved yet', 'Tap the heart on any product to keep it here for later.');
      return;
    }
    body.innerHTML = `<ul class="lines">${ids.map((id) => {
      const p = KB.findProduct(id);
      const href = `product.html?id=${encodeURIComponent(id)}`;
      return `<li class="line line--compact">
        <a class="line__img" href="${href}">${KB.productArt(p)}</a>
        <div class="line__info">
          <div class="line__top"><a class="line__name" href="${href}">${esc(p.name)}</a><span class="line__price">${KB.formatINR(p.price)}</span></div>
          <p class="line__unit">${esc(KB.categoryName(p.category))} · ${KB.STOCK_LABEL[p.stock]}</p>
          <div class="line__actions">
            ${p.stock === 'out' ? '' : p.customisable ? `<a class="btn btn--ghost btn--sm" href="${href}">Personalise</a>` : `<button class="btn btn--ghost btn--sm" type="button" data-quick-add="${id}">Add to bag</button>`}
            <button type="button" class="line__remove" data-wish-remove="${id}">Remove</button>
          </div>
        </div>
      </li>`;
    }).join('')}</ul>`;
  }

  /* ---------- Counters ---------- */
  function updateCounts() {
    const c = KB.cart.count();
    const w = KB.wishlist.count();
    $$('[data-cart-count]').forEach((el) => { el.textContent = c; el.hidden = c === 0; });
    $$('[data-wish-count]').forEach((el) => { el.textContent = w; el.hidden = w === 0; });
    $$('[data-cart-count-text]').forEach((el) => { el.textContent = c ? `(${c})` : ''; });
    $$('[data-wish-count-text]').forEach((el) => { el.textContent = w ? `(${w})` : ''; });
    const bag = $('[data-open="cartDrawer"]');
    if (bag) bag.setAttribute('aria-label', `Shopping bag, ${c} item${c === 1 ? '' : 's'}`);
    const wish = $('[data-open="wishDrawer"]');
    if (wish) wish.setAttribute('aria-label', `Wishlist, ${w} item${w === 1 ? '' : 's'}`);
  }

  function bump(sel) {
    $$(sel).forEach((el) => {
      const btn = el.closest('.icon-btn');
      if (!btn) return;
      btn.classList.remove('is-bump');
      void btn.offsetWidth;
      btn.classList.add('is-bump');
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const mount = $('#site-footer');
    if (!mount) return;
    const year = new Date().getFullYear();
    const contact = [
      `<li>${I.pin}<span>${esc(cfg.location)}</span></li>`,
      `<li>${I.insta}<a href="${cfg.instagramUrl}" target="_blank" rel="noopener">@${cfg.handle}</a></li>`,
      `<li>${I.chat}<a href="${cfg.dmUrl}" target="_blank" rel="noopener">Message us on Instagram</a></li>`,
      cfg.email && `<li>${I.mail}<a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a></li>`,
      cfg.phone && `<li>${I.phone}<a href="tel:${esc(cfg.phone.replace(/\s/g, ''))}">${esc(cfg.phone)}</a></li>`
    ].filter(Boolean).join('');

    mount.outerHTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer__cta">
      <p class="footer__big" aria-hidden="true">kuchbhi<span>prints</span></p>
      <div class="footer__cta-copy">
        <p class="footer__lead">${esc(cfg.taglineHi)}</p>
        <a class="btn btn--accent" href="custom.html">Start a custom print ${I.arrow}</a>
      </div>
    </div>
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="index.html" aria-label="Kuch Bhi Prints — home">${KB.logo('logo--light')}</a>
        <p>3D-printed gifts and décor from ${esc(cfg.location.split(',')[0])}. ${esc(cfg.taglineEn)}</p>
        <a class="social" href="${cfg.instagramUrl}" target="_blank" rel="noopener" aria-label="Kuch Bhi Prints on Instagram">${I.insta}<span>Follow @${cfg.handle}</span></a>
      </div>
      <nav class="footer__col" aria-label="Shop">
        <h2 class="footer__h">Shop</h2>
        <ul>
          <li><a href="shop.html">Shop all</a></li>
          <li><a href="shop.html?new=1">New arrivals</a></li>
          <li><a href="shop.html?featured=1">Featured</a></li>
          <li><a href="custom.html">Custom prints</a></li>
          <li><a href="cart.html">Your bag</a></li>
        </ul>
      </nav>
      <nav class="footer__col" aria-label="Categories">
        <h2 class="footer__h">Categories</h2>
        <ul>${KB.categories.map((c) => `<li><a href="${c.href || 'shop.html?cat=' + c.id}">${esc(c.name)}</a></li>`).join('')}</ul>
      </nav>
      <nav class="footer__col" aria-label="Help">
        <h2 class="footer__h">Help</h2>
        <ul>
          <li><a href="about.html">About us</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="policies.html#shipping">Shipping policy</a></li>
          <li><a href="policies.html#returns">Return policy</a></li>
          <li><a href="policies.html#privacy">Privacy policy</a></li>
          <li><a href="policies.html#terms">Terms & conditions</a></li>
        </ul>
      </nav>
      <div class="footer__col">
        <h2 class="footer__h">Contact</h2>
        <ul class="footer__contact">${contact}</ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© ${year} Kuch Bhi Prints. Printed layer by layer in Lucknow.</p>
      <a href="#main" class="to-top" data-to-top>Back to top ↑</a>
    </div>
  </div>
</footer>`;
  }

  /* ---------- Search panel ---------- */
  function initSearch() {
    const input = $('#searchInput');
    const results = $('#searchResults');
    if (!input) return;
    const run = () => {
      const q = input.value.trim();
      if (!q) { results.innerHTML = ''; return; }
      const found = KB.search(q).slice(0, 6);
      results.innerHTML = found.length
        ? `<p class="search-panel__meta">${found.length} result${found.length === 1 ? '' : 's'} for “${esc(q)}”</p>
           <ul class="search-panel__list">${found.map((p) => `<li><a href="product.html?id=${p.id}"><span class="sr-thumb">${KB.productArt(p)}</span><span><span class="sr-name">${esc(p.name)}</span><span class="sr-cat">${esc(KB.categoryName(p.category))} · ${KB.formatINR(p.price)}</span></span></a></li>`).join('')}</ul>
           <a class="link-arrow" href="shop.html?q=${encodeURIComponent(q)}">See all results ${I.arrow}</a>`
        : `<p class="search-panel__meta">No products match “${esc(q)}”. Can’t find it? <a href="custom.html">Ask us to print it</a>.</p>`;
    };
    let t;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 120); });
    $$('[data-suggest]').forEach((b) => b.addEventListener('click', () => { input.value = b.dataset.suggest; run(); input.focus(); }));
  }

  /* ---------- Newsletter ---------- */
  function initNewsletter() {
    $$('form[data-newsletter]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const msg = form.querySelector('.form-msg') || form.parentElement.querySelector('.form-msg');
        const email = input.value.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        input.setAttribute('aria-invalid', String(!valid));
        if (!valid) { if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.className = 'form-msg is-error'; } input.focus(); return; }
        if (cfg.newsletterEndpoint) {
          try {
            const res = await fetch(cfg.newsletterEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email }) });
            if (!res.ok) throw new Error(res.statusText);
            if (msg) { msg.textContent = 'You’re on the list — watch your inbox for the next drop.'; msg.className = 'form-msg is-ok'; }
            form.reset();
          } catch (err) {
            if (msg) { msg.textContent = 'Something went wrong. Please try again, or follow us on Instagram.'; msg.className = 'form-msg is-error'; }
          }
        } else {
          // No mailing list connected yet — be honest about it.
          if (msg) { msg.innerHTML = `Our email list isn’t live yet. For new drops, follow <a href="${cfg.instagramUrl}" target="_blank" rel="noopener">@${cfg.handle}</a> on Instagram.`; msg.className = 'form-msg is-ok'; }
        }
      });
    });
  }

  /* ---------- Global event delegation ---------- */
  function onClick(e) {
    const t = e.target;

    const opener = t.closest('[data-open]');
    if (opener) { e.preventDefault(); KB.openPanel(opener.dataset.open); return; }

    if (t.closest('[data-close]') || t.id === 'scrim' || t.id === 'modalPanel') {
      const link = t.closest('a[href]');
      if (link && link.getAttribute('href') !== '#') { KB.closePanel(); return; }
      e.preventDefault();
      KB.closePanel();
      return;
    }

    const wish = t.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      const id = wish.dataset.wish;
      const added = KB.wishlist.toggle(id);
      const p = KB.findProduct(id);
      $$(`[data-wish="${id}"]`).forEach((b) => {
        b.setAttribute('aria-pressed', String(added));
        b.setAttribute('aria-label', `${added ? 'Remove from' : 'Add to'} wishlist: ${p.name}`);
        b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
      });
      KB.toast(added ? `Saved <b>${esc(p.name)}</b> to your wishlist` : `Removed from wishlist`, added ? { label: 'View', onClick: () => KB.openPanel('wishDrawer') } : null);
      return;
    }

    const wr = t.closest('[data-wish-remove]');
    if (wr) { KB.wishlist.remove(wr.dataset.wishRemove); renderWishDrawer(); syncWishButtons(); return; }

    const quick = t.closest('[data-quick-add]');
    if (quick) {
      e.preventDefault();
      const p = KB.findProduct(quick.dataset.quickAdd);
      if (!p) return;
      KB.cart.add(p.id);
      quick.classList.add('is-added');
      setTimeout(() => quick.classList.remove('is-added'), 1200);
      KB.openPanel('cartDrawer');
      return;
    }

    // Quantity & remove inside any cart line (drawer or cart page)
    const line = t.closest('.line[data-key]');
    if (line) {
      const key = line.dataset.key;
      const step = t.closest('[data-qty]');
      if (step) {
        const input = line.querySelector('[data-qty-input]');
        KB.cart.setQty(key, (parseInt(input.value, 10) || 1) + parseInt(step.dataset.qty, 10));
        return;
      }
      if (t.closest('[data-remove]')) {
        const removed = KB.cart.items().find((i) => i.key === key);
        line.classList.add('is-leaving');
        setTimeout(() => {
          KB.cart.remove(key);
          if (removed) KB.toast('Removed from bag', { label: 'Undo', onClick: () => KB.cart.add(removed.id, removed) });
        }, 220);
        return;
      }
    }

    const toTop = t.closest('[data-to-top]');
    if (toTop) { e.preventDefault(); window.scrollTo({ top: 0, behavior: KB.reducedMotion ? 'auto' : 'smooth' }); return; }

    // Mega menu (touch / click)
    const mt = t.closest('.mega-toggle');
    const li = $('.has-mega');
    if (mt && li) {
      const open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      mt.setAttribute('aria-expanded', String(open));
      return;
    }
    if (li && li.classList.contains('is-open') && !t.closest('.has-mega')) {
      li.classList.remove('is-open');
      $('.mega-toggle').setAttribute('aria-expanded', 'false');
    }

    const pill = t.closest('.preview-pill__btn');
    if (pill) {
      const info = $('#previewInfo');
      info.hidden = !info.hidden;
      pill.setAttribute('aria-expanded', String(!info.hidden));
    }
  }

  function onChange(e) {
    const input = e.target.closest('[data-qty-input]');
    if (!input) return;
    const line = input.closest('.line[data-key]');
    if (line) KB.cart.setQty(line.dataset.key, input.value);
  }

  function syncWishButtons() {
    const ids = KB.wishlist.ids();
    $$('[data-wish]').forEach((b) => b.setAttribute('aria-pressed', String(ids.includes(b.dataset.wish))));
  }

  /* ---------- Boot ---------- */
  renderHeader();
  renderFooter();
  renderOverlays();
  initSearch();
  initNewsletter();
  updateCounts();

  document.addEventListener('click', onClick);
  document.addEventListener('change', onChange);
  document.addEventListener('keydown', (e) => {
    const li = $('.has-mega');
    if (e.key === 'Escape' && li && li.classList.contains('is-open')) {
      li.classList.remove('is-open');
      $('.mega-toggle').setAttribute('aria-expanded', 'false');
      $('.mega-toggle').focus();
    }
  });

  KB.cart.onChange(() => {
    updateCounts();
    bump('[data-cart-count]');
    if (openPanelEl && openPanelEl.id === 'cartDrawer') renderCartDrawer();
  });
  KB.wishlist.onChange(() => {
    updateCounts();
    syncWishButtons();
    if (openPanelEl && openPanelEl.id === 'wishDrawer') renderWishDrawer();
  });
})();
