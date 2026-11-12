/* =========================================================================
   Kuch Bhi Prints — interactions
   Scroll reveal, sticky header behaviour, tilt, carousels, image zoom.
   All effects respect prefers-reduced-motion.
   ========================================================================= */
(function () {
  'use strict';
  const KB = window.KB;
  const { $, $$ } = KB;
  const reduced = KB.reducedMotion;

  /* ---------- Scroll reveal ---------- */
  let io = null;
  if ('IntersectionObserver' in window && !reduced) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  /** Call after injecting new content to animate it in. */
  KB.reveal = function (root = document) {
    $$('.reveal:not(.is-in), [data-stagger] > *:not(.is-in)', root).forEach((el, i) => {
      const parent = el.parentElement;
      if (parent && parent.hasAttribute('data-stagger')) {
        el.classList.add('reveal');
        el.style.setProperty('--d', `${Math.min(Array.from(parent.children).indexOf(el), 8) * 70}ms`);
      }
      if (io) io.observe(el);
      else el.classList.add('is-in');
    });
  };

  /* ---------- Header: shrink + hide on scroll down ---------- */
  function initHeader() {
    const header = $('#siteHeader');
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      const megaOpen = $('.has-mega.is-open');
      if (y > 320 && y > lastY + 4 && !megaOpen && !document.documentElement.classList.contains('is-locked')) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 320) header.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
    update();
  }

  /* ---------- Smooth anchor scroll with header offset ---------- */
  function initAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.hasAttribute('data-to-top')) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- Pointer tilt for [data-tilt] ---------- */
  KB.tilt = function (root = document) {
    if (reduced || !window.matchMedia('(hover: hover)').matches) return;
    $$('[data-tilt]', root).forEach((el) => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = '1';
      const max = parseFloat(el.dataset.tilt) || 6;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  };

  /* ---------- Horizontal carousels: [data-carousel] + prev/next ---------- */
  KB.carousel = function (root = document) {
    $$('[data-carousel]', root).forEach((wrap) => {
      if (wrap.dataset.bound) return;
      wrap.dataset.bound = '1';
      const track = wrap.querySelector('[data-track]');
      const prev = wrap.querySelector('[data-prev]');
      const next = wrap.querySelector('[data-next]');
      if (!track) return;
      const step = () => {
        const card = track.firstElementChild;
        return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : 300;
      };
      const sync = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max;
        const bar = wrap.querySelector('[data-progress]');
        if (bar) bar.style.setProperty('--p', max > 0 ? (track.scrollLeft / max).toFixed(3) : 1);
      };
      prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
      next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
      track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
      window.addEventListener('resize', sync);
      sync();

      // Drag to scroll with a mouse
      let down = false, startX = 0, startLeft = 0, moved = false;
      track.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) { moved = true; track.classList.add('is-dragging'); }
        track.scrollLeft = startLeft - dx;
      });
      window.addEventListener('pointerup', () => { down = false; track.classList.remove('is-dragging'); });
      track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  };

  /* ---------- Hover zoom for [data-zoom] (product gallery) ---------- */
  KB.zoom = function (el) {
    if (!el || !window.matchMedia('(hover: hover)').matches) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    el.addEventListener('pointerenter', () => el.classList.add('is-zoomed'));
    el.addEventListener('pointerleave', () => el.classList.remove('is-zoomed'));
  };

  /* ---------- Count-up for [data-count-to] ---------- */
  KB.countUp = function (el, to, ms = 2600, pad = 3) {
    if (!el) return;
    if (reduced) { el.textContent = String(to).padStart(pad, '0'); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = String(Math.round(to * t)).padStart(pad, '0');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  initHeader();
  initAnchors();
  // Page scripts call KB.reveal()/KB.tilt()/KB.carousel() after rendering;
  // run once on load too for static markup.
  document.addEventListener('DOMContentLoaded', () => {
    KB.reveal();
    KB.tilt();
    KB.carousel();
  });
})();
