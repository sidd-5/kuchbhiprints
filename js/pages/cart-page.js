/* Kuch Bhi Prints — cart page & order request
   No online payment is taken. The order is sent as a message (Instagram DM,
   or WhatsApp if configured) and the brand confirms details & payment. */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, esc, icons: I, config: cfg } = KB;
  const root = $('#cartRoot');
  const DRAFT_KEY = 'kb_order_details_v1';

  function render() {
    const items = KB.cart.items();
    const count = KB.cart.count();
    $('#bagCount').textContent = count ? `(${count})` : '';

    if (!items.length) {
      root.innerHTML = `<div style="max-width:520px;margin:0 auto">${KB.emptyState('Your bag is empty', 'Nothing here yet. Lanterns, diyas and keepsakes are waiting to be found.', { label: 'Continue shopping', href: 'shop.html' })}</div>`;
      return;
    }

    const d = KB.store.get(DRAFT_KEY, {});
    const sub = KB.cart.subtotal();
    root.innerHTML = `<div class="cart-layout">
      <div>
        <ul class="lines cart-list">${items.map((l) => KB.cartLineHTML(l, { compact: false })).join('')}</ul>
        <div class="cart-actions">
          <a class="btn btn--ghost" href="shop.html">${I.arrowL} Continue shopping</a>
          <button class="btn btn--text" type="button" id="clearCart">Clear bag</button>
        </div>
      </div>

      <aside class="summary" aria-labelledby="sumTitle">
        <h2 class="summary__title" id="sumTitle">Order summary</h2>
        <div class="sum-row"><span>Subtotal (${count} item${count === 1 ? '' : 's'})</span><span>${KB.formatINR(sub)}</span></div>
        <div class="sum-row"><span>Shipping</span><span class="muted">Confirmed with you</span></div>
        <hr>
        <div class="sum-row sum-row--total"><span>Order total</span><strong>${KB.formatINR(sub)}</strong></div>
        <p class="fine">Total excludes shipping. ${esc(cfg.shippingNote)}</p>
        <hr>
        <form class="summary__fields" id="orderForm" novalidate>
          <p class="field__label" style="font-size:.95rem">Your details <small>(added to your order message)</small></p>
          <div class="field"><label class="field__label" for="oName">Name</label><input class="input" id="oName" name="name" autocomplete="name" required value="${esc(d.name || '')}"><p class="field__error" id="oNameErr" hidden>Please add your name.</p></div>
          <div class="field"><label class="field__label" for="oCity">City &amp; PIN code</label><input class="input" id="oCity" name="city" autocomplete="address-level2" placeholder="e.g. Lucknow 226001" value="${esc(d.city || '')}"></div>
          <div class="field"><label class="field__label" for="oNote">Note <small>(optional)</small></label><textarea class="textarea" id="oNote" name="note" rows="3" placeholder="Gift wrap, needed-by date, anything else…">${esc(d.note || '')}</textarea></div>
          <button class="btn btn--primary btn--block" type="submit">Send order request ${I.arrow}</button>
          <p class="fine" style="text-align:center">You won’t be charged here. We’ll reply on ${cfg.whatsapp ? 'WhatsApp' : 'Instagram'} to confirm availability, shipping and payment.</p>
        </form>
      </aside>
    </div>`;

    $('#clearCart').addEventListener('click', () => {
      const snapshot = KB.cart.items();
      KB.cart.clear();
      KB.toast('Bag cleared', { label: 'Undo', onClick: () => snapshot.forEach((l) => KB.cart.add(l.id, l)) });
    });

    const form = $('#orderForm');
    form.addEventListener('input', () => {
      KB.store.set(DRAFT_KEY, { name: $('#oName').value, city: $('#oCity').value, note: $('#oNote').value });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#oName').value.trim();
      $('#oName').setAttribute('aria-invalid', String(!name));
      $('#oNameErr').hidden = !!name;
      if (!name) { $('#oName').focus(); return; }
      KB.sendMessage(buildMessage(name, $('#oCity').value.trim(), $('#oNote').value.trim()), {
        title: 'Send your order request',
        intro: 'Nothing has been charged. Send this message and we’ll confirm your order personally.'
      });
    });
  }

  function buildMessage(name, city, note) {
    const lines = KB.cart.items().map((l, i) => {
      const d = KB.cart.detail(l);
      const v = [l.colour, l.size, l.custom && `“${l.custom}”`].filter(Boolean).join(', ');
      return `${i + 1}. ${d.product.name}${v ? ` (${v})` : ''} × ${l.qty} = ${KB.formatINR(d.total)}`;
    });
    return [
      `Hi ${cfg.brand}! I'd like to order:`,
      '',
      ...lines,
      '',
      `Subtotal: ${KB.formatINR(KB.cart.subtotal())} (+ shipping)`,
      '',
      `Name: ${name}`,
      city ? `City/PIN: ${city}` : null,
      note ? `Note: ${note}` : null
    ].filter((x) => x !== null).join('\n');
  }

  // Re-render on any change, but keep the focused quantity input usable.
  KB.cart.onChange(() => {
    const active = document.activeElement;
    const key = active && active.closest && active.closest('.line[data-key]') ? active.closest('.line[data-key]').dataset.key : null;
    const sel = active && active.matches && active.matches('[data-qty]') ? `[data-qty="${active.dataset.qty}"]` : '[data-qty-input]';
    render();
    if (key) {
      const line = Array.from(document.querySelectorAll('.cart-list .line[data-key]')).find((l) => l.dataset.key === key);
      const el = line && line.querySelector(sel);
      if (el) el.focus();
    }
  });

  render();
})();
