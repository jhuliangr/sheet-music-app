import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import './index.css';
import '@radix-ui/themes/styles.css';
import { router } from './router';
import { Theme } from '@radix-ui/themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme accentColor="gray" grayColor="sand" panelBackground="solid">
      <RouterProvider router={router} />
    </Theme>
  </StrictMode>,
);
