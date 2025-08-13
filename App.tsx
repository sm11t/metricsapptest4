import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';

type HRSample = { startDate: string; value: number; unit?: string };

const HK = AppleHealthKit.Constants.Permissions;

// Build the read list defensively; remove any undefined entries.
const READ_TYPES = [
  HK.HeartRate,
  HK.RestingHeartRate,
  HK.HeartRateVariabilitySDNN ?? (HK as any).HeartRateVariability,
  HK.SleepAnalysis,
  HK.RespiratoryRate,
  HK.MindfulSession,
].filter(Boolean);

const perms: HealthKitPermissions = {
  permissions: { read: READ_TYPES as any, write: [] },
};

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [hkReady, setHkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('Requesting Health access…');
  const [hr, setHr] = useState<HRSample[]>([]);
  const didInit = useRef(false);

  // Authorize on launch, then auto-import HR
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
      setHkReady(true);
      setMsg('Health access granted. Importing heart rate…');
      importHeartRate(30);
    });
  }, []);

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
      const samples: HRSample[] = results.map((r) => ({
        startDate: r.startDate,
        value: r.value,
        unit: r.unit || 'bpm',
      }));
      setHr(samples);
      setMsg(
        samples.length
          ? `Imported ${samples.length} heart-rate samples from the last ${daysBack} days.`
          : `No heart-rate samples found in the last ${daysBack} days.`
      );
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
      setMsg('Health access granted. Importing heart rate…');
      importHeartRate(30);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Heart Activity</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {(initializing || loading) && <ActivityIndicator />}
          <Text>{msg}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          {Platform.OS === 'ios' && !hkReady ? (
            <Button
              title={initializing ? 'Requesting Health Access…' : 'Grant Health Access'}
              onPress={retryAuth}
              disabled={initializing}
            />
          ) : (
            <>
              <Button
                title="Refresh (30 days)"
                onPress={() => importHeartRate(30)}
                disabled={loading || !hkReady}
              />
              <Button
                title="Load 90 days"
                onPress={() => importHeartRate(90)}
                disabled={loading || !hkReady}
              />
            </>
          )}
        </View>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {Platform.OS !== 'ios' ? (
          <Text>Apple Health is iOS-only. Build to an iPhone to test.</Text>
        ) : (
          <>
            {hr.slice(0, 200).map((s, i) => {
              const when = new Date(s.startDate).toLocaleString();
              return (
                <Text key={`${s.startDate}-${i}`} style={{ marginBottom: 4 }}>
                  {when} — {s.value} {s.unit || 'bpm'}
                </Text>
              );
            })}
            {hkReady && !loading && hr.length === 0 ? (
              <Text style={{ marginTop: 8, fontStyle: 'italic' }}>
                Tip: No HR yet? Health app → Browse → Heart → Heart Rate → “+” to add a sample,
                then tap Refresh.
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
