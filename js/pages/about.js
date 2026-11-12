/* Kuch Bhi Prints — about page */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, esc } = KB;

  const r = (shape, o) => KB.art.render(shape, o);
  $('#collage .a1').innerHTML = r('lantern', { color: '#EFE6D6', bg: '#24211E', lit: true, label: 'Lattice lantern (placeholder render)' });
  $('#collage .a2').innerHTML = r('elephant', { color: '#C9A040', bg: '#F3E3C4', flame: true, label: 'Elephant tealight holder (placeholder render)' });
  $('#collage .a3').innerHTML = r('temple', { color: '#F4F1EC', bg: '#F2D9CF', label: 'Miniature mandir (placeholder render)' });

  const steps = [
    ['An idea', 'It starts with a thought: a gift, a festive piece, a name or a shape you can’t find in shops.', 'nameplate', { color: '#2B2825', bg: '#F2D9CF', text: 'Idea' }],
    ['A design', 'The idea becomes a 3D model, checked for strength, size and how it will print.', 'organiser', { color: '#8FAE8B', bg: '#E3E7DF' }],
    ['Layer by layer', 'The printer builds the object from the bottom up, one thin layer at a time.', 'vase', { color: '#E5562A', bg: '#24211E', view: 2 }],
    ['Finished & yours', 'Each piece is cleaned, checked and packed for its new home.', 'diya', { color: '#F2B33D', bg: '#F3E3C4' }]
  ];
  $('#process').innerHTML = steps.map(([t, d, shape, o], i) => `<li class="process__step">
    <div class="process__art">${r(shape, Object.assign({ label: `${t} (placeholder render)` }, o))}</div>
    <span class="eyebrow eyebrow--plain">Step 0${i + 1}</span>
    <h3>${esc(t)}</h3>
    <p>${esc(d)}</p>
  </li>`).join('');
})();
