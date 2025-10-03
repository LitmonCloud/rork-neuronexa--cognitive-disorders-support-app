import { SkPath } from '@shopify/react-native-skia';

export type GuideKind = 'circle' | 'triangle' | 'heart' | 'spiral' | 'square' | 'star' | 'infinity';

export function guidePathSkia(target: SkPath, kind: GuideKind, w: number, h: number, inset: number) {
  const x = inset;
  const y = inset;
  const W = w - inset * 2;
  const H = h - inset * 2;
  const cx = x + W / 2;
  const cy = y + H / 2;

  if (kind === 'circle') {
    target.addCircle(cx, cy, Math.min(W, H) / 2);
    return;
  }

  if (kind === 'triangle') {
    target.moveTo(cx, y);
    target.lineTo(x, y + H);
    target.lineTo(x + W, y + H);
    target.close();
    return;
  }

  if (kind === 'heart') {
    const scale = Math.min(W, H) / 160;
    target.moveTo(cx, cy + 50 * scale);
    target.cubicTo(
      cx, cy + 20 * scale,
      cx - 50 * scale, cy - 20 * scale,
      cx - 50 * scale, cy - 10 * scale
    );
    target.cubicTo(
      cx - 50 * scale, cy - 40 * scale,
      cx - 30 * scale, cy - 50 * scale,
      cx, cy - 30 * scale
    );
    target.cubicTo(
      cx + 30 * scale, cy - 50 * scale,
      cx + 50 * scale, cy - 40 * scale,
      cx + 50 * scale, cy - 10 * scale
    );
    target.cubicTo(
      cx + 50 * scale, cy - 20 * scale,
      cx, cy + 20 * scale,
      cx, cy + 50 * scale
    );
    target.close();
    return;
  }

  if (kind === 'square') {
    const half = Math.min(W, H) / 2;
    target.addRect({
      x: cx - half,
      y: cy - half,
      width: half * 2,
      height: half * 2,
    });
    return;
  }

  if (kind === 'star') {
    const points = 5;
    const outerRadius = Math.min(W, H) / 2;
    const innerRadius = outerRadius * 0.4;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) target.moveTo(px, py);
      else target.lineTo(px, py);
    }
    target.close();
    return;
  }

  if (kind === 'infinity') {
    const w2 = Math.min(W, H) * 0.6;
    const h2 = Math.min(W, H) * 0.3;
    target.moveTo(cx - w2, cy);
    target.cubicTo(cx - w2, cy - h2, cx - w2 / 3, cy - h2, cx, cy);
    target.cubicTo(cx + w2 / 3, cy + h2, cx + w2, cy + h2, cx + w2, cy);
    target.cubicTo(cx + w2, cy - h2, cx + w2 / 3, cy - h2, cx, cy);
    target.cubicTo(cx - w2 / 3, cy + h2, cx - w2, cy + h2, cx - w2, cy);
    return;
  }

  if (kind === 'spiral') {
    const turns = 1.5;
    const steps = 420;
    const maxR = Math.min(W, H) / 2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const theta = 2 * Math.PI * turns * t;
      const r = t * maxR;
      const px = cx + r * Math.cos(theta);
      const py = cy + r * Math.sin(theta);
      if (i === 0) target.moveTo(px, py);
      else target.lineTo(px, py);
    }
    return;
  }
}

export function buildGuidePolyline(
  kind: GuideKind,
  w: number,
  h: number,
  inset: number,
  samples: number
): { x: number; y: number }[] {
  const x = inset;
  const y = inset;
  const W = w - inset * 2;
  const H = h - inset * 2;
  const cx = x + W / 2;
  const cy = y + H / 2;
  const pts: { x: number; y: number }[] = [];

  if (kind === 'circle') {
    const radius = Math.min(W, H) / 2;
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * 2 * Math.PI;
      pts.push({ x: cx + radius * Math.cos(t), y: cy + radius * Math.sin(t) });
    }
    return pts;
  }

  if (kind === 'triangle') {
    const A = { x: cx, y: y };
    const B = { x: x, y: y + H };
    const C = { x: x + W, y: y + H };
    return sampleEdges([A, B, C, A], samples);
  }

  if (kind === 'square') {
    const half = Math.min(W, H) / 2;
    const A = { x: cx - half, y: cy - half };
    const B = { x: cx + half, y: cy - half };
    const C = { x: cx + half, y: cy + half };
    const D = { x: cx - half, y: cy + half };
    return sampleEdges([A, B, C, D, A], samples);
  }

  if (kind === 'star') {
    const points = 5;
    const outerRadius = Math.min(W, H) / 2;
    const innerRadius = outerRadius * 0.4;
    const vertices: { x: number; y: number }[] = [];
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      vertices.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    vertices.push(vertices[0]);
    return sampleEdges(vertices, samples);
  }

  if (kind === 'heart') {
    const scale = Math.min(W, H) / 160;
    const edges = 40;
    for (let i = 0; i <= edges; i++) {
      const t = (i / edges) * 2 * Math.PI;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push({ x: cx + hx * scale * 5, y: cy + hy * scale * 5 });
    }
    return pts;
  }

  if (kind === 'infinity') {
    const w2 = Math.min(W, H) * 0.6;
    const h2 = Math.min(W, H) * 0.3;
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * 2 * Math.PI;
      const px = cx + w2 * Math.cos(t);
      const py = cy + (h2 * Math.sin(2 * t)) / 2;
      pts.push({ x: px, y: py });
    }
    return pts;
  }

  if (kind === 'spiral') {
    const turns = 1.5;
    const steps = samples;
    const maxR = Math.min(W, H) / 2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const theta = 2 * Math.PI * turns * t;
      const r = t * maxR;
      pts.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
    }
    return pts;
  }

  return pts;
}

function sampleEdges(vertices: { x: number; y: number }[], samples: number) {
  const pts: { x: number; y: number }[] = [];
  let totalLen = 0;
  const lens: number[] = [];
  for (let i = 1; i < vertices.length; i++) {
    const a = vertices[i - 1];
    const b = vertices[i];
    const L = Math.hypot(b.x - a.x, b.y - a.y);
    totalLen += L;
    lens.push(L);
  }
  for (let s = 0; s <= samples; s++) {
    const dist = (s / samples) * totalLen;
    let acc = 0;
    for (let i = 1; i < vertices.length; i++) {
      const segLen = lens[i - 1];
      if (dist <= acc + segLen) {
        const t = (dist - acc) / segLen;
        const a = vertices[i - 1];
        const b = vertices[i];
        pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
        break;
      }
      acc += segLen;
    }
  }
  return pts;
}
