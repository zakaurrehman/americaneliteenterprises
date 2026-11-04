"use client";

import { useEffect, useRef, useState } from "react";
import { companies, sectors } from "@/content/portfolio";

// Per sector: its companies, and which of them are core entities (drawn gold).
const RINGS = sectors.map((s) => {
  const list = companies.filter((c) => c.sector === s.slug);
  return { name: s.name, count: list.length, core: list.map((c) => Boolean(c.profile)) };
});

const TILT = 0.52; // ellipse squash — the orbit plane seen from above
const ROT = (-14 * Math.PI) / 180; // plane rotation

/**
 * Hero visual: the nine sectors as orbits around the crest, with each of
 * the 45 businesses as a particle on its sector's orbit. Idle: sectors light
 * up in turn. Pointer: the nearest orbit lights up and the plane tilts.
 * Decorative (aria-hidden) — the sector explorer below is the accessible path.
 */
export function Orbit() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const logo = new Image();
    logo.src = "/brand/american-elite-crest-sm.webp";

    // Phones and touch devices: lower resolution and 30fps keep it cheap.
    const light = !fine || window.innerWidth < 768;
    const frameMs = light ? 1000 / 30 : 0;

    let w = 0, h = 0, dpr = 1;
    // The core halo is pre-rendered once per size rather than every frame.
    const halo = document.createElement("canvas");
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(light ? 1.5 : 2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const hr = (Math.min(w, h) / 2) * 0.98 * 0.36;
      halo.width = halo.height = Math.max(1, Math.round(hr * 2));
      const hctx = halo.getContext("2d");
      if (hctx) {
        const g = hctx.createRadialGradient(hr, hr, 0, hr, hr, hr);
        g.addColorStop(0, "rgba(36,99,234,0.20)");
        g.addColorStop(1, "rgba(36,99,234,0)");
        hctx.fillStyle = g;
        hctx.fillRect(0, 0, halo.width, halo.height);
      }
      if (!running) draw(performance.now());
    };

    // Pointer state (eased) and highlight state
    let px = 0, py = 0, tx = 0, ty = 0;
    let hover = -1;
    let auto = 0;
    let lastSwitch = 0;
    const glow = new Float32Array(RINGS.length); // eased 0..1 per ring

    const radius = (i: number, R: number) => R * (0.4 + 0.066 * i);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      tx = x / r.width;
      ty = y / r.height;
      // Nearest ring in the un-rotated, un-squashed plane
      const cos = Math.cos(-ROT), sin = Math.sin(-ROT);
      const ux = x * cos - y * sin, uy = (x * sin + y * cos) / TILT;
      const rho = Math.hypot(ux, uy);
      const R = Math.min(w, h) / 2;
      let best = -1, bestD = R * 0.05;
      for (let i = 0; i < RINGS.length; i++) {
        const d = Math.abs(rho - radius(i, R));
        if (d < bestD) { bestD = d; best = i; }
      }
      hover = best;
      if (best >= 0) setLabel(best);
    };
    const onLeave = () => { hover = -1; tx = ty = 0; };
    if (fine && !reduce) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    let visible = true;
    let started = false; // animation begins only after load + idle
    let running = false;
    let raf = 0, last = performance.now(), lastFrame = 0, t = 0;

    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;

      // Idle cycle through the sectors
      if (started && hover < 0 && now - lastSwitch > 2600) {
        auto = (auto + 1) % RINGS.length;
        lastSwitch = now;
        setLabel(auto);
      }
      const active = hover >= 0 ? hover : auto;
      for (let i = 0; i < RINGS.length; i++) {
        glow[i] += ((i === active ? 1 : 0) - glow[i]) * Math.min(1, dt * 6 || 1);
      }
      px += (tx - px) * Math.min(1, dt * 4);
      py += (ty - py) * Math.min(1, dt * 4);

      const R = Math.min(w, h) / 2 * 0.98;
      const cx = w / 2, cy = h / 2;
      const tilt = TILT + py * 0.12;
      const rot = ROT + px * 0.12;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const place = (x: number, y: number): [number, number] => [cx + x * cr - y * sr, cy + x * sr + y * cr];

      ctx!.clearRect(0, 0, w, h);

      // Orbits
      for (let i = 0; i < RINGS.length; i++) {
        const r = radius(i, R);
        const g = glow[i];
        ctx!.beginPath();
        ctx!.ellipse(cx, cy, r, r * tilt, rot, 0, Math.PI * 2);
        ctx!.strokeStyle = g > 0.02 ? `rgba(36,99,234,${0.08 + g * 0.55})` : "rgba(15,23,41,0.10)";
        ctx!.lineWidth = 1 + g * 0.6;
        ctx!.stroke();
      }

      // Particles, split into back (behind the mark) and front
      const back: number[][] = [], front: number[][] = [];
      for (let i = 0; i < RINGS.length; i++) {
        const ring = RINGS[i];
        const r = radius(i, R);
        const speed = 0.16 / (1 + i * 0.2);
        for (let k = 0; k < ring.count; k++) {
          const a = t * speed + (k / ring.count) * Math.PI * 2 + i * 0.7;
          const [x, y] = place(Math.cos(a) * r, Math.sin(a) * r * tilt);
          const depth = (Math.sin(a) + 1) / 2; // 0 back → 1 front
          (Math.sin(a) < 0 ? back : front).push([x, y, depth, glow[i], ring.core[k] ? 1 : 0]);
        }
      }
      const dot = ([x, y, depth, g, core]: number[]) => {
        const size = (1.4 + depth * 1.6) * (core ? 1.35 : 1) * (1 + g * 0.5);
        if (g > 0.05 || core) {
          ctx!.beginPath();
          ctx!.arc(x, y, size * 3.2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(36,99,234,${0.1 * Math.max(g, core * 0.6)})`;
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.arc(x, y, size, 0, Math.PI * 2);
        const alpha = 0.35 + depth * 0.6;
        ctx!.fillStyle = core || g > 0.5 ? `rgba(36,99,234,${alpha})` : `rgba(15,23,41,${alpha * (0.7 + g * 0.3)})`;
        ctx!.fill();
      };
      back.forEach(dot);

      // Core: soft halo + the crest
      ctx!.drawImage(halo, cx - halo.width / 2, cy - halo.height / 2);
      if (logo.complete && logo.naturalWidth) {
        const s = R * 0.4;
        ctx!.drawImage(logo, cx - s / 2 + px * 6, cy - s / 2 + py * 6, s, s);
      }

      front.forEach(dot);
    }

    function loop(now: number) {
      cancelAnimationFrame(raf);
      running = false;
      if (!started || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
      if (frameMs && now - lastFrame < frameMs) return;
      lastFrame = now;
      draw(now);
    }

    const resume = () => started && loop(performance.now());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      resume();
    });
    const onVis = () => !document.hidden && resume();
    document.addEventListener("visibilitychange", onVis);
    logo.onload = () => !running && draw(performance.now());

    // Static first frame now; animation starts once the page has loaded and
    // the main thread is idle, so it never competes with first render.
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    io.observe(wrap);
    const begin = () => {
      if (reduce) return;
      started = true;
      last = lastSwitch = performance.now();
      resume();
    };
    let idleId = 0;
    const hasIdle = typeof window.requestIdleCallback === "function"; // absent in older Safari
    const schedule = () => {
      idleId = hasIdle ? window.requestIdleCallback(begin, { timeout: 3000 }) : window.setTimeout(begin, 1500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      window.removeEventListener("load", schedule);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const ring = RINGS[label];
  return (
    <div ref={wrapRef} aria-hidden className="relative aspect-square w-full">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[8%] flex justify-center">
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface/90 px-4 py-2 text-sm">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgb(36_99_234/0.6)]" />
          <span className="font-mono text-[0.7rem] text-fg-subtle">{String(label + 1).padStart(2, "0")}</span>
          <span key={label} className="font-medium text-fg [animation:fade-in_0.5s_ease_both]">
            {ring.name}
          </span>
          <span className="text-fg-muted">
            {ring.count} {ring.count === 1 ? "business" : "businesses"}
          </span>
        </div>
      </div>
    </div>
  );
}
