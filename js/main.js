/* =========================================================
   BLACKBYTE — Shared JS (main.js)
   ========================================================= */

/* ─── Page Fade Transition ─────────────────────────────── */
document.body.classList.add('page-entering');
window.addEventListener('load', () => {
  requestAnimationFrame(() => document.body.classList.remove('page-entering'));
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto')
      || href.startsWith('http') || href.startsWith('https')
      || link.target === '_blank') return;
  // Skip same-page anchor links like "index.html#services"
  if (href.includes('#')) {
    const pagePart = href.split('#')[0];
    const currentPage = window.location.pathname.split('/').pop();
    if (!pagePart || pagePart === currentPage) return;
  }
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = href; }, 320);
  });
});

/* ─── Scroll Reveal (staggered) ────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-line').forEach((el, i) => {
  if (el.classList.contains('reveal')) el.style.transitionDelay = `${(i % 6) * 80}ms`;
  revealObserver.observe(el);
});

/* Service cards staggered entry */
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
  revealObserver.observe(card);
});

/* ─── Navbar Scroll ────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── Hamburger Menu ───────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ─── BLACKBYTE Scramble Effect ────────────────────────── */
function scrambleText(el, finalText, duration = 1800) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!%&0123456789';
  let startTime = null;
  const len = finalText.length;

  function frame(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    let result = '';
    for (let i = 0; i < len; i++) {
      if (finalText[i] === ' ') { result += ' '; continue; }
      const revealThreshold = (i / len) * 0.85;
      if (progress > revealThreshold) {
        result += finalText[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = result;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = finalText;
  }
  requestAnimationFrame(frame);
}

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const originalText = heroTitle.dataset.text || heroTitle.textContent.trim();
  setTimeout(() => scrambleText(heroTitle, originalText, 1800), 400);

  heroTitle.addEventListener('mouseenter', () => {
    scrambleText(heroTitle, originalText, 900);
  });
}

/* ─── Hero Orbital Spin + Parallax ────────────────────── */
const heroOrbital = document.querySelector('.hero-bg-orbital');
if (heroOrbital) {
  let orbitalRot = 0;
  let orbitalLast = performance.now();
  (function spinOrbital() {
    const now = performance.now();
    orbitalRot = (orbitalRot + (now - orbitalLast) * 0.012) % 360;
    orbitalLast = now;
    const scrollY = window.scrollY;
    heroOrbital.style.transform = `translateY(calc(-50% + ${scrollY * 0.18}px)) rotate(${orbitalRot}deg)`;
    requestAnimationFrame(spinOrbital);
  })();
}

/* ─── Service Cards 3D Tilt ────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const x   = e.clientX - r.left;
    const y   = e.clientY - r.top;
    const rx  = ((y - r.height / 2) / r.height) * -10;
    const ry  = ((x - r.width  / 2) / r.width)  *  10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.transition = 'transform 0.08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.45s cubic-bezier(.23,1,.32,1)';
  });
});

/* ─── Magnetic Buttons ─────────────────────────────────── */
document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.2;
    const y = (e.clientY - r.top  - r.height / 2) * 0.2;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.15s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(.23,1,.32,1)';
  });
});

/* ─── Stat bars animation ──────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const fill = e.target;
    const w = fill.dataset.width || '100';
    fill.style.setProperty('--fill-width', w + '%');
    fill.classList.add('animated');
    barObserver.unobserve(fill);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-v2-fill').forEach(el => barObserver.observe(el));

/* ─── Animated Counter ─────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '');
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ─── Typing Subtitle ──────────────────────────────────── */
const heroSub = document.querySelector('.hero-subtitle');
if (heroSub) {
  const text = heroSub.textContent.trim();
  heroSub.textContent = '';
  heroSub.style.borderRight = '2px solid rgba(255,255,255,0.6)';
  let i = 0;
  const typeInterval = setInterval(() => {
    heroSub.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typeInterval);
      setTimeout(() => { heroSub.style.borderRight = 'none'; }, 800);
    }
  }, 32);
}

/* ─── Smooth Section Highlight ─────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navItems.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));
}

/* ─── Noise Canvas Overlay ─────────────────────────────── */
(function initNoise() {
  const canvas = document.createElement('canvas');
  canvas.id = 'noise-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9999',
    opacity: '0.028', mixBlendMode: 'overlay'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, frame = 0;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function drawNoise() {
    const img = ctx.createImageData(w, h);
    const d   = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i] = d[i+1] = d[i+2] = v;
      d[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  function loop() {
    if (++frame % 3 === 0) drawNoise(); // refresh every 3 frames
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  loop();
})();

/* ─── Scroll Progress Bar ──────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  Object.assign(bar.style, {
    position: 'fixed', top: 0, left: 0,
    height: '2px', width: '0%',
    background: 'linear-gradient(90deg, #6b1010, #9b1c1c, #a07828)',
    zIndex: '10000', pointerEvents: 'none',
    transition: 'width 0.1s linear',
    opacity: '1'
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ─── Nav Auth State ───────────────────────────────────── */
(function initNavAuth() {
  const sessionRaw = localStorage.getItem('bb_session');
  if (!sessionRaw) return;
  let session;
  try { session = JSON.parse(sessionRaw); } catch { return; }
  if (!session || !session.name) return;

  const navRight = document.querySelector('.nav-right');
  if (navRight) {
    navRight.innerHTML = `
      <span class="nav-user-name">${escapeHTML(session.name)}</span>
      <a href="dashboard.html" class="nav-cta btn-sm">Mi cuenta</a>
      <button class="nav-logout" id="nav-logout-btn">Salir</button>
    `;
    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('bb_session');
      window.location.href = 'index.html';
    });
  }

  const loginLink = document.querySelector('.nav-links .nav-login-link');
  if (loginLink) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;width:100%';
    wrapper.innerHTML = `
      <a href="dashboard.html" style="display:block;padding:0.9rem 0;border-bottom:1px solid var(--border);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim)">Mi cuenta</a>
      <button class="nav-logout" id="mob-logout-btn" style="display:block;width:100%;padding:0.9rem 0;text-align:left;border:none;background:none;font-family:inherit;font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);cursor:pointer">Salir</button>
    `;
    loginLink.replaceWith(wrapper);
    document.getElementById('mob-logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('bb_session');
      window.location.href = 'index.html';
    });
  }
})();


/* ─── Hero Grid Canvas ─────────────────────────────────── */
(function initHeroGrid() {
  const container = document.getElementById('hero-grid');
  if (!container) return;

  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, offset = 0;
  const SIZE = 55;

  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    offset = (offset + 0.3) % SIZE;

    // vertical lines
    for (let x = (offset % SIZE); x < W; x += SIZE) {
      const dist = Math.abs(x - W / 2) / (W / 2);
      const alpha = (1 - dist) * 0.12;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // horizontal lines
    for (let y = (offset % SIZE); y < H; y += SIZE) {
      const dist = Math.abs(y - H / 2) / (H / 2);
      const alpha = (1 - dist) * 0.09;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // highlight random intersections occasionally
    if (Math.random() < 0.04) {
      const gx = Math.floor(Math.random() * Math.ceil(W / SIZE)) * SIZE + (offset % SIZE);
      const gy = Math.floor(Math.random() * Math.ceil(H / SIZE)) * SIZE + (offset % SIZE);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 30);
      g.addColorStop(0, 'rgba(255,255,255,0.18)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(gx - 30, gy - 30, 60, 60);
    }

    requestAnimationFrame(loop);
  })();
})();

/* ─── Hero Mouse Gradient ──────────────────────────────── */
(function initHeroGlow() {
  const hero = document.getElementById('hero');
  const glow = document.getElementById('hero-glow');
  if (!hero || !glow) return;

  Object.assign(glow.style, {
    position: 'absolute', inset: '0',
    pointerEvents: 'none', zIndex: '0',
    background: 'radial-gradient(600px circle at 30% 40%, rgba(160,120,40,0.08) 0%, transparent 70%)'
  });

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    glow.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(155,28,28,0.12) 0%, rgba(160,120,40,0.06) 40%, transparent 70%)`;
  }, { passive: true });
})();

/* ─── Particle Canvas (full page, fixed) ───────────────── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-particles';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '1'
  });
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.15, 0.15), vy: rand(-0.25, -0.05),
      size: rand(1, 2.2),
      alpha: rand(0.04, 0.18),
      life: rand(0.3, 1)
    };
  }

  resize();
  const count = window.innerWidth < 768 ? 70 : 140;
  for (let i = 0; i < count; i++) particles.push(createParticle());
  window.addEventListener('resize', resize, { passive: true });

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.life -= 0.0015;
      if (p.life <= 0 || p.y < -10) particles[i] = createParticle();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      // mix crimson and gold for particles in hero
      const r = Math.random() > 0.6 ? 160 : 245;
      const g = Math.random() > 0.6 ? 80  : 220;
      const b = Math.random() > 0.6 ? 40  : 210;
      ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * p.life})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', resize, { passive: true });
})();

/* ─── Stats Section Canvas ─────────────────────────────── */
(function initStatsCanvas() {
  const canvas = document.getElementById('stats-canvas');
  if (!canvas) return;
  const section = document.getElementById('stats');
  const ctx = canvas.getContext('2d');
  let W, H, lines = [], t = 0;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    lines = [];
    for (let i = 0; i < 18; i++) {
      lines.push({
        x: Math.random() * W, y: Math.random() * H,
        tx: Math.random() * W, ty: Math.random() * H,
        speed: 0.002 + Math.random() * 0.003,
        alpha: 0.03 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    // pulsing orbs
    [0.2, 0.5, 0.8].forEach((xr, i) => {
      const x = W * xr;
      const y = H * 0.5 + Math.sin(t + i * 2) * H * 0.1;
      const r = 200 + Math.sin(t * 0.7 + i) * 60;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${0.055 + Math.sin(t + i) * 0.02})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // animated lines
    lines.forEach(l => {
      l.phase += l.speed;
      const ax = l.x + Math.sin(l.phase) * 80;
      const ay = l.y + Math.cos(l.phase * 0.7) * 60;
      const bx = l.tx + Math.cos(l.phase) * 80;
      const by = l.ty + Math.sin(l.phase * 0.7) * 60;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = `rgba(255,255,255,${l.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    requestAnimationFrame(loop);
  })();
})();

/* ─── Multi-layer Scroll Parallax ──────────────────────── */
(function initParallax() {
  const layers = [
    { sel: '.hero-content',    speed: 0.12 },
    { sel: '#hero-glow',       speed: 0.08 },
  ];
  const els = layers.map(l => ({ el: document.querySelector(l.sel), speed: l.speed }))
                     .filter(l => l.el);

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    els.forEach(({ el, speed }) => {
      el.style.transform = el.id === 'hero-glow'
        ? `translate(-50%, calc(-50% + ${y * speed}px))`
        : `translateY(${y * speed}px)`;
    });
  }, { passive: true });
})();

/* ─── Courses Section Canvas ───────────────────────────── */
(function initCoursesCanvas() {
  const canvas = document.getElementById('courses-canvas');
  if (!canvas) return;
  const section = document.getElementById('courses');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], t = 0;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    nodes = Array.from({ length: 22 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1 + Math.random() * 2
    }));
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;

    // background glow
    const g = ctx.createRadialGradient(W * 0.7, H * 0.5, 0, W * 0.7, H * 0.5, W * 0.5);
    g.addColorStop(0, `rgba(255,255,255,${0.04 + Math.sin(t) * 0.015})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - d / 160)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fill();
    });

    requestAnimationFrame(loop);
  })();
})();

/* ─── Paper Section Dust Particles ────────────────────── */
(function initPaperDust() {
  document.querySelectorAll('.paper-section').forEach(section => {
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0',
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0'
    });
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }

    function rand(a, b) { return Math.random() * (b - a) + a; }

    function mkParticle() {
      return {
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.12, 0.12), vy: rand(-0.18, -0.04),
        size: rand(0.8, 2.2),
        alpha: rand(0.04, 0.14),
        // warm tones: dusty rose, gold, brown
        hue: Math.random() > 0.5 ? `155,28,28` : `160,120,40`,
        life: rand(0.5, 1)
      };
    }

    resize();
    const count = Math.min(Math.floor((W * H) / 14000), 80);
    for (let i = 0; i < count; i++) particles.push(mkParticle());
    window.addEventListener('resize', resize, { passive: true });

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.0008;
        if (p.life <= 0 || p.y < -5) particles[i] = mkParticle();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.alpha * p.life})`;
        ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  });
})();

/* ─── Split-char title animation ───────────────────────── */
(function initSplitTitles() {
  document.querySelectorAll('.split-title').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.cssText = `
        display:inline-block;
        opacity:0;
        transform:translateY(60px) rotate(${Math.random() > 0.5 ? 4 : -4}deg);
        transition: opacity 0.5s ease ${i * 40}ms, transform 0.5s cubic-bezier(.23,1,.32,1) ${i * 40}ms;
      `;
      el.appendChild(span);
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        el.querySelectorAll('span').forEach(s => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0) rotate(0deg)';
        });
        obs.unobserve(el);
      });
    }, { threshold: 0.2 });
    obs.observe(el);
  });
})();


/* ─── Utility ──────────────────────────────────────────── */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
