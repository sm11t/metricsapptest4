import type { Driver } from './sample';

export type Baseline = { baseline?: number; sigma?: number };
export type TodayPack = {
  hrv?: number; rhr?: number; sleepDurMin?: number; sleepEff?: number; resp?: number; strain?: number;
  base: Record<Driver, Baseline>;
};

const clamp = (v:number, lo:number, hi:number)=>Math.min(hi,Math.max(lo,v));
const pct = (v?:number,b?:number)=> (isFinite(v!)&&isFinite(b!)&&b!>0) ? (v!-b!)/b! : undefined;
const z   = (v?:number,b?:number,s?:number)=> (isFinite(v!)&&isFinite(b!)&&isFinite(s!)&&s!>0) ? (v!-b!)/s! : undefined;

export type DriverPoints = { driver: Driver; points: number; reason?: string };

export function computeReadiness(today: TodayPack){
  const {hrv,rhr,sleepDurMin,sleepEff,resp,strain,base} = today;
  const parts: DriverPoints[] = [];

  // HRV (+)
  { const zz = z(hrv, base.hrv.baseline, base.hrv.sigma);
    const p  = zz===undefined ? 0 : clamp(25*(zz/2), -25, 25);
    if (zz!==undefined) parts.push({driver:'hrv', points:p, reason:`HRV ${zz>=0?'+':''}${zz.toFixed(1)}σ`});
  }
  // RHR (− when above)
  { const zz = z(rhr, base.rhr.baseline, base.rhr.sigma);
    const p  = zz===undefined ? 0 : clamp(-20*(zz/2), -20, 10);
    if (zz!==undefined) parts.push({driver:'rhr', points:p, reason:`RHR ${zz>=0?'+':''}${zz.toFixed(1)}σ`});
  }
  // Sleep duration (+ via %Δ)
  { const d = pct(sleepDurMin, base.sleepDur.baseline);
    const p = d===undefined ? 0 : clamp(20*(d/0.20), -20, 20);
    if (d!==undefined) parts.push({driver:'sleepDur', points:p, reason:`Sleep ${d>=0?'+':''}${Math.round(d*100)}%`});
  }
  // Sleep efficiency (+ via %Δ)
  { const d = pct(sleepEff, base.sleepEff.baseline);
    const p = d===undefined ? 0 : clamp(10*(d/0.10), -10, 10);
    if (d!==undefined) parts.push({driver:'sleepEff', points:p, reason:`Eff ${d>=0?'+':''}${Math.round(d*100)}%`});
  }
  // Respiratory (− when above)
  { const zz = z(resp, base.resp.baseline, base.resp.sigma);
    const p  = zz===undefined ? 0 : clamp(-10*(zz/2), -10, 5);
    if (zz!==undefined) parts.push({driver:'resp', points:p, reason:`Resp ${zz>=0?'+':''}${zz.toFixed(1)}σ`});
  }
  // Yesterday strain (− when high)
  { const zz = z(strain, base.strain.baseline, base.strain.sigma);
    const p  = zz===undefined ? 0 : clamp(-10*(zz/2), -10, 0);
    if (zz!==undefined) parts.push({driver:'strain', points:p, reason:`Strain ${zz>=0?'+':''}${zz.toFixed(1)}σ`});
  }

  const score = clamp(50 + parts.reduce((s,p)=>s+p.points,0), 0, 100);
  const badge = score < 40 ? 'RECOVER' : score > 70 ? 'TRAIN' : 'MAINTAIN';
  const top   = parts.slice().sort((a,b)=>Math.abs(b.points)-Math.abs(a.points))[0];

  return { score, badge, drivers: parts, reason: top?.reason };
}
