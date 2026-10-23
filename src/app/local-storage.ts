import { InjectionToken, inject } from '@angular/core';

import { WINDOW } from './window';

/**
 * Minimal storage contract used for token persistence.
 */
export interface IStorage {
  /**
   * The **`length`** read-only property of the `Storage` object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/length)
   */
  readonly length: number;
  /**
   * The **`clear()`** method of the Storage interface clears all keys stored in a given `Storage` object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/clear)
   */
  clear(): void;
  /**
   * The **`getItem()`** method of the Storage interface, when passed a key name, will return that key's value,
   * or `null` if the key does not exist, in the given `Storage` object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/getItem)
   */
  getItem(key: string): string | null;
  /**
   * The **`key()`** method of the Storage interface, when passed a number n, returns the name of the nth key
   * in a given `Storage` object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/key)
   */
  key(index: number): string | null;
  /**
   * The **`removeItem()`** method of the Storage interface, when passed a key name, will remove that key from
   * the given `Storage` object if it exists.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/removeItem)
   */
  removeItem(key: string): void;
  /**
   * The **`setItem()`** method of the Storage interface, when passed a key name and value, will add that key
   * to the given `Storage` object, or update that key's value if it already exists.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/setItem)
   */
  setItem(key: string, value: string): void;
}

/**
 * A memory-based implementation of the Storage interface for non-browser contexts.
 */
export class MemoryStorage implements IStorage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) ?? null) : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

/**
 * Injection token for storage, with a memory fallback when window storage is unavailable.
 */
export const LocalStorage = new InjectionToken<IStorage>('localStorage', {
  factory: () => {
    const windowRef = inject(WINDOW);
    return windowRef?.localStorage ?? new MemoryStorage();
  },
});
