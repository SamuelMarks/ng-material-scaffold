import { TestBed } from '@angular/core/testing';

import { WINDOW } from './window';

describe('WINDOW token', () => {
  it('provides the browser window when available', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(WINDOW)).toBe(window);
  });
});
