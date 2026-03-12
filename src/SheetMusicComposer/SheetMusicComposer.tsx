import { Staff } from './Staff';
import { Palette } from './Palette';
import { PlaybackControls } from './PlaybackControls';
import { SongList } from './SongList';
import { SheetMusicComposerProvider } from './SheetMusicComposerProvider';
import { useSheetMusicComposer } from './useSheetMusicComposer';
import styles from './SheetMusicComposer.module.css';

function SheetMusicComposerContent() {
  const {
    music,
    activeNoteId,
    isPlaying,
    rowsStaff,
    handleDeletion,
    handleStaffClick,
    handleMaximumWidthChange,
  } = useSheetMusicComposer();

  return (
    <div className={styles['main-content']}>
      <div className={styles['staff-section']} style={{ maxWidth: '100%' }}>
        {rowsStaff.length > 0 &&
          rowsStaff.map((row, index) => (
            <div
              key={row.position}
              onClick={
                index === rowsStaff.length - 1 ? handleStaffClick : undefined
              }
              className={styles['staff-row']}
            >
              <Staff
                key={row.position}
                music={row.notes}
                activeNoteId={activeNoteId}
                isPlaying={isPlaying}
                onDelete={handleDeletion}
                onMaximumWidthChange={
                  index === 0 ? handleMaximumWidthChange : undefined
                }
              />
            </div>
          ))}
        {rowsStaff.length === 0 && (
          <div style={{ maxWidth: '100%' }}>
            <Staff
              music={music}
              activeNoteId={activeNoteId}
              isPlaying={isPlaying}
              onDelete={handleDeletion}
              onMaximumWidthChange={handleMaximumWidthChange}
            />
          </div>
        )}
      </div>
      <div className={styles['palette-and-saved-songs']}>
        <Palette />
        <SongList />
      </div>
      <PlaybackControls />
    </div>
  );
}

export function SheetMusicComposer() {
  return (
    <SheetMusicComposerProvider>
      <SheetMusicComposerContent />
    </SheetMusicComposerProvider>
  );
}
