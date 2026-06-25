import type { Emotion } from './emotions';

export const DIARY_STORAGE_KEY = 'vibeDiaryData';

export type DiaryEntry = {
  id: string;
  date: number;
  emotion: Emotion;
  text: string;
};

export function getTodayId(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function createEmptyEntry(date = new Date()): DiaryEntry {
  return {
    id: getTodayId(date),
    date: date.getTime(),
    emotion: 'neutral',
    text: '',
  };
}

export function loadDiaryEntries(): DiaryEntry[] {
  const storedValue = localStorage.getItem(DIARY_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as DiaryEntry[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isDiaryEntry).sort(sortNewestFirst);
  } catch {
    return [];
  }
}

export function saveDiaryEntry(entry: DiaryEntry): DiaryEntry[] {
  const entries = loadDiaryEntries();
  const nextEntries = [entry, ...entries.filter((item) => item.id !== entry.id)]
    .filter((item) => item.text.trim().length > 0 || item.id === getTodayId())
    .sort(sortNewestFirst);

  localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(nextEntries));
  return nextEntries;
}

function sortNewestFirst(a: DiaryEntry, b: DiaryEntry): number {
  return b.date - a.date;
}

function isDiaryEntry(value: unknown): value is DiaryEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as DiaryEntry;
  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'number' &&
    typeof entry.emotion === 'string' &&
    typeof entry.text === 'string'
  );
}
