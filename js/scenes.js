/* =========================================================
   DEVCLUB — Cinematic procedural scenes (Canvas 2D)
   Scenes 2–8 are fully procedural (particles/nodes/grids) — see
   CONTEUDO-FONTE.md for why no AI video was generated for these.
   Scene 1 sits on top of a real AI-generated video (<video
   id="scene1Video"> in index.html); the canvas only draws a
   transparent particle/light overlay so the footage shows through.
   Scene 9 sits on top of an AI-generated still (<img
   id="scene9Image">), animated in CSS (Ken Burns + glow pulse, see
   styles.css) instead of video — see README.md for why (Higgsfield
   credit budget). Its canvas overlay works the same way: transparent,
   just adds the particle/light layer on top.
   ========================================================= */
(function (global) {
  "use strict";

  const isLowPower = () =>
    window.matchMedia("(max-width: 768px)").matches ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  function setupCanvas(canvas, transparent) {
    const ctx = canvas.getContext("2d", { alpha: !!transparent });
    let dpr = Math.min(window.devicePixelRatio || 1, isLowPower() ? 1.5 : 2);
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, isLowPower() ? 1.5 : 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    }
    resize();
    window.addEventListener("resize", resize);
    return { ctx, resize, get dpr() { return dpr; } };
  }

  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  const ACCENT = "41,255,160";
  const INK = "244,242,236";

  /* ---------- Generic particle/node field used by several scenes ---------- */
  function makeNodes(count, seed, w, h) {
    const rnd = seededRandom(seed);
    const nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: rnd() * w,
        y: rnd() * h,
        vx: (rnd() - 0.5) * 0.15,
        vy: (rnd() - 0.5) * 0.15,
        r: 1.2 + rnd() * 2.2,
        phase: rnd() * Math.PI * 2,
      });
    }
    return nodes;
  }

  function drawBackdrop(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0b0d10");
    g.addColorStop(1, "#07080a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function connectNodes(ctx, nodes, maxDist, alphaScale) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.5 * alphaScale;
          ctx.strokeStyle = `rgba(${ACCENT},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function stepNodes(nodes, w, h) {
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
  }

  /* ---------- Scene factory ----------
     transparent:true is used for scenes that sit on top of a real
     <video> background (1, 8, 9) so the canvas doesn't paint over it. */
  function baseScene(canvas, seed, transparent) {
    const { ctx, resize } = setupCanvas(canvas, transparent);
    const count = isLowPower() ? 26 : 60;
    let w = canvas.width, h = canvas.height;
    let nodes = makeNodes(count, seed, w, h);
    const ro = new ResizeObserver(() => {
      w = canvas.width; h = canvas.height;
      nodes = makeNodes(count, seed, w, h);
    });
    ro.observe(canvas);
    return { ctx, get w() { return canvas.width; }, get h() { return canvas.height; }, nodes, resize };
  }

  /* SCENE 1 — Hero: real AI-generated video sits behind this canvas
     (see <video id="scene1Video">); the canvas only draws a
     transparent particle/data overlay so the footage shows through.
     If the video fails to load (e.g. offline), the poster frame
     (the same AI still) is shown by the <video> element itself. */
  function scene1(canvas) {
    const s = baseScene(canvas, 1, true);
    function render(progress) {
      const w = s.w, h = s.h;
      s.ctx.clearRect(0, 0, w, h);
      stepNodes(s.nodes, w, h);
      connectNodes(s.ctx, s.nodes, w * 0.06, 0.5 + progress * 0.5);
      s.nodes.forEach((n) => {
        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${ACCENT},.55)`;
        s.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        s.ctx.fill();
      });
    }
    return { render, resize: s.resize };
  }

  /* SCENE 2 — Progressão do zero ao avançado: grade que cresce em complexidade */
  function scene2(canvas) {
    const s = baseScene(canvas, 2);
    function render(progress) {
      const w = s.w, h = s.h;
      drawBackdrop(s.ctx, w, h);
      const cols = Math.round(4 + progress * 18);
      const rows = Math.round(3 + progress * 10);
      const gx = w / cols, gy = h / rows;
      s.ctx.lineWidth = 1;
      for (let i = 0; i <= cols; i++) {
        const alpha = 0.05 + 0.12 * progress;
        s.ctx.strokeStyle = `rgba(${INK},${alpha})`;
        s.ctx.beginPath();
        s.ctx.moveTo(i * gx, h * 0.15);
        s.ctx.lineTo(i * gx, h * 0.85);
        s.ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        s.ctx.strokeStyle = `rgba(${INK},${0.04 + 0.08 * progress})`;
        s.ctx.beginPath();
        s.ctx.moveTo(w * 0.1, j * gy);
        s.ctx.lineTo(w * 0.9, j * gy);
        s.ctx.stroke();
      }
      // glowing nodes climbing diagonally = "evolution path"
      const rnd = seededRandom(42);
      const steps = Math.round(6 + progress * 30);
      for (let k = 0; k < steps; k++) {
        const t = k / steps;
        const x = w * 0.12 + t * w * 0.76 + Math.sin(t * 20 + progress * 6) * 6;
        const y = h * 0.82 - t * h * 0.62 * progress + Math.cos(t * 12) * 8;
        const r = 2 + rnd() * 3;
        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${ACCENT},${0.25 + t * 0.6})`;
        s.ctx.arc(x, y, r, 0, Math.PI * 2);
        s.ctx.fill();
        if (k > 0) {
          s.ctx.strokeStyle = `rgba(${ACCENT},${0.15 + t * 0.3})`;
          s.ctx.beginPath();
          s.ctx.moveTo(x, y);
          const pt = t - 1 / steps;
          s.ctx.lineTo(
            w * 0.12 + pt * w * 0.76,
            h * 0.82 - pt * h * 0.62 * progress
          );
          s.ctx.stroke();
        }
      }
    }
    return { render, resize: s.resize };
  }

  /* SCENE 3 — Universo de tecnologias conectadas (radial) */
  function scene3(canvas) {
    const s = baseScene(canvas, 3);
    const clusters = 6;
    function render(progress) {
      const w = s.w, h = s.h;
      drawBackdrop(s.ctx, w, h);
      const cx = w / 2, cy = h / 2;
      const radius = Math.min(w, h) * (0.18 + progress * 0.16);
      for (let c = 0; c < clusters; c++) {
        const angle = (c / clusters) * Math.PI * 2 + progress * 0.6;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.7;
        const grad = s.ctx.createRadialGradient(x, y, 0, x, y, 70);
        grad.addColorStop(0, `rgba(${ACCENT},${0.35 * progress + 0.1})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        s.ctx.fillStyle = grad;
        s.ctx.beginPath();
        s.ctx.arc(x, y, 70, 0, Math.PI * 2);
        s.ctx.fill();

        s.ctx.strokeStyle = `rgba(${ACCENT},${0.2 + progress * 0.3})`;
        s.ctx.beginPath();
        s.ctx.moveTo(cx, cy);
        s.ctx.lineTo(x, y);
        s.ctx.stroke();

        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${INK},.9)`;
        s.ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        s.ctx.fill();
      }
      s.ctx.beginPath();
      s.ctx.fillStyle = `rgba(${ACCENT},.9)`;
      s.ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      s.ctx.fill();
      stepNodes(s.nodes, w, h);
      s.nodes.forEach((n) => {
        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${INK},.15)`;
        s.ctx.arc(n.x, n.y, n.r * 0.6, 0, Math.PI * 2);
        s.ctx.fill();
      });
    }
    return { render, resize: s.resize };
  }

  /* SCENE 4 — Inteligência Artificial: rede neural com pulsos de dados */
  function scene4(canvas) {
    const s = baseScene(canvas, 4);
    const layers = 4;
    const perLayer = isLowPower() ? 5 : 8;
    function layerNodes(w, h) {
      const out = [];
      for (let l = 0; l < layers; l++) {
        const col = [];
        for (let n = 0; n < perLayer; n++) {
          col.push({
            x: w * (0.18 + (l / (layers - 1)) * 0.64),
            y: h * ((n + 1) / (perLayer + 1)),
          });
        }
        out.push(col);
      }
      return out;
    }
    let cached = null, cw = 0, ch = 0;
    function render(progress) {
      const w = s.w, h = s.h;
      if (w !== cw || h !== ch) { cached = layerNodes(w, h); cw = w; ch = h; }
      drawBackdrop(s.ctx, w, h);
      const t = performance.now() / 1000;
      for (let l = 0; l < layers - 1; l++) {
        cached[l].forEach((a, ai) => {
          cached[l + 1].forEach((b, bi) => {
            const pulse = (Math.sin(t * 1.4 + ai + bi + l) + 1) / 2;
            const alpha = 0.05 + pulse * 0.18 * (0.4 + progress * 0.8);
            s.ctx.strokeStyle = `rgba(${ACCENT},${alpha})`;
            s.ctx.beginPath();
            s.ctx.moveTo(a.x, a.y);
            s.ctx.lineTo(b.x, b.y);
            s.ctx.stroke();
          });
        });
      }
      cached.forEach((col, l) => {
        col.forEach((n, i) => {
          const pulse = (Math.sin(t * 2 + i * 0.7 + l) + 1) / 2;
          const r = 3 + pulse * 2.4 * progress;
          s.ctx.beginPath();
          const grad = s.ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
          grad.addColorStop(0, `rgba(${ACCENT},${0.5 + pulse * 0.3})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          s.ctx.fillStyle = grad;
          s.ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
          s.ctx.fill();
          s.ctx.beginPath();
          s.ctx.fillStyle = `rgba(${INK},.9)`;
          s.ctx.arc(n.x, n.y, r * 0.5, 0, Math.PI * 2);
          s.ctx.fill();
        });
      });
    }
    return { render, resize: s.resize };
  }

  /* SCENE 5 — Aprender na prática: agora um still gerado via Higgsfield
     (mesa/estação de trabalho, telas com código e app abstratos — ver
     README.md/CONTEUDO-FONTE.md) sob um overlay transparente, no mesmo
     padrão das Cenas 1 e 9 (<img id="scene5Image"> + <div id="scene5Pulse">,
     CSS Ken Burns em .cinema__image). O canvas só desenha "faíscas de
     código" — partículas que nascem perto do centro (onde ficaria a tela)
     e sobem se dispersando, ganhando trilha/conexões conforme o progresso,
     como se linhas de código estivessem virando resultado em tempo real. */
  function scene5(canvas) {
    const s = baseScene(canvas, 5, true);
    const rnd = seededRandom(55);
    const sparks = s.nodes.map((n, i) => ({
      baseX: 0.35 + rnd() * 0.3,
      baseY: 0.85 - rnd() * 0.1,
      driftX: (rnd() - 0.5) * 0.5,
      speed: 0.15 + rnd() * 0.35,
      phase: rnd() * Math.PI * 2,
      r: n.r,
    }));
    function render(progress) {
      const w = s.w, h = s.h;
      s.ctx.clearRect(0, 0, w, h);
      const t = performance.now() / 1000;
      const rise = 0.12 + progress * 0.78;
      const pts = sparks.map((sp) => {
        const life = ((t * sp.speed + sp.phase) % 1);
        const x = w * (sp.baseX + sp.driftX * life);
        const y = h * sp.baseY - life * h * rise;
        const alpha = Math.sin(life * Math.PI) * (0.25 + progress * 0.55);
        return { x, y, alpha, r: sp.r };
      });
      pts.forEach((p) => {
        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${ACCENT},${p.alpha})`;
        s.ctx.arc(p.x, p.y, p.r * 1.4, 0, Math.PI * 2);
        s.ctx.fill();
      });
      if (progress > 0.3) {
        const linkAlpha = (progress - 0.3) / 0.7;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i], b = pts[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < w * 0.14) {
              s.ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / (w * 0.14)) * 0.3 * linkAlpha})`;
              s.ctx.lineWidth = 1;
              s.ctx.beginPath();
              s.ctx.moveTo(a.x, a.y);
              s.ctx.lineTo(b.x, b.y);
              s.ctx.stroke();
            }
          }
        }
      }
    }
    return { render, resize: s.resize };
  }

  /* SCENE 6 — Comunidade: constelação que se expande e afasta a câmera */
  function scene6(canvas) {
    const s = baseScene(canvas, 6);
    const rnd = seededRandom(6);
    const total = isLowPower() ? 40 : 90;
    const pts = Array.from({ length: total }, () => ({
      a: rnd() * Math.PI * 2,
      d: 0.05 + rnd() * 0.95,
      r: 1.5 + rnd() * 2,
    }));
    function render(progress) {
      const w = s.w, h = s.h;
      drawBackdrop(s.ctx, w, h);
      const cx = w / 2, cy = h / 2;
      const spread = Math.min(w, h) * (0.15 + progress * 0.65);
      const shown = Math.round(pts.length * (0.25 + progress * 0.75));
      const active = pts.slice(0, shown);
      active.forEach((p, i) => {
        const x = cx + Math.cos(p.a) * spread * p.d;
        const y = cy + Math.sin(p.a) * spread * p.d * 0.72;
        p._x = x; p._y = y;
        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${ACCENT},.6)`;
        s.ctx.arc(x, y, p.r, 0, Math.PI * 2);
        s.ctx.fill();
      });
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const a = active[i], b = active[j];
          const dx = a._x - b._x, dy = a._y - b._y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < spread * 0.28) {
            s.ctx.strokeStyle = `rgba(${INK},${0.08 * (1 - d / (spread * 0.28))})`;
            s.ctx.beginPath();
            s.ctx.moveTo(a._x, a._y);
            s.ctx.lineTo(b._x, b._y);
            s.ctx.stroke();
          }
        }
      }
    }
    return { render, resize: s.resize };
  }

  /* SCENE 7 — Carreira: janelas de um escritório abstrato, pan lento */
  function scene7(canvas) {
    const s = baseScene(canvas, 7);
    const rnd = seededRandom(7);
    function render(progress) {
      const w = s.w, h = s.h;
      drawBackdrop(s.ctx, w, h);
      const cols = 12, rows = 8;
      const cw = w / cols, ch = h / rows;
      const pan = progress * w * 0.08;
      const t = performance.now() / 4000;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const seed = r * cols + c;
          const flicker = (Math.sin(t * 1.5 + seed) + 1) / 2;
          const lit = flicker > 0.55 - progress * 0.3;
          const x = c * cw - pan + cw * 0.15;
          const y = r * ch + ch * 0.15;
          s.ctx.fillStyle = lit
            ? `rgba(${ACCENT},${0.12 + flicker * 0.28})`
            : "rgba(244,242,236,.02)";
          roundRect(s.ctx, x, y, cw * 0.7, ch * 0.7, 4);
          s.ctx.fill();
        }
      }
    }
    return { render, resize: s.resize };
  }

  /* SCENE 8 — Transformação: a pedido do usuário (04/08/2026), passou a
     usar um vídeo real enviado por ele (assets/video/transformacao-scroll.mp4),
     scroll-scrubbed do mesmo jeito que o vídeo da Cena 1 (ver
     scrubVideo() em js/main.js — <video data-scrub="true"> em
     index.html). Esse canvas só desenha o overlay transparente de
     partículas (mesma função usada na Cena 9), pra não pintar por cima
     da imagem real. Substituiu duas tentativas anteriores — um mural de
     cards e depois uma trilha ascendente 100% proceduais — que o usuário
     não curtiu; ver README.md para o histórico. */

  /* SCENE 9 — Retorno à estação inicial, agora iluminada.
     The brightening itself is done on the real <video> element via
     CSS filter (driven by scroll progress in main.js) — this canvas
     only adds a transparent drifting light-particle overlay on top,
     reinforcing the "coming into focus" feeling. Also reused by Scene 8
     (see comment above). */
  function litHeroScene(canvas, seedVal) {
    const s = baseScene(canvas, seedVal, true);
    function render(progress) {
      const w = s.w, h = s.h;
      s.ctx.clearRect(0, 0, w, h);
      stepNodes(s.nodes, w, h);
      s.nodes.forEach((n) => {
        s.ctx.beginPath();
        s.ctx.fillStyle = `rgba(${ACCENT},${0.15 + progress * 0.45})`;
        s.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        s.ctx.fill();
      });
    }
    return { render, resize: s.resize };
  }

  global.DevClubScenes = {
    scene1, scene2, scene3, scene4, scene5, scene6, scene7,
    scene8: (c) => litHeroScene(c, 8),
    scene9: (c) => litHeroScene(c, 9),
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
})(window);
