import {
  createRouter,
  createRootRoute,
  createRoute,
  createHashHistory,
} from '@tanstack/react-router';
import { SheetMusicComposer } from './SheetMusicComposer';
import { Songs } from './Songs';
import AppLayout from './AppLayout';

const rootRoute = createRootRoute({
  component: () => <AppLayout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SheetMusicComposer,
});

const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs',
  component: Songs,
});

const routeTree = rootRoute.addChildren([indexRoute, songsRoute]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
