import { TestBed } from '@angular/core/testing';

import { LocalStorage, MemoryStorage } from './local-storage';
import { WINDOW } from './window';

describe('MemoryStorage', () => {
  it('supports basic storage operations', () => {
    const storage = new MemoryStorage();

    expect(storage.length).toBe(0);
    expect(storage.getItem('missing')).toBeNull();

    storage.setItem('token', 'value');
    storage.setItem('another', 'second');

    expect(storage.length).toBe(2);
    expect(storage.getItem('token')).toBe('value');
    expect(storage.key(0)).toBe('token');
    expect(storage.key(99)).toBeNull();

    storage.removeItem('token');
    expect(storage.getItem('token')).toBeNull();

    storage.clear();
    expect(storage.length).toBe(0);
  });

  it('treats undefined values as missing', () => {
    const storage = new MemoryStorage();

    storage.setItem('token', undefined as unknown as string);

    expect(storage.getItem('token')).toBeNull();
  });
});

describe('LocalStorage token', () => {
  it('uses the provided window storage when available', () => {
    const storage = new MemoryStorage();
    const windowStub = { localStorage: storage } as unknown as Window;

    TestBed.configureTestingModule({
      providers: [{ provide: WINDOW, useValue: windowStub }],
    });

    const injected = TestBed.inject(LocalStorage);
    expect(injected === storage).toBeTrue();
  });

  it('falls back to memory storage when window is unavailable', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: WINDOW, useValue: undefined }],
    });

    const injected = TestBed.inject(LocalStorage);
    expect(injected instanceof MemoryStorage).toBeTrue();
  });
});
