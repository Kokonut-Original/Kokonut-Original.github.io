/* Sakura Swarm. Choreography inspired by Swarm Rebuild and Joel Califa's Swarm. */
(() => {
  "use strict";

  const desk = document.getElementById("top");
  const replay = document.getElementById("swarmBtn");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phone = window.matchMedia("(max-width: 900px)");
  const introKey = "sakura-swarm-seen";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const flight = 460;
  const sweep = 550;
  const bloom = 440;
  const clamp = (n) => Math.max(0, Math.min(1, n));
  const ease = (n) => n * n * (3 - 2 * n);
  let frame = 0;

  canvas.className = "sakura-swarm";
  canvas.setAttribute("aria-hidden", "true");
  canvas.hidden = true;
  canvas.width = canvas.height = 1;
  document.body.append(canvas);

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (canvas.hidden) return;
    canvas.hidden = true;
    canvas.width = canvas.height = 1;
  }

  function chooseTargets(compact, width) {
    const top = replay.closest(".menubar").getBoundingClientRect().bottom + 6;
    const bottom = document.querySelector(".dock").getBoundingClientRect().top - 6;
    const selectors = [
      compact ? ".hero" : ".hero-inner",
      "#w-spot", "#w-ava", "#w-games", "#w-cal",
      "#w-sched", "#w-weather", "#w-dc", "#w-note", "#w-clock",
    ];
    const targets = [];

    for (const selector of selectors) {
      const rect = desk.querySelector(selector).getBoundingClientRect();
      const pad = selector === ".hero-inner" ? 10 : -3;
      const left = Math.max(3, rect.left - pad);
      const right = Math.min(width - 3, rect.right + pad);
      if (right - left < Math.max(40, rect.width * .85) ||
          rect.height < 30 || rect.top < top || rect.bottom > bottom) continue;

      targets.push({
        x: left, y: rect.top - pad,
        width: right - left, height: rect.height + pad * 2,
      });
      if (targets.length === (compact ? 3 : 4)) break;
    }
    return targets;
  }

  function drawCursor(x, y, accent, paper, alpha, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = accent;
    ctx.strokeStyle = paper;
    ctx.lineWidth = 1.4;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(13, 8);
    ctx.lineTo(7.5, 9.2);
    ctx.lineTo(4.4, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawAgent(target, origin, time, index, compact, accent, paper) {
    if (time < 0 || time >= flight + sweep + bloom) return;
    const { x, y, width, height } = target;

    if (time < flight) {
      const bend = (index % 2 === 0 ? 1 : -1) * (compact ? 24 : 48);
      // Offset the trails along the same curve so they follow the cursor into place.
      for (let trail = 3; trail >= 0; trail--) {
        const progress = ease(clamp((time - trail * 31) / flight));
        const arc = Math.sin(Math.PI * progress) * bend;
        const cx = origin.x + (x - origin.x) * progress + arc;
        const cy = origin.y + (y - origin.y) * progress - Math.abs(arc) * .55;
        const alpha = ease(clamp((time - trail * 31) / 115));
        drawCursor(cx, cy, accent, paper, alpha / (1 + trail * 2.7), 1 - trail * .14);
      }
      return;
    }

    const progress = ease(clamp((time - flight) / sweep));
    const fade = ease(clamp((time - flight - sweep) / bloom));
    const edge = x + width * progress;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - 2, y - 2, edge - x + 4, height + 4);
    ctx.clip();
    ctx.globalAlpha = .72 * (1 - fade);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, width, height, 17);
    else ctx.rect(x, y, width, height);
    ctx.stroke();
    ctx.restore();

    if (time < flight + sweep) {
      drawCursor(edge, y, accent, paper, 1, 1);
      return;
    }

    // The cursor dissolves into the same petal shapes as the site's wallpaper.
    ctx.save();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 1 - fade;
    for (let petal = 0; petal < 5; petal++) {
      const angle = petal * Math.PI * 2 / 5 + index;
      const radius = 3 + 24 * fade;
      ctx.beginPath();
      ctx.ellipse(edge + Math.cos(angle) * radius, y + Math.sin(angle) * radius + 9 * fade,
        3.7, 1.8, angle + fade, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function play(trigger) {
    stop();
    if (reducedMotion.matches || document.hidden ||
        document.body.matches(".away, .app-open")) return;

    const compact = phone.matches;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const targets = chooseTargets(compact, width);
    if (!targets.length) return;

    const bounds = trigger.getBoundingClientRect();
    const origin = { x: bounds.left + bounds.width / 2, y: bounds.bottom };
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim();
    const paper = styles.getPropertyValue("--panel-solid").trim();
    const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5);
    const stagger = compact ? 105 : 120;
    const duration = flight + sweep + bloom + (targets.length - 1) * stagger;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas.hidden = false;
    const start = performance.now();

    function draw(now) {
      const elapsed = now - start;
      if (elapsed >= duration) {
        stop();
        return;
      }
      ctx.clearRect(0, 0, width, height);
      targets.forEach((target, i) => drawAgent(target, origin, elapsed - i * stagger, i, compact, accent, paper));
      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    try { sessionStorage.setItem(introKey, "1"); } catch (error) { /* Storage may be disabled. */ }
  }

  function updateMotionPreference() {
    replay.hidden = reducedMotion.matches;
    if (reducedMotion.matches) stop();
  }

  updateMotionPreference();
  reducedMotion.addEventListener("change", updateMotionPreference);
  replay.addEventListener("click", () => play(replay));
  window.addEventListener("resize", stop, { passive: true });
  window.addEventListener("pointerdown", stop, { capture: true, passive: true });
  window.addEventListener("keydown", stop, { capture: true });
  window.addEventListener("scroll", (event) => {
    if (event.target === document || event.target === window || desk.contains(event.target)) stop();
  }, { capture: true, passive: true });
  window.addEventListener("pagehide", stop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });

  let seen = false;
  try { seen = sessionStorage.getItem(introKey) === "1"; } catch (error) { /* Storage may be disabled. */ }
  if (!seen && !reducedMotion.matches) {
    // Give the actual desktop a frame to paint before decorating it.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => play(document.getElementById("homeLink")));
    });
  }
})();
