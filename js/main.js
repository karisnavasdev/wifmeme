/* ============================================================
   Ansemhood wif Hat — Living Forest Interactions
   ============================================================ */

const CONFIG = {
  tokenAddress: "YOUR_TOKEN_ADDRESS_HERE",
  xUrl: "https://x.com/AnsemhoodwifH",
  pumpSwapUrl: "https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=YOUR_TOKEN_ADDRESS_HERE",
  dexScreenerUrl: "https://dexscreener.com/solana/YOUR_TOKEN_ADDRESS_HERE",
};

/* ---- Forest particle canvas (fireflies + leaves) ---- */
function initForestCanvas() {
  const canvas = document.getElementById("forestCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let raf = 0;
  const particles = [];
  const leaves = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function spawn() {
    particles.length = 0;
    leaves.length = 0;
    const fireCount = w < 768 ? 28 : 55;
    const leafCount = w < 768 ? 10 : 18;

    for (let i = 0; i < fireCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.2,
        a: Math.random(),
        da: 0.004 + Math.random() * 0.01,
        vx: -0.15 + Math.random() * 0.3,
        vy: -0.2 + Math.random() * 0.15,
        hue: 35 + Math.random() * 25,
      });
    }

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: 6 + Math.random() * 10,
        rot: Math.random() * Math.PI * 2,
        vr: -0.02 + Math.random() * 0.04,
        vx: -0.3 + Math.random() * 0.6,
        vy: 0.35 + Math.random() * 0.55,
        tone: Math.random() > 0.5 ? "#3a5a38" : "#6b4a28",
      });
    }
  }

  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = l.tone;
    ctx.beginPath();
    ctx.ellipse(0, 0, l.s * 0.45, l.s * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.da;
      if (p.a > 1 || p.a < 0.05) p.da *= -1;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.a})`);
      g.addColorStop(1, `hsla(${p.hue}, 90%, 50%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const l of leaves) {
      l.x += l.vx + Math.sin(l.rot) * 0.2;
      l.y += l.vy;
      l.rot += l.vr;
      if (l.y > h + 20) {
        l.y = -20;
        l.x = Math.random() * w;
      }
      drawLeaf(l);
    }

    raf = requestAnimationFrame(frame);
  }

  resize();
  spawn();
  frame();

  window.addEventListener("resize", () => {
    resize();
    spawn();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(frame);
  });
}

/* ---- Hero cinematic FX overlay (dust / embers over video) ---- */
function initHeroFx() {
  const canvas = document.getElementById("heroFx");
  const frame = document.querySelector(".hero__frame");
  if (!canvas || !frame) return;

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let raf = 0;
  const motes = [];

  function resize() {
    const rect = frame.getBoundingClientRect();
    w = canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
    h = canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  function spawn() {
    motes.length = 0;
    const count = 42;
    for (let i = 0; i < count; i++) {
      motes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.6 + Math.random() * 1.8) * devicePixelRatio,
        a: 0.15 + Math.random() * 0.55,
        vx: (-0.15 + Math.random() * 0.35) * devicePixelRatio,
        vy: (-0.35 + Math.random() * 0.1) * devicePixelRatio,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function frameLoop() {
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      m.x += m.vx + Math.sin(m.pulse) * 0.15 * devicePixelRatio;
      m.y += m.vy;
      m.pulse += 0.02;
      if (m.y < -10) {
        m.y = h + 10;
        m.x = Math.random() * w;
      }
      if (m.x < -10) m.x = w + 10;
      if (m.x > w + 10) m.x = -10;

      const alpha = m.a * (0.55 + 0.45 * Math.sin(m.pulse));
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
      g.addColorStop(0, `rgba(255, 220, 140, ${alpha})`);
      g.addColorStop(0.4, `rgba(232, 168, 74, ${alpha * 0.35})`);
      g.addColorStop(1, "rgba(232, 168, 74, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frameLoop);
  }

  resize();
  spawn();
  frameLoop();
  window.addEventListener("resize", () => {
    resize();
    spawn();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(frameLoop);
  });
}

/* ---- Ensure hero video plays ---- */
function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  const tryPlay = () => {
    video.play().catch(() => {});
  };
  video.addEventListener("loadeddata", tryPlay);
  tryPlay();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryPlay();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initForestCanvas();
  initHeroFx();
  initHeroVideo();
  initParallax();
  initReveal();
  initNav();
  initCopy();
  applyConfig();
});

function initParallax() {
  const layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ---- Reveal on scroll ---- */
function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("reveal--visible");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  nodes.forEach((n) => io.observe(n));
}

/* ---- Navigation ---- */
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.querySelectorAll(".nav__link");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 30);
  }, { passive: true });

  toggle?.addEventListener("click", () => nav.classList.toggle("nav--open"));
  links.forEach((l) => l.addEventListener("click", () => nav.classList.remove("nav--open")));

  const sections = document.querySelectorAll("section[id]");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((l) => {
          l.classList.toggle("nav__link--active", l.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.28, rootMargin: "-70px 0px -45% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
}

/* ---- Copy contract ---- */
function initCopy() {
  const btn = document.getElementById("copyBtn");
  const addr = document.getElementById("contractAddr");
  if (!btn || !addr) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(addr.textContent.trim());
      btn.classList.add("ca__copy--ok");
      btn.querySelector("span").textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("ca__copy--ok");
        btn.querySelector("span").textContent = "Copy";
      }, 1800);
    } catch {
      const range = document.createRange();
      range.selectNode(addr);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });
}

/* ---- Config links ---- */
function applyConfig() {
  const addr = CONFIG.tokenAddress;
  const contractEl = document.getElementById("contractAddr");
  if (contractEl) contractEl.textContent = addr;

  const chartFrame = document.getElementById("chartFrame");
  if (chartFrame && addr !== "YOUR_TOKEN_ADDRESS_HERE") {
    chartFrame.src = `https://dexscreener.com/solana/${addr}?embed=1&theme=dark&trades=0&info=0`;
  }

  document.querySelectorAll("[data-link='x']").forEach((el) => {
    el.href = CONFIG.xUrl;
  });

  document.querySelectorAll("[data-link='pumpswap']").forEach((el) => {
    el.href = addr !== "YOUR_TOKEN_ADDRESS_HERE" ? `${CONFIG.pumpSwapUrl}${addr}` : CONFIG.pumpSwapUrl;
  });

  document.querySelectorAll("[data-link='dexscreener']").forEach((el) => {
    el.href = addr !== "YOUR_TOKEN_ADDRESS_HERE"
      ? `https://dexscreener.com/solana/${addr}`
      : CONFIG.dexScreenerUrl;
  });
}
