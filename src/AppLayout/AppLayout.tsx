import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import '../JazzSheets/JazzSheets.css';

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sheet Music Composer</h1>
        <p className="subtitle">
          Create and play back sheet music in Western Notation
        </p>
        <nav className="app-nav">
          <Link
            to="/"
            className="nav-link"
            data-status={pathname === '/' ? 'active' : undefined}
          >
            Composer
          </Link>
          <Link
            to="/songs"
            className="nav-link"
            data-status={pathname === '/songs' ? 'active' : undefined}
          >
            Saved Songs
          </Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
