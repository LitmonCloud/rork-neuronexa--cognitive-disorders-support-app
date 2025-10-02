import { InteractionManager } from 'react-native';

export function runAfterInteractions<T>(fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve(fn());
    });
  });
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args) as ReturnType<T>;
    cache.set(key, result);
    
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value as string | undefined;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }

    return result;
  };
}

export class BatchProcessor<T> {
  private queue: T[] = [];
  private processing = false;
  private batchSize: number;
  private processFn: (items: T[]) => Promise<void>;

  constructor(processFn: (items: T[]) => Promise<void>, batchSize = 10) {
    this.processFn = processFn;
    this.batchSize = batchSize;
  }

  add(item: T): void {
    this.queue.push(item);
    this.processQueue();
  }

  addBatch(items: T[]): void {
    this.queue.push(...items);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      await this.processFn(batch);
    }

    this.processing = false;
  }
}
