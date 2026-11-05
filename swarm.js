/* Sakura Swarm. Choreography inspired by Swarm Rebuild and Joel Califa's Swarm. */
(() => {
  "use strict";

  const desk = document.getElementById("top");
  const replay = document.getElementById("swarmBtn");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phone = window.matchMedia("(max-width: 900px)");
  const introKey = "sakura-rebuild-seen";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const flight = 540;
  const sweep = 820;
  const bloom = 520;
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
      const pad = selector === ".hero-inner" ? 14 : -1;
      const left = Math.max(3, rect.left - pad);
      const right = Math.min(width - 3, rect.right + pad);
      if (right - left < Math.max(40, rect.width * .85) ||
          rect.height < 30 || rect.top < top || rect.bottom > bottom) continue;

      targets.push({
        x: left, y: rect.top - pad,
        width: right - left, height: rect.height + pad * 2,
      });
      if (targets.length === (compact ? 3 : 5)) break;
    }
    return targets;
  }

  function targetPath(x, y, width, height) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, width, height, 18);
    else ctx.rect(x, y, width, height);
  }

  function drawBlueprint(target, elapsed, time, color, paper, number) {
    if (time >= flight + sweep) return;
    const { x, y, width, height } = target;
    const progress = ease(clamp((time - flight) / sweep));
    const edge = x + width * progress;
    const opacity = ease(clamp(elapsed / 145));

    ctx.save();
    targetPath(x, y, width, height);
    ctx.clip();
    ctx.beginPath();
    ctx.rect(edge, y, x + width - edge, height);
    ctx.clip();

    ctx.globalAlpha = opacity;
    ctx.fillStyle = paper;
    ctx.fillRect(x, y, width, height);

    ctx.globalAlpha = opacity * .17;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let column = 16; column < width; column += 20) {
      ctx.moveTo(x + column, y);
      ctx.lineTo(x + column, y + height);
    }
    for (let row = 16; row < height; row += 20) {
      ctx.moveTo(x, y + row);
      ctx.lineTo(x + width, y + row);
    }
    ctx.stroke();

    ctx.globalAlpha = opacity * .65;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(x + 12, y + 12, width - 24, height - 24);
    ctx.setLineDash([]);
    if (width >= 76 && height >= 62) {
      ctx.fillStyle = paper;
      ctx.fillRect(x + 13, y + 18, 55, 22);
      ctx.fillStyle = color;
      ctx.font = "600 11px ui-monospace, monospace";
      ctx.fillText("TĐL / " + number, x + 14, y + 33);
    }
    ctx.restore();
  }

  function drawCursor(x, y, accent, paper, alpha, scale, number) {
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
    if (number) {
      ctx.fillRect(11, 13, 23, 15);
      ctx.fillStyle = paper;
      ctx.font = "700 10px ui-monospace, monospace";
      ctx.fillText(number, 16, 24);
    }
    ctx.restore();
  }

  function drawAgent(target, origin, time, index, compact, accent, paper, number) {
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
        drawCursor(cx, cy, accent, paper, alpha / (1 + trail * 2.7),
          1.35 - trail * .2, trail === 0 ? number : "");
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
    ctx.globalAlpha = .9 * (1 - fade);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    targetPath(x, y, width, height);
    ctx.stroke();
    ctx.restore();

    if (time < flight + sweep) {
      ctx.save();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(edge, y);
      ctx.lineTo(edge, y + height);
      ctx.stroke();
      ctx.restore();
      drawCursor(edge, y, accent, paper, 1, 1.35, number);
      return;
    }

    // The cursor dissolves into the same petal shapes as the site's wallpaper.
    ctx.save();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 1 - fade;
    for (let petal = 0; petal < 5; petal++) {
      const angle = petal * Math.PI * 2 / 5 + index;
      const radius = 4 + 36 * fade;
      ctx.beginPath();
      ctx.ellipse(edge + Math.cos(angle) * radius, y + Math.sin(angle) * radius + 9 * fade,
        5.5, 2.6, angle + fade, 0, Math.PI * 2);
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
    const dark = document.documentElement.dataset.theme === "dark";
    const colors = [accent, dark ? "#82C9FF" : "#1767AE", dark ? "#C8AFFE" : "#7552A8"];
    const agents = targets.map((target, index) => ({
      target, index, color: colors[index % colors.length], number: String(index + 1).padStart(2, "0"),
    }));
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
      for (const { target, index, color, number } of agents) {
        drawBlueprint(target, elapsed, elapsed - index * stagger, color, paper, number);
      }
      for (const { target, index, color, number } of agents) {
        drawAgent(target, origin, elapsed - index * stagger, index, compact, color, paper, number);
      }
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
