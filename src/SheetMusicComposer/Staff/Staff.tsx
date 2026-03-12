import React, { useEffect, useRef, type MouseEvent } from 'react';
import type { Chord, Note } from '#shared/types';
import { NOTE_WIDTH, STAFF_PADDING } from '#shared/constants';
import styles from './Staff.module.css';
import { getNoteY, renderLedgerLines, renderStaffLines } from './utils';

interface StaffProps {
  music: (Note | Chord)[];
  activeNoteId: string | null;
  isPlaying: boolean;
  onDelete: (id: string) => void;

  onMaximumWidthChange?: (actualWidth: number) => void;
}

export const Staff: React.FC<StaffProps> = ({
  music,
  activeNoteId,
  onDelete,
  onMaximumWidthChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWidthRef = useRef(0);
  const renderNoteBarOrChord = (noteOrChord: Note | Chord) => {
    const x = STAFF_PADDING + noteOrChord.position * NOTE_WIDTH;

    const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDelete(noteOrChord.id);
    };

    if (!('features' in noteOrChord)) {
      const y = getNoteY(noteOrChord);

      if (noteOrChord.isRest) {
        return (
          <div
            key={noteOrChord.id}
            className={[
              styles.note,
              styles.rest,
              styles[noteOrChord.duration],
            ].join(' ')}
            style={{ left: x }}
          >
            <span className={styles['rest-symbol']}>
              {noteOrChord.duration === 'whole'
                ? '𝄻'
                : noteOrChord.duration === 'half'
                  ? '𝄼'
                  : '𝄽'}
            </span>
          </div>
        );
      }

      const isActive = noteOrChord.id === activeNoteId;

      return (
        <div
          key={noteOrChord.id}
          className={[
            styles.note,
            styles[noteOrChord.duration],
            isActive ? styles.active : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ left: x, maxWidth: '100%' }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onContextMenu={handleDelete}
        >
          {renderLedgerLines(y)}
          <div
            className={styles['note-head']}
            style={{
              top: y,
              transform:
                noteOrChord.duration === 'whole' ? 'none' : 'rotate(-10deg)',
            }}
          />
          {noteOrChord.duration !== 'whole' &&
            noteOrChord.duration !== 'half' && (
              <div className={styles['note-stem']} style={{ top: y + 3 }} />
            )}
          {noteOrChord.duration === 'eighth' && (
            <div className={styles['note-flag']} style={{ top: y + 27 }} />
          )}
          {noteOrChord.accidental === '#' && (
            <span
              className={`${styles.accidental} ${styles.sharp}`}
              style={{ top: y + 5 }}
            >
              ♯
            </span>
          )}
          {/* ♮ */}
          {noteOrChord.accidental === 'b' && (
            <span
              className={`${styles.accidental} ${styles.flat}`}
              style={{ top: y + 5 }}
            >
              ♭
            </span>
          )}
        </div>
      );
    }
    // Is a chord :D
    const qualityLabel =
      noteOrChord.quality === 'major' ? '' : (noteOrChord.quality ?? '');

    return (
      <div
        className={styles.chord}
        key={noteOrChord.id}
        style={{
          left: x,
        }}
        onContextMenu={handleDelete}
      >
        {noteOrChord.note}
        {noteOrChord.accidental === '#' && (
          <span
            className={`${styles.accidental} ${styles.sharp} ${styles['for-chord']}`}
          >
            ♯
          </span>
        )}
        {noteOrChord.accidental === 'b' && (
          <span
            className={`${styles.accidental} ${styles.flat} ${styles['for-chord']}`}
          >
            ♭
          </span>
        )}
        {qualityLabel && (
          <span className={styles['chord-quality']}>{qualityLabel}</span>
        )}
      </div>
    );
  };

  const totalWidth = Math.max(
    800,
    STAFF_PADDING * 2 + (music.length + 1) * NOTE_WIDTH,
  );

  useEffect(() => {
    if (!onMaximumWidthChange) return;
    const el = containerRef.current;
    if (!el) return;

    const handler = () => {
      const actualWidth = el.clientWidth;
      if (actualWidth !== lastWidthRef.current) {
        lastWidthRef.current = actualWidth;
        onMaximumWidthChange(actualWidth);
      }
    };

    const ro = new ResizeObserver(handler);
    ro.observe(el);
    handler();

    return () => ro.disconnect();
  }, [music.length, onMaximumWidthChange]);

  return (
    <div className={styles['staff-container']} ref={containerRef}>
      <div className={styles['staff-scroll']} style={{ width: '100%' }}>
        <div className={styles.staff} style={{ minWidth: totalWidth }}>
          <p className={styles.clef}>𝄞|</p>
          {renderStaffLines()}
          {music.map((noteOrChord) => renderNoteBarOrChord(noteOrChord))}
        </div>
      </div>
    </div>
  );
};
