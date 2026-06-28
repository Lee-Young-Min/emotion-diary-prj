import type { Emotion } from './emotions';

export const DIARY_STORAGE_KEY = 'vibeDiaryData';
export const DIARY_PROJECT_FILE = 'data/vibeDiaryData.json';
const DIARY_API_ENDPOINT = '/api/diary';

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
    return normalizeDiaryEntries(JSON.parse(storedValue) as unknown);
  } catch {
    return [];
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]): DiaryEntry[] {
  const nextEntries = normalizeDiaryEntries(entries);
  localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(nextEntries));
  return nextEntries;
}

export function saveDiaryEntry(entry: DiaryEntry, entries = loadDiaryEntries()): DiaryEntry[] {
  const nextEntries = [entry, ...entries.filter((item) => item.id !== entry.id)]
    .filter((item) => item.text.trim().length > 0 || item.id === getTodayId())
    .sort(sortNewestFirst);

  return saveDiaryEntries(nextEntries);
}

export async function loadDiaryEntriesFromProjectFile(): Promise<DiaryEntry[]> {
  const response = await fetch(DIARY_API_ENDPOINT);

  if (!response.ok) {
    throw new Error('프로젝트 일기 파일을 불러오지 못했습니다.');
  }

  return normalizeDiaryEntries((await response.json()) as unknown);
}

export async function saveDiaryEntriesToProjectFile(entries: DiaryEntry[]): Promise<DiaryEntry[]> {
  const normalizedEntries = normalizeDiaryEntries(entries);
  const response = await fetch(DIARY_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(normalizedEntries),
  });

  if (!response.ok) {
    throw new Error('프로젝트 일기 파일에 저장하지 못했습니다.');
  }

  return normalizeDiaryEntries((await response.json()) as unknown);
}

export function mergeDiaryEntries(...entryGroups: DiaryEntry[][]): DiaryEntry[] {
  const entriesById = new Map<string, DiaryEntry>();

  entryGroups.flat().forEach((entry) => {
    entriesById.set(entry.id, entry);
  });

  return normalizeDiaryEntries(Array.from(entriesById.values()));
}

export function normalizeDiaryEntries(value: unknown): DiaryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isDiaryEntry).sort(sortNewestFirst);
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
