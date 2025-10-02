import { Image } from 'react-native';

interface ImageCache {
  [uri: string]: boolean;
}

class ImageOptimizer {
  private cache: ImageCache = {};
  private prefetchQueue: string[] = [];
  private isPrefetching = false;

  async prefetchImage(uri: string): Promise<void> {
    if (this.cache[uri]) {
      return;
    }

    try {
      await Image.prefetch(uri);
      this.cache[uri] = true;
    } catch (error) {
      console.warn(`Failed to prefetch image: ${uri}`, error);
    }
  }

  async prefetchImages(uris: string[]): Promise<void> {
    this.prefetchQueue.push(...uris.filter(uri => !this.cache[uri]));
    
    if (!this.isPrefetching) {
      await this.processPrefetchQueue();
    }
  }

  private async processPrefetchQueue(): Promise<void> {
    this.isPrefetching = true;

    while (this.prefetchQueue.length > 0) {
      const uri = this.prefetchQueue.shift();
      if (uri) {
        await this.prefetchImage(uri);
      }
    }

    this.isPrefetching = false;
  }

  clearCache(): void {
    this.cache = {};
  }

  isCached(uri: string): boolean {
    return this.cache[uri] || false;
  }
}

export const imageOptimizer = new ImageOptimizer();

export function getOptimizedImageUri(uri: string, width?: number, height?: number): string {
  if (!uri.startsWith('http')) {
    return uri;
  }

  if (uri.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', '80');
    params.append('fm', 'webp');
    
    return `${uri}?${params.toString()}`;
  }

  return uri;
}
