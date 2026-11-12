/* =========================================================================
   Kuch Bhi Prints — placeholder product renders
   -------------------------------------------------------------------------
   Generates SVG "studio renders" of products with visible print-layer lines,
   used ONLY until real product photography is added (see products.js).
   Views: 0 = front, 1 = alternate angle (studio), 2 = layer close-up.
   ========================================================================= */
(function () {
  'use strict';
  const KB = (window.KB = window.KB || {});
  let uid = 0;
  const GLOW = '#FFD58A';

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function parse(hex) {
    let h = String(hex || '#888888').replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  /** t > 0 lightens toward white, t < 0 darkens toward black */
  function mix(hex, t) {
    const target = t < 0 ? 0 : 255;
    const p = Math.min(1, Math.abs(t));
    const [r, g, b] = parse(hex).map((v) => Math.round(v + (target - v) * p));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function lum(hex) {
    const [r, g, b] = parse(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  /* ---------- Shapes (400 × 500 canvas, floor at y≈415) ---------- */
  const shapes = {
    lantern({ L, c, o, id }) {
      const dark = mix(c, -0.45);
      const lit = o.lit !== false;
      let win = '';
      for (let r = 0; r < 4; r++) {
        for (let k = 0; k < 3; k++) {
          const x = 149 + k * 38;
          const y = 148 + r * 58;
          win += `<path d="M${x} ${y + 46}V${y + 13}a13 13 0 0 1 26 0V${y + 46}Z" fill="${lit ? GLOW : dark}"${lit ? '' : ' opacity=".7"'}/>`;
        }
      }
      return `${lit ? `<circle cx="200" cy="260" r="190" fill="url(#${id}h)"/>` : ''}
<circle cx="200" cy="80" r="15" fill="none" stroke="${dark}" stroke-width="6"/>
${L(`<path d="M164 122H236L226 94H174Z" fill="FILL"/>`)}
${L(`<path d="M138 128H262L270 382H130Z" fill="FILL"/>`)}
${win}
${L(`<path d="M122 382H278L268 412H132Z" fill="FILL"/>`)}`;
    },

    lamp({ L, c, id }) {
      const spots = [[160, 165, 13], [228, 140, 9], [258, 196, 15], [190, 206, 8], [136, 214, 7]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${mix(c, 0.55)}" opacity=".75"/>`)
        .join('');
      return `<circle cx="200" cy="250" r="185" fill="url(#${id}h)"/>
<ellipse cx="200" cy="246" rx="98" ry="12" fill="${GLOW}"/>
${L(`<path d="M193 244H207V400H193Z" fill="FILL"/>`)}
${L(`<path d="M122 400Q200 384 278 400L274 414Q200 426 126 414Z" fill="FILL"/>`)}
${L(`<path d="M96 240C108 142 160 98 200 98C240 98 292 142 304 240Q200 256 96 240Z" fill="FILL"/>`)}
${spots}`;
    },

    elephant({ L, P, c, o, id }) {
      const acc = o.accent || (c.toLowerCase() === '#e5562a' ? '#F2B33D' : '#E5562A');
      const body = 'M110 300C110 230 160 200 230 205C265 180 315 190 325 235C335 270 330 300 340 330C345 350 355 360 350 372C340 378 330 370 328 355C322 335 315 320 305 312L300 400H272L268 340H170L166 400H138L134 330C120 325 110 315 110 300Z';
      const dots = [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${182 + i * 12}" cy="${289 + (i % 2) * 2}" r="3.6" fill="${mix(acc, 0.55)}"/>`).join('');
      const flame = o.flame
        ? `<circle cx="210" cy="168" r="50" fill="url(#${id}h)"/>
<rect x="186" y="186" width="48" height="24" rx="5" fill="#CFC8BD"/><rect x="186" y="186" width="48" height="6" rx="3" fill="#E9E4DC"/>
<path d="M210 190C200 176 204 162 210 146C218 162 222 176 210 190Z" fill="url(#${id}f)"/>`
        : '';
      return `${L(`<path d="${body}" fill="FILL"/>`)}
<path d="M112 292C98 302 96 322 102 338" fill="none" stroke="${mix(c, -0.35)}" stroke-width="5" stroke-linecap="round"/>
${P('M172 216C196 210 228 210 246 218L244 286C220 296 192 296 174 288Z', acc)}
${dots}
${P('M262 214C238 236 240 290 272 304C296 296 300 250 288 220Z', mix(c, -0.14))}
<circle cx="301" cy="240" r="4.5" fill="#1C1A17"/>
<path d="M312 258C325 272 340 272 346 262C336 266 324 264 316 252Z" fill="#F5F0E8"/>
${flame}`;
    },

    diya({ L, c, id }) {
      const dots = [0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${128 + i * 24}" cy="362" r="5" fill="${mix(c, 0.5)}"/>`).join('');
      return `<circle cx="340" cy="250" r="90" fill="url(#${id}h)"/>
${L(`<path d="M150 404H250L258 422H142Z" fill="FILL"/>`)}
${L(`<path d="M288 318C318 312 336 300 346 286C344 318 322 336 296 344Z" fill="FILL"/>`)}
${L(`<path d="M96 322C100 392 150 410 200 410C250 410 300 392 304 322Z" fill="FILL"/>`)}
<ellipse cx="200" cy="322" rx="104" ry="17" fill="${mix(c, -0.35)}"/>
<ellipse cx="200" cy="325" rx="92" ry="11" fill="${mix(c, -0.55)}"/>
${dots}
<path d="M342 288C330 262 338 238 346 216C358 242 366 264 352 288Z" fill="url(#${id}f)"/>`;
    },

    temple({ L, P, c, o, id }) {
      const acc = o.accent || '#E5562A';
      const bands = [[148, 252, 262], [157, 243, 232], [168, 232, 202], [181, 219, 172]]
        .map(([a, b, y]) => `<path d="M${a} ${y}H${b}" stroke="${mix(c, -0.25)}" stroke-width="3"/>`)
        .join('');
      return `${L(`<path d="M100 392H300V414H100Z" fill="FILL"/>`)}
${L(`<path d="M120 372H280V392H120Z" fill="FILL"/>`)}
${L(`<path d="M140 280H260V372H140Z" fill="FILL"/>`)}
<path d="M178 372V320a22 22 0 0 1 44 0V372Z" fill="${mix(c, -0.55)}"/>
<circle cx="200" cy="345" r="30" fill="url(#${id}h)"/>
<circle cx="200" cy="350" r="5" fill="${GLOW}"/>
${L(`<path d="M146 282C150 222 176 170 200 134C224 170 250 222 254 282Z" fill="FILL"/>`)}
${bands}
${L(`<ellipse cx="200" cy="130" rx="20" ry="8" fill="FILL"/>`)}
${L(`<path d="M190 122C186 104 214 104 210 122Z" fill="FILL"/>`)}
<path d="M200 106V62" stroke="#1C1A17" stroke-width="2.5"/>
${P('M200 62L238 72L200 84Z', acc)}`;
    },

    vase({ L, c, o, id }) {
      const d = 'M156 410C138 360 118 300 138 236C150 196 176 176 170 132H230C224 176 250 196 262 236C282 300 262 360 244 410Z';
      const ribs = [0, 1, 2, 3, 4, 5, 6]
        .map((i) => `<path d="M${130 + i * 22} 420C${120 + i * 20} 340 ${176 + i * 10} 250 ${168 + i * 10} 120" fill="none" stroke="${mix(c, -0.3)}" stroke-width="2.5" opacity=".45"/>`)
        .join('');
      return `<path d="M200 132C198 100 206 80 214 60" fill="none" stroke="#6B7F55" stroke-width="3"/>
<ellipse cx="216" cy="56" rx="9" ry="14" fill="${o.accent || '#E28A9B'}" transform="rotate(20 216 56)"/>
<path d="M203 104C188 96 182 86 184 76C196 80 204 90 203 104Z" fill="#7F9A68"/>
<clipPath id="${id}c"><path d="${d}"/></clipPath>
${L(`<path d="${d}" fill="FILL"/>`)}
<g clip-path="url(#${id}c)">${ribs}</g>
${L(`<ellipse cx="200" cy="132" rx="30" ry="7" fill="FILL"/>`)}
<ellipse cx="200" cy="132" rx="22" ry="4" fill="${mix(c, -0.55)}"/>`;
    },

    planter({ L }) {
      const greens = ['#5E8C61', '#7FAE7A', '#4E7A52'];
      const leaves = [-58, -32, -10, 12, 34, 58]
        .map((a, i) => `<ellipse cx="200" cy="215" rx="20" ry="66" fill="${greens[i % 3]}" transform="rotate(${a} 200 290)"/>`)
        .join('');
      const front = [-24, 0, 24]
        .map((a, i) => `<ellipse cx="200" cy="250" rx="16" ry="42" fill="${greens[(i + 1) % 3]}" transform="rotate(${a} 200 290)"/>`)
        .join('');
      return `${leaves}${front}
${L(`<path d="M136 296H264L248 412H152Z" fill="FILL"/>`)}
<path d="M178 296H222L216 412H184Z" fill="#fff" opacity=".10"/>
${L(`<path d="M128 282H272V300H128Z" fill="FILL"/>`)}`;
    },

    keychain({ L, c, o }) {
      const t = esc(String(o.text || 'A').slice(0, 2).toUpperCase());
      const fs = t.length > 1 ? 70 : 96;
      return `<circle cx="166" cy="176" r="36" fill="none" stroke="#B9B2A8" stroke-width="7"/>
<g transform="rotate(-10 200 290)">
${L(`<rect x="126" y="172" width="152" height="232" rx="46" fill="FILL"/>`)}
<circle cx="168" cy="212" r="15" fill="${o.bg}"/>
<text x="206" y="354" text-anchor="middle" font-family="Unbounded, sans-serif" font-weight="700" font-size="${fs}" fill="${mix(c, -0.45)}" opacity=".45">${t}</text>
<text x="202" y="350" text-anchor="middle" font-family="Unbounded, sans-serif" font-weight="700" font-size="${fs}" fill="${lum(c) > 0.7 ? mix(c, -0.25) : mix(c, 0.55)}">${t}</text>
</g>`;
    },

    nameplate({ L, P, c, o }) {
      const t = esc(String(o.text || 'Your Name').slice(0, 16));
      const fs = t.length > 10 ? 24 : t.length > 7 ? 30 : 38;
      const ink = lum(c) > 0.6 ? mix(c, -0.65) : mix(c, 0.75);
      return `${L(`<path d="M146 362H254L282 414H118Z" fill="FILL"/>`)}
${L(`<rect x="78" y="214" width="244" height="152" rx="18" fill="FILL"/>`)}
<rect x="92" y="228" width="216" height="124" rx="10" fill="none" stroke="${ink}" stroke-width="2.5" opacity=".55"/>
<text x="200" y="264" text-anchor="middle" font-family="DM Mono, monospace" font-size="12" letter-spacing="3" fill="${ink}" opacity=".8">WELCOME HOME</text>
<text x="200" y="314" text-anchor="middle" font-family="Unbounded, sans-serif" font-weight="700" font-size="${fs}" fill="${ink}">${t}</text>
${P('M188 330H212V335H188Z', o.accent || '#E5562A')}`;
    },

    organiser({ L, c, o }) {
      const cup = (cx, w, top) => {
        const x = cx - w / 2;
        return `${L(`<path d="M${x} ${top}V404a${w / 2} 10 0 0 0 ${w} 0V${top}Z" fill="FILL"/>`)}
<ellipse cx="${cx}" cy="${top}" rx="${w / 2}" ry="10" fill="${mix(c, -0.5)}"/>
<ellipse cx="${cx}" cy="${top}" rx="${w / 2}" ry="10" fill="none" stroke="${mix(c, 0.25)}" stroke-width="2"/>`;
      };
      const pens = `<path d="M206 176L188 96" stroke="#1C1A17" stroke-width="7" stroke-linecap="round"/>
<path d="M232 176L250 104" stroke="${o.accent || '#F2B33D'}" stroke-width="8" stroke-linecap="round"/>
<path d="M250 104L254 90" stroke="#1C1A17" stroke-width="3" stroke-linecap="round"/>
<path d="M218 176L222 120" stroke="#E5562A" stroke-width="6" stroke-linecap="round"/>`;
      return pens + cup(222, 96, 176) + cup(150, 90, 252) + cup(278, 82, 286);
    }
  };

  /**
   * Render a product as an SVG string.
   * @param {string} shape  key in `shapes`
   * @param {object} opts   { color, bg, view, label, transparent, lit, flame, text, accent, noTag }
   */
  function render(shape, opts = {}) {
    const id = 'kb' + ++uid;
    const c = opts.color || '#E5562A';
    const view = opts.view || 0;
    let bg = opts.bg || '#EDE6DA';
    if (view === 1) bg = opts.bgAlt || (lum(bg) > 0.5 ? '#24211E' : '#EDE6DA');
    const isDark = lum(bg) < 0.35;

    const L = (el) => el.replace(/FILL/g, `url(#${id}g)`) + el.replace(/FILL/g, `url(#${id}l)`);
    const P = (d, fill) => `<path d="${d}" fill="${fill}"/><path d="${d}" fill="url(#${id}l)"/>`;
    const fn = shapes[shape] || shapes.vase;
    const draw = fn({ L, P, c, o: Object.assign({}, opts, { bg }), id });

    const hasText = shape === 'keychain' || shape === 'nameplate';
    let transform = '';
    if (view === 1) transform = hasText ? 'rotate(-7 200 300) translate(6 0)' : 'translate(400 0) scale(-1 1)';
    if (view === 2) transform = 'translate(-210 -300) scale(2.05)';

    const showTag = KB.config && KB.config.previewMode && !opts.transparent && !opts.noTag;
    const label = esc(opts.label || 'Product render');

    return `<svg class="art" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice" focusable="false">
<defs>
<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stop-color="${mix(c, 0.3)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${mix(c, -0.4)}"/></linearGradient>
<pattern id="${id}l" width="10" height="5" patternUnits="userSpaceOnUse"><rect width="10" height="1.6" fill="#fff" opacity=".16"/><rect y="3.4" width="10" height="1.6" fill="#000" opacity=".12"/></pattern>
<pattern id="${id}d" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1" fill="${isDark ? '#fff' : '#000'}" opacity=".08"/></pattern>
<radialGradient id="${id}s"><stop offset="0" stop-color="#000" stop-opacity="${isDark ? 0.55 : 0.22}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}h"><stop offset="0" stop-color="${GLOW}" stop-opacity=".55"/><stop offset="1" stop-color="${GLOW}" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}f" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E5562A"/><stop offset=".5" stop-color="#F2B33D"/><stop offset="1" stop-color="#FFF1C4"/></linearGradient>
</defs>
${opts.transparent ? '' : `<rect width="400" height="500" fill="${bg}"/><rect width="400" height="500" fill="url(#${id}d)"/>`}
${view === 2 ? '' : `<ellipse cx="200" cy="416" rx="${opts.shadowW || 130}" ry="16" fill="url(#${id}s)"/>`}
<g transform="${transform}">${draw}</g>
${showTag ? `<text x="200" y="446" text-anchor="middle" font-family="DM Mono, monospace" font-size="10" letter-spacing="1.2" fill="${isDark ? '#F5F0E8' : '#1C1A17'}" opacity=".5">PLACEHOLDER RENDER${view === 2 ? ' · LAYER DETAIL' : ''}</text>` : ''}
</svg>`;
  }

  KB.art = { render, mix, lum, shapes: Object.keys(shapes) };
})();
