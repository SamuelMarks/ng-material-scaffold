import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('creates the component', () => {
    const component = new AppComponent();
    expect(component).toBeTruthy();
  });

  it('closes the sidenav', () => {
    const component = new AppComponent();
    component.sidenavOpened.set(true);

    component.closeSidenav();

    expect(component.sidenavOpened()).toBeFalse();
  });

  it('sets the sidenav state', () => {
    const component = new AppComponent();

    component.setSidenavOpened(true);
    expect(component.sidenavOpened()).toBeTrue();

    component.setSidenavOpened(false);
    expect(component.sidenavOpened()).toBeFalse();
  });
});
