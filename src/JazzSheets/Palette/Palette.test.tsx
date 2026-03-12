import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Palette } from './Palette';
import { useJazzSheets } from '../useJazzSheets';

vi.mock('../useJazzSheets');

const defaultContextValue = {
  selectedNote: 'C' as const,
  selectedChord: 'G' as const,
  selectedChordQuality: 'major' as const,
  selectedDuration: 'half' as const,
  selectedAccidental: '#' as const,
  isRest: false,
  selectedNoteOctave: 4,
  setSelectedNoteOctave: vi.fn(),
  handleNoteSelect: vi.fn(),
  handleChordSelect: vi.fn(),
  setSelectedChordQuality: vi.fn(),
  setSelectedDuration: vi.fn(),
  setSelectedAccidental: vi.fn(),
  setIsRest: vi.fn(),
  handleClear: vi.fn(),
};

describe('JazzSheets/Palette/Palette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useJazzSheets).mockReturnValue(
      defaultContextValue as unknown as ReturnType<typeof useJazzSheets>,
    );
  });

  it('works', () => {
    render(<Palette />);
  });

  it('renders all note buttons', () => {
    render(<Palette />);
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    notes.forEach((note) => {
      const buttons = screen.getAllByText(note);
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders all duration buttons', () => {
    render(<Palette />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByText('1/4')).toBeInTheDocument();
    expect(screen.getByText('1/8')).toBeInTheDocument();
  });

  it('renders all accidental buttons', () => {
    render(<Palette />);
    expect(screen.getByText('Natural (♮)')).toBeInTheDocument();
    expect(screen.getByText('♯')).toBeInTheDocument();
    expect(screen.getByText('♭')).toBeInTheDocument();
  });

  it('renders rest and clear buttons', () => {
    render(<Palette />);
    const restButtons = screen.getAllByText('Rest');
    expect(restButtons[restButtons.length - 1]).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('displays current octave', () => {
    render(<Palette />);
    expect(screen.getByText('Octave: 4')).toBeInTheDocument();
  });

  it('highlights selected note', () => {
    render(<Palette />);
    const cButtons = screen.getAllByText('C');
    expect(cButtons[0]).toHaveClass('active');
  });

  it('highlights selected chord', () => {
    render(<Palette />);
    const buttons = screen.getAllByText('G');
    expect(buttons[1]).toHaveClass('active');
  });

  it('highlights selected duration', () => {
    render(<Palette />);
    expect(screen.getByText('1/2')).toHaveClass('active');
  });

  it('highlights selected accidental', () => {
    render(<Palette />);
    expect(screen.getByText('♯')).toHaveClass('active');
  });

  it('highlights rest when active', () => {
    vi.mocked(useJazzSheets).mockReturnValue({
      ...defaultContextValue,
      isRest: true,
    } as unknown as ReturnType<typeof useJazzSheets>);
    render(<Palette />);
    const restButtons = screen.getAllByText('Rest');
    expect(restButtons[restButtons.length - 1]).toHaveClass('active');
  });

  it('has +/- buttons for octave control', () => {
    render(<Palette />);
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });
});
