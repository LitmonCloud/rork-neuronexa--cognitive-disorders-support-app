import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completedMetrics: PerformanceMetric[] = [];
  private maxCompletedMetrics = 50;

  start(name: string, metadata?: Record<string, unknown>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata,
    };
    this.metrics.set(name, metric);
    logger.debug(`Performance: Started ${name}`, metadata);
  }

  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`Performance: No start time found for ${name}`);
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
    };

    this.completedMetrics.push(completedMetric);
    if (this.completedMetrics.length > this.maxCompletedMetrics) {
      this.completedMetrics.shift();
    }

    this.metrics.delete(name);

    logger.debug(`Performance: ${name} took ${duration}ms`, metric.metadata);

    if (duration > 1000) {
      logger.warn(`Performance: Slow operation detected - ${name} took ${duration}ms`);
    }

    return duration;
  }

  async measure<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, unknown>): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.completedMetrics];
  }

  getAverageTime(name: string): number | null {
    const metrics = this.completedMetrics.filter(m => m.name === name && m.duration !== undefined);
    if (metrics.length === 0) return null;

    const total = metrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / metrics.length;
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify({
      active: Array.from(this.metrics.values()),
      completed: this.completedMetrics,
    }, null, 2);
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return performanceMonitor.measure(name, fn);
}

export function measureSync<T>(name: string, fn: () => T): T {
  performanceMonitor.start(name);
  try {
    const result = fn();
    performanceMonitor.end(name);
    return result;
  } catch (error) {
    performanceMonitor.end(name);
    throw error;
  }
}
