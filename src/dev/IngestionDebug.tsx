import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { RELAY_BASE_URL } from '../lib/config';

import { useHeartRate } from '../features/heart-rate/useHeartRate';
import { useSpO2 } from '../features/spo2/useSpO2';

import { hrToRows, spo2ToRows } from '../lib/ingestion/rowBuilders';
import { insertRows, health } from '../lib/ingestion/client';

// HealthKit for permission + direct probe
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';

const USER_ID = 'u_dev';
const SOURCE = 'apple_health';
const DEVICE_ID = 'ios_device';

export default function IngestionDebug() {
  const [out, setOut] = useState<string>('ready');

  // ---- Heart Rate via hook ----
  const { samples, refresh, loading, lastSyncAt } = useHeartRate(365);
  const last10 = useMemo(() => {
    const sorted = [...samples].sort(
      (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
    );
    return sorted.slice(-10);
  }, [samples]);

  // ---- SpO₂ via hook ----
  const {
    history: spo2History = [],
    lastSyncAt: spo2LastSync,
    loading: loadingSpO2,
    refresh: refreshSpO2,
  } = useSpO2(2); // ~48h window for dev

  const spo2Last10 = useMemo(() => {
    const sorted = [...spo2History].sort(
      (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
    );
    return sorted.slice(-10);
  }, [spo2History]);

  // ------- HealthKit perms + probe -------
  const perms: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.OxygenSaturation,
      ],
      write: [],
    },
  };

  const requestHealthPermissions = () => {
    AppleHealthKit.initHealthKit(perms, (err: string) => {
      if (err) return setOut(`HealthKit init error: ${err}`);
      setOut('HealthKit ready: permissions OK');
    });
  };

  const probeHR24h = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const endDate = now.toISOString();
    const options = { startDate, endDate, unit: 'bpm' as const };

    AppleHealthKit.getHeartRateSamples(options, (err: string, results: HealthValue[]) => {
      if (err) return setOut(`getHeartRateSamples error: ${err}`);
      if (!results?.length) return setOut('HealthKit HR: 0 samples in last 24h');
      const last = results[results.length - 1];
      setOut(`HealthKit HR: ${results.length} samples (24h)\nlatest: ${last.endDate} → ${last.value} bpm`);
    });
  };

  // ------- Hook refresh (HR & SpO₂) -------
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

  const loadSpO2ViaHook = async () => {
    try {
      setOut('Loading SpO₂ via hook…');
      await refreshSpO2?.(2);
      setOut(`SpO₂ hook loaded: ${spo2History.length} samples`);
    } catch (e: any) {
      setOut(`SpO₂ refresh error: ${String(e)}`);
    }
  };

  // ------- Uploads (HR) via Relay -------
  const uploadHRLast10 = async () => {
    try {
      if (!last10.length) {
        return setOut('No HR samples available (hook). Try “Load HR (hook)” or “Upload last 10 HR (direct)”.');
      }
      const rows = hrToRows(last10, USER_ID, SOURCE, DEVICE_ID);
      const res = await insertRows(rows);
      if (res.ok) Alert.alert('HR upload', `Sent ${res.sent} rows`);
      else Alert.alert('HR upload failed', res.error);
    } catch (e: any) {
      setOut(`uploadHRLast10 error: ${String(e)}`);
    }
  };

  const uploadHRLast10Direct = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const endDate = now.toISOString();
    const options = { startDate, endDate, unit: 'bpm' as const };

    AppleHealthKit.getHeartRateSamples(options, async (err: string, results: HealthValue[]) => {
      try {
        if (err) return setOut(`getHeartRateSamples error: ${err}`);
        if (!results?.length) return setOut('No HR from HealthKit (direct).');

        const hrSamples = results.map(r => ({ ts: r.endDate, bpm: Number(r.value) }));
        const last10Direct = hrSamples.slice(-10);
        const rows = hrToRows(last10Direct, USER_ID, SOURCE, DEVICE_ID);
        const res = await insertRows(rows);
        if (res.ok) Alert.alert('HR upload (direct)', `Sent ${res.sent} rows`);
        else Alert.alert('HR upload (direct) failed', res.error);
      } catch (e: any) {
        setOut(`uploadHRLast10Direct error: ${String(e)}`);
      }
    });
  };

  // ------- Uploads (SpO₂) via Relay -------
  const uploadSpO2Hook = async () => {
    try {
      if (!spo2Last10.length) return setOut('No SpO₂ samples (hook). Try “Load SpO₂ (hook refresh)”.');
      const rows = spo2ToRows(spo2Last10, USER_ID, SOURCE, DEVICE_ID);
      const res = await insertRows(rows);
      if (res.ok) Alert.alert('SpO₂ upload', `Sent ${res.sent} rows`);
      else Alert.alert('SpO₂ upload failed', res.error);
    } catch (e: any) {
      setOut(`uploadSpO2Hook error: ${String(e)}`);
    }
  };

  const uploadSpO2Direct = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const endDate = now.toISOString();

    AppleHealthKit.getOxygenSaturationSamples(
      { startDate, endDate },
      async (err: string, results: HealthValue[] | any[]) => {
        try {
          if (err) return setOut(`getOxygenSaturationSamples error: ${err}`);
          if (!results?.length) return setOut('No SpO₂ from HealthKit (direct).');

          const samples = results.map(r => {
            const v = Number((r as any).value);
            const percent = v <= 1 ? v * 100 : v; // HK sometimes returns 0–1
            return { ts: (r as any).endDate, percent };
          });
          const last10 = samples.slice(-10);
          const rows = spo2ToRows(last10, USER_ID, SOURCE, DEVICE_ID);
          const res = await insertRows(rows);
          if (res.ok) Alert.alert('SpO₂ upload (direct)', `Sent ${res.sent} rows`);
          else Alert.alert('SpO₂ upload (direct) failed', res.error);
        } catch (e: any) {
          setOut(`uploadSpO2Direct error: ${String(e)}`);
        }
      },
    );
  };

  // ------- Relay helpers -------
  const ping = async () => {
    const ok = await health();
    setOut(ok ? 'Relay health OK' : 'Relay not reachable');
  };

  const insertDummy = async () => {
    try {
      const rows = [
        { user_id: 'u_dev', metric: 'heart_rate', ts: '2025-08-22 12:40:00.000', value: 74, unit: 'bpm', source: 'apple_health', device_id: 'ios_device', day: '2025-08-22' },
        { user_id: 'u_dev', metric: 'spo2',       ts: '2025-08-22 12:41:00.000', value: 97, unit: '%',   source: 'apple_health', device_id: 'ios_device', day: '2025-08-22' },
      ];
      const res = await insertRows(rows);
      setOut(res.ok ? `Dummy sent: ${res.sent}` : `Dummy failed: ${res.error}`);
    } catch (e: any) {
      setOut(String(e));
    }
  };

  const queryCounts = async () => {
    try {
      const sql = `SELECT metric, count() AS cnt
                   FROM myt_metrics.myt_metrics_raw
                   WHERE user_id = '${USER_ID}'
                   GROUP BY metric
                   ORDER BY metric`;
      const r = await fetch(`${RELAY_BASE_URL}/dev/sql`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const txt = await r.text();
      setOut(txt);
    } catch (e: any) {
      setOut(String(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Ingestion Debug</Text>
      <View style={styles.row}>
        {/* HealthKit + HR */}
        <Btn title="Request Health Permissions" onPress={requestHealthPermissions} />
        <Btn title="Probe HR (24h)" onPress={probeHR24h} />
        <Btn title="Load HR (hook refresh)" onPress={loadHRViaHook} />
        <Btn title="Upload last 10 HR (hook)" onPress={uploadHRLast10} />
        <Btn title="Upload last 10 HR (direct)" onPress={uploadHRLast10Direct} />

        {/* SpO₂ */}
        <Btn title="Load SpO₂ (hook refresh)" onPress={loadSpO2ViaHook} />
        <Btn title="Upload last 10 SpO₂ (hook)" onPress={uploadSpO2Hook} />
        <Btn title="Upload last 10 SpO₂ (direct)" onPress={uploadSpO2Direct} />

        {/* Relay utils */}
        <Btn title="Ping Relay" onPress={ping} />
        <Btn title="Insert Dummy" onPress={insertDummy} />
        <Btn title="Query Counts" onPress={queryCounts} />
      </View>

      <Text style={styles.mono}>{out}</Text>

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: '#9ca3af' }}>Hook loading (HR): {String(loading)}</Text>
        <Text style={{ color: '#9ca3af' }}>
          Hook lastSyncAt (HR): {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : '—'}
        </Text>
        <Text style={{ color: '#9ca3af' }}>HR samples available (hook): {samples.length}</Text>
        <Text style={{ color: '#9ca3af' }}>Will upload HR (hook last 10): {last10.length}</Text>

        <Text style={{ color: '#9ca3af', marginTop: 8 }}>
          SpO₂ loading: {String(loadingSpO2)}
        </Text>
        <Text style={{ color: '#9ca3af' }}>
          SpO₂ lastSyncAt: {spo2LastSync ? new Date(spo2LastSync).toLocaleString() : '—'}
        </Text>
        <Text style={{ color: '#9ca3af' }}>SpO₂ samples (hook): {spo2History.length}</Text>
        <Text style={{ color: '#9ca3af' }}>
          Will upload SpO₂ (hook last 10): {spo2Last10.length}
        </Text>
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
  mono: {
    marginTop: 12,
    color: '#d1d5db',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 12,
  },
});
