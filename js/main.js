/* =========================================================
   DEVCLUB — Scroll storytelling controller
   Primary engine: Lenis + GSAP + ScrollTrigger (loaded via CDN).
   Fallback engine: vanilla JS (native smooth scroll + rAF + IO),
   used automatically if the CDN libraries fail to load (offline,
   blocked network, ad-blocker, etc.) so the page never breaks.
   ========================================================= */
(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  const sceneDefs = [
    { canvas: "scene1Canvas", factory: "scene1" },
    { canvas: "scene2Canvas", factory: "scene2" },
    { canvas: "scene3Canvas", factory: "scene3" },
    { canvas: "scene4Canvas", factory: "scene4" },
    { canvas: "scene5Canvas", factory: "scene5" },
    { canvas: "scene6Canvas", factory: "scene6" },
    { canvas: "scene7Canvas", factory: "scene7" },
    { canvas: "scene8Canvas", factory: "scene8" },
    { canvas: "scene9Canvas", factory: "scene9" },
  ];

  function buildSceneInstances() {
    return sceneDefs
      .map((def) => {
        const canvasEl = document.getElementById(def.canvas);
        if (!canvasEl || !window.DevClubScenes || !window.DevClubScenes[def.factory]) return null;
        const videoEl = document.getElementById(def.canvas.replace("Canvas", "Video"));
        const imageEl = document.getElementById(def.canvas.replace("Canvas", "Image"));
        const pulseEl = document.getElementById(def.canvas.replace("Canvas", "Pulse"));
        return { canvasEl, videoEl, imageEl, pulseEl, instance: window.DevClubScenes[def.factory](canvasEl), progress: 0 };
      })
      .filter(Boolean);
  }

  /* Scroll-scrubbed videos: currentTime follows scroll progress — down
     plays forward, up plays backward, stop scrolling and it settles on
     that frame. Used by Scene 1 (hero) and Scene 8 (transformação) —
     any <video data-scrub="true">. Those files are encoded with every
     frame as a keyframe (GOP=1 — a normal export's sparse keyframes make
     every seek decode the whole clip from zero and stutter badly), so
     seeking is cheap and safe to do every animation frame. The only
     smoothing left is easing the tracked position toward the raw scroll
     progress (same idea as the Lenis smoothing already used for the
     page scroll itself), so sudden scroll jumps read as a glide instead
     of a snap. */
  const scrubState = new WeakMap();
  function scrubVideo(videoEl, progress) {
    videoEl.style.filter = `brightness(${0.78 + progress * 0.45}) saturate(${1 + progress * 0.2})`;
    if (!videoEl.duration || Number.isNaN(videoEl.duration)) return;

    let eased = scrubState.get(videoEl);
    if (eased === undefined) eased = progress;
    eased += (progress - eased) * 0.18;
    if (Math.abs(progress - eased) < 0.001) eased = progress;
    scrubState.set(videoEl, eased);

    const target = eased * videoEl.duration;
    if (Math.abs(videoEl.currentTime - target) > 0.02) {
      videoEl.currentTime = target;
    }
  }

  function updateVideo(videoEl, progress, scrub) {
    if (!videoEl) return;
    if (scrub) {
      scrubVideo(videoEl, progress);
      return;
    }
    videoEl.style.filter = `brightness(${1 + progress * 0.6}) saturate(${1 + progress * 0.25})`;
    const shouldPlay = progress > 0.02 && progress < 0.98;
    if (shouldPlay && videoEl.paused) videoEl.play().catch(() => {});
    if (!shouldPlay && !videoEl.paused) videoEl.pause();
  }

  /* Scene 9 lays an AI-generated still behind the canvas (CSS Ken Burns +
     glow pulse handle the motion — see styles.css). It brightens and the
     glow intensifies as the visitor scrolls through, mirroring the
     "lights up" narrative beat the old shared hero footage had. */
  function updateImage(imageEl, pulseEl, progress) {
    if (!imageEl) return;
    imageEl.style.filter = `brightness(${0.85 + progress * 0.55}) saturate(${1 + progress * 0.25})`;
    if (pulseEl) pulseEl.style.opacity = progress > 0.02 && progress < 0.98 ? "1" : "0";
  }

  const nav = document.getElementById("siteNav");
  const progressBar = document.getElementById("scrollProgress");
  initMobileMenu();
  initTeachersCarousel();
  initProjectsSpiral();
  initSignatureHero();
  initMagneticButtons();
  initTiltCards();
  initCounters();

  /* No poster image anymore (hero is the video, full stop) — force the
     first frame to paint as soon as there's enough data, so the hero
     never sits on a black rectangle before the visitor scrolls. */
  (function primeHeroFirstFrame() {
    const heroVideo = document.getElementById("scene1Video");
    if (!heroVideo) return;
    const paint = () => { if (heroVideo.currentTime === 0) heroVideo.currentTime = 0.01; };
    if (heroVideo.readyState >= 1) paint();
    else heroVideo.addEventListener("loadedmetadata", paint, { once: true });
  })();

  /* Professores — anel 3D giratório (coverflow). Cada card fica centrado
     na .teachers-stage (CSS: top/left 50% + translate(-50%,-50%) como
     base) e aqui a gente escreve o resto do transform por card conforme
     o deslocamento em relação ao card "da frente" (centro do anel):
     translateX/translateZ (posição no anel), rotateY (giro) e scale
     (profundidade). O card da frente também ganha tilt 3D + spotlight
     ao passar o mouse (mesma ideia do brilho que já existia, só que
     agora só faz sentido no card em destaque). */
  function initTeachersCarousel() {
    const track = document.getElementById("teachersTrack");
    const stage = track ? track.closest(".teachers-stage") : null;
    const prevBtn = document.getElementById("teachersPrev");
    const nextBtn = document.getElementById("teachersNext");
    const wrap = document.getElementById("teachersWrap");
    if (!track || !stage || !prevBtn || !nextBtn || !wrap) return;
    const cards = [...track.querySelectorAll("[data-teacher-reveal]")];
    const n = cards.length;
    if (!n) return;

    const pointerFine = !prefersReduced && window.matchMedia("(pointer: fine)").matches;
    const tilt = cards.map(() => ({ x: 0, y: 0 }));
    let center = 0;

    function spacing() {
      // Scale the ring's spread to the stage's actual width so it holds up
      // from small phones to wide desktops instead of using fixed px.
      const w = stage.clientWidth || 320;
      return { x: Math.min(150, w * 0.19), z: Math.min(190, w * 0.24) };
    }

    function applyCard(i, entering) {
      const card = cards[i];
      let offset = i - center;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;
      const abs = Math.abs(offset);
      const { x: unitX, z: unitZ } = spacing();
      const x = offset * unitX;
      const z = -abs * unitZ;
      const rot = offset * -34;
      const scale = offset === 0 ? 1.1 : Math.max(0.58, 1 - abs * 0.16);
      const opacity = abs > 3 ? 0 : Math.max(0.16, 1 - abs * 0.3);
      const isFront = offset === 0;
      const t = isFront ? tilt[i] : { x: 0, y: 0 };

      if (entering) {
        // "Converging into formation": before the section is ever seen,
        // paint every card flung further out, spun harder and shrunk —
        // scattered around where the ring will eventually sit. The very
        // next renderAll() (triggered once the section scrolls into
        // view) writes the real ring transform on top of this, and the
        // existing transform transition on .teacher animates the jump
        // from scattered -> formation. Purely a starting paint, so no
        // opacity/z-index/aria bookkeeping needed here.
        card.style.transform =
          `translate(-50%,-50%) translate3d(${x * 2.6}px,0,${z - 260}px) rotateY(${rot + offset * 30}deg) scale(${Math.max(0.28, scale * 0.45)})`;
        card.style.opacity = 0;
        return;
      }

      card.style.transform =
        `translate(-50%,-50%) translate3d(${x}px,0,${z}px) rotateY(${rot}deg) scale(${scale}) rotateX(${t.x}deg) rotateY(${t.y}deg)`;
      card.style.opacity = opacity;
      card.style.zIndex = String(100 - Math.round(abs * 10));
      card.style.pointerEvents = abs > 3 ? "none" : "auto";
      card.classList.toggle("is-front", isFront);
      card.setAttribute("aria-hidden", isFront ? "false" : "true");
    }
    function renderAll(entering) { for (let i = 0; i < n; i++) applyCard(i, entering); }

    function goTo(index) {
      center = ((index % n) + n) % n;
      renderAll();
    }

    // Troca automática — a pedido do usuário (04/08/2026): o anel gira
    // sozinho a cada 3s, mas as setas/clique num card continuam funcionando
    // a qualquer momento (mesmo padrão de autoplay+pausa do carrossel
    // espiral de projetos, só que com intervalo mais curto). Pausa ao
    // passar o mouse por cima e quando a seção sai da tela; qualquer
    // interação manual reinicia a contagem em vez de brigar com o autoplay.
    let autoplayTimer = null;
    let hovering = false;
    function stopAutoplay() {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    function startAutoplay() {
      if (autoplayTimer || hovering || prefersReduced) return;
      autoplayTimer = window.setInterval(() => goTo(center + 1), 3000);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    cards.forEach((card, index) => {
      card.style.setProperty("--teacher-index", index);
      card.addEventListener("click", () => { if (index !== center) { goTo(index); restartAutoplay(); } });
      if (!pointerFine) return;
      card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
      card.addEventListener("pointermove", (event) => {
        if (!card.classList.contains("is-front")) return;
        const bounds = card.getBoundingClientRect();
        const px = (event.clientX - bounds.left) / bounds.width;
        const py = (event.clientY - bounds.top) / bounds.height;
        tilt[index].x = (0.5 - py) * 12;
        tilt[index].y = (px - 0.5) * 12;
        card.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
        applyCard(index);
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        tilt[index].x = 0;
        tilt[index].y = 0;
        applyCard(index);
      });
    });

    prevBtn.addEventListener("click", () => { goTo(center - 1); restartAutoplay(); });
    nextBtn.addEventListener("click", () => { goTo(center + 1); restartAutoplay(); });
    window.addEventListener("resize", () => renderAll());
    wrap.addEventListener("pointerenter", () => { hovering = true; stopAutoplay(); });
    wrap.addEventListener("pointerleave", () => { hovering = false; startAutoplay(); });

    function settleIntoRing() {
      // Two nested rAFs so the browser actually paints the scattered
      // "entering" state (set below) on its own frame first — collapsing
      // straight to renderAll() in the same tick would skip the CSS
      // transition and just snap into place.
      requestAnimationFrame(() => requestAnimationFrame(() => renderAll()));
    }

    if (prefersReduced) {
      wrap.classList.add("is-visible");
      renderAll();
    } else {
      renderAll(true); // paint the scattered pre-entrance state first
      if ("IntersectionObserver" in window) {
        const entranceObserver = new IntersectionObserver((entries) => {
          if (!entries[0].isIntersecting) return;
          wrap.classList.add("is-visible");
          settleIntoRing();
          entranceObserver.disconnect();
        }, { threshold: 0.2 });
        entranceObserver.observe(wrap);

        // Observador à parte (não se desconecta) só pro autoplay: liga
        // quando a seção está visível, desliga quando sai da tela — o de
        // cima é "uma vez só" (entrada), esse aqui acompanha o scroll
        // pra sempre.
        const autoplayObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) startAutoplay();
          else stopAutoplay();
        }, { threshold: 0.2 });
        autoplayObserver.observe(wrap);
      } else {
        wrap.classList.add("is-visible");
        settleIntoRing();
        startAutoplay();
      }
    }
  }

  /* Projetos — carrossel espiral ("caracol"), trocando o card único antigo
     (assets/img/projetos-reais.png) a pedido do usuário (04/08/2026). Os 9
     cards (.project-card) ficam sobre pontos FIXOS de uma espiral — o ponto
     0 é o maior/em destaque, por fora; o ponto n-1 é minúsculo/quase
     invisível, perto do centro — como o enrolar da concha de um caracol.
     A cada "passo" (autoplay lento ou seta), a gente não recalcula a
     espiral: a gente troca qual CARD ocupa qual PONTO (deslocando `shift`),
     então cada card anima (via a transition CSS de .project-card) do seu
     ponto atual pro próximo — o card em destaque encolhe rumo ao centro
     enquanto o card seguinte cresce vindo de dentro, dando a sensação de um
     caracol avançando pela própria concha em vez de cards só trocando de
     lugar. */
  function initProjectsSpiral() {
    const stage = document.querySelector(".projects-spiral-stage");
    const track = document.getElementById("projectsSpiralTrack");
    const prevBtn = document.getElementById("projectsSpiralPrev");
    const nextBtn = document.getElementById("projectsSpiralNext");
    const wrap = document.getElementById("projectsSpiralWrap");
    if (!stage || !track || !wrap || !prevBtn || !nextBtn) return;
    // prefers-reduced-motion: a media query em styles.css já troca o layout
    // pra uma grade estática simples — nada aqui precisa (nem deve) rodar.
    if (prefersReduced) return;

    const cards = [...track.querySelectorAll("[data-project-card]")];
    const n = cards.length;
    if (!n) return;

    let shift = 0;
    let autoplayTimer = null;
    let hovering = false;

    function points() {
      const w = stage.clientWidth || 320;
      const h = stage.clientHeight || 320;
      const cardW = cards[0].offsetWidth || 200;
      const cardH = cards[0].offsetHeight || 124;
      // Leque pra esquerda (a pedido do usuário, 04/08/2026) em vez da espiral
      // 360° original: o card da frente ficou grande demais pra caber uma
      // espiral inteira sem estourar a altura do stage (o raio acabava
      // travado pertinho de zero, escondendo as fotos de trás). Em vez de um
      // raio único cos/sin, X e Y usam orçamentos independentes — X vem da
      // largura do stage (sobra bastante, então as fotos de trás aparecem
      // bem à esquerda), Y fica bem contido pra nunca depender do tamanho do
      // card da frente. Escala/opacidade têm piso alto pra que as fotos de
      // trás continuem reconhecíveis, não quase somem como antes.
      const maxX = Math.max(50, w / 2 - cardW * 0.32 - 8);
      const maxY = Math.min(34, Math.max(12, h / 2 - cardH * 0.5 - 8));
      const bias = maxX * 0.16; // frente puxada um pouco pra direita, sobra espaço pro leque à esquerda
      const pts = [];
      for (let k = 0; k < n; k++) {
        const f = n === 1 ? 0 : k / (n - 1); // 0 na frente → 1 no fim do leque (esquerda)
        pts.push({
          x: bias - maxX * f,
          y: maxY * f,
          scale: 1 - 0.4 * f,
          opacity: 1 - 0.48 * f,
          z: 100 - k * 8,
        });
      }
      return pts;
    }

    function render() {
      const pts = points();
      cards.forEach((card, i) => {
        const k = (((i - shift) % n) + n) % n;
        const p = pts[k];
        card.style.transform = `translate(-50%,-50%) translate(${p.x}px, ${p.y}px) scale(${p.scale})`;
        card.style.opacity = p.opacity.toFixed(3);
        card.style.zIndex = String(p.z);
        card.style.pointerEvents = k > 4 ? "none" : "auto";
        const isFront = k === 0;
        card.classList.toggle("is-front", isFront);
        card.setAttribute("aria-hidden", isFront ? "false" : "true");
      });
    }

    function step(delta) {
      shift = (((shift + delta) % n) + n) % n;
      render();
    }

    function goToCard(index) {
      shift = ((index % n) + n) % n;
      render();
    }

    function stopAutoplay() {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    function startAutoplay() {
      if (autoplayTimer || hovering) return;
      autoplayTimer = window.setInterval(() => step(1), 3200); // ritmo de caracol — devagar
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    cards.forEach((card, index) => {
      card.addEventListener("click", () => { goToCard(index); restartAutoplay(); });
    });
    prevBtn.addEventListener("click", () => { step(-1); restartAutoplay(); });
    nextBtn.addEventListener("click", () => { step(1); restartAutoplay(); });
    window.addEventListener("resize", render);
    wrap.addEventListener("pointerenter", () => { hovering = true; stopAutoplay(); });
    wrap.addEventListener("pointerleave", () => { hovering = false; startAutoplay(); });

    render();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startAutoplay();
        else stopAutoplay();
      }, { threshold: 0.25 });
      observer.observe(wrap);
    } else {
      startAutoplay();
    }
  }

  function initSignatureHero() {
    const loader = document.getElementById("introLoader");
    const hero = document.getElementById("topo");

    if (loader) {
      const dismissLoader = () => loader.classList.add("is-leaving");
      window.setTimeout(dismissLoader, prefersReduced ? 0 : 1250);
      window.addEventListener("load", () => window.setTimeout(dismissLoader, prefersReduced ? 0 : 350), { once: true });
    }
    if (!hero || prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;

    let frameRequested = false;
    let pointerX = 0.5;
    let pointerY = 0.5;
    const renderPointer = () => {
      const offsetX = (pointerX - 0.5) * -12;
      const offsetY = (pointerY - 0.5) * -8;
      hero.style.setProperty("--hero-offset-x", `${offsetX}px`);
      hero.style.setProperty("--hero-offset-y", `${offsetY}px`);
      hero.style.setProperty("--hero-light-x", `${pointerX * 100}%`);
      hero.style.setProperty("--hero-light-y", `${pointerY * 100}%`);
      frameRequested = false;
    };
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width;
      pointerY = (event.clientY - bounds.top) / bounds.height;
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(renderPointer);
      }
    });
    hero.addEventListener("pointerleave", () => {
      pointerX = 0.5;
      pointerY = 0.5;
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(renderPointer);
      }
    });
  }

  function initMagneticButtons() {
    if (prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;
    document.querySelectorAll("[data-magnetic]").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const bounds = button.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * 0.16;
        const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
        button.style.setProperty("--magnet-x", `${x}px`);
        button.style.setProperty("--magnet-y", `${y}px`);
      });
      button.addEventListener("pointerleave", () => {
        button.style.setProperty("--magnet-x", "0px");
        button.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  function initTiltCards() {
    if (prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.add("is-tilt");
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  function initCounters() {
    const counters = [...document.querySelectorAll("[data-counter]")];
    if (!counters.length) return;
    const paintCounter = (element, value) => {
      element.textContent = `${element.dataset.prefix || ""}${Math.round(value)}${element.dataset.suffix || ""}`;
    };
    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach((counter) => paintCounter(counter, Number(counter.dataset.counter)));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = Number(counter.dataset.counter);
        const startedAt = performance.now();
        const duration = 1150;
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          paintCounter(counter, target * (1 - Math.pow(1 - progress, 4)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(counter);
      });
    }, { threshold: 0.65 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function initMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;
    function close() {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    function open() {
      toggle.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  if (prefersReduced) {
    html.classList.add("reduced-motion");
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    buildSceneInstances().forEach((s) => s.instance.render(0.55)); // single static frame
    plainNavAndProgress();
    return;
  }

  const hasFullEngine = !!(window.gsap && window.ScrollTrigger && window.Lenis);

  if (hasFullEngine) {
    runGsapEngine();
  } else {
    // eslint-disable-next-line no-console
    console.warn("[DevClub] GSAP/Lenis não carregaram (CDN indisponível) — usando motor de scroll alternativo em JS puro.");
    runVanillaEngine();
  }

  /* =========================================================
     ENGINE A — GSAP + ScrollTrigger + Lenis (premium experience)
     ========================================================= */
  function runGsapEngine() {
    html.classList.add("js-reveal-ready");
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -20 });
          }
        }
      });
    });

    if (nav) {
      ScrollTrigger.create({
        start: 60,
        onUpdate: (self) => nav.classList.toggle("is-scrolled", self.scroll() > 40),
      });
    }

    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    }

    document.querySelectorAll("[data-reveal]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: (i % 6) * 0.04,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        }
      );
    });

    const scenes = buildSceneInstances();
    scenes.forEach((s) => {
      const track = s.canvasEl.closest(".scene__track");
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => { s.progress = self.progress; },
      });
    });

    startRenderLoop(scenes);
    ScrollTrigger.refresh();

    /* Lazy-loaded images (showcase screenshots, etc.) reserve no space
       until they finish loading, so the page grows after Lenis/ScrollTrigger's
       initial measurement — leaving the scroll limit short of the real
       bottom (wheel scroll stalls early; dragging the scrollbar still
       works because it bypasses Lenis's cached limit). Resync both
       Lenis's virtual scroll height and ScrollTrigger's trigger math
       whenever the document's height actually changes. */
    let refreshTimer;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 120);
    };
    window.addEventListener("load", scheduleRefresh);
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", scheduleRefresh, { once: true });
    });
    new ResizeObserver(scheduleRefresh).observe(document.body);
  }

  /* =========================================================
     ENGINE B — Vanilla JS fallback (no external dependencies)
     Provides the same observable behaviour: nav state, progress
     bar, reveal-on-scroll, and scene canvases scrubbed by native
     scroll position. Uses native smooth scrolling for anchors.
     ========================================================= */
  function runVanillaEngine() {
    html.classList.add("js-reveal-ready");
    html.classList.add("vanilla-engine");
    html.style.scrollBehavior = "smooth";

    plainNavAndProgress();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transition = "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)";
            entry.target.style.opacity = 1;
            entry.target.style.transform = "none";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    const scenes = buildSceneInstances();
    const tracks = scenes.map((s) => ({ ...s, track: s.canvasEl.closest(".scene__track") }));

    function updateProgress() {
      tracks.forEach((s) => {
        const rect = s.track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        s.progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      });
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    startRenderLoop(tracks);
  }

  function plainNavAndProgress() {
    function onScroll() {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
      if (progressBar) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const frac = max > 0 ? window.scrollY / max : 0;
        progressBar.style.transform = `scaleX(${frac})`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function startRenderLoop(scenes) {
    let rafId;
    function loop() {
      scenes.forEach((s) => {
        s.instance.render(s.progress);
        if (s.videoEl) updateVideo(s.videoEl, s.progress, s.videoEl.dataset.scrub === "true");
        if (s.imageEl) updateImage(s.imageEl, s.pulseEl, s.progress);
      });
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(loop);
    });
  }
})();
