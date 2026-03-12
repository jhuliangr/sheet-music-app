import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderStaffLines } from './renderStaffLines';
import { STAFF_TOP, LINE_SPACING } from '#shared/constants';

describe('SheetMusicComposer/Staff/utils/renderStaffLines', () => {
  it('works', () => {
    expect(renderStaffLines()).toBeDefined();
  });

  it('renders exactly 5 lines', () => {
    const { container } = render(<>{renderStaffLines()}</>);
    expect(container.querySelectorAll('.staff-line')).toHaveLength(5);
  });

  it('first line starts at STAFF_TOP', () => {
    const { container } = render(<>{renderStaffLines()}</>);
    const firstLine = container.querySelector('.staff-line') as HTMLElement;
    expect(firstLine.style.top).toBe(`${STAFF_TOP}px`);
  });

  it('lines are spaced LINE_SPACING apart', () => {
    const { container } = render(<>{renderStaffLines()}</>);
    const lines = container.querySelectorAll<HTMLElement>('.staff-line');
    const tops = Array.from(lines).map((l) => parseInt(l.style.top));
    expect(tops[1] - tops[0]).toBe(LINE_SPACING);
    expect(tops[4] - tops[3]).toBe(LINE_SPACING);
  });
});
