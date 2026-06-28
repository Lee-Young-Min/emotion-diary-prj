import { useEffect, useMemo, useState } from 'react';
import { DiaryEditor } from './components/DiaryEditor';
import { HistoryList } from './components/HistoryList';
import {
  DIARY_PROJECT_FILE,
  createEmptyEntry,
  loadDiaryEntries,
  loadDiaryEntriesFromProjectFile,
  mergeDiaryEntries,
  saveDiaryEntries,
  saveDiaryEntriesToProjectFile,
  saveDiaryEntry,
  type DiaryEntry,
} from './lib/diaryStorage';
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
    let shouldIgnore = false;

    async function hydrateFromProjectFile(): Promise<void> {
      const localEntries = loadDiaryEntries();

      try {
        const projectFileEntries = await loadDiaryEntriesFromProjectFile();
        const mergedEntries = mergeDiaryEntries(projectFileEntries, localEntries);
        const todayEntry = createEmptyEntry();

        if (shouldIgnore) {
          return;
        }

        saveDiaryEntries(mergedEntries);
        setEntries(mergedEntries);
        setSelectedEntry((currentEntry) => {
          return mergedEntries.find((entry) => entry.id === currentEntry.id) ?? mergedEntries.find((entry) => entry.id === todayEntry.id) ?? currentEntry;
        });
        setHasHydrated(true);

        if (mergedEntries.length !== projectFileEntries.length) {
          await saveDiaryEntriesToProjectFile(mergedEntries);
        }
      } catch {
        if (!shouldIgnore) {
          setHasHydrated(true);
        }
      }
    }

    void hydrateFromProjectFile();

    return () => {
      shouldIgnore = true;
    };
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
      setEntries((currentEntries) => {
        const nextEntries = saveDiaryEntry(selectedEntry, currentEntries);
        void saveDiaryEntriesToProjectFile(nextEntries);
        return nextEntries;
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [selectedEntry, hasHydrated]);

  function saveEntriesToLocalFile(): void {
    const latestEntries = saveDiaryEntry(selectedEntry, entries);
    setEntries(latestEntries);
    void saveDiaryEntriesToProjectFile(latestEntries);
  }

  return (
    <main className="app-shell">
      <div className="app-intro">
        <h1>영민의 Vibe Diary</h1>
        <p>하루의 끝, 오직 영민의 감정과 생각에만 집중하는 공간.</p>
      </div>
      <div className="workspace">
        <DiaryEditor entry={selectedEntry} onChange={setSelectedEntry} />
        <HistoryList
          entries={entries}
          filePath={DIARY_PROJECT_FILE}
          selectedEntryId={selectedEntry.id}
          onSaveFile={saveEntriesToLocalFile}
          onSelect={setSelectedEntry}
        />
      </div>
    </main>
  );
}
