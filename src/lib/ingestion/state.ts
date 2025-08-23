// src/lib/ingestion/state.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = (metric: string) => `@ingest:lastTs:${metric}`;

export async function getLastTs(metric: string, fallbackHours = 48): Promise<Date> {
  try {
    const s = await AsyncStorage.getItem(KEY(metric));
    if (s) {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) return d;
    }
  } catch {}
  // default: backfill a little window so first run uploads something
  return new Date(Date.now() - fallbackHours * 60 * 60 * 1000);
}

export async function setLastTs(metric: string, ts: string | Date) {
  const iso = typeof ts === 'string' ? ts : ts.toISOString();
  try { await AsyncStorage.setItem(KEY(metric), iso); } catch {}
}
