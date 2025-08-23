// src/lib/ingestion/shapes.ts
export type MetricRow = {
  user_id: string;
  metric: string;   // e.g. "heart_rate"
  ts: string;       // "YYYY-MM-DD HH:mm:ss.mmm" UTC
  value: number;
  unit: string;     // e.g. "bpm"
  source: string;   // "apple_health" | "google_fit" | "demo"
  device_id: string;
  day: string;      // "YYYY-MM-DD" UTC
};

export function toClickHouseTsUTC(d: string | number | Date): string {
  const date = new Date(d);
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  const yyyy = date.getUTCFullYear();
  const mm = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mi = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  const ms = pad(date.getUTCMilliseconds(), 3);
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms}`;
}

export function dayFromUTC(d: string | number | Date): string {
  const date = new Date(d);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
