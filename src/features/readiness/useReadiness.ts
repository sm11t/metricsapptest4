import { useMemo, useState } from 'react';
import { computeReadiness } from './math';
import { sampleReadinessPack } from './sample';

export default function useReadiness() {
  // Mock: later we’ll replace sampleReadinessPack with real hook inputs.
  const [trend] = useState<number[]>(sampleReadinessPack.trend7);

  const { score, badge, drivers, reason } = useMemo(() => {
    return computeReadiness({
      ...sampleReadinessPack.today,
      base: sampleReadinessPack.base as any,
    });
  }, []);

  const spark = trend.map(v => ({ value: v })); // tiny score spark

  const refresh = () => {}; // no-op for mock
  const lastSyncAt = Date.now();

  return { score, badge, drivers, reason, spark, refresh, lastSyncAt, loading: false };
}
