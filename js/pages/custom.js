/* Kuch Bhi Prints — custom print request */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, $$, esc, icons: I, config: cfg } = KB;
  const DRAFT_KEY = 'kb_custom_draft_v1';
  const MAX_FILES = 4;
  const MAX_MB = 8;

  const TYPES = [
    { id: 'Name plate', shape: 'nameplate' },
    { id: 'Keychain / initials', shape: 'keychain' },
    { id: 'Lamp or lantern', shape: 'lantern' },
    { id: 'Festive / devotional', shape: 'diya' },
    { id: 'Home décor', shape: 'vase' },
    { id: 'Something else', shape: 'organiser' }
  ];
  const COLOURS = [{ name: 'No preference', hex: null }].concat(Object.values(KB.colours));

  let type = TYPES[0].id;
  let colour = COLOURS[0];
  let files = [];

  /* ---------- Visual ---------- */
  function updateArt() {
    const t = TYPES.find((x) => x.id === type);
    $('#ideaArt').innerHTML = KB.art.render(t.shape, {
      color: colour.hex || '#E5562A',
      bg: '#F2D9CF',
      lit: true,
      text: t.shape === 'nameplate' ? ($('#cName').value.trim().split(' ')[0] || 'Your Name') : t.shape === 'keychain' ? ($('#cName').value.trim()[0] || 'K') : undefined,
      label: `Illustration of a custom ${t.id.toLowerCase()} (placeholder render)`
    });
  }

  /* ---------- Options ---------- */
  $('#typeOpts').innerHTML = TYPES.map((t, i) => `<label class="type-opt"><input type="radio" name="type" value="${esc(t.id)}" ${i === 0 ? 'checked' : ''}><span>${esc(t.id)}</span></label>`).join('');
  $('#colourOpts').innerHTML = COLOURS.map((c, i) => `<button type="button" class="swatch" role="radio" aria-checked="${i === 0}" aria-label="${esc(c.name)}" data-c="${i}">
    <span style="--c:${c.hex || 'conic-gradient(#E5562A 0 25%, #F2B33D 0 50%, #3F6E64 0 75%, #9C86D6 0)'};${c.hex ? '' : 'background:conic-gradient(#E5562A 0 25%, #F2B33D 0 50%, #3F6E64 0 75%, #9C86D6 0)'}"></span></button>`).join('');

  $('#typeOpts').addEventListener('change', (e) => { type = e.target.value; updateArt(); saveDraft(); });
  $('#colourOpts').addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    colour = COLOURS[+b.dataset.c];
    $$('[data-c]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    $('#colourName').textContent = `— ${colour.name}`;
    updateArt();
    saveDraft();
  });
  $('#colourOpts').addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const items = $$('[data-c]');
    const i = items.indexOf(document.activeElement);
    const n = items[(i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length];
    n.focus();
    n.click();
  });

  /* ---------- Uploads (previews only — files are not sent anywhere) ---------- */
  function renderPreviews() {
    $('#previews').innerHTML = files.map((f, i) => `<div class="preview"><img src="${f.url}" alt="Reference image ${i + 1}: ${esc(f.file.name)}"><button type="button" data-rm="${i}" aria-label="Remove ${esc(f.file.name)}">${I.close}</button></div>`).join('');
  }
  function addFiles(list) {
    const err = $('#fileErr');
    const problems = [];
    Array.from(list).forEach((file) => {
      if (files.length >= MAX_FILES) { problems.push(`Only ${MAX_FILES} images allowed.`); return; }
      if (!/^image\//.test(file.type)) { problems.push(`${file.name} isn’t an image.`); return; }
      if (file.size > MAX_MB * 1024 * 1024) { problems.push(`${file.name} is over ${MAX_MB} MB.`); return; }
      files.push({ file, url: URL.createObjectURL(file) });
    });
    err.hidden = !problems.length;
    err.textContent = [...new Set(problems)].join(' ');
    renderPreviews();
  }
  $('#cFiles').addEventListener('change', (e) => { addFiles(e.target.files); e.target.value = ''; });
  const dz = $('#dropzone');
  ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('is-over'); }));
  dz.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));
  $('#previews').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rm]');
    if (!b) return;
    URL.revokeObjectURL(files[+b.dataset.rm].url);
    files.splice(+b.dataset.rm, 1);
    renderPreviews();
  });

  /* ---------- Draft ---------- */
  const FIELDS = ['cDesc', 'cW', 'cH', 'cD', 'cQty', 'cDate', 'cName', 'cCity', 'cContact'];
  function saveDraft() {
    const d = { type, colour: colour.name };
    FIELDS.forEach((f) => { d[f] = $('#' + f).value; });
    KB.store.set(DRAFT_KEY, d);
  }
  function loadDraft() {
    const d = KB.store.get(DRAFT_KEY, null);
    const ref = KB.params.get('ref');
    if (d) {
      FIELDS.forEach((f) => { if (d[f] != null) $('#' + f).value = d[f]; });
      const t = TYPES.find((x) => x.id === d.type);
      if (t) { type = t.id; const r = $(`input[name="type"][value="${t.id}"]`); if (r) r.checked = true; }
      const ci = COLOURS.findIndex((c) => c.name === d.colour);
      if (ci > -1) $(`[data-c="${ci}"]`).click();
    }
    if (ref && !$('#cDesc').value.includes(ref)) {
      $('#cDesc').value = `Something like the “${ref}”, but… ` + ($('#cDesc').value || '');
    }
  }
  $('#customForm').addEventListener('input', (e) => {
    saveDraft();
    if (e.target.id === 'cName') updateArt();
  });

  /* ---------- Submit ---------- */
  $('#customForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = $('#cDesc').value.trim();
    const name = $('#cName').value.trim();
    const okDesc = desc.length >= 10;
    const okName = name.length > 0;
    $('#cDesc').setAttribute('aria-invalid', String(!okDesc));
    $('#cName').setAttribute('aria-invalid', String(!okName));
    $('#cDescErr').hidden = okDesc;
    $('#cNameErr').hidden = okName;
    if (!okDesc || !okName) { (!okDesc ? $('#cDesc') : $('#cName')).focus(); return; }

    const dims = ['cW', 'cH', 'cD'].map((f) => $('#' + f).value.trim());
    const dimTxt = dims.some(Boolean) ? `${dims.map((x) => x || '?').join(' × ')} cm (W × H × D)` : '';
    const msg = [
      `Hi ${cfg.brand}! I have a custom print request.`,
      '',
      `Type: ${type}`,
      `Idea: ${desc}`,
      `Colour: ${colour.name}`,
      dimTxt ? `Approx. size: ${dimTxt}` : null,
      `Quantity: ${Math.max(1, parseInt($('#cQty').value, 10) || 1)}`,
      $('#cDate').value ? `Needed by: ${$('#cDate').value}` : null,
      files.length ? `Reference images: ${files.length} (attaching next)` : null,
      '',
      `Name: ${name}`,
      $('#cCity').value.trim() ? `City: ${$('#cCity').value.trim()}` : null,
      $('#cContact').value.trim() ? `Contact: ${$('#cContact').value.trim()}` : null
    ].filter((x) => x !== null).join('\n');

    KB.sendMessage(msg, {
      title: 'Send your custom request',
      intro: files.length
        ? `<strong>Don’t forget your ${files.length} reference image${files.length > 1 ? 's' : ''}.</strong> Attach ${files.length > 1 ? 'them' : 'it'} in the chat after pasting the message.`
        : 'We’ll reply with questions, a price and a timeline. Nothing is charged until you agree.'
    });
  });

  loadDraft();
  updateArt();
})();
