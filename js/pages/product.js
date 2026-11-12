/* Kuch Bhi Prints — product detail page */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, $$, esc, icons: I, config: cfg } = KB;

  const id = KB.params.get('id');
  const p = KB.findProduct(id);
  const mount = $('#pdp');

  if (!p) {
    mount.innerHTML = `<div class="no-results" style="margin-bottom:var(--section)">
      <h1 class="h3">We couldn’t find that product.</h1>
      <p>It may have been renamed or removed. Browse the collection, or ask us to print something just for you.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn--primary" href="shop.html">Shop all ${I.arrow}</a><a class="btn btn--ghost" href="custom.html">Custom print</a></div>
    </div>`;
    document.title = 'Product not found | Kuch Bhi Prints';
    return;
  }

  /* ---------- State ---------- */
  const reqColour = KB.params.get('colour');
  const state = {
    colour: (p.colours.find((c) => c.name === reqColour) || p.colours[0] || { name: '', hex: '#ccc' }),
    size: p.sizes && p.sizes.length ? p.sizes[0].label : '',
    qty: 1,
    view: 0,
    custom: ''
  };
  const hasPhotos = p.images && p.images.length;
  const VIEWS = hasPhotos
    ? p.images.map((_, i) => (i === 0 ? 'Front' : `View ${i + 1}`))
    : ['Front', 'Alternate angle', 'Layer detail'];
  const cat = KB.findCategory(p.category);
  const catHref = cat && cat.href ? cat.href : `shop.html?cat=${p.category}`;

  /* ---------- SEO ---------- */
  document.title = `${p.name} — 3D-Printed ${cat ? cat.name : ''} | Kuch Bhi Prints`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${p.name}: ${p.tagline} ${p.description}`.slice(0, 158));
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    category: cat ? cat.name : undefined,
    brand: { '@type': 'Brand', name: cfg.brand },
    color: p.colours.map((c) => c.name).join(', '),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: p.price,
      availability: p.stock === 'out' ? 'https://schema.org/OutOfStock' : p.stock === 'made-to-order' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock'
    }
  });
  document.head.appendChild(ld);

  $('#crumbs').insertAdjacentHTML('beforeend', `<li><a href="${catHref}">${esc(cat ? cat.name : '')}</a></li><li aria-current="page">${esc(p.name)}</li>`);

  /* ---------- Render helpers ---------- */
  const art = (view) => KB.productArt(p, { view, color: state.colour.hex, text: state.custom || undefined, eager: view === 0 });

  function specsHTML() {
    const rows = [];
    const s = p.specs || {};
    if (s.dimensions) rows.push(['Dimensions', esc(s.dimensions)]);
    if (s.material) rows.push(['Material', esc(s.material)]);
    if (s.finish) rows.push(['Finish', esc(s.finish)]);
    if (s.weight) rows.push(['Weight', esc(s.weight)]);
    rows.push(['Colours', p.colours.map((c) => `<span class="variant"><span class="dot" style="--c:${c.hex}"></span>${esc(c.name)}</span>`).join('')]);
    if (p.sizes) rows.push(['Sizes', p.sizes.map((z) => esc(z.label)).join(' · ')]);
    if (p.customisable) rows.push(['Personalisation', esc(p.customLabel || 'Available')]);
    if (p.productionTime) rows.push(['Production time', esc(p.productionTime)]);
    rows.push(['Made in', esc(cfg.location)]);
    return `<dl class="specs">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      ${cfg.previewMode ? `<p class="notice notice--dashed">${I.info}<span>Sample specifications. Values will be confirmed by Kuch Bhi Prints before launch. Unverified details such as material and weight are hidden.</span></p>` : ''}`;
  }

  function acc(idx, title, body, open) {
    return `<div class="acc__item">
      <h2 style="margin:0"><button class="acc__btn" type="button" aria-expanded="${open}" aria-controls="acc-${idx}" id="accb-${idx}">${title}${I.plus}</button></h2>
      <div class="acc__panel ${open ? 'is-open' : ''}" id="acc-${idx}" role="region" aria-labelledby="accb-${idx}"><div><div class="acc__inner">${body}</div></div></div>
    </div>`;
  }

  function priceNow() { return KB.unitPrice(p, state.size); }

  function render() {
    const thumbs = VIEWS.map((label, i) => `<button class="gallery__thumb" type="button" data-view="${i}" aria-label="Show ${label.toLowerCase()}" aria-current="${i === state.view}">${art(i)}</button>`).join('');
    const slides = VIEWS.map((label, i) => `<div class="gallery__slide ${i === state.view ? 'is-active' : ''}" data-slide="${i}" aria-hidden="${i !== state.view}">${art(i)}</div>`).join('');
    const out = p.stock === 'out';

    const colourOpts = p.colours.length ? `<div class="opt">
        <p class="opt__label" id="colourLbl">Colour <span id="colourName">${esc(state.colour.name)}</span></p>
        <div class="swatches" role="radiogroup" aria-labelledby="colourLbl">${p.colours.map((c) => `<button type="button" class="swatch" role="radio" aria-checked="${c.name === state.colour.name}" aria-label="${esc(c.name)}" data-colour="${esc(c.name)}"><span style="--c:${c.hex}"></span></button>`).join('')}</div>
      </div>` : '';

    const sizeOpts = p.sizes && p.sizes.length ? `<div class="opt">
        <p class="opt__label" id="sizeLbl">Size <span>${p.sizes.length} options</span></p>
        <div class="sizes" role="radiogroup" aria-labelledby="sizeLbl">${p.sizes.map((z) => `<button type="button" class="size" role="radio" aria-checked="${z.label === state.size}" data-size="${esc(z.label)}">${esc(z.label)}<small>${KB.formatINR(p.price + z.delta)}</small></button>`).join('')}</div>
      </div>` : '';

    const customOpt = p.customisable ? `<div class="opt custom-input">
        <label class="opt__label" for="customText">Personalise <span>Required</span></label>
        <input class="input" id="customText" type="text" maxlength="${p.customMax || 20}" placeholder="${esc(p.customLabel || 'Your text')}" autocomplete="off" aria-describedby="customHint">
        <p class="field__hint" id="customHint">${esc(p.customLabel || '')}${p.customMax ? ` · max ${p.customMax} characters` : ''}. We confirm the final design with you before printing.</p>
        <p class="field__error" id="customErr" hidden>Please enter the text you’d like printed.</p>
      </div>` : '';

    mount.innerHTML = `<div class="pdp">
      <div class="gallery">
        <div class="gallery__thumbs" role="group" aria-label="Product views">${thumbs}</div>
        <div class="gallery__main" id="galleryMain">
          ${slides}
          <button class="wish-btn" type="button" data-wish="${p.id}" aria-pressed="${KB.wishlist.has(p.id)}" aria-label="${KB.wishlist.has(p.id) ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${I.heart}</button>
          <span class="gallery__hint" aria-hidden="true">Hover to zoom</span>
        </div>
      </div>

      <div class="info">
        <div class="info__head">
          <div class="info__badges"><a class="badge" href="${catHref}">${esc(cat ? cat.name : '')}</a>${KB.badges(p)}</div>
          <h1 class="info__name">${esc(p.name)}</h1>
          <p class="info__tagline">${esc(p.tagline)}</p>
          <div class="info__price">
            <span class="now" id="priceNow">${KB.formatINR(priceNow())}</span>
            ${p.compareAt && p.compareAt > p.price ? `<span class="was">${KB.formatINR(p.compareAt)}</span>` : ''}
            <span class="note">Shipping confirmed at order</span>
          </div>
          <span class="stock stock--${p.stock}">${KB.STOCK_LABEL[p.stock]}</span>
        </div>
        <p>${esc(p.description)}</p>

        ${colourOpts}
        ${sizeOpts}
        ${customOpt}

        <div class="buy" id="buyBox">
          <div class="qty" role="group" aria-label="Quantity">
            <button type="button" data-pqty="-1" aria-label="Decrease quantity">${I.minus}</button>
            <input type="number" id="pQty" inputmode="numeric" min="1" max="${KB.cart.MAX_QTY}" value="${state.qty}" aria-label="Quantity">
            <button type="button" data-pqty="1" aria-label="Increase quantity">${I.plus}</button>
          </div>
          <button class="btn btn--primary" type="button" id="addToCart" ${out ? 'disabled' : ''}>${out ? 'Sold out' : `Add to bag ${I.bag}`}</button>
          <button class="btn btn--accent btn--buy" type="button" id="buyNow" ${out ? 'disabled' : ''}>Buy now ${I.arrow}</button>
        </div>

        <div class="trust">
          <div>${I.layers}<strong>Printed layer by layer</strong><span>Fine ridges are part of the look.</span></div>
          <div>${I.chat}<strong>Order on Instagram</strong><span>We confirm details before you pay.</span></div>
          <div>${I.sparkle}<strong>Custom requests</strong><span><a href="custom.html" style="text-decoration:underline">Ask for any idea</a></span></div>
        </div>

        <div class="acc" id="acc">
          ${acc(1, 'Description', `<p>${esc(p.description)}</p>${p.care ? `<p class="notice">${I.info}<span>${esc(p.care)}</span></p>` : ''}`, true)}
          ${acc(2, 'Specifications', specsHTML(), false)}
          ${acc(3, 'Shipping & orders', `<p>${esc(cfg.shippingNote)}</p><p>${p.productionTime ? `Estimated production time: <strong>${esc(p.productionTime)}</strong>.` : 'Production time depends on the piece and is confirmed when you order.'}</p><p>See our <a href="policies.html#shipping" style="text-decoration:underline">shipping</a> and <a href="policies.html#returns" style="text-decoration:underline">returns</a> policies.</p>`, false)}
          ${acc(4, 'Want it different?', `<p>Different colour, size or a name on it? That’s what we’re here for: <em>socho kuch bhi</em>.</p><p><a class="link-arrow" href="custom.html?ref=${encodeURIComponent(p.name)}">Start a custom request ${I.arrow}</a></p>`, false)}
        </div>
      </div>
    </div>`;

    $('#stickyBuy').innerHTML = `<div class="sticky-buy__inner">
      <span class="line__img" style="width:46px;border-radius:10px;flex:none">${art(0)}</span>
      <div><p class="sticky-buy__name">${esc(p.name)}</p><p class="sticky-buy__price" id="stickyPrice">${KB.formatINR(priceNow())}</p></div>
      <button class="btn btn--primary" type="button" id="stickyAdd" ${out ? 'disabled' : ''}>${out ? 'Sold out' : 'Add to bag'}</button>
    </div>`;

    bind();
  }

  /* ---------- Gallery ---------- */
  function setView(v) {
    state.view = (v + VIEWS.length) % VIEWS.length;
    $$('[data-slide]').forEach((s) => {
      const on = +s.dataset.slide === state.view;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', String(!on));
    });
    $$('[data-view]').forEach((t) => t.setAttribute('aria-current', String(+t.dataset.view === state.view)));
  }

  function refreshArt() {
    $$('[data-slide]').forEach((s) => { s.innerHTML = art(+s.dataset.slide); });
    $$('[data-view]').forEach((t) => { t.innerHTML = art(+t.dataset.view); });
    const st = $('#stickyBuy .line__img');
    if (st) st.innerHTML = art(0);
  }

  function updatePrice() {
    const txt = KB.formatINR(priceNow());
    $('#priceNow').textContent = txt;
    $('#stickyPrice').textContent = txt;
  }

  /* ---------- Add to cart ---------- */
  function validCustom() {
    if (!p.customisable) return true;
    const input = $('#customText');
    const ok = input.value.trim().length > 0;
    input.setAttribute('aria-invalid', String(!ok));
    $('#customErr').hidden = ok;
    if (!ok) {
      input.scrollIntoView({ behavior: KB.reducedMotion ? 'auto' : 'smooth', block: 'center' });
      input.focus({ preventScroll: true });
    }
    return ok;
  }

  function addToCart() {
    if (!validCustom()) return false;
    KB.cart.add(p.id, { colour: state.colour.name, size: state.size, qty: state.qty, custom: state.custom });
    return true;
  }

  function bind() {
    $$('[data-view]').forEach((b) => b.addEventListener('click', () => setView(+b.dataset.view)));

    const main = $('#galleryMain');
    KB.zoom(main);
    // Swipe between views on touch
    let sx = null;
    main.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    main.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) setView(state.view + (dx < 0 ? 1 : -1));
      sx = null;
    });

    $$('[data-colour]').forEach((b) => b.addEventListener('click', () => {
      state.colour = p.colours.find((c) => c.name === b.dataset.colour);
      $$('[data-colour]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      $('#colourName').textContent = state.colour.name;
      refreshArt();
    }));

    $$('[data-size]').forEach((b) => b.addEventListener('click', () => {
      state.size = b.dataset.size;
      $$('[data-size]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      updatePrice();
    }));

    // Arrow-key navigation in radio groups
    $$('[role="radiogroup"]').forEach((g) => g.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const items = $$('[role="radio"]', g);
      const i = items.indexOf(document.activeElement);
      const next = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
      next.focus();
      next.click();
    }));

    const custom = $('#customText');
    if (custom) {
      let t;
      custom.addEventListener('input', () => {
        state.custom = custom.value.trim();
        if (state.custom) { custom.setAttribute('aria-invalid', 'false'); $('#customErr').hidden = true; }
        clearTimeout(t);
        t = setTimeout(refreshArt, 150); // live preview on the render
      });
    }

    const qty = $('#pQty');
    const setQty = (n) => {
      state.qty = Math.max(1, Math.min(KB.cart.MAX_QTY, parseInt(n, 10) || 1));
      qty.value = state.qty;
    };
    $$('[data-pqty]').forEach((b) => b.addEventListener('click', () => setQty(state.qty + parseInt(b.dataset.pqty, 10))));
    qty.addEventListener('change', () => setQty(qty.value));

    const add = () => {
      if (!addToCart()) return;
      KB.openPanel('cartDrawer');
    };
    $('#addToCart').addEventListener('click', add);
    $('#stickyAdd').addEventListener('click', add);
    $('#buyNow').addEventListener('click', () => { if (addToCart()) window.location.href = 'cart.html'; });

    $$('.acc__btn').forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      document.getElementById(b.getAttribute('aria-controls')).classList.toggle('is-open', open);
    }));

    // Sticky mobile buy bar when the main buttons scroll away
    const sticky = $('#stickyBuy');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        sticky.classList.toggle('is-visible', show);
        sticky.setAttribute('aria-hidden', String(!show));
        sticky.inert = !show;
      }).observe($('#buyBox'));
    }
  }

  /* ---------- Related ---------- */
  function related() {
    const same = KB.products.filter((x) => x.id !== p.id && x.category === p.category);
    const others = KB.products.filter((x) => x.id !== p.id && x.category !== p.category);
    const list = same.concat(others).slice(0, 4);
    if (!list.length) return;
    $('#related').innerHTML = list.map((x) => KB.card(x)).join('');
    $('#relLink').href = catHref;
    $('#relLink').innerHTML = `More ${esc(cat ? cat.name : '')} ${I.arrow}`;
    $('#relatedSection').hidden = false;
  }

  render();
  related();
})();
