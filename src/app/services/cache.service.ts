import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private tokenCache = new Map<string, any>();

  setAccessToken(key: string, token: string): void {
    this.tokenCache.set(key, token);
  }

  getAccessToken(key: string): string | null {
    return this.tokenCache.get(key) || null;
  }

  haveAccessToken(key: string): boolean {
    return this.tokenCache.has(key);
  }

  clearAccessToken(key: string): void {
    this.tokenCache.delete(key);
  }

  clearAllTokens(): void {
    this.tokenCache.clear();
  }
}
