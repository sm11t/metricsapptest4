import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { RELAY_BASE_URL } from '../lib/config';

export default function IngestionDebug() {
  const [out, setOut] = useState<string>('ready');

  const ping = async () => {
    try {
      const r = await fetch(`${RELAY_BASE_URL}/health`);
      const j = await r.json();
      setOut(JSON.stringify(j, null, 2));
    } catch (e:any) { setOut(String(e)); }
  };

  const insertDummy = async () => {
    try {
      const rows = [
        { user_id:'u_dev', metric:'heart_rate', ts:'2025-08-22 12:40:00.000', value:74, unit:'bpm', source:'apple_health', device_id:'iphone11', day:'2025-08-22' },
        { user_id:'u_dev', metric:'spo2',       ts:'2025-08-22 12:41:00.000', value:97, unit:'%',   source:'apple_health', device_id:'iphone11', day:'2025-08-22' },
      ];
      const r = await fetch(`${RELAY_BASE_URL}/metrics/insertRows`, {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ rows }),
      });
      const j = await r.json().catch(() => ({}));
      const text = r.ok ? JSON.stringify(j) : await r.text();
      setOut(text);
    } catch (e:any) { setOut(String(e)); }
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
      const text = await r.text();
      setOut(text);
    } catch (e:any) { setOut(String(e)); }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Ingestion Debug</Text>
      <View style={styles.row}>
        <Btn title="Ping Relay" onPress={ping} />
        <Btn title="Insert Dummy" onPress={insertDummy} />
        <Btn title="Query Counts" onPress={queryCounts} />
      </View>
      <Text style={styles.mono}>{out}</Text>
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
  h1: { fontSize: 20, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: '600' },
  mono: { marginTop: 12, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }), fontSize: 12 },
});
