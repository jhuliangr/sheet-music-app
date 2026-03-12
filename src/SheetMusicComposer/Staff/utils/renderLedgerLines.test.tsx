import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderLedgerLines } from './renderLedgerLines';
import { STAFF_TOP, LINE_SPACING } from '#shared/constants';

describe('SheetMusicComposer/Staff/utils/renderLedgerLines', () => {
  it('works', () => {
    expect(renderLedgerLines(STAFF_TOP + LINE_SPACING * 2)).toBeDefined();
  });

  it('returns no ledger lines for a note within the staff', () => {
    const noteY = STAFF_TOP + LINE_SPACING * 2;
    const { container } = render(<>{renderLedgerLines(noteY)}</>);
    expect(container.querySelectorAll('.ledger-line')).toHaveLength(0);
  });

  it('returns a ledger line for a note just above the staff', () => {
    const noteY = STAFF_TOP - 5;
    const { container } = render(<>{renderLedgerLines(noteY)}</>);
    expect(container.querySelectorAll('.ledger-line').length).toBeGreaterThan(
      0,
    );
  });

  it('returns ledger lines for a note below the staff', () => {
    const noteY = STAFF_TOP + LINE_SPACING * 6;
    const { container } = render(<>{renderLedgerLines(noteY)}</>);
    expect(container.querySelectorAll('.ledger-line').length).toBeGreaterThan(
      0,
    );
  });
});
