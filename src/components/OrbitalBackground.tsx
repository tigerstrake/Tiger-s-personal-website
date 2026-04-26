"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToolId = "gravity" | "blackhole" | "debris" | "satellite" | "repulsor";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  absorbed?: boolean;
  isDebris?: boolean;    // user-placed — wraps at edges instead of recycling
  rotation?: number;     // current angle (debris rocks spin)
  spin?: number;         // angular velocity (rad/frame)
  seed?: number;         // 0–1, determines rock shape & color per particle
}

interface Satellite {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;      // current body angle
  spin: number;          // angular velocity (very slow tumble)
  id?: string;
}

interface GravityWell {
  x: number; y: number;
  mass: number;
  isPermanent?: boolean;
  isMouse?: boolean;
  isBlackHole?: boolean;
  eventHorizon?: number;   // px — varies with hold duration for black holes
  createdAt?: number;
  lifetime?: number;
}

interface Flash {
  x: number; y: number;
  createdAt: number; duration: number;
  color?: string;   // default purple; satellite explosion uses amber
}

// ─── Configuration ────────────────────────────────────────────────────────────

const CFG = {
  PARTICLE_COUNT_DESKTOP: 320,
  PARTICLE_COUNT_MOBILE:  100,

  G:              0.12,
  SOFTENING_SQ:   1600,
  MOUSE_MASS:     1800,

  BASE_CLICK_MASS:     20000,
  MAX_HOLD_MS:         2200,
  MAX_HOLD_MASS_MULT:  6,

  CLICK_LIFETIME_MS:    5000,
  BH_LIFETIME_MS:       8000,
  REPULSOR_LIFETIME_MS: 4000,

  BH_MASS_MULT:        9,
  BH_EVENT_HORIZON:    20,

  DEFAULT_DEBRIS_COUNT: 22,
  DEFAULT_DEBRIS_SIZE:  1.0,   // multiplier applied to DEBRIS_SIZE_* range
  DRAG_SCALE:           70,    // px of drag → 1 px/frame velocity

  DEBRIS_SIZE_MIN: 2.8,        // rock radius range (px) — separate from bg particles
  DEBRIS_SIZE_MAX: 5.5,
  SAT_COLLISION_R: 16,         // satellite body half-size for collision (px)
  SAT_EXPLOSION_N: 22,

  STAR_COUNT: 180,

  DRAG:          0.9997,  // per-frame velocity damping — prevents energy drift from numerical integration
  MAX_SPEED:     50,      // hard cap, should rarely fire with Verlet + drag
  TRAIL_ALPHA:   0.06,

  PARTICLE_SIZE_MIN: 0.4,      // background dust — stays small
  PARTICLE_SIZE_MAX: 1.1,
  ESCAPE_RADIUS_MULT: 2.5,

  GRID_SPACING:      80,
  GRID_MAX_DISPLACE: 22,
  GRID_ALPHA:        0.07,

  BG_COLOR:       "7, 8, 12",
  PARTICLE_COLOR: "238, 235, 225",
  ACCENT_COLOR:   "200, 134, 90",
} as const;

// ─── Tool palette ─────────────────────────────────────────────────────────────

const TOOLS: { id: ToolId; label: string; desc: string; color: string; key: string }[] = [
  { id: "gravity",   label: "Gravity Well", desc: "Hold longer → stronger pull",            color: "#C8865A", key: "G" },
  { id: "blackhole", label: "Black Hole",   desc: "Absorbs particles",                      color: "#A78BFA", key: "B" },
  { id: "debris",    label: "Debris",       desc: "Drag to launch · click for burst",       color: "#60A5FA", key: "D" },
  { id: "satellite", label: "Satellite",    desc: "Drag to launch · debris hit = explodes", color: "#FCD34D", key: "S" },
  { id: "repulsor",  label: "Repulsor",     desc: "Pushes particles away",                  color: "#34D399", key: "R" },
];

const INTERACTIVE_SEL = "a, button, input, select, textarea, label, [role='button'], [data-no-sim]";

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrbitalBackground() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const particlesRef   = useRef<Particle[]>([]);
  const satellitesRef  = useRef<Satellite[]>([]);
  const wellsRef       = useRef<GravityWell[]>([]);
  const starsRef       = useRef<{ nx: number; ny: number; r: number; a: number }[]>([]);
  const flashesRef     = useRef<Flash[]>([]);
  const mouseRef       = useRef({ x: -9999, y: -9999, active: false });
  const holdRef        = useRef<{ start: number; x: number; y: number } | null>(null);
  const debrisDragRef  = useRef<{ sx: number; sy: number; ex: number; ey: number } | null>(null);
  const rafRef         = useRef<number>(0);
  const toolRef        = useRef<ToolId>("gravity");
  const noFadeRef      = useRef(false);
  const debrisCountRef = useRef<number>(CFG.DEFAULT_DEBRIS_COUNT);
  const debrisSizeRef  = useRef<number>(CFG.DEFAULT_DEBRIS_SIZE);
  const zoomRef        = useRef(1);   // 1 = normal, <1 = zoomed out
  const tutorialBHRef  = useRef<GravityWell | null>(null);
  const tutorialSatRef = useRef<Satellite | null>(null);

  const [tool, setTool]           = useState<ToolId>("gravity");
  const [noFade, setNoFade]       = useState(false);
  const [showHelp, setShowHelp]   = useState(true);
  const [debrisCount, setDebrisCount] = useState<number>(CFG.DEFAULT_DEBRIS_COUNT);
  const [debrisSize,  setDebrisSize]  = useState<number>(CFG.DEFAULT_DEBRIS_SIZE);
  const [zoomPct, setZoomPct]     = useState(100);  // display only

  const [tutCursorPos,  setTutCursorPos]  = useState({ x: 0, y: 0 });
  const [tutCursorVis,  setTutCursorVis]  = useState(false);
  const [tutClicking,   setTutClicking]   = useState(false);
  const [tutLabel,      setTutLabel]      = useState("");
  const [tutLabelVis,   setTutLabelVis]   = useState(false);
  const [tutArrowPos,   setTutArrowPos]   = useState<{ x: number; y: number } | null>(null);

  useEffect(() => { toolRef.current    = tool;   }, [tool]);
  useEffect(() => { noFadeRef.current  = noFade; }, [noFade]);
  useEffect(() => { debrisCountRef.current = debrisCount; }, [debrisCount]);
  useEffect(() => { debrisSizeRef.current  = debrisSize;  }, [debrisSize]);

  // ─── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, ToolId> = {
        g: "gravity", b: "blackhole", d: "debris", s: "satellite", r: "repulsor",
      };
      const t = map[e.key.toLowerCase()];
      if (t) setTool(t);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ─── Tutorial animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 640) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => { timers.push(setTimeout(fn, ms)); };

    let bhX = 0, bhY = 0;

    at(1200, () => {
      setTutLabel("This background is a live gravity simulator!");
      setTutLabelVis(true);
    });

    at(2400, () => {
      const btn = document.getElementById("toolbar-btn-blackhole");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setTutArrowPos({ x: r.left + r.width / 2, y: r.bottom + 14 });
      setTutLabel("Click “Black Hole” to create one!");
      setTutCursorPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });

    at(3000, () => setTutCursorVis(true));

    at(3700, () => {
      setTutClicking(true);
      setTool("blackhole");
    });
    at(4000, () => {
      setTutClicking(false);
      setTutArrowPos(null);
    });

    at(4500, () => {
      bhX = window.innerWidth * 0.5;
      bhY = window.innerHeight * 0.42;
      setTutCursorPos({ x: bhX, y: bhY });
      setTutLabel("Hold & click to place a black hole...");
    });

    at(5400, () => {
      holdRef.current = { start: performance.now(), x: bhX, y: bhY };
    });

    at(6700, () => {
      holdRef.current = null;
      const now = performance.now();
      const bh: GravityWell = {
        x: bhX, y: bhY,
        mass: CFG.BASE_CLICK_MASS * CFG.BH_MASS_MULT,
        isBlackHole: true,
        eventHorizon: CFG.BH_EVENT_HORIZON * 1.1,
        isPermanent: true,
        createdAt: now,
      };
      wellsRef.current.push(bh);
      tutorialBHRef.current = bh;
    });

    at(7300, () => {
      const btn = document.getElementById("toolbar-btn-satellite");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setTutArrowPos({ x: r.left + r.width / 2, y: r.bottom + 14 });
      setTutCursorPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      setTutLabel("Now launch a satellite to orbit it!");
    });

    at(8100, () => {
      setTutClicking(true);
      setTool("satellite");
    });
    at(8400, () => {
      setTutClicking(false);
      setTutArrowPos(null);
    });

    at(9000, () => {
      setTutCursorPos({ x: bhX + 165, y: bhY });
      setTutLabel("Click to place it in orbit!");
    });

    at(9800, () => setTutClicking(true));

    at(10100, () => {
      setTutClicking(false);
      // Compute circular orbital velocity: v = sqrt(G * M / (r² + softening) * r)
      const r  = 165;
      const mass = CFG.BASE_CLICK_MASS * CFG.BH_MASS_MULT;
      const distSq = r * r + CFG.SOFTENING_SQ;
      const v  = Math.sqrt((CFG.G * mass / distSq) * r);
      const sat: Satellite = {
        x: bhX + r, y: bhY,
        vx: 0, vy: -v,
        rotation: 0, spin: 0.004,
        id: "tutorial-sat",
      };
      satellitesRef.current.push(sat);
      tutorialSatRef.current = sat;
      setTool("gravity");
    });

    at(11200, () => {
      setTutLabelVis(false);
      setTutCursorVis(false);
      setTutLabel("");
    });

    // Fade everything 7 seconds after satellite is placed
    at(10100 + 7000, () => {
      const bh = tutorialBHRef.current;
      if (bh) {
        bh.isPermanent = false;
        bh.createdAt   = performance.now();
        bh.lifetime    = 2500;
        tutorialBHRef.current = null;
      }
      const sat = tutorialSatRef.current;
      if (sat) {
        const idx = satellitesRef.current.indexOf(sat);
        if (idx >= 0) {
          flashesRef.current.push({ x: sat.x, y: sat.y, createdAt: performance.now(), duration: 800, color: "252,200,60" });
          satellitesRef.current.splice(idx, 1);
        }
        tutorialSatRef.current = null;
      }
    });

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Spawn helper ───────────────────────────────────────────────────────────
  const spawnParticle = useCallback((wells: GravityWell[], w: number, h: number): Particle => {
    const permanent = wells.filter(wl => wl.isPermanent);

    if (permanent.length > 0) {
      const anchor = permanent[Math.floor(Math.random() * permanent.length)];
      const angle  = Math.random() * Math.PI * 2;
      const dist   = 60 + Math.random() * Math.min(w, h) * 0.45;
      const x = anchor.x + Math.cos(angle) * dist;
      const y = anchor.y + Math.sin(angle) * dist;
      const spd = Math.sqrt((CFG.G * anchor.mass) / (dist + 1)) * (0.75 + Math.random() * 0.5);
      return {
        x, y,
        vx: -Math.sin(angle) * spd,
        vy:  Math.cos(angle) * spd,
        size:  CFG.PARTICLE_SIZE_MIN + Math.random() * (CFG.PARTICLE_SIZE_MAX - CFG.PARTICLE_SIZE_MIN),
        alpha: 0.15 + Math.random() * 0.55,
      };
    }

    return {
      x:    Math.random() * w,
      y:    Math.random() * h,
      vx:   (Math.random() - 0.5) * 0.15,
      vy:   (Math.random() - 0.5) * 0.15,
      size: CFG.PARTICLE_SIZE_MIN + Math.random() * (CFG.PARTICLE_SIZE_MAX - CFG.PARTICLE_SIZE_MIN),
      alpha: 0.08 + Math.random() * 0.35,
    };
  }, []);

  // ─── Acceleration helper (shared by Verlet position + velocity half-steps) ──
  const accelAt = useCallback((
    px: number, py: number, wells: GravityWell[], now: number, persistMode: boolean
  ): [number, number, boolean] => {
    let fx = 0, fy = 0;
    let absorbed = false;
    for (const well of wells) {
      if (well.isMouse && !mouseRef.current.active) continue;
      let mass = well.mass;
      if (!persistMode && !well.isPermanent && !well.isMouse && well.createdAt !== undefined) {
        const t = Math.min((now - well.createdAt) / (well.lifetime ?? CFG.CLICK_LIFETIME_MS), 1);
        mass = well.mass * (1 - t * t);
      }
      if (Math.abs(mass) < 10) continue;
      const dx = well.x - px, dy = well.y - py;
      const distSq = dx * dx + dy * dy + CFG.SOFTENING_SQ;
      const dist = Math.sqrt(distSq);
      if (well.isBlackHole && dist < (well.eventHorizon ?? CFG.BH_EVENT_HORIZON)) {
        absorbed = true;
        continue;
      }
      const s = (CFG.G * mass) / distSq;
      fx += (s * dx) / dist;
      fy += (s * dy) / dist;
    }
    return [fx, fy, absorbed];
  }, []);

  // ─── Physics step (particles) — velocity Verlet (symplectic, energy-conserving) ──
  const step = useCallback((
    particles: Particle[], wells: GravityWell[], flashes: Flash[],
    w: number, h: number, now: number
  ) => {
    const persistMode = noFadeRef.current;
    const escapeR     = Math.max(w, h) * CFG.ESCAPE_RADIUS_MULT;
    const drag        = CFG.DRAG;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 1. Compute acceleration at current position
      const [ax1, ay1, absorbed1] = accelAt(p.x, p.y, wells, now, persistMode);
      if (absorbed1) {
        p.absorbed = true;
        flashes.push({ x: p.x, y: p.y, createdAt: now, duration: 380 });
      }

      // 2. Half-step velocity, full-step position
      const hvx = p.vx + ax1 * 0.5;
      const hvy = p.vy + ay1 * 0.5;
      p.x += hvx;
      p.y += hvy;

      // 3. Compute acceleration at new position
      const [ax2, ay2, absorbed2] = accelAt(p.x, p.y, wells, now, persistMode);
      if (absorbed2) {
        p.absorbed = true;
        flashes.push({ x: p.x, y: p.y, createdAt: now, duration: 380 });
      }

      // 4. Complete velocity step + apply drag
      p.vx = (hvx + ax2 * 0.5) * drag;
      p.vy = (hvy + ay2 * 0.5) * drag;

      // Speed cap (safety valve)
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > CFG.MAX_SPEED) { p.vx *= CFG.MAX_SPEED / spd; p.vy *= CFG.MAX_SPEED / spd; }

      if (p.isDebris) {
        // Spin the rock
        if (p.spin !== undefined) p.rotation = (p.rotation ?? 0) + p.spin;
        // No wrapping — simulate off-screen; remove only if truly escaped
        const rx = p.x - w / 2, ry = p.y - h / 2;
        if (p.absorbed || Math.sqrt(rx * rx + ry * ry) > escapeR) {
          particles.splice(i, 1); i--;
        }
      } else if (p.absorbed) {
        particles[i] = spawnParticle(wells, w, h);
      } else {
        const rx = p.x - w / 2, ry = p.y - h / 2;
        if (Math.sqrt(rx * rx + ry * ry) > escapeR) {
          particles[i] = spawnParticle(wells, w, h);
        }
      }
    }
  }, [spawnParticle, accelAt]);

  // ─── Physics step (satellites) ──────────────────────────────────────────────
  const stepSatellites = useCallback((
    satellites: Satellite[], wells: GravityWell[],
    particles: Particle[], flashes: Flash[],
    w: number, h: number, now: number
  ) => {
    const persistMode = noFadeRef.current;
    const escapeR = Math.max(w, h) * CFG.ESCAPE_RADIUS_MULT;

    for (let i = satellites.length - 1; i >= 0; i--) {
      const sat = satellites[i];
      sat.rotation += sat.spin;   // slow tumble each frame
      // RK4 integration — conserves orbital energy, eliminates attractor orbit
      const accel = (px: number, py: number): [number, number] => {
        let afx = 0, afy = 0;
        for (const well of wells) {
          if (well.isMouse && !mouseRef.current.active) continue;
          let mass = well.mass;
          if (!persistMode && !well.isPermanent && !well.isMouse && well.createdAt !== undefined) {
            const wt = Math.min((now - well.createdAt) / (well.lifetime ?? CFG.CLICK_LIFETIME_MS), 1);
            mass = well.mass * (1 - wt * wt);
          }
          if (Math.abs(mass) < 10) continue;
          const wdx = well.x - px, wdy = well.y - py;
          const distSq = wdx * wdx + wdy * wdy + CFG.SOFTENING_SQ;
          const dist = Math.sqrt(distSq);
          const s = (CFG.G * mass) / distSq;
          afx += (s * wdx) / dist;
          afy += (s * wdy) / dist;
        }
        return [afx, afy];
      };

      const [ax1, ay1] = accel(sat.x, sat.y);
      const vx1 = sat.vx, vy1 = sat.vy;

      const [ax2, ay2] = accel(sat.x + vx1 * 0.5, sat.y + vy1 * 0.5);
      const vx2 = sat.vx + ax1 * 0.5, vy2 = sat.vy + ay1 * 0.5;

      const [ax3, ay3] = accel(sat.x + vx2 * 0.5, sat.y + vy2 * 0.5);
      const vx3 = sat.vx + ax2 * 0.5, vy3 = sat.vy + ay2 * 0.5;

      const [ax4, ay4] = accel(sat.x + vx3, sat.y + vy3);
      const vx4 = sat.vx + ax3, vy4 = sat.vy + ay3;

      sat.x  += (vx1 + 2 * vx2 + 2 * vx3 + vx4) / 6;
      sat.y  += (vy1 + 2 * vy2 + 2 * vy3 + vy4) / 6;
      sat.vx += (ax1 + 2 * ax2 + 2 * ax3 + ax4) / 6;
      sat.vy += (ay1 + 2 * ay2 + 2 * ay3 + ay4) / 6;

      // No wrapping — simulate off-screen; remove if truly escaped
      const srx = sat.x - w / 2, sry = sat.y - h / 2;
      if (Math.sqrt(srx * srx + sry * sry) > escapeR) {
        satellites.splice(i, 1);
        continue;
      }

      // Collision: debris particle hits satellite
      let hit = false;
      for (const p of particles) {
        if (!p.isDebris) continue;
        const dx = p.x - sat.x, dy = p.y - sat.y;
        const threshold = CFG.SAT_COLLISION_R + p.size;
        if (dx * dx + dy * dy < threshold * threshold) { hit = true; break; }
      }

      // Collision: satellite hits another satellite
      if (!hit) {
        for (let j = 0; j < satellites.length; j++) {
          if (j === i) continue;
          const other = satellites[j];
          const dx = other.x - sat.x, dy = other.y - sat.y;
          const threshold = CFG.SAT_COLLISION_R * 2;
          if (dx * dx + dy * dy < threshold * threshold) { hit = true; break; }
        }
      }

      if (hit) {
        const n = CFG.SAT_EXPLOSION_N;
        for (let j = 0; j < n; j++) {
          const angle = (j / n) * Math.PI * 2 + Math.random() * 0.4;
          const s2    = 0.5 + Math.random() * 3.2;
          const seed  = Math.random();
          particles.push({
            x: sat.x + (Math.random() - 0.5) * 8,
            y: sat.y + (Math.random() - 0.5) * 8,
            vx: sat.vx + Math.cos(angle) * s2,
            vy: sat.vy + Math.sin(angle) * s2,
            size:  CFG.DEBRIS_SIZE_MIN + Math.random() * (CFG.DEBRIS_SIZE_MAX - CFG.DEBRIS_SIZE_MIN),
            alpha: 0.55 + Math.random() * 0.45,
            isDebris: true,
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.06,
            seed,
          });
        }
        flashes.push({ x: sat.x, y: sat.y, createdAt: now, duration: 800, color: "252,200,60" });
        satellites.splice(i, 1);
      }
    }
  }, []);

  // ─── Grid render ────────────────────────────────────────────────────────────
  const renderGrid = useCallback((
    ctx: CanvasRenderingContext2D, wells: GravityWell[], w: number, h: number, now: number
  ) => {
    const persistMode = noFadeRef.current;
    const sp   = CFG.GRID_SPACING;
    const cols = Math.ceil(w / sp) + 1;
    const rows = Math.ceil(h / sp) + 1;
    const pts  = new Float32Array(cols * rows * 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const gx = col * sp, gy = row * sp;
        let dx = 0, dy = 0;

        for (const well of wells) {
          if (well.isMouse && !mouseRef.current.active) continue;
          let mass = well.mass;
          if (!persistMode && !well.isPermanent && !well.isMouse && well.createdAt !== undefined) {
            const t = Math.min((now - well.createdAt) / (well.lifetime ?? CFG.CLICK_LIFETIME_MS), 1);
            mass = well.mass * (1 - t * t);
          }
          if (Math.abs(mass) < 100) continue;

          const ex = well.x - gx, ey = well.y - gy;
          const distSq = ex * ex + ey * ey + 4000;
          const dist   = Math.sqrt(distSq);
          const pull   = (Math.abs(mass) / 14000) * CFG.GRID_MAX_DISPLACE / (distSq / 10000 + 1);
          const sign   = mass < 0 ? -1 : 1;
          dx += sign * (ex / dist) * pull;
          dy += sign * (ey / dist) * pull;
        }

        const idx = (row * cols + col) * 2;
        pts[idx] = gx + dx; pts[idx + 1] = gy + dy;
      }
    }

    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${CFG.GRID_ALPHA})`;
    ctx.lineWidth = 0.5;

    // Horizontal lines — smooth quadratic bezier through displaced grid points
    for (let row = 0; row < rows; row++) {
      ctx.beginPath();
      const i0 = (row * cols) * 2;
      ctx.moveTo(pts[i0], pts[i0 + 1]);
      for (let col = 0; col < cols - 1; col++) {
        const ia = (row * cols + col) * 2;
        const ib = (row * cols + col + 1) * 2;
        const mx = (pts[ia] + pts[ib]) / 2;
        const my = (pts[ia + 1] + pts[ib + 1]) / 2;
        ctx.quadraticCurveTo(pts[ia], pts[ia + 1], mx, my);
      }
      const iLast = (row * cols + cols - 1) * 2;
      ctx.lineTo(pts[iLast], pts[iLast + 1]);
      ctx.stroke();
    }
    // Vertical lines — smooth quadratic bezier through displaced grid points
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      const i0 = col * 2;
      ctx.moveTo(pts[i0], pts[i0 + 1]);
      for (let row = 0; row < rows - 1; row++) {
        const ia = (row * cols + col) * 2;
        const ib = ((row + 1) * cols + col) * 2;
        const mx = (pts[ia] + pts[ib]) / 2;
        const my = (pts[ia + 1] + pts[ib + 1]) / 2;
        ctx.quadraticCurveTo(pts[ia], pts[ia + 1], mx, my);
      }
      const iLast = ((rows - 1) * cols + col) * 2;
      ctx.lineTo(pts[iLast], pts[iLast + 1]);
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  // ─── Frame render ───────────────────────────────────────────────────────────
  const render = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[], wells: GravityWell[], flashes: Flash[], satellites: Satellite[],
    w: number, h: number, now: number
  ) => {
    const persistMode = noFadeRef.current;

    ctx.fillStyle = `rgba(${CFG.BG_COLOR},${CFG.TRAIL_ALPHA})`;
    ctx.fillRect(0, 0, w, h);

    // Stars — drawn in screen space so they fill the viewport at any zoom level
    for (const star of starsRef.current) {
      ctx.beginPath();
      ctx.arc(star.nx * w, star.ny * h, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.a})`;
      ctx.fill();
    }

    // ── Zoom transform — all world-space content drawn inside ───────────────
    const zoom = zoomRef.current;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h / 2);

    // Helper: convert screen coord → world coord (for UI elements stored in screen space)
    const sw = (sx: number) => (sx - w / 2) / zoom + w / 2;
    const sh = (sy: number) => (sy - h / 2) / zoom + h / 2;

    renderGrid(ctx, wells, w, h, now);

    // Black hole visuals — accretion disk, photon ring, animated hot spots, relativistic jets
    for (const well of wells) {
      if (!well.isBlackHole) continue;
      const t = persistMode ? 0 : Math.min((now - (well.createdAt ?? now)) / (well.lifetime ?? CFG.BH_LIFETIME_MS), 1);
      const a = 1 - t * t;
      if (a < 0.01) continue;

      const EH = well.eventHorizon ?? CFG.BH_EVENT_HORIZON;
      const cx = well.x, cy = well.y;
      const jitter = Math.sin(now * 0.007) * 0.8 + Math.cos(now * 0.0113) * 0.5;

      ctx.save();

      // ── Relativistic jets (narrow violet beams from poles) ──────────────────
      for (const sign of ([-1, 1] as const)) {
        const jetLen = EH * 7;
        const jg = ctx.createLinearGradient(cx, cy, cx, cy + sign * jetLen);
        jg.addColorStop(0,    `rgba(210,170,255,${0.5 * a})`);
        jg.addColorStop(0.25, `rgba(167,100,255,${0.22 * a})`);
        jg.addColorStop(1,    `rgba(120,50,220,0)`);
        ctx.fillStyle = jg;
        ctx.beginPath();
        const hw = EH * 0.3;
        ctx.moveTo(cx - hw, cy);
        ctx.lineTo(cx, cy + sign * jetLen);
        ctx.lineTo(cx + hw, cy);
        ctx.closePath();
        ctx.fill();
      }

      // ── Accretion disk (foreshortened ellipse — tilted ring effect) ─────────
      const diskOuter = EH * 3.2;
      const diskInner = EH * 1.18;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.26);

      // Outer diffuse glow
      const outerGlow = ctx.createRadialGradient(0, 0, diskInner, 0, 0, diskOuter * 1.8);
      outerGlow.addColorStop(0,   `rgba(255,160,60,${0.14 * a})`);
      outerGlow.addColorStop(0.6, `rgba(200,80,10,${0.05 * a})`);
      outerGlow.addColorStop(1,   `rgba(150,30,0,0)`);
      ctx.beginPath();
      ctx.arc(0, 0, diskOuter * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Main disk annulus (outer clockwise + inner counter-clockwise = donut)
      const diskGrd = ctx.createRadialGradient(0, 0, diskInner, 0, 0, diskOuter);
      diskGrd.addColorStop(0,    `rgba(255,245,190,${0.95 * a})`);
      diskGrd.addColorStop(0.18, `rgba(255,190,70,${0.88 * a})`);
      diskGrd.addColorStop(0.45, `rgba(240,100,20,${0.65 * a})`);
      diskGrd.addColorStop(0.75, `rgba(160,40,0,${0.35 * a})`);
      diskGrd.addColorStop(1,    `rgba(60,8,0,0)`);
      ctx.beginPath();
      ctx.arc(0, 0, diskOuter, 0, Math.PI * 2);
      ctx.arc(0, 0, diskInner, 0, Math.PI * 2, true);
      ctx.fillStyle = diskGrd;
      ctx.fill();

      // Hot spots — bright plasma clumps orbiting at different angular velocities
      for (let hs = 0; hs < 5; hs++) {
        const ang = (hs / 5) * Math.PI * 2 + now * (0.00042 + hs * 0.00019) + jitter * 0.04;
        const r   = diskInner + (diskOuter - diskInner) * (0.18 + (hs % 3) * 0.3);
        const hx  = Math.cos(ang) * r;
        const hy  = Math.sin(ang) * r;
        const hr  = EH * (0.28 + (hs & 1) * 0.18);
        const hg  = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr * 1.6);
        hg.addColorStop(0,   `rgba(255,255,220,${0.9 * a})`);
        hg.addColorStop(0.4, `rgba(255,210,80,${0.55 * a})`);
        hg.addColorStop(1,   `rgba(255,100,0,0)`);
        ctx.beginPath();
        ctx.arc(hx, hy, hr * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      ctx.restore(); // undo scale

      // ── Event horizon (pure black void) ────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, EH, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${CFG.BG_COLOR})`;
      ctx.fill();

      // ── Photon ring — thin bright ring at 1.08× event horizon ──────────────
      const prA = 0.65 + Math.sin(now * 0.008 + jitter * 0.3) * 0.12;
      ctx.beginPath();
      ctx.arc(cx, cy, EH * 1.08, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,245,200,${prA * a})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // ── Gravitational lensing glow ──────────────────────────────────────────
      const lensGrd = ctx.createRadialGradient(cx, cy, EH, cx, cy, EH * 2.8);
      lensGrd.addColorStop(0,    `rgba(167,139,250,${0.5 * a})`);
      lensGrd.addColorStop(0.35, `rgba(139,92,246,${0.18 * a})`);
      lensGrd.addColorStop(1,    `rgba(100,50,200,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, EH * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = lensGrd;
      ctx.fill();

      ctx.restore();
    }

    // Gravity well visuals — pulsing gravitational wave rings
    for (const well of wells) {
      if (well.isMouse || well.isBlackHole) continue;
      const t = persistMode ? 0 : Math.min((now - (well.createdAt ?? now)) / (well.lifetime ?? CFG.CLICK_LIFETIME_MS), 1);
      const col = well.mass < 0 ? "52,211,153" : CFG.ACCENT_COLOR;
      const baseA = well.isPermanent ? 0.9 : (1 - t);
      if (baseA < 0.01) continue;

      ctx.save();

      // Core dot
      ctx.beginPath();
      ctx.arc(well.x, well.y, well.isPermanent ? 3.5 : (2.5 + t * 1.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${baseA * 0.6})`;
      ctx.fill();

      // Three staggered gravitational wave rings continuously expanding outward
      const ringCycle = (now * 0.001) % 1;
      for (let ri = 0; ri < 3; ri++) {
        const rp = (ringCycle + ri / 3) % 1;
        const rr = rp * 75;
        const ra = baseA * 0.3 * (1 - rp);
        if (ra < 0.01) continue;
        ctx.beginPath();
        ctx.arc(well.x, well.y, rr + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},${ra})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // Transient decay ring (fades as well expires)
      if (!well.isPermanent) {
        ctx.beginPath();
        ctx.arc(well.x, well.y, t * 70 + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},${(1 - t) * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    }

    // Absorption / explosion flashes
    for (const f of flashes) {
      const t = (now - f.createdAt) / f.duration;
      if (t >= 1) continue;
      ctx.beginPath();
      ctx.arc(f.x, f.y, t * 18, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${f.color ?? "167,139,250"},${(1 - t) * 0.9})`;
      ctx.fill();
    }

    // Hold charging ring (not in debris/satellite mode — uses drag arrow instead)
    if (holdRef.current && toolRef.current !== "debris" && toolRef.current !== "satellite") {
      const held = Math.min((now - holdRef.current.start) / CFG.MAX_HOLD_MS, 1);
      const col  = toolRef.current === "blackhole" ? "167,139,250"
                 : toolRef.current === "repulsor"  ? "52,211,153"
                 : CFG.ACCENT_COLOR;
      const hx = sw(holdRef.current.x), hy = sh(holdRef.current.y);
      ctx.beginPath();
      ctx.arc(hx, hy, 6 + held * 42, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${col},${0.15 + held * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hx, hy, 3 + held * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${0.4 + held * 0.55})`;
      ctx.fill();
    }

    // Velocity drag arrow (debris + satellite tools)
    const drag = debrisDragRef.current;
    if (drag && (toolRef.current === "debris" || toolRef.current === "satellite")) {
      const wsx = sw(drag.sx), wsy = sh(drag.sy);
      const wex = sw(drag.ex), wey = sh(drag.ey);
      const dvx = wex - wsx, dvy = wey - wsy;
      const len = Math.sqrt(dvx * dvx + dvy * dvy);
      const col = toolRef.current === "satellite" ? "252,211,77" : "96,165,250";

      ctx.beginPath();
      ctx.arc(wsx, wsy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},0.7)`;
      ctx.fill();

      if (len > 4) {
        const nx = dvx / len, ny = dvy / len;

        ctx.save();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = `rgba(${col},0.55)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(wsx, wsy);
        ctx.lineTo(wex, wey);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(wex, wey);
        ctx.lineTo(wex - nx * 10 + ny * 5, wey - ny * 10 - nx * 5);
        ctx.lineTo(wex - nx * 10 - ny * 5, wey - ny * 10 + nx * 5);
        ctx.closePath();
        ctx.fillStyle = `rgba(${col},0.7)`;
        ctx.fill();
        ctx.restore();

        const speed = ((drag.ex - drag.sx) / CFG.DRAG_SCALE / zoom).toFixed(2);
        ctx.font = `${11 / zoom}px monospace`;
        ctx.fillStyle = `rgba(${col},0.8)`;
        ctx.fillText(`v = ${speed} px/f`, wex + 12, wey - 6);
      }
    }

    // Satellites — drawn as proper mechanical spacecraft
    for (const sat of satellites) {
      ctx.save();
      ctx.translate(sat.x, sat.y);
      ctx.rotate(sat.rotation);

      // ── Body ──────────────────────────────────────────────────────────────
      // Main bus: silver-gray rectangular box with top-lit gradient
      const bodyGrd = ctx.createLinearGradient(0, -5, 0, 5);
      bodyGrd.addColorStop(0,   "rgba(210,218,225,0.97)");
      bodyGrd.addColorStop(0.45,"rgba(148,158,168,0.97)");
      bodyGrd.addColorStop(1,   "rgba(75,85,95,0.97)");
      ctx.fillStyle = bodyGrd;
      ctx.fillRect(-8, -5, 16, 10);

      // Body edge — bright top, dark bottom
      ctx.strokeStyle = "rgba(235,242,248,0.7)";
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(-8,-5); ctx.lineTo(8,-5); ctx.stroke();
      ctx.strokeStyle = "rgba(40,50,60,0.7)";
      ctx.beginPath(); ctx.moveTo(-8,5); ctx.lineTo(8,5); ctx.stroke();
      ctx.strokeStyle = "rgba(130,140,150,0.5)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-8, -5, 16, 10);

      // Sensor/aperture window (center)
      ctx.fillStyle = "rgba(80,170,255,0.9)";
      ctx.fillRect(-2.5, -2.5, 5, 5);
      ctx.strokeStyle = "rgba(160,220,255,0.6)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-2.5, -2.5, 5, 5);

      // Thruster nozzle (right end)
      ctx.fillStyle = "rgba(55,62,70,0.9)";
      ctx.fillRect(8, -2, 3, 4);
      ctx.fillStyle = "rgba(200,120,40,0.4)";
      ctx.fillRect(10.5, -1.2, 1.5, 2.4); // subtle exhaust glow hint

      // ── Solar panels ──────────────────────────────────────────────────────
      // Two panels extend from top and bottom, connected by struts
      for (const side of [-1, 1] as const) {
        const py = side * (5 + 2);   // panel Y offset from body edge
        const ph = 6, pw = 22;       // panel height and width
        const px = -pw / 2;

        // Panel backing frame
        ctx.fillStyle = "rgba(18,28,50,0.95)";
        ctx.fillRect(px, py * 1 + (side === -1 ? -ph : 0), pw, ph);

        // Cell rows and columns
        const cols = 4, rows = 2;
        const cellW = pw / cols, cellH = ph / rows;
        for (let ci = 0; ci < cols; ci++) {
          for (let ri = 0; ri < rows; ri++) {
            const cx = px + ci * cellW + 0.5;
            const cy = py * 1 + (side === -1 ? -ph : 0) + ri * cellH + 0.5;
            // Cell body — slight blue with thin gradient
            const cellGrd = ctx.createLinearGradient(cx, cy, cx, cy + cellH - 1);
            cellGrd.addColorStop(0, "rgba(35,80,180,0.85)");
            cellGrd.addColorStop(1, "rgba(20,55,130,0.85)");
            ctx.fillStyle = cellGrd;
            ctx.fillRect(cx, cy, cellW - 1, cellH - 1);
          }
        }

        // Grid lines over cells
        ctx.strokeStyle = "rgba(80,140,220,0.35)";
        ctx.lineWidth = 0.4;
        for (let ci = 1; ci < cols; ci++) {
          const lx = px + ci * cellW;
          const ly = py * 1 + (side === -1 ? -ph : 0);
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + ph); ctx.stroke();
        }
        ctx.beginPath();
        const midY = py * 1 + (side === -1 ? -ph / 2 : ph / 2);
        ctx.moveTo(px, midY); ctx.lineTo(px + pw, midY); ctx.stroke();

        // Reflection gleam on top edge of each panel
        ctx.fillStyle = "rgba(120,190,255,0.18)";
        const gleamY = py * 1 + (side === -1 ? -ph : 0);
        ctx.fillRect(px, gleamY, pw, 1.2);

        // Struts connecting panel to body
        ctx.strokeStyle = "rgba(160,170,180,0.7)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(-6, side * 5);
        ctx.lineTo(-6, side * (5 + 2));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, side * 5);
        ctx.lineTo(6, side * (5 + 2));
        ctx.stroke();
      }

      // ── Antenna ───────────────────────────────────────────────────────────
      ctx.strokeStyle = "rgba(200,208,215,0.85)";
      ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-14, -5); ctx.stroke();
      // Dish
      ctx.beginPath();
      ctx.arc(-14, -5, 3, Math.PI * 0.3, Math.PI * 1.1);
      ctx.strokeStyle = "rgba(200,208,215,0.65)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    // Particles — debris as rocks, background as dust dots
    for (const p of particles) {
      if (p.isDebris) {
        // ── Asteroid rock ──────────────────────────────────────────────────
        const seed = p.seed ?? 0.5;
        const r    = p.size;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation ?? 0);

        // Irregular outline using sin-based deformation — deterministic per seed
        ctx.beginPath();
        const verts = 10;
        for (let j = 0; j <= verts; j++) {
          const ang = (j / verts) * Math.PI * 2;
          const rad = r * (
            0.78
            + 0.13 * Math.sin(2.9 * ang + seed * 6.28)
            + 0.09 * Math.sin(5.2 * ang + seed * 11.1)
          );
          const px = Math.cos(ang) * rad, py = Math.sin(ang) * rad;
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Rock gradient — lit from upper-left
        const base  = 105 + Math.floor(seed * 75);      // 105–180 brightness
        const warm  = seed > 0.55 ? 12 : -8;            // warm S-type vs cool C-type
        const grd = ctx.createRadialGradient(-r * 0.35, -r * 0.3, 0, 0, 0, r * 1.15);
        grd.addColorStop(0,    `rgba(${base+55+warm},${base+50},${base+44-warm},${p.alpha})`);
        grd.addColorStop(0.55, `rgba(${base+warm},${base},${base-warm},${p.alpha})`);
        grd.addColorStop(1,    `rgba(${base-28+warm},${base-30},${base-32-warm},${p.alpha * 0.45})`);
        ctx.fillStyle = grd;
        ctx.fill();

        // Faint edge catch-light
        ctx.strokeStyle = `rgba(${base+60},${base+55},${base+50},${p.alpha * 0.25})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.restore();
      } else {
        // ── Background dust dot ────────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CFG.PARTICLE_COLOR},${p.alpha})`;
        ctx.fill();
      }
    }

    ctx.restore(); // ── End zoom transform ──────────────────────────────────
  }, [renderGrid]);

  // ─── Canvas / animation setup ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = `rgb(${CFG.BG_COLOR})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Static star field — normalized coords, redrawn each frame to survive ghost fill
    starsRef.current = Array.from({ length: CFG.STAR_COUNT }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      r:  Math.random() < 0.05 ? 1.2 + Math.random() * 0.8 : 0.3 + Math.random() * 0.55,
      a:  Math.random() < 0.05 ? 0.65 + Math.random() * 0.3 : 0.08 + Math.random() * 0.3,
    }));

    wellsRef.current = [
      { x: -9999, y: -9999, mass: CFG.MOUSE_MASS, isMouse: true },
    ];

    const count = window.innerWidth < 768 ? CFG.PARTICLE_COUNT_MOBILE : CFG.PARTICLE_COUNT_DESKTOP;
    particlesRef.current = Array.from({ length: count }, () =>
      spawnParticle(wellsRef.current, W(), H())
    );

    if (reducedMotion) {
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CFG.PARTICLE_COLOR},${p.alpha * 0.3})`;
        ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    let lastTime = performance.now();
    const loop = (now: number) => {
      Math.min(now - lastTime, 50);
      lastTime = now;

      const mw = wellsRef.current.find(w => w.isMouse);
      if (mw) {
        const z = zoomRef.current, ww = W(), wh = H();
        mw.x = (mouseRef.current.x - ww / 2) / z + ww / 2;
        mw.y = (mouseRef.current.y - wh / 2) / z + wh / 2;
      }

      wellsRef.current = wellsRef.current.filter(well => {
        if (well.isPermanent || well.isMouse) return true;
        if (noFadeRef.current) return true;
        return now - (well.createdAt ?? 0) < (well.lifetime ?? CFG.CLICK_LIFETIME_MS);
      });
      flashesRef.current = flashesRef.current.filter(f => now - f.createdAt < f.duration);

      step(particlesRef.current, wellsRef.current, flashesRef.current, W(), H(), now);
      stepSatellites(satellitesRef.current, wellsRef.current, particlesRef.current, flashesRef.current, W(), H(), now);
      render(ctx, particlesRef.current, wellsRef.current, flashesRef.current, satellitesRef.current, W(), H(), now);
      setZoomPct(Math.round(zoomRef.current * 100));

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [spawnParticle, step, stepSatellites, render]);

  // ─── Window-level mouse handlers ─────────────────────────────────────────────
  useEffect(() => {
    const isInteractive = (e: MouseEvent) =>
      !!(e.target as HTMLElement)?.closest?.(INTERACTIVE_SEL);

    // Convert screen pixel coords → world coords (accounting for current zoom)
    const toWorld = (sx: number, sy: number): [number, number] => {
      const z = zoomRef.current;
      const ww = window.innerWidth, wh = window.innerHeight;
      return [(sx - ww / 2) / z + ww / 2, (sy - wh / 2) / z + wh / 2];
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (holdRef.current)       { holdRef.current.x = e.clientX; holdRef.current.y = e.clientY; }
      if (debrisDragRef.current) { debrisDragRef.current.ex = e.clientX; debrisDragRef.current.ey = e.clientY; }
    };

    const onLeave = () => { mouseRef.current.active = false; };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0 || isInteractive(e)) return;
      if (toolRef.current === "debris" || toolRef.current === "satellite") {
        debrisDragRef.current = { sx: e.clientX, sy: e.clientY, ex: e.clientX, ey: e.clientY };
      } else {
        holdRef.current = { start: performance.now(), x: e.clientX, y: e.clientY };
      }
    };

    const onUp = (e: MouseEvent) => {
      if (e.button !== 0) return;

      // ── Satellite ────────────────────────────────────────────────────────────
      if (toolRef.current === "satellite" && debrisDragRef.current) {
        const { sx, sy, ex, ey } = debrisDragRef.current;
        debrisDragRef.current = null;
        const [wx, wy] = toWorld(sx, sy);
        const z = zoomRef.current;
        satellitesRef.current.push({
          x: wx, y: wy,
          vx: (ex - sx) / CFG.DRAG_SCALE / z,
          vy: (ey - sy) / CFG.DRAG_SCALE / z,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.006,
        });
        return;
      }

      // ── Debris ──────────────────────────────────────────────────────────────
      if (toolRef.current === "debris" && debrisDragRef.current) {
        const { sx, sy, ex, ey } = debrisDragRef.current;
        debrisDragRef.current = null;
        const [wx, wy] = toWorld(sx, sy);
        const z = zoomRef.current;
        const dvx = (ex - sx) / CFG.DRAG_SCALE / z;
        const dvy = (ey - sy) / CFG.DRAG_SCALE / z;
        const isDragged = Math.sqrt(dvx * dvx + dvy * dvy) > 0.08;
        const n    = debrisCountRef.current;
        const sScl = debrisSizeRef.current;
        const sMin = CFG.DEBRIS_SIZE_MIN * sScl;
        const sMax = CFG.DEBRIS_SIZE_MAX * sScl;

        for (let i = 0; i < n; i++) {
          const angle     = (i / n) * Math.PI * 2 + Math.random() * 0.5;
          const spreadSpd = isDragged
            ? 0.08 + Math.random() * 0.35
            : 0.4  + Math.random() * 3.5;
          particlesRef.current.push({
            x: wx + (Math.random() - 0.5) * 6,
            y: wy + (Math.random() - 0.5) * 6,
            vx: dvx + Math.cos(angle) * spreadSpd,
            vy: dvy + Math.sin(angle) * spreadSpd,
            size:     sMin + Math.random() * (sMax - sMin),
            alpha:    0.55 + Math.random() * 0.4,
            isDebris: true,
            rotation: Math.random() * Math.PI * 2,
            spin:     (Math.random() - 0.5) * 0.055,
            seed:     Math.random(),
          });
        }
        const max = window.innerWidth < 768
          ? CFG.PARTICLE_COUNT_MOBILE + 100
          : CFG.PARTICLE_COUNT_DESKTOP + 200;
        if (particlesRef.current.length > max)
          particlesRef.current.splice(0, particlesRef.current.length - max);
        return;
      }

      // ── Other tools ─────────────────────────────────────────────────────────
      if (!holdRef.current) return;
      const heldMs = performance.now() - holdRef.current.start;
      const [wx, wy] = toWorld(holdRef.current.x, holdRef.current.y);
      holdRef.current = null;

      const ratio = Math.min(heldMs / CFG.MAX_HOLD_MS, 1);
      const t = toolRef.current;
      const now = performance.now();

      if (t === "gravity") {
        const mass = CFG.BASE_CLICK_MASS * (1 + ratio * (CFG.MAX_HOLD_MASS_MULT - 1));
        wellsRef.current.push({ x: wx, y: wy, mass, createdAt: now, lifetime: CFG.CLICK_LIFETIME_MS });
      } else if (t === "blackhole") {
        const mass = CFG.BASE_CLICK_MASS * CFG.BH_MASS_MULT * (0.5 + ratio * 0.5);
        const eventHorizon = CFG.BH_EVENT_HORIZON * (0.55 + ratio * 0.9);
        wellsRef.current.push({ x: wx, y: wy, mass, isBlackHole: true, eventHorizon, createdAt: now, lifetime: CFG.BH_LIFETIME_MS });
      } else if (t === "repulsor") {
        const mass = -CFG.BASE_CLICK_MASS * Math.abs(CFG.BH_MASS_MULT) * (0.4 + ratio * 0.6);
        wellsRef.current.push({ x: wx, y: wy, mass, createdAt: now, lifetime: CFG.REPULSOR_LIFETIME_MS });
      }
    };

    const onCtx = (e: MouseEvent) => {
      if (isInteractive(e)) return;
      e.preventDefault();
      holdRef.current = null;
      debrisDragRef.current = null;
      const [wx, wy] = toWorld(e.clientX, e.clientY);
      wellsRef.current.push({
        x: wx, y: wy,
        mass: -CFG.BASE_CLICK_MASS * 1.4,
        createdAt: performance.now(),
        lifetime: CFG.REPULSOR_LIFETIME_MS,
      });
    };

    // Ctrl/Cmd + scroll to zoom — plain scroll is left for page scrolling
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;  // pass through if no modifier
      if (isInteractive(e as unknown as MouseEvent)) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.88 : 1 / 0.88;
      zoomRef.current = Math.max(0.1, Math.min(1, zoomRef.current * factor));
    };

    window.addEventListener("mousemove",   onMove,  { passive: true });
    window.addEventListener("mouseleave",  onLeave, { passive: true });
    window.addEventListener("mousedown",   onDown);
    window.addEventListener("mouseup",     onUp);
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("wheel",       onWheel, { passive: false });

    return () => {
      window.removeEventListener("mousemove",   onMove);
      window.removeEventListener("mouseleave",  onLeave);
      window.removeEventListener("mousedown",   onDown);
      window.removeEventListener("mouseup",     onUp);
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("wheel",       onWheel);
    };
  }, []);

  const activeTool = TOOLS.find(t => t.id === tool)!;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0, display: "block", pointerEvents: "none" }}
        aria-hidden="true"
      />

      {/* Toolbar — hidden on mobile, simulation controls don't work on touch */}
      <div
        className="hidden sm:flex fixed left-1/2 -translate-x-1/2 z-50 flex-col items-center gap-1.5"
        style={{ top: "72px" }}
      >
        {/* Tool pills + persist */}
        <div
          className="flex items-center gap-1 p-1 rounded-full"
          style={{
            background: "rgba(7,8,12,0.82)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          {TOOLS.map(t => (
            <button
              key={t.id}
              id={`toolbar-btn-${t.id}`}
              onClick={() => setTool(t.id)}
              title={t.label}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 13px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.72rem",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                letterSpacing: "0.03em",
                transition: "background 0.18s, color 0.18s, outline 0.18s",
                background: tool === t.id ? `${t.color}20` : "transparent",
                color:      tool === t.id ? t.color : "rgba(255,255,255,0.32)",
                outline:    tool === t.id ? `1px solid ${t.color}50` : "1px solid transparent",
              }}
            >
              <ToolIcon id={t.id} color={tool === t.id ? t.color : "rgba(255,255,255,0.22)"} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 3px", flexShrink: 0 }} />

          <label style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 11px",
            cursor: "pointer",
            fontSize: "0.72rem",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "0.03em",
            color: noFade ? "#DFA070" : "rgba(255,255,255,0.32)",
            userSelect: "none",
            borderRadius: "999px",
            transition: "color 0.18s",
          }}>
            <input
              type="checkbox"
              checked={noFade}
              onChange={e => setNoFade(e.target.checked)}
              style={{ accentColor: "#C8865A", width: 11, height: 11, cursor: "pointer" }}
            />
            <span className="hidden sm:inline">Persist</span>
          </label>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 3px", flexShrink: 0 }} />

          {/* Zoom level — shows current zoom, click to reset */}
          {zoomPct < 100 && (
            <button
              onClick={() => { zoomRef.current = 1; setZoomPct(100); }}
              title="Reset zoom (Ctrl+scroll to zoom)"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "5px 9px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.45)",
                transition: "color 0.18s, background 0.18s",
                flexShrink: 0,
              }}
              className="hover-light"
            >
              {zoomPct}%
            </button>
          )}

          {/* Standalone simulation link */}
          <a
            href="/simulation"
            target="_blank"
            rel="noopener noreferrer"
            title="Open simulation standalone"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              letterSpacing: "0.03em",
              color: "rgba(255,255,255,0.28)",
              textDecoration: "none",
              transition: "color 0.18s",
              flexShrink: 0,
            }}
            className="hover-light"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M1 10L10 1M10 1H4M10 1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="hidden sm:inline">Sim</span>
          </a>
        </div>

        {/* Debris sliders — only shown when debris tool is active */}
        {tool === "debris" && (
          <div
            className="flex items-center gap-5 px-4 py-2 rounded-full"
            style={{
              background: "rgba(7,8,12,0.82)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
            }}
          >
            {[
              {
                label: "Count", min: 5, max: 150, step: 5,
                value: debrisCount, fmt: (v: number) => String(v),
                onChange: (v: number) => setDebrisCount(v),
              },
              {
                label: "Size", min: 0.5, max: 5, step: 0.1,
                value: debrisSize, fmt: (v: number) => v.toFixed(1) + "×",
                onChange: (v: number) => setDebrisSize(v),
              },
            ].map(({ label, min, max, step, value, fmt, onChange }) => (
              <label key={label} style={{
                display: "flex", alignItems: "center", gap: 7,
                fontSize: "0.68rem", color: "rgba(255,255,255,0.38)",
                fontFamily: "var(--font-display)", letterSpacing: "0.03em",
                userSelect: "none",
              }}>
                {label}
                <input
                  type="range"
                  min={min} max={max} step={step}
                  value={value}
                  onChange={e => onChange(+e.target.value)}
                  style={{ width: 88, accentColor: "#60A5FA", cursor: "pointer" }}
                />
                <span style={{ color: "#60A5FA", minWidth: 32, fontSize: "0.7rem", fontWeight: 600 }}>
                  {fmt(value)}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Hint */}
        <div style={{
          fontSize: "0.63rem",
          color: "rgba(255,255,255,0.18)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.04em",
          pointerEvents: "none",
        }}>
          {activeTool.desc} &nbsp;·&nbsp; right-click repels &nbsp;·&nbsp; ctrl+scroll to zoom &nbsp;·&nbsp; G·B·D·S·R
          {noFade ? " · objects persist" : ""}
        </div>
      </div>

      {/* Help panel — hidden on mobile */}
      {/* ── Tutorial overlay ── */}
      {tutLabelVis && (
        <div
          className="hidden sm:flex items-center gap-2"
          style={{
            position: "fixed",
            top: "148px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            background: "rgba(7,8,12,0.92)",
            border: "1px solid rgba(167,139,250,0.35)",
            borderRadius: "999px",
            padding: "8px 20px",
            fontSize: "0.8rem",
            fontFamily: "var(--font-display)",
            color: "#DDD8FF",
            whiteSpace: "nowrap",
            backdropFilter: "blur(14px)",
            pointerEvents: "none",
            letterSpacing: "0.01em",
            boxShadow: "0 0 24px rgba(167,139,250,0.18)",
          }}
        >
          <span style={{ fontSize: "0.85rem" }}>✦</span>
          {tutLabel}
        </div>
      )}

      {/* Bouncing arrow indicator */}
      {tutArrowPos && (
        <div
          className="hidden sm:block"
          style={{
            position: "fixed",
            left: tutArrowPos.x,
            top: tutArrowPos.y,
            transform: "translateX(-50%)",
            zIndex: 60,
            pointerEvents: "none",
            fontSize: "18px",
            color: "#A78BFA",
            lineHeight: 1,
            animation: "tutBounce 0.75s ease-in-out infinite",
            textShadow: "0 0 12px rgba(167,139,250,0.8)",
          }}
        >
          ↑
        </div>
      )}

      {/* Fake cursor */}
      <div
        className="hidden sm:block"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          zIndex: 70,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            transform: `translate(${tutCursorPos.x - 4}px, ${tutCursorPos.y - 2}px)`,
            opacity: tutCursorVis ? 1 : 0,
            transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          }}
        >
          <svg
            width="22"
            height="28"
            viewBox="0 0 22 28"
            fill="none"
            style={{
              transform: tutClicking ? "scale(0.82)" : "scale(1)",
              transition: "transform 0.12s ease",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
            }}
          >
            <path
              d="M4 2L4 22L8.5 17.5L12 25L15 23.5L11.5 16L18 16Z"
              fill="white"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {tutClicking && (
            <div style={{
              position: "absolute",
              top: 4,
              left: 4,
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "2px solid rgba(167,139,250,0.7)",
              animation: "fadeIn 0.15s ease",
            }} />
          )}
        </div>
      </div>

      {showHelp ? (
        <div data-no-sim className="hidden sm:block fixed z-50" style={{ bottom: 28, right: 28 }}>
          <div style={{
            width: 228,
            background: "rgba(7,8,12,0.88)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 12,
            backdropFilter: "blur(18px)",
            padding: "14px 16px 12px",
            fontFamily: "var(--font-display)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                Simulation
              </span>
              <button
                onClick={() => setShowHelp(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", fontSize: 14, lineHeight: 1, padding: "0 2px" }}
              >×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 13 }}>
              {[
                { key: "G", color: "#C8865A", label: "Gravity Well", tip: "Hold longer → stronger" },
                { key: "B", color: "#A78BFA", label: "Black Hole",   tip: "Absorbs particles" },
                { key: "D", color: "#60A5FA", label: "Debris",       tip: "Drag to set velocity · sliders above" },
                { key: "S", color: "#FCD34D", label: "Satellite",    tip: "Drag to launch · debris = explodes" },
                { key: "R", color: "#34D399", label: "Repulsor",     tip: "Negative gravity" },
              ].map(({ key, color, label, tip }) => (
                <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 4,
                    fontSize: "0.62rem", fontWeight: 700, color, flexShrink: 0, marginTop: 1,
                  }}>{key}</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.28)", lineHeight: 1.3, marginTop: 1 }}>{tip}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(96,165,250,0.06)",
              border: "1px solid rgba(96,165,250,0.15)",
              borderRadius: 8,
              padding: "9px 10px",
              marginBottom: 10,
            }}>
              <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "#60A5FA", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                How to orbit
              </div>
              {[
                "Press G, hold-click to place a well",
                "Tick Persist so it doesn't fade",
                "Press D, drag from your spawn point",
                "Drag perpendicular to the well",
                "Release — debris will orbit",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.6rem", color: "#60A5FA", opacity: 0.55, minWidth: 10, marginTop: 1 }}>{i + 1}.</span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.35 }}>{s}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: "0.61rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.55 }}>
              Right-click anywhere to repel.<br />
              Debris wraps at screen edges.
            </div>
          </div>
        </div>
      ) : (
        <button
          data-no-sim
          onClick={() => setShowHelp(true)}
          className="hidden sm:flex fixed z-50"
          style={{
            bottom: 28, right: 28,
            width: 32, height: 32,
            background: "rgba(7,8,12,0.82)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "50%",
            cursor: "pointer",
            color: "rgba(255,255,255,0.35)",
            fontSize: 14,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(14px)",
          }}
          title="Show simulation help"
        >?</button>
      )}
    </>
  );
}

// ─── Tool icons ───────────────────────────────────────────────────────────────
function ToolIcon({ id, color }: { id: ToolId; color: string }) {
  const s = { width: 12, height: 12 } as const;

  if (id === "gravity") return (
    <svg {...s} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2" fill={color} />
      <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="1" strokeDasharray="2 1.5" />
    </svg>
  );
  if (id === "blackhole") return (
    <svg {...s} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2.8" fill={color} fillOpacity="0.18" />
      <circle cx="6" cy="6" r="2.8" stroke={color} strokeWidth="1.5" />
      <circle cx="6" cy="6" r="5.4" stroke={color} strokeWidth="0.5" strokeOpacity="0.45" />
    </svg>
  );
  if (id === "debris") return (
    <svg {...s} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      {([[6,1],[11,6],[6,11],[1,6],[9.5,2.5],[9.5,9.5],[2.5,9.5],[2.5,2.5]] as [number,number][])
        .map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="0.9" fill={color} fillOpacity={i < 4 ? 1 : 0.5} />)}
    </svg>
  );
  if (id === "satellite") return (
    <svg {...s} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      {/* Body */}
      <rect x="4.5" y="3.5" width="3" height="5" fill={color} />
      {/* Solar panels */}
      <rect x="0.5" y="5" width="3" height="2" fill={color} fillOpacity="0.7" />
      <rect x="8.5" y="5" width="3" height="2" fill={color} fillOpacity="0.7" />
      {/* Antenna */}
      <line x1="6" y1="3.5" x2="6" y2="1.5" stroke={color} strokeWidth="0.8" />
      <circle cx="6" cy="1" r="0.8" stroke={color} strokeWidth="0.6" />
    </svg>
  );
  // repulsor
  return (
    <svg {...s} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2" fill={color} />
      <line x1="6" y1="0.5" x2="6" y2="3.2"  stroke={color} strokeWidth="1.2" />
      <line x1="6" y1="8.8" x2="6" y2="11.5" stroke={color} strokeWidth="1.2" />
      <line x1="0.5" y1="6" x2="3.2" y2="6"  stroke={color} strokeWidth="1.2" />
      <line x1="8.8" y1="6" x2="11.5" y2="6" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
