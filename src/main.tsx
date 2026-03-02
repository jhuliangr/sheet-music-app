import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@radix-ui/themes/styles.css';
import { JazzSheets } from './JazzSheets';
import { Theme } from '@radix-ui/themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme accentColor="gray" grayColor="sand" panelBackground="solid">
      <JazzSheets />
    </Theme>
  </StrictMode>,
);
