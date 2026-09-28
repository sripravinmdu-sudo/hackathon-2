import { SubjectCalc, RiskLevel } from '../types';

const RISK_CONFIG: Record<RiskLevel, { label: string; textClass: string; bgClass: string; borderClass: string; dot: string }> = {
  SAFE: {
    label: 'Safe',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/8',
    borderClass: 'border-emerald-500/15',
    dot: 'bg-emerald-400',
  },
  WATCH: {
    label: 'Watch',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/8',
    borderClass: 'border-amber-500/15',
    dot: 'bg-amber-400',
  },
  AT_RISK: {
    label: 'At Risk',
    textClass: 'text-orange-400',
    bgClass: 'bg-orange-500/8',
    borderClass: 'border-orange-500/15',
    dot: 'bg-orange-400',
  },
  IRREVERSIBLE: {
    label: 'Irreversible',
    textClass: 'text-red-400',
    bgClass: 'bg-red-500/8',
    borderClass: 'border-red-500/15',
    dot: 'bg-red-400',
  },
};

interface SubjectCardProps {
  subject: SubjectCalc;
  isSelected: boolean;
  onClick: () => void;
}

function SubjectCard({ subject: s, isSelected, onClick }: SubjectCardProps) {
  const rc = RISK_CONFIG[s.risk];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left surface-card-hover p-5 transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-indigo-500/40 bg-indigo-500/[0.05]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/80 font-medium text-sm leading-tight">{s.name}</p>
          <p className="text-xs text-white/30 mt-0.5">
            {s.attended}/{s.conducted} classes
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${rc.textClass} ${rc.borderClass}`}
          style={{ background: 'transparent' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
          {rc.label}
        </span>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="label-subtle mb-1">Current</p>
          <p className={`text-xl font-bold tracking-tight ${rc.textClass}`}>
            {s.percentage.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="label-subtle mb-1">Max Possible</p>
          <p className="text-xl font-bold tracking-tight text-white/70">
            {s.maxPossible.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            s.risk === 'SAFE'
              ? 'bg-emerald-500'
              : s.risk === 'WATCH'
                ? 'bg-amber-500'
                : s.risk === 'AT_RISK'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(100, s.percentage)}%` }}
        />
      </div>

      {/* Action line */}
      <div className="mt-3">
        {s.isIrreversible ? (
          <p className="text-xs text-red-400/70">
            Cannot reach 75% — max possible: {s.maxPossible.toFixed(1)}%
          </p>
        ) : s.risk === 'SAFE' && s.canMissAndStaySafe > 0 ? (
          <p className="text-xs text-emerald-400/70">
            Can miss {s.canMissAndStaySafe} class{s.canMissAndStaySafe !== 1 ? 'es' : ''} and stay above 75%
          </p>
        ) : s.minRequired75 > 0 ? (
          <p className="text-xs text-amber-400/70">
            Attend {s.minRequired75} of next {s.remaining} classes to stay above 75%
          </p>
        ) : (
          <p className="text-xs text-emerald-400/70">
            On track — {s.remaining} classes remaining
          </p>
        )}
      </div>
    </button>
  );
}

interface SubjectDetailProps {
  subject: SubjectCalc;
  onClose: () => void;
}

function SubjectDetail({ subject: s, onClose }: SubjectDetailProps) {
  const rc = RISK_CONFIG[s.risk];

  return (
    <div className="surface-card p-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="label-subtle mb-1">Subject Detail</p>
          <h3 className="text-xl font-bold text-white tracking-tight">{s.name}</h3>
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border mt-2 ${rc.textClass} ${rc.borderClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
            {rc.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/60 text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current', value: `${s.percentage.toFixed(1)}%`, accent: rc.textClass },
          { label: 'Attended', value: s.attended.toString(), accent: 'text-white' },
          { label: 'Conducted', value: s.conducted.toString(), accent: 'text-white/70' },
          { label: 'Remaining', value: s.remaining.toString(), accent: 'text-white/70' },
        ].map(item => (
          <div key={item.label} className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
            <p className="label-subtle mb-1">{item.label}</p>
            <p className={`text-2xl font-bold tracking-tight ${item.accent}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Irreversible alert */}
      {s.isIrreversible && (
        <div className="bg-red-500/[0.06] border border-red-500/20 rounded-xl p-5 mb-6">
          <p className="text-red-400 font-semibold text-sm mb-1">IRREVERSIBLE DETENTION</p>
          <p className="text-red-300/60 text-xs">
            Even with perfect attendance from now until the end of the semester, reaching 75% is
            mathematically impossible.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Current', value: `${s.percentage.toFixed(1)}%` },
              { label: 'Max Possible', value: `${s.maxPossible.toFixed(1)}%` },
              { label: 'Required', value: '75.0%' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-white/30 mb-1">{item.label}</p>
                <p className="text-sm font-bold text-red-400">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-400/70 text-center mt-3 font-semibold">● STATUS: IRREVERSIBLE</p>
        </div>
      )}

      {/* Path to safety */}
      {!s.isIrreversible && (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 mb-6">
          <h4 className="text-sm font-semibold text-white/70 mb-4">Your path to safety</h4>
          <div className="space-y-3">
            {[
              {
                label: 'To stay above 75%',
                value: `Attend at least ${s.minRequired75} of ${s.remaining} classes`,
                note:
                  s.minRequired75 === 0
                    ? `✓ Already safe — can miss ${s.canMissAndStaySafe} more`
                    : null,
              },
              {
                label: 'To reach 90%',
                value:
                  s.minRequired90 >= s.remaining
                    ? `Attend all ${s.remaining} classes`
                    : `Attend at least ${s.minRequired90} of ${s.remaining} classes`,
                note: null,
              },
              {
                label: 'Max possible attendance',
                value: `${s.maxPossible.toFixed(1)}%`,
                note: '(if all remaining classes attended)',
              },
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4 py-2 border-b border-white/[0.04] last:border-0">
                <p className="text-xs text-white/40 flex-shrink-0">{item.label}</p>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/80">{item.value}</p>
                  {item.note && <p className="text-xs text-white/30 mt-0.5">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual progress bar */}
      <div>
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>0%</span>
          <span>75%</span>
          <span>90%</span>
          <span>100%</span>
        </div>
        <div className="relative h-3 bg-white/[0.04] rounded-full overflow-hidden">
          {/* 75% marker */}
          <div className="absolute left-[75%] top-0 bottom-0 w-px bg-emerald-500/40" />
          {/* 90% marker */}
          <div className="absolute left-[90%] top-0 bottom-0 w-px bg-indigo-500/40" />
          {/* Current */}
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              s.risk === 'SAFE'
                ? 'bg-emerald-500'
                : s.risk === 'WATCH'
                  ? 'bg-amber-500'
                  : s.risk === 'AT_RISK'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, s.percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface SubjectGridProps {
  subjects: SubjectCalc[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function SubjectGrid({ subjects, selectedId, onSelect }: SubjectGridProps) {
  const selected = subjects.find(s => s.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Subject Analysis</h2>

      {/* Selected detail */}
      {selected && (
        <SubjectDetail
          subject={selected}
          onClose={() => onSelect(null)}
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(s => (
          <SubjectCard
            key={s.id}
            subject={s}
            isSelected={s.id === selectedId}
            onClick={() => onSelect(s.id === selectedId ? null : s.id)}
          />
        ))}
      </div>
    </div>
  );
}
