import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Path, Skia, BlurMask } from '@shopify/react-native-skia';
import { buildGuidePolyline, GuideKind, guidePathSkia } from '../logic/shapes';

export type Stroke = { id: number; points: { x: number; y: number }[] };
export type TraceStats = { loops: number; accuracy: number };

interface TracingCanvasProps {
  guide?: GuideKind;
  targetLoops?: number;
  strokeColor?: string;
  coreWidth?: number;
  glowWidth?: number;
  tolerancePx?: number;
  onStats?: (s: TraceStats) => void;
  onStrokeEnd?: (stroke: Stroke, s: TraceStats) => void;
  onTracingStart?: () => void;
  onTracingEnd?: () => void;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  guide = 'circle',
  strokeColor = '#5CA3FF',
  coreWidth = 6,
  glowWidth = 28,
  tolerancePx = 18,
  onStats,
  onStrokeEnd,
  onTracingStart,
  onTracingEnd,
}) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const statsRef = useRef<TraceStats>({ loops: 0, accuracy: 100 });
  const strokeIdRef = useRef(0);
  const gateRef = useRef<{
    a: { x: number; y: number };
    b: { x: number; y: number };
    count: number;
  }>({ a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, count: 0 });

  const corePaint = useMemo(() => {
    const p = Skia.Paint();
    p.setColor(Skia.Color(strokeColor));
    p.setStyle(1);
    p.setStrokeWidth(coreWidth);
    p.setStrokeCap(1);
    p.setStrokeJoin(1);
    return p;
  }, [strokeColor, coreWidth]);

  const glowPaint = useMemo(() => {
    const p = Skia.Paint();
    p.setColor(Skia.Color(strokeColor));
    p.setStyle(1);
    p.setStrokeWidth(glowWidth);
    p.setStrokeCap(1);
    p.setStrokeJoin(1);
    p.setBlendMode(14);
    return p;
  }, [strokeColor, glowWidth]);

  const guideSkiaPath = useMemo(() => {
    if (canvasWidth === 0 || canvasHeight === 0) return Skia.Path.Make();
    const path = Skia.Path.Make();
    guidePathSkia(path, guide, canvasWidth, canvasHeight, 24);
    return path;
  }, [guide, canvasWidth, canvasHeight]);

  const polylineRef = useMemo(() => {
    if (canvasWidth === 0 || canvasHeight === 0) return [];
    return buildGuidePolyline(guide, canvasWidth, canvasHeight, 24, 360);
  }, [guide, canvasWidth, canvasHeight]);

  useMemo(() => {
    if (canvasWidth === 0 || canvasHeight === 0) return;
    const cx = canvasWidth / 2;
    const topY = 24;
    gateRef.current = {
      a: { x: cx - 10, y: topY + 2 },
      b: { x: cx + 10, y: topY + 2 },
      count: 0,
    };
  }, [canvasWidth, canvasHeight]);

  const pathFrom = (pts: { x: number; y: number }[]) => {
    const p = Skia.Path.Make();
    if (!pts.length) return p;
    p.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) p.lineTo(pts[i].x, pts[i].y);
    return p;
  };

  const updateAccuracy = (allPts: { x: number; y: number }[]) => {
    const poly = polylineRef;
    if (poly.length < 2 || allPts.length === 0) return 100;
    let good = 0;
    for (const pt of allPts) {
      const d = distanceToPolyline(pt, poly);
      if (d <= tolerancePx) good++;
    }
    const acc = Math.round((good / allPts.length) * 100);
    return acc;
  };

  const updateLoopsWithGate = (strokePts: { x: number; y: number }[]) => {
    if (!gateRef.current || strokePts.length < 2) return 0;
    const gate = gateRef.current;
    let hits = 0;
    for (let i = 1; i < strokePts.length; i++) {
      if (segmentsCross(strokePts[i - 1], strokePts[i], gate.a, gate.b)) hits++;
    }
    gate.count += hits;
    return gate.count;
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((e) => {
      console.log('[Trace] Gesture started at:', e.x, e.y);
      onTracingStart?.();
      setCurrentStroke([{ x: e.x, y: e.y }]);
    })
    .onUpdate((e) => {
      setCurrentStroke((prev) => {
        const last = prev[prev.length - 1];
        if (!last || Math.abs(last.x - e.x) + Math.abs(last.y - e.y) > 0.5) {
          return [...prev, { x: e.x, y: e.y }];
        }
        return prev;
      });
    })
    .onEnd(() => {
      console.log('[Trace] Gesture ended, path length:', currentStroke.length);

      if (currentStroke.length > 1) {
        const newStroke: Stroke = {
          id: strokeIdRef.current++,
          points: currentStroke,
        };

        const loops = updateLoopsWithGate(currentStroke);
        const accuracy = updateAccuracy(currentStroke);
        const s = { loops, accuracy };
        statsRef.current = s;
        onStats?.(s);
        onStrokeEnd?.(newStroke, s);

        setStrokes((prev) => [...prev, newStroke]);
      }

      setCurrentStroke([]);
      onTracingEnd?.();
    });

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        const height = e.nativeEvent.layout.height;
        console.log('[Canvas] Layout:', width, height);
        setCanvasWidth(width);
        setCanvasHeight(height);
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Canvas style={styles.canvas}>
          {canvasWidth > 0 && canvasHeight > 0 && (
            <Path
              path={guideSkiaPath}
              color="rgba(255,255,255,0.3)"
              style="stroke"
              strokeWidth={4}
            />
          )}

          {strokes.map((s) => {
            const p = pathFrom(s.points);
            return (
              <React.Fragment key={`s-${s.id}`}>
                <Path path={p} paint={glowPaint}>
                  <BlurMask blur={10} style="outer" />
                </Path>
                <Path path={p} paint={corePaint} />
              </React.Fragment>
            );
          })}

          {currentStroke.length > 0 && (
            <React.Fragment>
              <Path path={pathFrom(currentStroke)} paint={glowPaint}>
                <BlurMask blur={12} style="outer" />
              </Path>
              <Path path={pathFrom(currentStroke)} paint={corePaint} />
            </React.Fragment>
          )}
        </Canvas>
      </GestureDetector>
    </View>
  );
};

function distanceToPolyline(p: { x: number; y: number }, poly: { x: number; y: number }[]) {
  let best = Number.POSITIVE_INFINITY;
  for (let i = 1; i < poly.length; i++) {
    best = Math.min(best, pointToSegmentDistance(p, poly[i - 1], poly[i]));
  }
  return best;
}

function pointToSegmentDistance(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const wx = p.x - a.x;
  const wy = p.y - a.y;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(p.x - b.x, p.y - b.y);
  const t = c1 / c2;
  const proj = { x: a.x + t * vx, y: a.y + t * vy };
  return Math.hypot(p.x - proj.x, p.y - proj.y);
}

function segmentsCross(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  q1: { x: number; y: number },
  q2: { x: number; y: number }
) {
  const o = (a: any, b: any, c: any) =>
    Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
  return o(p1, p2, q1) !== o(p1, p2, q2) && o(q1, q2, p1) !== o(q1, q2, p2);
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 22, overflow: 'hidden' },
  canvas: { width: '100%', height: 320, backgroundColor: 'rgba(20,20,28,0.9)' },
});
