import { useEffect, useMemo, useState } from 'react';
import { DiaryEditor } from './components/DiaryEditor';
import { HistoryList } from './components/HistoryList';
import { createEmptyEntry, loadDiaryEntries, saveDiaryEntry, type DiaryEntry } from './lib/diaryStorage';
import { emotionThemes } from './lib/emotions';

export function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadDiaryEntries());
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry>(() => {
    const todayEntry = createEmptyEntry();
    return loadDiaryEntries().find((entry) => entry.id === todayEntry.id) ?? todayEntry;
  });
  const [hasHydrated, setHasHydrated] = useState(false);

  const theme = useMemo(() => emotionThemes[selectedEntry.emotion], [selectedEntry.emotion]);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-bg', theme.background);
    document.documentElement.style.setProperty('--theme-text', theme.text);
  }, [theme]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setEntries(saveDiaryEntry(selectedEntry));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [selectedEntry, hasHydrated]);

  return (
    <main className="app-shell">
      <div className="app-intro">
        <h1>Vibe Diary</h1>
        <p>하루의 끝, 오직 당신의 감정과 생각에만 집중하는 공간.</p>
      </div>
      <div className="workspace">
        <DiaryEditor entry={selectedEntry} onChange={setSelectedEntry} />
        <HistoryList entries={entries} selectedEntryId={selectedEntry.id} onSelect={setSelectedEntry} />
      </div>
    </main>
  );
}
