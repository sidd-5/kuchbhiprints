/* Kuch Bhi Prints — homepage */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, esc, icons: I, config: cfg } = KB;

  /* ---------- Hero ---------- */
  function hero() {
    const stage = (id, shape, opts) => {
      const el = $(id);
      if (el) el.innerHTML = KB.art.render(shape, Object.assign({ transparent: true, bg: '#1C1A17', noTag: true, label: '' }, opts));
    };
    stage('#stageMain', 'lantern', { color: '#EFE6D6', lit: true });
    stage('#stageLeft', 'elephant', { color: '#C9A040', flame: true, shadowW: 110 });
    stage('#stageRight', 'diya', { color: '#E5562A', shadowW: 100 });

    $('#heroMeta').innerHTML = [
      [I.layers, 'Printed layer by layer'],
      [I.sparkle, 'Custom requests open'],
      [I.pin, `Made in ${cfg.location.split(',')[0]}`]
    ].map(([ic, t]) => `<li>${ic}${t}</li>`).join('');

    const featured = KB.byTag('featured')[0] || KB.products[0];
    const tag = $('#stageTag');
    if (featured && tag) {
      tag.href = `product.html?id=${featured.id}`;
      tag.setAttribute('aria-label', `Featured: ${featured.name}, ${KB.formatINR(featured.price)}`);
      tag.innerHTML = `<span><small>Featured · ${KB.formatINR(featured.price)}</small><strong>${esc(featured.name)}</strong></span><span class="stage__tag-go">${I.arrow}</span>`;
    }

    // Layer counter synced to the print animation
    const delay = KB.reducedMotion ? 0 : 500;
    setTimeout(() => KB.countUp($('#layerCount'), 240, 3400), delay);
    setTimeout(() => {
      const s = $('#stageStatus');
      if (s) { s.textContent = 'Print complete'; s.classList.add('is-done'); }
    }, KB.reducedMotion ? 0 : 4000);
  }

  /* ---------- Categories ---------- */
  function categories() {
    $('#catGrid').innerHTML = KB.categories.map((c, i) => {
      const count = KB.products.filter((p) => p.category === c.id).length;
      const href = c.href || `shop.html?cat=${c.id}`;
      return `<article class="cat-card ${i === 0 ? 'cat-card--lg' : ''}">
        <div class="cat-card__art">${KB.categoryArt(c)}</div>
        <div class="cat-card__body">
          <span class="cat-card__num">0${i + 1} · ${count} ${count === 1 ? 'product' : 'products'}</span>
          <h3 class="cat-card__name">${esc(c.name)}</h3>
          <p class="cat-card__desc">${esc(c.description)}</p>
          <span class="cat-card__cta">Explore ${I.arrow}</span>
        </div>
        <a class="cat-card__link" href="${href}" aria-label="Explore ${esc(c.name)}"></a>
      </article>`;
    }).join('');
  }

  /* ---------- Trending carousel ---------- */
  function trending() {
    const list = KB.byTag('trending');
    $('#trendTrack').innerHTML = (list.length ? list : KB.products.slice(0, 6)).map((p) => KB.card(p)).join('');
  }

  /* ---------- Bestsellers bento ---------- */
  function bestsellers() {
    const list = KB.byTag('bestseller').slice(0, 4);
    const section = $('#bestsellers');
    if (!list.length) { section.hidden = true; return; }
    $('#bestGrid').innerHTML = list.map((p, i) => {
      const href = `product.html?id=${p.id}`;
      const stroke = i === 0 && KB.art.lum(p.art.bg || '#EDE6DA') < 0.5 ? 'var(--on-dark)' : 'var(--ink)';
      const action = p.stock === 'out'
        ? '<span class="badge badge--muted">Sold out</span>'
        : p.customisable
          ? `<a class="btn btn--ghost btn--sm" href="${href}">Personalise</a>`
          : `<button class="btn btn--ghost btn--sm" type="button" data-quick-add="${p.id}">Add to bag</button>`;
      return `<article class="best best--${i + 1}">
        <div class="best__media">${KB.productArt(p)}</div>
        <button class="wish-btn" type="button" data-wish="${p.id}" aria-pressed="${KB.wishlist.has(p.id)}" aria-label="Add to wishlist: ${esc(p.name)}">${I.heart}</button>
        <div class="best__body">
          <span class="best__rank" style="-webkit-text-stroke-color:${stroke}" aria-hidden="true">#0${i + 1}</span>
          <p class="card__cat">${esc(KB.categoryName(p.category))}</p>
          <h3 class="best__name"><a href="${href}">${esc(p.name)}</a></h3>
          <p class="best__tag">${esc(p.tagline)}</p>
          <div class="best__foot">${KB.priceHTML(p)}${action}</div>
        </div>
      </article>`;
    }).join('');
  }

  /* ---------- 3D difference: loupe ---------- */
  function difference() {
    const opts = { color: '#3F6E64', bg: '#2A2622', noTag: false, label: 'Close-up of a 3D-printed spiral vase showing print layers (placeholder render)' };
    $('#diffArt').innerHTML = KB.art.render('vase', opts);
    $('#loupeInner').innerHTML = KB.art.render('vase', Object.assign({}, opts, { noTag: true, label: '' }));

    const bars = Array.from({ length: 36 }, (_, i) => {
      const h = 25 + Math.round(Math.abs(Math.sin(i * 0.42)) * 75);
      return `<span style="--h:${h}%;--i:${i}"></span>`;
    }).join('');
    $('#diffLayers').innerHTML = bars;

    const vis = $('#diffVisual');
    const loupe = $('#loupe');
    const inner = $('#loupeInner');
    const Z = 2.4;
    let fx = 0.58, fy = 0.42;
    const place = () => {
      const W = vis.clientWidth, H = vis.clientHeight, s = loupe.offsetWidth;
      const px = fx * W, py = fy * H;
      loupe.style.transform = `translate(${px - s / 2}px, ${py - s / 2}px)`;
      inner.style.width = `${W * Z}px`;
      inner.style.height = `${H * Z}px`;
      inner.style.transform = `translate(${s / 2 - px * Z}px, ${s / 2 - py * Z}px)`;
    };
    vis.addEventListener('pointermove', (e) => {
      const r = vis.getBoundingClientRect();
      fx = Math.min(0.92, Math.max(0.08, (e.clientX - r.left) / r.width));
      fy = Math.min(0.92, Math.max(0.08, (e.clientY - r.top) / r.height));
      requestAnimationFrame(place);
    });
    window.addEventListener('resize', place);
    place();
  }

  /* ---------- New arrivals ---------- */
  function newArrivals() {
    $('#newGrid').innerHTML = KB.newest().slice(0, 4).map((p) => KB.card(p)).join('');
  }

  /* ---------- Editorial showcase ---------- */
  function showcase() {
    const list = (KB.byTag('featured').length ? KB.byTag('featured') : KB.products).slice(0, 3);
    const n = list.length;
    $('#showcase').innerHTML = list.map((p, i) => {
      const href = `product.html?id=${p.id}`;
      const rows = [
        ['Colours', p.colours.map((c) => `<span class="dot" style="--c:${c.hex}" title="${esc(c.name)}"></span>`).join('') + ` <span class="muted" style="font-weight:500">${p.colours.length}</span>`],
        p.sizes ? ['Sizes', p.sizes.map((s) => esc(s.label)).join(' · ')] : null,
        p.specs.dimensions ? ['Dimensions', esc(p.specs.dimensions)] : null,
        ['Availability', KB.STOCK_LABEL[p.stock]]
      ].filter(Boolean).slice(0, 4);
      const action = p.customisable
        ? `<a class="btn btn--ghost" href="${href}">Personalise</a>`
        : p.stock !== 'out' ? `<button class="btn btn--ghost" type="button" data-quick-add="${p.id}">Add to bag</button>` : '';
      return `<article class="show ${i % 2 ? 'show--flip' : ''} reveal">
        <a class="show__media" href="${href}" aria-label="View ${esc(p.name)}" style="aspect-ratio:1/1">
          ${KB.productArt(p)}
          <span class="show__inset">${KB.productArt(p, { view: 2 })}</span>
        </a>
        <div class="show__copy">
          <p class="show__idx">0${i + 1} / 0${n}</p>
          <p class="card__cat">${esc(KB.categoryName(p.category))}</p>
          <h3 class="show__name">${esc(p.name)}</h3>
          <p class="show__desc">${esc(p.description)}</p>
          <dl class="show__specs">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          <div class="show__actions"><span class="show__price">${KB.formatINR(p.price)}</span><a class="btn btn--primary" href="${href}">View product</a>${action}</div>
        </div>
      </article>`;
    }).join('');
  }

  /* ---------- Marquee band ---------- */
  function band() {
    const row = `<div class="band__row"><span>Socho kuch bhi</span><span class="star">✦</span><a href="custom.html">Print hum karenge</a><span class="star">✦</span><a href="custom.html">Start a custom print →</a><span class="star">✦</span></div>`;
    $('#bandTrack').innerHTML = row + row + row.replace('class="band__row"', 'class="band__row" aria-hidden="true"') + row.replace('class="band__row"', 'class="band__row" aria-hidden="true"');
  }

  /* ---------- Instagram ---------- */
  function instagram() {
    const grid = $('#igGrid');
    const posts = cfg.instagramPosts || [];
    if (posts.length) {
      grid.innerHTML = posts.slice(0, 8).map((p) => `<a class="ig-tile" href="${esc(p.url || cfg.instagramUrl)}" target="_blank" rel="noopener">
        <img src="${esc(p.image)}" alt="${esc(p.alt || 'Kuch Bhi Prints on Instagram')}" loading="lazy" decoding="async">
        <span class="ig-tile__ov"><span>${I.insta}View on Instagram</span></span></a>`).join('');
      return;
    }
    $('#igNote').hidden = false;
    const picks = ['jaali-lattice-lantern', 'haathi-tealight-holder', 'miniature-mandir', 'layered-diya-set', 'mushroom-glow-lamp', 'spiral-bud-vase', 'name-initial-keychain', 'custom-name-plate']
      .map(KB.findProduct).filter(Boolean);
    grid.innerHTML = picks.map((p, i) => `<a class="ig-tile" href="${cfg.instagramUrl}" target="_blank" rel="noopener" aria-label="Kuch Bhi Prints on Instagram (opens in new tab)">
      ${KB.productArt(p, { view: i % 3 === 1 ? 1 : i % 3 === 2 ? 2 : 0 })}
      <span class="ig-tile__type">${i % 2 ? I.grid : I.reel}</span>
      <span class="ig-tile__ov"><span>${I.insta}View on Instagram</span></span>
    </a>`).join('');
  }

  /* ---------- Reviews ---------- */
  function reviews() {
    const wrap = $('#reviews');
    const stars = (n) => Array.from({ length: 5 }, (_, i) => `<span style="opacity:${i < n ? 1 : 0.25}">${I.star}</span>`).join('');
    const list = cfg.reviews || [];
    if (list.length) {
      wrap.innerHTML = list.slice(0, 3).map((r) => `<figure class="review">
        <div class="review__stars" aria-label="${r.rating || 5} out of 5 stars">${stars(r.rating || 5)}</div>
        <blockquote class="review__text">“${esc(r.text)}”</blockquote>
        <figcaption class="review__who"><span class="review__avatar" aria-hidden="true">${esc((r.name || '?')[0])}</span><span><span class="review__name" style="display:block">${esc(r.name)}</span><span class="review__meta">${esc([r.city, r.product, r.source].filter(Boolean).join(' · '))}</span></span></figcaption>
      </figure>`).join('');
      return;
    }
    wrap.innerHTML = [1, 2, 3].map((n) => `<article class="review review--placeholder">
      <div class="review__stars" aria-hidden="true">${stars(5)}</div>
      <span class="placeholder-note">${I.info} Review placeholder ${n}</span>
      <p class="review__text">Add a genuine customer review here, quoted with the customer’s permission (for example from an Instagram comment or DM).</p>
      <div class="review__who"><span class="review__avatar" aria-hidden="true">?</span><div><p class="review__name">Customer name</p><p class="review__meta">City · Product purchased</p></div></div>
    </article>`).join('');
  }

  hero();
  categories();
  trending();
  bestsellers();
  difference();
  newArrivals();
  showcase();
  band();
  instagram();
  reviews();
})();
