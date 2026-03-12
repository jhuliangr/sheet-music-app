import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { useTriviaStore } from '#shared/stores/useTriviaStore';
import '../JazzSheets/JazzSheets.css';
import './AppLayout.css';

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { score, total, reset } = useTriviaStore();

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
          <div className="nav-trivia-score">
            <span className="trivia-score-label">🎵 Trivia</span>
            <span className="trivia-score-value">
              {score}/{total}
            </span>
            {total > 0 && (
              <button
                className="trivia-reset-btn"
                onClick={reset}
                title="Reset score"
              >
                ↺
              </button>
            )}
          </div>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
