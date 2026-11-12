/* Kuch Bhi Prints — contact page */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, $$, esc, icons: I, config: cfg } = KB;

  const card = (href, icon, k, v, ext) => href
    ? `<a class="contact-card" href="${href}" ${ext ? 'target="_blank" rel="noopener"' : ''}><span class="contact-card__ic">${icon}</span><span><small>${k}</small><strong>${v}</strong></span></a>`
    : `<div class="contact-card"><span class="contact-card__ic">${icon}</span><span><small>${k}</small><strong>${v}</strong></span></div>`;

  $('#contactCards').innerHTML = [
    card(cfg.dmUrl, I.chat, 'Fastest reply', 'DM us on Instagram', true),
    card(cfg.instagramUrl, I.insta, 'Instagram', `@${esc(cfg.handle)}`, true),
    cfg.whatsapp ? card(`https://wa.me/${cfg.whatsapp}`, I.phone, 'WhatsApp', 'Chat with us', true) : '',
    cfg.email ? card(`mailto:${esc(cfg.email)}`, I.mail, 'Email', esc(cfg.email)) : '',
    cfg.phone ? card(`tel:${esc(cfg.phone.replace(/\s/g, ''))}`, I.phone, 'Phone', esc(cfg.phone)) : '',
    card(null, I.pin, 'Based in', esc(cfg.location))
  ].join('');

  const faqs = [
    ['How do I place an order?', 'Add products to your bag and tap <strong>Send order request</strong>. Your order is turned into a message for us on Instagram. We confirm availability, shipping and payment with you before anything is charged.'],
    ['Do you take custom orders?', 'Yes. Our motto is <em>Socho kuch bhi. Print hum karenge!</em> Use the <a href="custom.html" style="text-decoration:underline">custom print form</a> to share your idea, a reference image, colour and size.'],
    ['How much is shipping and how long does it take?', 'It depends on the piece and where you are. We confirm shipping charges and timelines with you before you pay.'],
    ['Can I use real flames with the lanterns and diyas?', 'Please use LED tealights or LED flames only. Printed pieces are decorative and should be kept away from open flames and high heat.']
  ];
  $('#faq').innerHTML = faqs.map(([q, a], i) => `<div class="acc__item">
    <h3 style="margin:0"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-${i}" id="faqb-${i}">${q}${I.plus}</button></h3>
    <div class="acc__panel" id="faq-${i}" role="region" aria-labelledby="faqb-${i}"><div><div class="acc__inner"><p>${a}</p></div></div></div>
  </div>`).join('');
  $$('#faq .acc__btn').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById(b.getAttribute('aria-controls')).classList.toggle('is-open', open);
  }));

  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#mName').value.trim();
    const msg = $('#mMsg').value.trim();
    $('#mName').setAttribute('aria-invalid', String(!name));
    $('#mMsg').setAttribute('aria-invalid', String(msg.length < 5));
    $('#mNameErr').hidden = !!name;
    $('#mMsgErr').hidden = msg.length >= 5;
    if (!name) { $('#mName').focus(); return; }
    if (msg.length < 5) { $('#mMsg').focus(); return; }
    const text = `Hi ${cfg.brand}! [${$('#mTopic').value}]\n\n${msg}\n\n— ${name}`;
    if (cfg.email && !cfg.whatsapp) {
      KB.modal({
        title: 'Send your message',
        body: '<p>Choose how you’d like to send it.</p>',
        actions: [
          { label: 'Send by email', href: `mailto:${cfg.email}?subject=${encodeURIComponent($('#mTopic').value)}&body=${encodeURIComponent(text)}`, primary: true },
          { label: 'Send on Instagram', onClick: () => KB.sendMessage(text, { title: 'Send your message' }) }
        ]
      });
      return;
    }
    KB.sendMessage(text, { title: 'Send your message' });
  });
})();
