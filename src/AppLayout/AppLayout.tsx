import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { useTriviaStore } from '#shared/stores/useTriviaStore';
import styles from './AppLayout.module.css';

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { score, total, reset } = useTriviaStore();

  return (
    <div className={styles.app}>
      <header className={styles['app-header']}>
        <h1>Sheet Music Composer</h1>
        <p className={styles.subtitle}>
          Create and play back sheet music in Western Notation
        </p>
        <nav className={styles['app-nav']}>
          <Link
            to="/"
            className={styles['nav-link']}
            data-status={pathname === '/' ? 'active' : undefined}
          >
            Composer
          </Link>
          <Link
            to="/songs"
            className={styles['nav-link']}
            data-status={pathname === '/songs' ? 'active' : undefined}
          >
            Saved Songs
          </Link>
          <div className={styles['nav-trivia-score']}>
            <span className={styles['trivia-score-label']}>🎵 Trivia</span>
            <span className={styles['trivia-score-value']}>
              {score}/{total}
            </span>
            {total > 0 && (
              <button
                className={styles['trivia-reset-btn']}
                onClick={reset}
                title="Reset score"
              >
                ↺
              </button>
            )}
          </div>
        </nav>
      </header>
      <main className={styles['app-main']}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
