// ─────────────────────────────────────────────
//  Component Loader
// ─────────────────────────────────────────────

async function loadComponent(id, file) {
  const res  = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// Load hero first, then init its JS
loadComponent("hero", "components/hero.html").then(() => {
  initHeroGlitch();
  initStatusTicker();
});

loadComponent("navbar",   "components/navbar.html");
loadComponent("features", "components/features.html");
loadComponent("howtobuy", "components/howtobuy.html");
loadComponent("footer",   "components/footer.html");


// ─────────────────────────────────────────────
//  Hero Title — Per-character glitch
// ─────────────────────────────────────────────

function initHeroGlitch() {
  const titleEl   = document.getElementById("hero-title");
  if (!titleEl) return;

  const ORIGINAL  = "Anonymous9x VIP Script";
  const GLITCH_CH = "A#0N@X9!%$&*<>|1M?=+~";

  // Split into char spans
  titleEl.innerHTML = ORIGINAL.split("").map(ch =>
    ch === " "
      ? '<span class="char">&nbsp;</span>'
      : `<span class="char">${ch}</span>`
  ).join("");

  const spans    = Array.from(titleEl.querySelectorAll(".char"));
  const origArr  = ORIGINAL.split("");

  function randCh() {
    return GLITCH_CH[Math.floor(Math.random() * GLITCH_CH.length)];
  }

  function glitchOne() {
    // Only non-space chars
    const pool   = spans.filter((_, i) => origArr[i] !== " ");
    const target = pool[Math.floor(Math.random() * pool.length)];
    const idx    = spans.indexOf(target);

    target.classList.add("glitching");
    target.textContent = randCh();

    setTimeout(() => {
      target.textContent = origArr[idx] === " " ? "\u00A0" : origArr[idx];
      target.classList.remove("glitching");
    }, 60 + Math.random() * 90);
  }

  function loop() {
    glitchOne();
    setTimeout(loop, 120 + Math.random() * 220);
  }
  loop();
}


// ─────────────────────────────────────────────
//  Status Ticker — Scrolling loop
// ─────────────────────────────────────────────

function initStatusTicker() {
  const el = document.getElementById("statusTicker");
  if (!el) return;

  const items = [
    { label: "STATUS",    value: "READY",            hl: true  },
    { label: "EXECUTOR",  value: "DELTA SUPPORTED",  hl: false },
    { label: "USERS",   value: "6+ ACTIVE",        hl: false },
    { label: "VERSION",   value: "VIP 2.1",          hl: false },
    { label: "PLATFORM",  value: "MOBILE/IOS/PC",      hl: false },
    { label: "KEY STOCK",    value: "CHECK DISCORD",            hl: true  },
  ];

  function buildItems() {
    return items.map(item => `
      <span class="tick-item">
        <span class="tick-dot"></span>
        <span>${item.label} :</span>
        <span class="${item.hl ? "tick-hl" : ""}">${item.value}</span>
      </span>
    `).join("");
  }

  // Duplicate for seamless infinite scroll
  el.innerHTML = buildItems() + buildItems();
}


// ─────────────────────────────────────────────
//  Scanline Typewriter (for script card names)
// ─────────────────────────────────────────────

function scanlineType(el, text, opts = {}) {
  const {
    typeSpeed   = 55,
    deleteSpeed = 30,
    pauseAfter  = 1800,
    pauseBefore = 600,
  } = opts;

  let index    = 0;
  let deleting = false;

  el.innerHTML = `<span class="scanline-text"></span><span class="scanline-cursor">|</span>`;
  const textEl = el.querySelector(".scanline-text");

  if (!document.getElementById("scanline-style")) {
    const style = document.createElement("style");
    style.id = "scanline-style";
    style.textContent = `
      .scanline-cursor {
        display: inline-block;
        color: #fff;
        font-weight: 100;
        margin-left: 1px;
        animation: scanBlink 0.65s step-start infinite;
      }
      @keyframes scanBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
      .scanline-text { display: inline; color: inherit; }
    `;
    document.head.appendChild(style);
  }

  function tick() {
    if (!deleting) {
      textEl.textContent = text.slice(0, index + 1);
      index++;
      if (index === text.length) {
        setTimeout(() => { deleting = true; tick(); }, pauseAfter);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      textEl.textContent = text.slice(0, index - 1);
      index--;
      if (index === 0) {
        deleting = false;
        setTimeout(tick, pauseBefore);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }
  tick();
}


// ─────────────────────────────────────────────
//  Script Cards Loader
// ─────────────────────────────────────────────

fetch("data/scripts.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("script-container");

    if (!document.getElementById("card-style")) {
      const style = document.createElement("style");
      style.id = "card-style";
      style.textContent = `
        #script-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px;
        }
        .script-card {
          position: relative;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 22px 20px 18px;
          flex: 1 1 240px;
          max-width: 300px;
          color: #fff;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .script-card::before, .script-card::after {
          content: "";
          position: absolute;
          width: 10px; height: 10px;
          border-color: rgba(255,255,255,0.5);
          border-style: solid;
          transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        .script-card::before { top:-1px; left:-1px; border-width: 2px 0 0 2px; }
        .script-card::after  { bottom:-1px; right:-1px; border-width: 0 2px 2px 0; }
        .script-card:hover {
          border-color: rgba(255,255,255,0.55);
          box-shadow: 0 0 18px rgba(255,255,255,0.07);
        }
        .script-card:hover::before, .script-card:hover::after {
          width: 18px; height: 18px;
          border-color: #ffffff;
        }
        .script-card .card-icon {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0 0 10px;
        }
        .script-card .card-name {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
          min-height: 1.4em;
        }
        .script-card .card-desc {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.5;
          margin: 0;
        }
      `;
      document.head.appendChild(style);
    }

    data.forEach((script, i) => {
      const card = document.createElement("div");
      card.className = "script-card";
      card.innerHTML = `
        <p class="card-icon">${script.icon}</p>
        <div class="card-name"></div>
        <p class="card-desc">${script.desc}</p>
      `;
      container.appendChild(card);

      const nameEl = card.querySelector(".card-name");
      setTimeout(() => {
        scanlineType(nameEl, script.name, {
          typeSpeed:   60,
          deleteSpeed: 35,
          pauseAfter:  2000 + i * 80,
          pauseBefore: 500,
        });
      }, i * 250);
    });
  });


// ─────────────────────────────────────────────
//  Loader (Glitch text + boot messages + bar)
// ─────────────────────────────────────────────

const glitchText  = document.getElementById("glitchText");
const progressBar = document.getElementById("progressBar");
const bootText    = document.getElementById("bootText");

if (glitchText) {
  const text  = "Created by Anonymous9x";
  const chars = "!@#$%^&*()_+-={}[]<>?/|1234567890";

  function randomChar() { return chars[Math.floor(Math.random() * chars.length)]; }
  function glitchEffect() {
    let arr = text.split("");
    const n = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      if (arr[idx] !== " ") arr[idx] = randomChar();
    }
    glitchText.innerText = arr.join("");
  }
  setInterval(glitchEffect, 140);
}

if (bootText) {
  const bootMessages = [
    "Initializing system...",
    "Loading...",
    "Checking environment...",
    "Injecting Website...",
    "Connecting Website...",
    "Checking Connection...",
    "System ready..."
  ];
  let bootIndex = 0;
  function bootAnimation() {
    bootText.innerText = bootMessages[bootIndex];
    bootIndex = (bootIndex + 1) % bootMessages.length;
  }
  setInterval(bootAnimation, 900);
}

if (progressBar) {
  let progress = 0;
  const loading = setInterval(() => {
    progress += Math.random() * 2;
    progressBar.style.width = progress + "%";
    if (progress >= 100) {
      clearInterval(loading);
      setTimeout(() => {
        document.getElementById("loader").style.opacity = "0";
        setTimeout(() => {
          document.getElementById("loader").style.display = "none";
        }, 800);
      }, 600);
    }
  }, 60);
}


// ─────────────────────────────────────────────
//  Loader Matrix Rain (canvas#matrix)
// ─────────────────────────────────────────────

const matrixCanvas = document.getElementById("matrix");
if (matrixCanvas) {
  const mCtx     = matrixCanvas.getContext("2d");
  matrixCanvas.width  = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  const fontSize = 16;
  const cols     = matrixCanvas.width / fontSize;
  const mDrops   = Array.from({ length: cols }, () => 1);

  function drawLoaderMatrix() {
    mCtx.fillStyle = "rgba(0,0,0,0.05)";
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mCtx.fillStyle = "rgba(255,255,255,0.15)";
    mCtx.font = fontSize + "px monospace";
    for (let i = 0; i < mDrops.length; i++) {
      const ch = Math.random() > 0.5 ? "1" : "0";
      mCtx.fillText(ch, i * fontSize, mDrops[i] * fontSize);
      if (mDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975)
        mDrops[i] = 0;
      mDrops[i]++;
    }
  }
  setInterval(drawLoaderMatrix, 33);
}