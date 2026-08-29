'use client';

import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { useMotionPreference } from './hooks/use-motion-preference';

export interface PcampusLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rendered size in px (square). Default 120. */
  size?: number;
  /** Stroke color (any CSS color). Default '#ffffff'. */
  color?: string;
  /** Duration of the line "draw-on", ms. Default 4000. */
  drawMs?: number;
  /** Duration of one shine sweep, ms. Default 1500. */
  shineMs?: number;
  /** Number of shine sweeps before it re-draws. Default 2. */
  sweeps?: number;
}

// --- Logo geometry (unit space, centre 0,0 in a 340 design box) ---
const RBODY = 92; // central disk radius (arms reach ~ head level)
const HD = 94; // head centre distance
const HR = 31; // head radius
const RP = 46; // punch radius (concentric with head) → gap = RP - HR
const BOX = 340;
const CARD = [-90, 0, 90, 180]; // N, E, S, W
const TAU = Math.PI * 2;
const D2R = Math.PI / 180;

type Stroke = { pts: [number, number][]; seg: number[]; len: number };

// Body contour by radial sampling: r(θ) = min(disk, nearest carved head arc).
function bodyRadius(thDeg: number): number {
  let r = RBODY;
  for (const c of CARD) {
    const b = HD * Math.cos((thDeg - c) * D2R);
    const disc = b * b - (HD * HD - RP * RP);
    if (disc < 0) continue;
    const root = b - Math.sqrt(disc);
    if (root > 0 && root < r) r = root;
  }
  return r;
}

function buildGeometry(): { meta: Stroke[]; total: number } {
  const strokes: [number, number][][] = [];
  const body: [number, number][] = [];
  for (let i = 0; i <= 360; i++) {
    const r = bodyRadius(i);
    body.push([r * Math.cos(i * D2R), r * Math.sin(i * D2R)]);
  }
  strokes.push(body);
  for (const c of CARD) {
    const hx = Math.cos(c * D2R) * HD;
    const hy = Math.sin(c * D2R) * HD;
    const ring: [number, number][] = [];
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * TAU;
      ring.push([hx + HR * Math.cos(a), hy + HR * Math.sin(a)]);
    }
    strokes.push(ring);
  }
  let total = 0;
  const meta = strokes.map((pts) => {
    let len = 0;
    const seg = [0];
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i]!;
      const q = pts[i - 1]!;
      len += Math.hypot(p[0] - q[0], p[1] - q[1]);
      seg.push(len);
    }
    total += len;
    return { pts, seg, len };
  });
  return { meta, total };
}

const GEO = buildGeometry();

/** Canvas 2D rejects `var(--*)`. Resolve against a live element first. */
function resolveCanvasColor(specified: string, host: HTMLElement): string {
  const probe = document.createElement('span');
  probe.style.color = specified;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved && resolved !== 'rgba(0, 0, 0, 0)' ? resolved : '#ffffff';
}

/**
 * Pcampus brand loader — draws the 4-node mark as a line, then a bright band
 * sweeps diagonally across it (no glow). Loops. Respects reduced-motion.
 */
export const PcampusLoader = React.forwardRef<HTMLDivElement, PcampusLoaderProps>(
  (
    { size = 120, color = '#ffffff', drawMs = 4000, shineMs = 1500, sweeps = 2, className, style, ...rest },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const preference = useMotionPreference();
    const reduced = preference === 'reduced';

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const host = canvas.parentElement ?? canvas;
      const stroke = resolveCanvasColor(color, host);

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);

      const buildPath = (m: Stroke, reveal: number): [number, number] | null => {
        const { pts, seg, len } = m;
        if (reveal <= 0) return null;
        const p0 = pts[0]!;
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        let tip: [number, number] | null = null;
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i]!;
          const q = pts[i - 1]!;
          if (seg[i]! <= reveal) {
            ctx.lineTo(p[0], p[1]);
          } else {
            const f = (reveal - seg[i - 1]!) / (seg[i]! - seg[i - 1]!);
            tip = [q[0] + (p[0] - q[0]) * f, q[1] + (p[1] - q[1]) * f];
            ctx.lineTo(tip[0], tip[1]);
            break;
          }
        }
        if (reveal >= len) ctx.closePath();
        return reveal < len ? tip || pts[pts.length - 1]! : null;
      };

      const shineGradient = (pos: number): CanvasGradient => {
        const g = ctx.createLinearGradient(-125, -135, 135, 125);
        const w = 0.12;
        const clamp = (v: number) => Math.max(0, Math.min(1, v));
        let a = -1;
        const stop = (o: number, c: string) => {
          const next = clamp(o);
          if (next <= a) return;
          a = next;
          g.addColorStop(a, c);
        };
        stop(0, 'transparent');
        stop(pos - w, 'transparent');
        stop(pos, stroke);
        stop(pos + w, 'transparent');
        if (a < 1) stop(1, 'transparent');
        return g;
      };

      const render = (progress: number, shinePos: number | null) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.scale(size / BOX, size / BOX);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let remaining = progress >= 1 ? GEO.total + 10 : progress * GEO.total;
        let tip: [number, number] | null = null;
        for (const m of GEO.meta) {
          if (remaining <= 0) break;
          const t = buildPath(m, Math.min(remaining, m.len));
          ctx.strokeStyle = stroke;
          ctx.globalAlpha = 0.55; // dim line is the default
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
          if (t) tip = t;
          remaining -= m.len;
        }

        if (shinePos !== null) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = shineGradient(shinePos);
          ctx.lineWidth = 2.6;
          for (const m of GEO.meta) {
            buildPath(m, m.len);
            ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
        }

        if (tip) {
          ctx.beginPath();
          ctx.fillStyle = stroke;
          ctx.arc(tip[0], tip[1], 2.2, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      };

      if (reduced) {
        render(1, null);
        return;
      }

      const hold = shineMs * sweeps;
      let start = performance.now();
      let raf = 0;
      const loop = (now: number) => {
        try {
          const el = now - start;
          if (el <= drawMs) {
            render(Math.min(1, el / drawMs), null);
          } else if (el < drawMs + hold) {
            const s = ((el - drawMs) % shineMs) / shineMs;
            render(1, -0.15 + 1.3 * s);
          } else {
            start = now;
          }
        } catch {
          render(1, null);
          return;
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }, [size, color, drawMs, shineMs, sweeps, reduced]);

    return (
      <div
        ref={ref}
        className={clsx('inline-flex items-center justify-center', className)}
        style={{ width: size, height: size, ...style }}
        role="status"
        aria-label="Loading"
        {...rest}
      >
        <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />
      </div>
    );
  },
);

PcampusLoader.displayName = 'PcampusLoader';
