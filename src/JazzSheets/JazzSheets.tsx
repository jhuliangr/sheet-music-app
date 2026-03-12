import { Staff } from './Staff';
import { Palette } from './Palette';
import { PlaybackControls } from './PlaybackControls';
import { SongList } from './SongList';
import { JazzSheetsProvider } from './JazzSheetsProvider';
import { useJazzSheets } from './useJazzSheets';
import './JazzSheets.css';

function JazzSheetsContent() {
  const {
    music,
    activeNoteId,
    isPlaying,
    rowsStaff,
    handleNoteClick,
    handleDeletion,
    handleStaffClick,
    handleMaximumWidthChange,
  } = useJazzSheets();

  return (
    <div className="main-content">
      <div className="staff-section" style={{ maxWidth: '100%' }}>
        {rowsStaff.length > 0 &&
          rowsStaff.map((row, index) => (
            <div
              key={row.position}
              onClick={
                index === rowsStaff.length - 1 ? handleStaffClick : undefined
              }
              className="staff-row"
            >
              <Staff
                key={row.position}
                music={row.notes}
                activeNoteId={activeNoteId}
                isPlaying={isPlaying}
                onNoteClick={
                  index === rowsStaff.length - 1 ? handleNoteClick : undefined
                }
                onDelete={handleDeletion}
                onMaximumWidthChange={
                  index === 0 ? handleMaximumWidthChange : undefined
                }
              />
            </div>
          ))}
        {rowsStaff.length === 0 && (
          <div className="single-staff" style={{ maxWidth: '100%' }}>
            <Staff
              music={music}
              activeNoteId={activeNoteId}
              isPlaying={isPlaying}
              onNoteClick={handleNoteClick}
              onDelete={handleDeletion}
              onMaximumWidthChange={handleMaximumWidthChange}
            />
          </div>
        )}
      </div>
      <div className="palette-and-saved-songs">
        <Palette />
        <SongList />
      </div>
      <PlaybackControls />
    </div>
  );
}

export function JazzSheets() {
  return (
    <JazzSheetsProvider>
      <JazzSheetsContent />
    </JazzSheetsProvider>
  );
}
