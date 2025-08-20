// src/features/mindfulness/useMindfulness.ts
import { useMemo, useState } from 'react';

type Day = { date: string; minutes: number };

function makeMockWeek(): Day[] {
  const today = new Date();
  const days: Day[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const minutes = [0, 5, 10, 12, 0, 8, 20][6 - i]; // simple pattern
    days.push({ date: d.toISOString(), minutes });
  }
  return days;
}

export function useMindfulness() {
  const [loading, setLoading] = useState(false);
  const history = useMemo(() => makeMockWeek(), []);
  const minutesToday = history[history.length - 1]?.minutes ?? 0;
  const lastSyncAt = useMemo(() => new Date().toISOString(), []);

  async function refresh() {
    setLoading(true);
    // simulate fetch delay
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
  }

  return {
    loading,
    minutesToday,
    history,      // [{date, minutes}] last 7 days
    lastSyncAt,   // ISO string
    refresh,
  };
}
