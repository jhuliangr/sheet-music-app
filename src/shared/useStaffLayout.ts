import { useState, useRef, useCallback, useEffect } from 'react';
import { STAFF_PADDING, NOTE_WIDTH } from './constants';
import type { Note, Chord } from './types';

type StaffRow = { notes: (Note | Chord)[]; position: number };

function chunkIntoRows(
  arr: (Note | Chord)[],
  notesPerRow: number,
): (Note | Chord)[][] {
  const chunks: (Note | Chord)[][] = [];
  for (let start = 0; start < arr.length; start += notesPerRow) {
    chunks.push(arr.slice(start, start + notesPerRow));
  }
  return chunks;
}

export function useStaffLayout(music: (Note | Chord)[]) {
  const [rowsStaff, setRowsStaff] = useState<StaffRow[]>([]);
  const lastWidthRef = useRef(0);

  const handleMaximumWidthChange = useCallback(
    (actualWidth: number) => {
      lastWidthRef.current = actualWidth;
      const totalWidth = STAFF_PADDING * 2 + (music.length + 1) * NOTE_WIDTH;

      if (actualWidth >= totalWidth) {
        setRowsStaff([
          {
            notes: music.map((note, i) => ({ ...note, position: i })),
            position: 0,
          },
        ]);
        return;
      }

      const usableWidth = actualWidth - 2 * STAFF_PADDING;
      const notesPerRow = Math.max(1, Math.floor(usableWidth / NOTE_WIDTH));

      setRowsStaff(
        chunkIntoRows(music, notesPerRow).map((chunk, index) => ({
          notes: chunk.map((note, i) => ({ ...note, position: i })),
          position: index,
        })),
      );
    },
    [music],
  );

  useEffect(() => {
    if (lastWidthRef.current !== 0) {
      handleMaximumWidthChange(lastWidthRef.current);
    }
  }, [music, handleMaximumWidthChange]);

  return { rowsStaff, handleMaximumWidthChange };
}
