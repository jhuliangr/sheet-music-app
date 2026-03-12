import { useContext } from 'react';
import { JazzSheetsContext } from './JazzSheetsContext';

export function useJazzSheets() {
  const ctx = useContext(JazzSheetsContext);
  if (!ctx) {
    throw new Error('useJazzSheets must be used within JazzSheetsProvider');
  }
  return ctx;
}
