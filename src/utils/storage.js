const STORAGE_KEY = 'adhivasindo_taskboard_state_v1';

export function loadBoard(fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.columns || !parsed.tasks) return fallback;
    return parsed;
  } catch (err) {
    console.warn('Failed to load board from localStorage', err);
    return fallback;
  }
}

export function saveBoard(board) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (err) {
    console.warn('Failed to save board to localStorage', err);
  }
}

export function clearBoard() {
  window.localStorage.removeItem(STORAGE_KEY);
}
