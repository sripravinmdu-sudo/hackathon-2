import { SubjectCalc } from '../types';

interface IrreversibleBannerProps {
  subjects: SubjectCalc[];
}

export function IrreversibleBanner({ subjects }: IrreversibleBannerProps) {
  const irreversible = subjects.filter(s => s.isIrreversible);
  if (irreversible.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-6 animate-in">
      <div className="flex items-start gap-4">
        {/* Warning icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2 L18 16 L2 16 Z"
              stroke="#ef4444"
              strokeWidth="1.5"
              fill="none"
              strokeLinejoin="round"
            />
            <line x1="10" y1="8" x2="10" y2="12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.75" fill="#ef4444" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-red-400 font-semibold text-sm tracking-wide mb-1">
            IRREVERSIBLE DETENTION — {irreversible.length === 1 ? '1 Subject' : `${irreversible.length} Subjects`}
          </h3>
          <p className="text-red-300/60 text-xs leading-relaxed mb-4">
            Even with perfect attendance from now until the end of the semester, reaching 75% is
            mathematically impossible in {irreversible.length === 1 ? 'this subject' : 'these subjects'}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {irreversible.map(s => (
              <div
                key={s.id}
                className="rounded-lg bg-red-500/[0.06] border border-red-500/15 p-3"
              >
                <p className="text-xs font-semibold text-white/70 mb-2 truncate">{s.name}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Current</p>
                    <p className="text-sm font-bold text-red-400">{s.percentage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Max Possible</p>
                    <p className="text-sm font-bold text-red-400/70">{s.maxPossible.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 mb-0.5">Required</p>
                    <p className="text-sm font-bold text-white/40">75.0%</p>
                  </div>
                </div>
                <p className="text-[10px] text-red-400/60 text-center mt-2 font-semibold tracking-widest uppercase">
                  ● Irreversible
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
