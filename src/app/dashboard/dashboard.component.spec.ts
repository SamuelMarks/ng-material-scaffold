import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  const setup = (matches: boolean) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, DashboardComponent],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches }) },
        },
      ],
    });

    return TestBed.createComponent(DashboardComponent).componentInstance;
  };

  it('uses handset cards when handset breakpoint matches', () => {
    const component = setup(true);

    const cards = component.cards();

    expect(cards[0]).toEqual({ title: 'Card 1', cols: 1, rows: 1 });
    expect(cards.length).toBe(4);
  });

  it('uses desktop cards when handset breakpoint does not match', () => {
    const component = setup(false);

    const cards = component.cards();

    expect(cards[0]).toEqual({ title: 'Card 1', cols: 2, rows: 1 });
    expect(cards.length).toBe(4);
  });
});
