import { SubjectCalc } from '../types';
import { projectedAttendance } from '../engine/calculator';

interface WhatIfSimulatorProps {
  subjects: SubjectCalc[];
  whatIfClasses: number;
  onWhatIfChange: (n: number) => void;
}

export function WhatIfSimulator({ subjects, whatIfClasses, onWhatIfChange }: WhatIfSimulatorProps) {
  const options = [0, 1, 2, 3, 5, 10, 15, 20];

  // Calc what-if overall
  const totalAttended = subjects.reduce((s, x) => s + x.attended, 0);
  const totalConducted = subjects.reduce((s, x) => s + x.conducted, 0);
  const totalRemaining = subjects.reduce((s, x) => s + x.remaining, 0);

  // Distribute whatIfClasses proportionally across subjects by remaining count
  let futureAtt = 0;
  for (const s of subjects) {
    const share =
      totalRemaining === 0
        ? 0
        : Math.min(s.remaining, Math.round((s.remaining / totalRemaining) * whatIfClasses));
    futureAtt += share;
  }
  const displayPct = projectedAttendance(totalAttended, totalConducted, totalRemaining, futureAtt);

  const currentPct =
    totalConducted === 0 ? 0 : (totalAttended / totalConducted) * 100;

  const delta = displayPct - currentPct;

  const risk =
    displayPct >= 85
      ? 'SAFE'
      : displayPct >= 75
        ? 'WATCH'
        : 'AT_RISK';

  const riskConfig = {
    SAFE: { label: 'Safe', color: '#10b981' },
    WATCH: { label: 'Watch', color: '#f59e0b' },
    AT_RISK: { label: 'At Risk', color: '#f97316' },
  };

  const dist75 = displayPct - 75;
  const dist90 = displayPct - 90;

  return (
    <div className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">What if?</h2>
        <p className="text-white/40 text-sm">
          What happens if you attend your next <strong className="text-white/60">N</strong> classes?
        </p>
      </div>

      {/* Class selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {options.map(n => (
          <button
            key={n}
            onClick={() => onWhatIfChange(n)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              whatIfClasses === n
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30'
                : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
            }`}
          >
            {n === 0 ? 'Skip all' : `${n} class${n !== 1 ? 'es' : ''}`}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-white/30">Custom:</span>
          <input
            type="number"
            min={0}
            max={totalRemaining}
            value={whatIfClasses}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) onWhatIfChange(Math.max(0, Math.min(totalRemaining, v)));
            }}
            className="w-16 bg-[#0d0d10] border border-white/[0.08] rounded-lg px-2 py-1.5 text-sm text-white/80 text-center focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Projected attendance */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="label-subtle mb-2">Projected Attendance</p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: riskConfig[risk].color, letterSpacing: '-0.03em' }}
          >
            {displayPct.toFixed(1)}%
          </p>
          <p className={`text-xs mt-1 font-medium ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% from current
          </p>
        </div>

        {/* Risk status */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
          <p className="label-subtle mb-2">Risk Status</p>
          <p
            className="text-xl font-bold"
            style={{ color: riskConfig[risk].color }}
          >
            {riskConfig[risk].label}
          </p>
        </div>

        {/* Distance from 75% */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
          <p className="label-subtle mb-2">From 75%</p>
          <p className={`text-xl font-bold ${dist75 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {dist75 >= 0 ? '+' : ''}{dist75.toFixed(1)}%
          </p>
        </div>

        {/* Distance from 90% */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
          <p className="label-subtle mb-2">From 90%</p>
          <p className={`text-xl font-bold ${dist90 >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {dist90 >= 0 ? '+' : ''}{dist90.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Visual bar */}
      <div className="relative">
        <div className="flex justify-between text-xs text-white/30 mb-2">
          <span>0%</span>
          <span className="text-emerald-400/60">75%</span>
          <span className="text-indigo-400/60">90%</span>
          <span>100%</span>
        </div>
        <div className="h-4 bg-white/[0.04] rounded-full overflow-hidden relative">
          {/* 75% threshold marker */}
          <div className="absolute left-[75%] top-0 bottom-0 w-px bg-emerald-500/40 z-10" />
          {/* 90% marker */}
          <div className="absolute left-[90%] top-0 bottom-0 w-px bg-indigo-500/40 z-10" />
          {/* Before bar */}
          <div
            className="absolute h-full bg-white/[0.06] rounded-full"
            style={{ width: `${Math.min(100, currentPct)}%` }}
          />
          {/* After bar (what-if) */}
          <div
            className="absolute h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, displayPct)}%`,
              background: riskConfig[risk].color,
              opacity: 0.7,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/20 mt-1.5">
          <span>Current: {currentPct.toFixed(1)}%</span>
          <span>Projected: {displayPct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Per-subject impact */}
      <div className="mt-6 pt-6 border-t border-white/[0.06]">
        <p className="text-xs text-white/40 mb-3 uppercase tracking-widest">Impact per subject</p>
        <div className="space-y-2">
          {subjects.map(s => {
            const share =
              totalRemaining === 0
                ? 0
                : Math.min(s.remaining, Math.round((s.remaining / totalRemaining) * whatIfClasses));
            const proj = projectedAttendance(s.attended, s.conducted, s.remaining, share);
            const diff = proj - s.percentage;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-44 flex-shrink-0 truncate">{s.name}</span>
                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      proj >= 85 ? 'bg-emerald-500' : proj >= 75 ? 'bg-amber-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(100, proj)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-white/60 w-12 text-right">
                  {proj.toFixed(0)}%
                </span>
                <span className={`text-xs font-mono w-12 text-right ${diff >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                  {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
