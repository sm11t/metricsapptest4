import React, { useEffect, useRef, useState } from 'react';
import {
  Platform, SafeAreaView, View, Text, ScrollView, Button,
  ActivityIndicator, Alert, StyleSheet
} from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';

type HRSample = { startDate: string; value: number; unit?: string };

const HK = AppleHealthKit.Constants.Permissions;
const READ_TYPES = [
  HK.HeartRate,
  HK.RestingHeartRate,
  HK.HeartRateVariabilitySDNN ?? (HK as any).HeartRateVariability,
  HK.SleepAnalysis,
  HK.RespiratoryRate,
  HK.MindfulSession,
].filter(Boolean);

const perms: HealthKitPermissions = { permissions: { read: READ_TYPES as any, write: [] } };

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [hkReady, setHkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('Requesting Health access…');
  const [hr, setHr] = useState<HRSample[]>([]);
  const didInit = useRef(false);

  // Ask for Health access on first mount
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setInitializing(false);
      setMsg('Apple Health is iOS-only. Build to an iPhone to test.');
      return;
    }
    if (didInit.current) return;
    didInit.current = true;

    AppleHealthKit.initHealthKit(perms, (err) => {
      setInitializing(false);
      if (err) {
        setHkReady(false);
        setMsg('Health permission not granted. Tap “Grant Health Access” to try again.');
        return;
      }
      setHkReady(true);            // don’t call import here (avoids race)
      setMsg('Health access granted.');
    });
  }, []);

  // Auto-import once AFTER hkReady becomes true (solves the race)
  useEffect(() => {
    if (hkReady) {
      importHeartRate(30);
    }
  }, [hkReady]);

  const importHeartRate = (daysBack = 30) => {
    if (!hkReady) {
      Alert.alert('HealthKit', 'Please authorize first.');
      return;
    }
    const end = new Date();
    const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const options = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      ascending: false,
      limit: 10000,
    };

    setLoading(true);
    setMsg(`Importing heart rate (last ${daysBack} days)…`);
    AppleHealthKit.getHeartRateSamples(options, (err, results: any[] = []) => {
      setLoading(false);
      if (err) {
        console.error('getHeartRateSamples error', err);
        setHr([]);
        setMsg(`Error loading heart rate: ${String(err)}`);
        return;
      }
      const samples: HRSample[] = results.map(r => ({
        startDate: r.startDate, value: r.value, unit: r.unit || 'bpm'
      }));
      setHr(samples);
      setMsg(
        samples.length
          ? `Imported ${samples.length} heart-rate samples from the last ${daysBack} days.`
          : `No heart-rate samples found in the last ${daysBack} days.`
      );
      console.log('HR sample preview:', samples.slice(0, 5));
    });
  };

  const retryAuth = () => {
    setMsg('Requesting Health access…');
    setInitializing(true);
    AppleHealthKit.initHealthKit(perms, (err) => {
      setInitializing(false);
      if (err) {
        setHkReady(false);
        setMsg('Still not granted. In Health app: Profile → Apps → Your App → Allow.');
        return;
      }
      setHkReady(true);
      setMsg('Health access granted.');
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1}>Heart Activity</Text>
        <View style={styles.row}>
          {(initializing || loading) && <ActivityIndicator />}
          <Text style={styles.msg}>{msg}</Text>
        </View>
        <View style={styles.row}>
          {Platform.OS === 'ios' && !hkReady ? (
            <Button
              title={initializing ? 'Requesting Health Access…' : 'Grant Health Access'}
              onPress={retryAuth}
              disabled={initializing}
            />
          ) : (
            <>
              <Button title="Refresh (30 days)" onPress={() => importHeartRate(30)} disabled={loading} />
              <View style={{ width: 12 }} />
              <Button title="Load 90 days" onPress={() => importHeartRate(90)} disabled={loading} />
            </>
          )}
        </View>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.list}>
        {Platform.OS !== 'ios' ? (
          <Text style={styles.text}>Apple Health is iOS-only. Build to an iPhone to test.</Text>
        ) : (
          <>
            {hr.slice(0, 200).map((s, i) => (
              <Text key={`${s.startDate}-${i}`} style={styles.text}>
                {new Date(s.startDate).toLocaleString()} — {s.value} {s.unit || 'bpm'}
              </Text>
            ))}
            {hkReady && !loading && hr.length === 0 && (
              <Text style={[styles.text, { fontStyle: 'italic', marginTop: 8 }]}>
                No samples found. In Health → Browse → Heart → Heart Rate → “+”, add a couple of entries,
                then tap Refresh.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  header: { paddingHorizontal: 16, paddingTop: 12 },
  h1: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  msg: { color: '#cfcfcf', marginLeft: 8, flexShrink: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  text: { color: '#ffffff', marginBottom: 6 },
});
