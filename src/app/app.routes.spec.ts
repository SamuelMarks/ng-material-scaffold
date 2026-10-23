import { Routes } from '@angular/router';

import { appRoutes } from './app.routes';
import { adminRoutes } from './admin/admin.routes';
import { authRoutes } from './auth/auth.routes';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { secretDashboardRoutes } from './secret-dashboard/secret-dashboard.routes';

describe('Routes', () => {
  it('includes core app routes', () => {
    const paths = appRoutes.map((route) => route.path);

    expect(paths).toContain('');
    expect(paths).toContain('auth');
    expect(paths).toContain('admin');
    expect(paths).toContain('secret-dashboard');
    expect(paths).toContain('**');

    const adminRoute = appRoutes.find((route) => route.path === 'admin');
    expect(typeof adminRoute?.loadChildren).toBe('function');
  });

  it('defines feature route collections', () => {
    expect(adminRoutes[0].path).toBe('');
    expect(authRoutes[0].path).toBe('');
    expect(dashboardRoutes[0].path).toBe('');
    expect(secretDashboardRoutes[0].path).toBe('');
  });

  it('loads lazy route definitions', async () => {
    const routesByPath = new Map(appRoutes.map((route) => [route.path, route]));
    const dashboardLoader = routesByPath.get('')?.loadChildren;
    const authLoader = routesByPath.get('auth')?.loadChildren;
    const adminLoader = routesByPath.get('admin')?.loadChildren;
    const secretLoader = routesByPath.get('secret-dashboard')?.loadChildren;
    const isRoutes = (value: unknown): value is Routes => Array.isArray(value);

    expect(typeof dashboardLoader).toBe('function');
    expect(typeof authLoader).toBe('function');
    expect(typeof adminLoader).toBe('function');
    expect(typeof secretLoader).toBe('function');

    if (!dashboardLoader || !authLoader || !adminLoader || !secretLoader) {
      fail('Missing route loader');
      return;
    }

    const dashboard = await dashboardLoader();
    const auth = await authLoader();
    const admin = await adminLoader();
    const secret = await secretLoader();

    expect(isRoutes(dashboard)).toBeTrue();
    expect(isRoutes(auth)).toBeTrue();
    expect(isRoutes(admin)).toBeTrue();
    expect(isRoutes(secret)).toBeTrue();

    if (isRoutes(dashboard) && isRoutes(auth) && isRoutes(admin) && isRoutes(secret)) {
      expect(dashboard[0]?.path).toBe(dashboardRoutes[0].path);
      expect(auth[0]?.path).toBe(authRoutes[0].path);
      expect(admin[0]?.path).toBe(adminRoutes[0].path);
      expect(secret[0]?.path).toBe(secretDashboardRoutes[0].path);
    }
  });
});
