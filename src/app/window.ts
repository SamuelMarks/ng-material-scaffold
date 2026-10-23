import { InjectionToken } from '@angular/core';

/**
 * Injection token for the browser window.
 */
export const WINDOW = new InjectionToken<Window | undefined>('WindowToken', {
  factory: () => (globalThis as { window?: Window }).window,
});
