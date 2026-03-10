// ═══════════════════════════════════════════════
//  Anonymous9x — Background Engine
//  Number Matrix + Center Glitch Text (random)
// ═══════════════════════════════════════════════

(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initMatrix();
  }
  window.addEventListener("resize", resize);


  // ══════════════════════════════════════════════
  //  NUMBER MATRIX
  // ══════════════════════════════════════════════
  const DIGITS    = "0123456789";
  const FONT_SIZE = 14;
  let columns = 0, drops = [];

  function initMatrix() {
    columns = Math.ceil(canvas.width / FONT_SIZE);
    drops   = Array.from({ length: columns }, () => Math.random() * -80);
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const ch  = DIGITS[Math.floor(Math.random() * DIGITS.length)];
      const yPx = drops[i] * FONT_SIZE;
      const r   = Math.random();

      if (r > 0.97) {
        ctx.fillStyle   = "#ffffff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur  = 5;
      } else if (r > 0.87) {
        ctx.fillStyle  = "rgba(200,200,200,0.5)";
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle  = "rgba(255,255,255,0.09)";
        ctx.shadowBlur = 0;
      }

      ctx.fillText(ch, i * FONT_SIZE, yPx);
      if (yPx > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.45 + Math.random() * 0.4;
    }
    ctx.shadowBlur = 0;
  }


  // ══════════════════════════════════════════════
  //  CENTER GLITCH TEXT
  // ══════════════════════════════════════════════
  const TEXT       = "ANONYMOUS9X";
  const GLITCH_CHR = "A#0N@X9!%$&*<>|M";

  let state    = "idle";
  let timer    = 0;
  let nextShow = Date.now() + 2000;

  const APPEAR_MS   = 100;
  const GLITCH_MS   = 600;
  const FADE_MS     = 200;
  const IDLE_MIN_MS = 2500;
  const IDLE_MAX_MS = 5000;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function glitchChar(ch) {
    return Math.random() > 0.45
      ? GLITCH_CHR[Math.floor(Math.random() * GLITCH_CHR.length)]
      : ch;
  }

  function drawGlitchText(alpha, intensity) {
    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;
    const sz = Math.min(canvas.width * 0.07, 64); // responsive font size

    ctx.save();
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    // ── Outer glow pass ──
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle   = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur  = 40;
    ctx.font        = `900 ${sz}px 'Rajdhani', 'Courier New', monospace`;
    ctx.fillText(TEXT, cx, cy);

    // ── Chromatic aberration fringes ──
    if (intensity > 0) {
      const shift = intensity * 7;
      ctx.shadowBlur  = 0;

      ctx.globalAlpha = alpha * 0.3;
      ctx.fillStyle   = "#ff0040";
      ctx.fillText(TEXT, cx - shift, cy + 1);

      ctx.fillStyle   = "#00ffff";
      ctx.fillText(TEXT, cx + shift, cy - 1);
    }

    // ── Build glitched display string ──
    let display = "";
    for (let i = 0; i < TEXT.length; i++) {
      display += (intensity > 0 && Math.random() < intensity * 0.75)
        ? glitchChar(TEXT[i])
        : TEXT[i];
    }

    // ── Main text ──
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur  = 14;
    ctx.font        = `900 ${sz}px 'Rajdhani', 'Courier New', monospace`;
    ctx.fillText(display, cx, cy);

    // ── Scanline slice ──
    if (intensity > 0.25 && Math.random() > 0.45) {
      const sliceY = cy - sz * 0.5 + Math.random() * sz;
      const sliceH = 3 + Math.random() * 10;
      const sliceX = (Math.random() - 0.5) * intensity * 28;

      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle   = "#ffffff";
      ctx.shadowBlur  = 0;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sliceY, canvas.width, sliceH);
      ctx.clip();
      ctx.fillText(display, cx + sliceX, cy);
      ctx.restore();
    }

    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function updateGlitchText(now) {
    switch (state) {
      case "idle":
        if (now >= nextShow) { state = "appearing"; timer = now; }
        break;

      case "appearing": {
        const p = Math.min(1, (now - timer) / APPEAR_MS);
        drawGlitchText(p, p * 0.9);
        if (p >= 1) { state = "glitching"; timer = now; }
        break;
      }

      case "glitching": {
        const p = (now - timer) / GLITCH_MS;
        const intensity = 0.45 + Math.sin(p * Math.PI * 7) * 0.35 + p * 0.2;
        drawGlitchText(1, Math.min(1, intensity));
        if (p >= 1) { state = "fading"; timer = now; }
        break;
      }

      case "fading": {
        const p     = (now - timer) / FADE_MS;
        const alpha = Math.max(0, 1 - p);
        drawGlitchText(alpha, (1 - alpha) * 0.5);
        if (alpha <= 0) {
          state    = "idle";
          nextShow = now + rand(IDLE_MIN_MS, IDLE_MAX_MS);
        }
        break;
      }
    }
  }


  // ══════════════════════════════════════════════
  //  MAIN LOOP
  // ══════════════════════════════════════════════
  function animate(now) {
    requestAnimationFrame(animate);
    drawMatrix();
    updateGlitchText(now);
  }

  resize();
  requestAnimationFrame(animate);

})();