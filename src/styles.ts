import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const PAD_H = 16;
export const GAP = 12;
export const CARD = Math.floor((SCREEN_W - PAD_H * 2 - GAP) / 2);
export const CHART_H = Math.round(CARD * 0.5);
export const CARD_WIDE = CARD * 2 + GAP;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { paddingHorizontal: PAD_H, paddingTop: 12, paddingBottom: 16 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 10,
  },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700' },
  refreshBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#1a1a1a' },
  refreshText: { color: '#60a5fa', fontWeight: '700' },
  statusText: { color: '#9ca3af', marginTop: 6, marginBottom: 10 },

  // calendar
  calWrap: { marginTop: 2, marginBottom: 12, alignItems: 'center' },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 10, marginBottom: 8 },
  calTitle: { color: '#e5e7eb', fontWeight: '700' },
  chevBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderWidth: 1, borderColor: '#1f2937' },
  chevText: { color: '#fff', fontSize: 18, marginTop: -2 },
  calRow: { paddingHorizontal: 6 },
  calItem: { alignItems: 'center', width: 68, paddingHorizontal: 4 },
  calDow: { color: '#9ca3af', marginBottom: 6, fontSize: 12 },
  calDowSelected: { color: '#10b981' },
  calCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderWidth: 1, borderColor: '#1f2937' },
  calCircleSelected: { borderColor: '#10b981', backgroundColor: '#0b0b0b' },
  calDayNum: { color: '#e5e7eb', fontWeight: '800', fontSize: 16 },
  calDayNumSelected: { color: '#10b981' },
  calSub: { color: '#9ca3af', marginTop: 6, fontSize: 12, textAlign: 'center' },

  // grid/cards
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, zIndex: 0 },
  square: {
    width: CARD,
    height: CARD,
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    overflow: 'hidden',
  },
  squareTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  squareTitle: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  squareCenter: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  squareBig: { color: '#fff', fontSize: 28, fontWeight: '800', marginRight: 6 },
  squareUnit: { color: '#cfcfcf', marginBottom: 4 },
  squareSub: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  squareChart: { position: 'absolute', bottom: 10, left: 10, right: 10, height: CHART_H },
  xLabelsRow: { position: 'absolute', bottom: -2, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 },
  xLabel: { color: '#9ca3af', fontSize: 10 },
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontWeight: '700', fontSize: 10, letterSpacing: 0.4 },
});

export default styles;
export { CARD_WIDE };
