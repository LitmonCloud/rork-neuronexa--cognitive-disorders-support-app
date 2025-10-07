import { SkPath } from '@shopify/react-native-skia';

export type GuideKind = 'circle' | 'triangle' | 'heart' | 'spiral' | 'square' | 'star' | 'infinity' | 'letter-a' | 'number-8';

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
    const scale = Math.min(W, H) / 200;
    const startY = cy + 60 * scale;
    target.moveTo(cx, startY);
    
    target.cubicTo(
      cx - 75 * scale, cy + 30 * scale,
      cx - 75 * scale, cy - 30 * scale,
      cx, cy - 50 * scale
    );
    
    target.cubicTo(
      cx + 75 * scale, cy - 30 * scale,
      cx + 75 * scale, cy + 30 * scale,
      cx, startY
    );
    
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
    const lobeWidth = Math.min(W, H) * 0.35;
    const lobeHeight = Math.min(W, H) * 0.25;
    
    target.moveTo(cx, cy);
    
    target.cubicTo(
      cx - lobeWidth * 0.3, cy - lobeHeight,
      cx - lobeWidth * 0.7, cy - lobeHeight,
      cx - lobeWidth, cy
    );
    
    target.cubicTo(
      cx - lobeWidth * 0.7, cy + lobeHeight,
      cx - lobeWidth * 0.3, cy + lobeHeight,
      cx, cy
    );
    
    target.cubicTo(
      cx + lobeWidth * 0.3, cy + lobeHeight,
      cx + lobeWidth * 0.7, cy + lobeHeight,
      cx + lobeWidth, cy
    );
    
    target.cubicTo(
      cx + lobeWidth * 0.7, cy - lobeHeight,
      cx + lobeWidth * 0.3, cy - lobeHeight,
      cx, cy
    );
    
    return;
  }

  if (kind === 'spiral') {
    const turns = 3;
    const steps = 600;
    const maxR = Math.min(W, H) / 2.2;
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

  if (kind === 'letter-a') {
    const width = Math.min(W, H) * 0.6;
    const height = Math.min(W, H) * 0.8;
    const topX = cx;
    const topY = cy - height / 2;
    const bottomLeftX = cx - width / 2;
    const bottomLeftY = cy + height / 2;
    const bottomRightX = cx + width / 2;
    const bottomRightY = cy + height / 2;
    const crossbarY = cy + height * 0.1;

    target.moveTo(topX, topY);
    target.lineTo(bottomLeftX, bottomLeftY);
    target.moveTo(topX, topY);
    target.lineTo(bottomRightX, bottomRightY);
    target.moveTo(cx - width * 0.35, crossbarY);
    target.lineTo(cx + width * 0.35, crossbarY);
    return;
  }

  if (kind === 'number-8') {
    const lobeRadius = Math.min(W, H) * 0.22;
    const topCenterY = cy - lobeRadius * 0.6;
    const bottomCenterY = cy + lobeRadius * 0.6;

    target.addCircle(cx, topCenterY, lobeRadius);
    target.addCircle(cx, bottomCenterY, lobeRadius);
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
    const scale = Math.min(W, H) / 200;
    const edges = 60;
    for (let i = 0; i <= edges; i++) {
      const t = (i / edges) * 2 * Math.PI;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push({ x: cx + hx * scale * 5, y: cy + hy * scale * 5 });
    }
    return pts;
  }

  if (kind === 'infinity') {
    const lobeWidth = Math.min(W, H) * 0.35;
    const lobeHeight = Math.min(W, H) * 0.25;
    const edges = samples;
    
    for (let i = 0; i <= edges; i++) {
      let px, py;
      
      if (i <= edges / 2) {
        const angle = (i / (edges / 2)) * 2 * Math.PI;
        px = cx - lobeWidth + lobeWidth * Math.cos(angle);
        py = cy + lobeHeight * Math.sin(angle);
      } else {
        const angle = ((i - edges / 2) / (edges / 2)) * 2 * Math.PI;
        px = cx + lobeWidth + lobeWidth * Math.cos(angle + Math.PI);
        py = cy + lobeHeight * Math.sin(angle + Math.PI);
      }
      
      pts.push({ x: px, y: py });
    }
    return pts;
  }

  if (kind === 'spiral') {
    const turns = 3;
    const steps = samples;
    const maxR = Math.min(W, H) / 2.2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const theta = 2 * Math.PI * turns * t;
      const r = t * maxR;
      pts.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
    }
    return pts;
  }

  if (kind === 'letter-a') {
    const width = Math.min(W, H) * 0.6;
    const height = Math.min(W, H) * 0.8;
    const topX = cx;
    const topY = cy - height / 2;
    const bottomLeftX = cx - width / 2;
    const bottomLeftY = cy + height / 2;
    const bottomRightX = cx + width / 2;
    const bottomRightY = cy + height / 2;
    const crossbarY = cy + height * 0.1;

    const leftSide = sampleEdges([{ x: topX, y: topY }, { x: bottomLeftX, y: bottomLeftY }], samples / 3);
    const rightSide = sampleEdges([{ x: topX, y: topY }, { x: bottomRightX, y: bottomRightY }], samples / 3);
    const crossbar = sampleEdges([{ x: cx - width * 0.35, y: crossbarY }, { x: cx + width * 0.35, y: crossbarY }], samples / 3);
    
    return [...leftSide, ...rightSide, ...crossbar];
  }

  if (kind === 'number-8') {
    const lobeRadius = Math.min(W, H) * 0.22;
    const topCenterY = cy - lobeRadius * 0.6;
    const bottomCenterY = cy + lobeRadius * 0.6;
    const halfSamples = Math.floor(samples / 2);

    for (let i = 0; i <= halfSamples; i++) {
      const angle = (i / halfSamples) * 2 * Math.PI;
      pts.push({ x: cx + lobeRadius * Math.cos(angle), y: topCenterY + lobeRadius * Math.sin(angle) });
    }

    for (let i = 0; i <= halfSamples; i++) {
      const angle = (i / halfSamples) * 2 * Math.PI;
      pts.push({ x: cx + lobeRadius * Math.cos(angle), y: bottomCenterY + lobeRadius * Math.sin(angle) });
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
