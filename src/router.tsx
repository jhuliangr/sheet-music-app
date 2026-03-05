import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';
import { JazzSheets } from './JazzSheets';
import { Songs } from './Songs';
import AppLayout from './AppLayout';

const rootRoute = createRootRoute({
  component: () => <AppLayout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: JazzSheets,
});

const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs',
  component: Songs,
});

const routeTree = rootRoute.addChildren([indexRoute, songsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
