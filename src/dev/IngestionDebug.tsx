import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { RELAY_BASE_URL } from '../lib/config';

import { useHeartRate } from '../features/heart-rate/useHeartRate';
import { mapHeartRate } from '../lib/ingestion/map';
import { enqueue } from '../lib/ingestion/queue';

// HealthKit for permission + direct probe
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';

export default function IngestionDebug() {
  const [out, setOut] = useState<string>('ready');

  // pull from your hook (now also grab refresh/loading)
  const { samples, refresh, loading, lastSyncAt } = useHeartRate(365);

  const last10 = useMemo(() => {
    const sorted = [...samples].sort(
      (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
    );
    return sorted.slice(-10);
  }, [samples]);

  // ------- HealthKit perms + probe -------
  const perms: HealthKitPermissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.HeartRate],
      write: [],
    },
  };

  const requestHealthPermissions = () => {
    AppleHealthKit.initHealthKit(perms, (err: string) => {
      if (err) {
        setOut(`HealthKit init error: ${err}`);
        return;
      }
      setOut('HealthKit ready: permissions OK');
    });
  };

  const probeHR24h = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const endDate = now.toISOString();
    const options = { startDate, endDate, unit: 'bpm' as const };

    AppleHealthKit.getHeartRateSamples(options, (err: string, results: HealthValue[]) => {
      if (err) {
        setOut(`getHeartRateSamples error: ${err}`);
        return;
      }
      if (!results || results.length === 0) {
        setOut('HealthKit HR: 0 samples in last 24h');
        return;
      }
      const last = results[results.length - 1];
      setOut(
        `HealthKit HR: ${results.length} samples (24h)\n` +
          `latest: ${last.endDate} → ${last.value} bpm`,
      );
    });
  };

  // ------- Hook refresh (likely missing before) -------
  const loadHRViaHook = async () => {
    try {
      setOut('Loading HR via hook…');
      await refresh?.(365);
      setOut(
        `Hook loaded. samples=${samples.length} lastSyncAt=${
          lastSyncAt ? new Date(lastSyncAt).toISOString() : '—'
        }`,
      );
    } catch (e: any) {
      setOut(`refresh error: ${String(e)}`);
    }
  };

  // ------- Direct upload bypassing hook -------
  const uploadHRLast10Direct = () => {
    const now = new Date();
    // read a wider window to be safe
    const startDate = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const endDate = now.toISOString();
    const options = { startDate, endDate, unit: 'bpm' as const };

    AppleHealthKit.getHeartRateSamples(options, async (err: string, results: HealthValue[]) => {
      try {
        if (err) {
          setOut(`getHeartRateSamples error: ${err}`);
          return;
        }
        if (!results || results.length === 0) {
          setOut('No HR from HealthKit (direct).');
          return;
        }
        // Map HK → our HRSample[]
        const hrSamples = results.map(r => ({
          ts: r.endDate,                // use endDate as the event time
          bpm: Number(r.value),
        }));
        const last10Direct = hrSamples.slice(-10);
        const rows = mapHeartRate(last10Direct, {
          user_id: 'u_dev',
          source: 'apple_health',
          device_id: 'ios_device',
        });
        const res = await enqueue(rows);
        setOut(`Uploaded ${res.sent} heart_rate rows (direct)`);
      } catch (e: any) {
        setOut(`uploadHRLast10Direct error: ${String(e)}`);
      }
    });
  };

  // ------- Relay helpers -------
  const ping = async () => {
    try {
      const r = await fetch(`${RELAY_BASE_URL}/health`);
      const j = await r.json();
      setOut(JSON.stringify(j, null, 2));
    } catch (e: any) { setOut(String(e)); }
  };

  const insertDummy = async () => {
    try {
      const rows = [
        { user_id:'u_dev', metric:'heart_rate', ts:'2025-08-22 12:40:00.000', value:74, unit:'bpm', source:'apple_health', device_id:'ios_device', day:'2025-08-22' },
        { user_id:'u_dev', metric:'spo2',       ts:'2025-08-22 12:41:00.000', value:97, unit:'%',   source:'apple_health', device_id:'ios_device', day:'2025-08-22' },
      ];
      const r = await fetch(`${RELAY_BASE_URL}/metrics/insertRows`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const j = await r.json().catch(() => ({}));
      setOut(r.ok ? JSON.stringify(j) : await r.text());
    } catch (e: any) { setOut(String(e)); }
  };

  const uploadHRLast10 = async () => {
    try {
      if (!last10.length) return setOut('No HR samples available (hook). Try “Load HR (hook)” or “Upload last 10 HR (direct)”.');
      const rows = mapHeartRate(last10, {
        user_id: 'u_dev',
        source: 'apple_health',
        device_id: 'ios_device',
      });
      const res = await enqueue(rows);
      setOut(`Uploaded ${res.sent} heart_rate rows (hook)`);
    } catch (e: any) { setOut(`uploadHRLast10 error: ${String(e)}`); }
  };

  const queryCounts = async () => {
    try {
      const sql = `SELECT metric, count()
                   FROM prefix_metrics_raw
                   WHERE user_id = 'u_dev'
                   GROUP BY metric
                   ORDER BY metric`;
      const r = await fetch(`${RELAY_BASE_URL}/dev/sql`, {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ sql }),
      });
      setOut(await r.text());
    } catch (e: any) { setOut(String(e)); }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Ingestion Debug</Text>
      <View style={styles.row}>
        <Btn title="Request Health Permissions" onPress={requestHealthPermissions} />
        <Btn title="Probe HR (24h)" onPress={probeHR24h} />
        <Btn title="Load HR (hook refresh)" onPress={loadHRViaHook} />
        <Btn title="Upload last 10 HR (hook)" onPress={uploadHRLast10} />
        <Btn title="Upload last 10 HR (direct)" onPress={uploadHRLast10Direct} />
        <Btn title="Ping Relay" onPress={ping} />
        <Btn title="Insert Dummy" onPress={insertDummy} />
        <Btn title="Query Counts" onPress={queryCounts} />
      </View>

      <Text style={styles.mono}>{out}</Text>

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: '#9ca3af' }}>Hook loading: {String(loading)}</Text>
        <Text style={{ color: '#9ca3af' }}>
          Hook lastSyncAt: {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : '—'}
        </Text>
        <Text style={{ color: '#9ca3af' }}>HR samples available (hook): {samples.length}</Text>
        <Text style={{ color: '#9ca3af' }}>Will upload (hook last 10): {last10.length}</Text>
      </View>
    </ScrollView>
  );
}

function Btn({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}>
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  h1: { fontSize: 20, fontWeight: '600', color: '#fff' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: '600' },
  mono: { marginTop: 12, color: '#d1d5db', fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }), fontSize: 12 },
});
