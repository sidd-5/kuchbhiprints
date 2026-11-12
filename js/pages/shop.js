/* Kuch Bhi Prints — shop catalogue (filters, sort, search, URL state) */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, $$, esc, icons: I } = KB;

  const PRICE_BUCKETS = [
    { id: 'u500', label: 'Under ₹500', test: (p) => p < 500 },
    { id: '500-1000', label: '₹500 – ₹1,000', test: (p) => p >= 500 && p <= 1000 },
    { id: 'o1000', label: 'Over ₹1,000', test: (p) => p > 1000 }
  ];
  const AVAIL = [
    { id: 'in', label: 'In stock', test: (p) => p.stock === 'in' || p.stock === 'low' },
    { id: 'made', label: 'Made to order', test: (p) => p.stock === 'made-to-order' }
  ];
  const FLAGS = [
    { id: 'new', label: 'New arrivals' },
    { id: 'featured', label: 'Featured' },
    { id: 'bestseller', label: 'Bestsellers' }
  ];

  /* ---------- State from URL ---------- */
  const P = KB.params;
  const list = (k) => (P.get(k) || '').split(',').map((s) => s.trim()).filter(Boolean);
  const state = {
    cats: new Set(list('cat').filter((c) => KB.findCategory(c))),
    price: P.get('price') || '',
    min: P.get('min') || '',
    max: P.get('max') || '',
    avail: new Set(list('avail')),
    flags: new Set([...(P.get('new') ? ['new'] : []), ...(P.get('featured') ? ['featured'] : []), ...(P.get('best') ? ['bestseller'] : []), ...list('tags')]),
    colours: new Set(list('colour')),
    q: P.get('q') || '',
    sort: P.get('sort') || 'featured'
  };

  const allColours = (() => {
    const map = new Map();
    KB.products.forEach((p) => p.colours.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map, ([name, hex]) => ({ name, hex }));
  })();

  /* ---------- Build filter UI ---------- */
  function buildFilters() {
    const count = (fn) => KB.products.filter(fn).length;
    $('#fCats').innerHTML = KB.categories.map((c) => `<label class="check"><input type="checkbox" name="cat" value="${c.id}" ${state.cats.has(c.id) ? 'checked' : ''}> ${esc(c.name)} <span class="check__count">${count((p) => p.category === c.id)}</span></label>`).join('');
    $('#fPrice').innerHTML = [{ id: '', label: 'Any price' }].concat(PRICE_BUCKETS).map((b) => `<label class="check"><input type="radio" name="price" value="${b.id}" ${state.price === b.id ? 'checked' : ''}> ${b.label}${b.test ? ` <span class="check__count">${count((p) => b.test(p.price))}</span>` : ''}</label>`).join('');
    $('#fAvail').innerHTML = AVAIL.map((a) => `<label class="check"><input type="checkbox" name="avail" value="${a.id}" ${state.avail.has(a.id) ? 'checked' : ''}> ${a.label} <span class="check__count">${count(a.test)}</span></label>`).join('');
    $('#fFlags').innerHTML = FLAGS.map((f) => `<label class="check"><input type="checkbox" name="flag" value="${f.id}" ${state.flags.has(f.id) ? 'checked' : ''}> ${f.label} <span class="check__count">${count((p) => p.tags.includes(f.id))}</span></label>`).join('');
    $('#fColours').innerHTML = allColours.map((c) => `<label class="colour-opt" title="${esc(c.name)}"><input type="checkbox" name="colour" value="${esc(c.name)}" ${state.colours.has(c.name) ? 'checked' : ''} aria-label="${esc(c.name)}"><span style="--c:${c.hex}"></span></label>`).join('');
    $('#fMin').value = state.min;
    $('#fMax').value = state.max;
    $('#shopSearch').value = state.q;
    $('#sortSelect').value = state.sort;

    $('#shopCats').innerHTML = `<button type="button" class="chip ${state.cats.size === 0 ? 'is-active' : ''}" data-cat-chip="">All</button>` +
      KB.categories.map((c) => `<button type="button" class="chip ${state.cats.size === 1 && state.cats.has(c.id) ? 'is-active' : ''}" data-cat-chip="${c.id}">${esc(c.name)}</button>`).join('');
  }

  /* ---------- Filtering ---------- */
  function filtered() {
    let out = KB.search(state.q);
    if (state.cats.size) out = out.filter((p) => state.cats.has(p.category));
    if (state.price) {
      const b = PRICE_BUCKETS.find((x) => x.id === state.price);
      if (b) out = out.filter((p) => b.test(p.price));
    }
    const min = parseFloat(state.min), max = parseFloat(state.max);
    if (!isNaN(min)) out = out.filter((p) => p.price >= min);
    if (!isNaN(max)) out = out.filter((p) => p.price <= max);
    if (state.avail.size) out = out.filter((p) => AVAIL.some((a) => state.avail.has(a.id) && a.test(p)));
    if (state.flags.size) out = out.filter((p) => [...state.flags].every((f) => p.tags.includes(f)));
    if (state.colours.size) out = out.filter((p) => p.colours.some((c) => state.colours.has(c.name)));

    const score = (p) => (p.tags.includes('featured') ? 2 : 0) + (p.tags.includes('bestseller') ? 1 : 0);
    const sorters = {
      featured: (a, b) => score(b) - score(a) || b.added.localeCompare(a.added),
      newest: (a, b) => b.added.localeCompare(a.added),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name)
    };
    return out.sort(sorters[state.sort] || sorters.featured);
  }

  /* ---------- URL sync ---------- */
  function syncURL() {
    const q = new URLSearchParams();
    if (state.cats.size) q.set('cat', [...state.cats].join(','));
    if (state.q) q.set('q', state.q);
    if (state.price) q.set('price', state.price);
    if (state.min) q.set('min', state.min);
    if (state.max) q.set('max', state.max);
    if (state.avail.size) q.set('avail', [...state.avail].join(','));
    if (state.flags.size) q.set('tags', [...state.flags].join(','));
    if (state.colours.size) q.set('colour', [...state.colours].join(','));
    if (state.sort !== 'featured') q.set('sort', state.sort);
    const s = q.toString();
    try { history.replaceState(null, '', s ? `?${s}` : window.location.pathname); } catch (e) { /* file:// in some browsers */ }
  }

  /* ---------- Render ---------- */
  function activeChips() {
    const chips = [];
    const x = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    state.cats.forEach((c) => chips.push([`cat:${c}`, KB.categoryName(c)]));
    if (state.q) chips.push(['q', `“${state.q}”`]);
    if (state.price) chips.push(['price', PRICE_BUCKETS.find((b) => b.id === state.price).label]);
    if (state.min) chips.push(['min', `Min ${KB.formatINR(state.min)}`]);
    if (state.max) chips.push(['max', `Max ${KB.formatINR(state.max)}`]);
    state.avail.forEach((a) => chips.push([`avail:${a}`, AVAIL.find((x) => x.id === a).label]));
    state.flags.forEach((f) => { const fl = FLAGS.find((x) => x.id === f); if (fl) chips.push([`flag:${f}`, fl.label]); });
    state.colours.forEach((c) => chips.push([`colour:${c}`, c]));
    $('#activeFilters').innerHTML = chips.length
      ? chips.map(([k, l]) => `<button type="button" class="chip" data-remove-filter="${esc(k)}" aria-label="Remove filter: ${esc(l)}">${esc(l)} ${x}</button>`).join('') + `<button type="button" class="chip" data-clear-filters style="border-color:transparent;text-decoration:underline">Clear all</button>`
      : '';
    const n = chips.filter(([k]) => k !== 'q').length;
    $('#filterCount').textContent = n ? `(${n})` : '';
  }

  function heading() {
    const one = state.cats.size === 1 ? KB.findCategory([...state.cats][0]) : null;
    const flag = state.flags.size === 1 ? FLAGS.find((f) => f.id === [...state.flags][0]) : null;
    const title = one ? one.name : flag && !state.cats.size ? flag.label : 'Shop all objects';
    $('#shopTitle').textContent = title;
    $('#shopLead').textContent = one ? one.description : 'Lanterns, festive pieces, décor and gifts, each one printed layer by layer.';
    const crumb = $('#crumbCat');
    crumb.hidden = !one;
    if (one) crumb.textContent = one.name;
    document.title = `${title === 'Shop all objects' ? 'Shop All' : title} — 3D-Printed | Kuch Bhi Prints`;
    $$('[data-cat-chip]').forEach((b) => b.classList.toggle('is-active', b.dataset.catChip === '' ? state.cats.size === 0 : state.cats.size === 1 && state.cats.has(b.dataset.catChip)));
  }

  function render() {
    const items = filtered();
    const grid = $('#shopGrid');
    grid.innerHTML = items.length
      ? items.map((p) => KB.card(p)).join('')
      : `<div class="no-results"><h3>Nothing matches — yet.</h3><p>Try removing a filter. Or, true to our name, ask us to print exactly what you’re imagining.</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn--ghost" type="button" data-clear-filters>Clear filters</button><a class="btn btn--primary" href="custom.html">Request a custom print ${I.arrow}</a></div></div>`;
    $('#resultCount').innerHTML = `<strong>${items.length}</strong> ${items.length === 1 ? 'product' : 'products'}`;
    $('#showResults').textContent = `Show ${items.length} result${items.length === 1 ? '' : 's'}`;
    activeChips();
    heading();
    syncURL();
    grid.setAttribute('data-stagger', '');
    KB.reveal(grid);
  }

  /* ---------- Events ---------- */
  function readForm() {
    const form = $('#filterForm');
    state.cats = new Set($$('input[name="cat"]:checked', form).map((i) => i.value));
    state.price = ($('input[name="price"]:checked', form) || { value: '' }).value;
    state.avail = new Set($$('input[name="avail"]:checked', form).map((i) => i.value));
    state.flags = new Set($$('input[name="flag"]:checked', form).map((i) => i.value));
    state.colours = new Set($$('input[name="colour"]:checked', form).map((i) => i.value));
    state.min = $('#fMin').value.trim();
    state.max = $('#fMax').value.trim();
  }

  function clearAll() {
    Object.assign(state, { cats: new Set(), price: '', min: '', max: '', avail: new Set(), flags: new Set(), colours: new Set(), q: '' });
    buildFilters();
    render();
  }

  let deb;
  $('#filterForm').addEventListener('change', () => { readForm(); render(); });
  $('#filterForm').addEventListener('input', (e) => {
    if (e.target.type !== 'number') return;
    clearTimeout(deb);
    deb = setTimeout(() => { readForm(); render(); }, 350);
  });
  $('#shopSearch').addEventListener('input', (e) => {
    clearTimeout(deb);
    deb = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 200);
  });
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; render(); });

  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cat-chip]');
    if (chip) {
      state.cats = chip.dataset.catChip ? new Set([chip.dataset.catChip]) : new Set();
      buildFilters();
      render();
      return;
    }
    if (e.target.closest('[data-clear-filters]')) { clearAll(); return; }
    const rm = e.target.closest('[data-remove-filter]');
    if (rm) {
      const [k, v] = rm.dataset.removeFilter.split(/:(.*)/s);
      if (k === 'cat') state.cats.delete(v);
      else if (k === 'avail') state.avail.delete(v);
      else if (k === 'flag') state.flags.delete(v);
      else if (k === 'colour') state.colours.delete(v);
      else if (k === 'q') state.q = '';
      else if (k === 'price') state.price = '';
      else if (k === 'min') state.min = '';
      else if (k === 'max') state.max = '';
      buildFilters();
      render();
    }
  });

  // Filters panel is a drawer on tablet/mobile only — keep it interactive on desktop.
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncFilterMode = () => {
    const f = $('#filters');
    if (!mq.matches) {
      if (f.classList.contains('is-open')) KB.closePanel();
      f.inert = false;
    }
  };
  mq.addEventListener ? mq.addEventListener('change', syncFilterMode) : mq.addListener(syncFilterMode);

  buildFilters();
  render();
})();
