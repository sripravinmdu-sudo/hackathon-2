import { SubjectCalc } from '../types';
import { generateInsights } from '../engine/calculator';

interface InsightsPanelProps {
  subjects: SubjectCalc[];
}

export function InsightsPanel({ subjects }: InsightsPanelProps) {
  const insights = generateInsights(subjects);

  const getIcon = (text: string) => {
    if (text.includes('cannot mathematically') || text.includes('Irreversible')) return '⚠';
    if (text.includes('needs attention') || text.includes('at least')) return '●';
    if (text.includes('buffer') || text.includes('can miss')) return '◆';
    return '◇';
  };

  const getColor = (text: string) => {
    if (text.includes('cannot mathematically') || text.includes('Irreversible')) return {
      card: 'bg-red-500/[0.04] border-red-500/15',
      icon: 'text-red-400',
      text: 'text-red-300/70',
    };
    if (text.includes('needs attention') || text.includes('at least')) return {
      card: 'bg-amber-500/[0.04] border-amber-500/15',
      icon: 'text-amber-400',
      text: 'text-amber-300/70',
    };
    return {
      card: 'bg-emerald-500/[0.04] border-emerald-500/15',
      icon: 'text-emerald-400',
      text: 'text-emerald-300/70',
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">AttendGuard Insights</h2>
        <p className="text-white/40 text-sm">
          Predictive Insights — generated from the calculation engine, not guesswork.
        </p>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <p className="text-white/30 text-sm">No insights to display.</p>
          </div>
        ) : (
          insights.map((insight, i) => {
            const colors = getColor(insight);
            const icon = getIcon(insight);
            return (
              <div
                key={i}
                className={`rounded-xl border p-5 ${colors.card} animate-in`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex gap-3">
                  <span className={`text-lg leading-none flex-shrink-0 mt-0.5 ${colors.icon}`}>
                    {icon}
                  </span>
                  <p className="text-sm text-white/75 leading-relaxed">{insight}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary table */}
      <div className="surface-card p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
          Risk Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2 px-3 text-xs text-white/40 font-medium">Subject</th>
                <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">Current</th>
                <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">Remaining</th>
                <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">Min for 75%</th>
                <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">Max Possible</th>
                <th className="text-center py-2 px-3 text-xs text-white/40 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-white/70 font-medium text-xs">{s.name}</td>
                  <td className="py-3 px-3 text-right font-mono text-xs">
                    <span
                      className={
                        s.risk === 'SAFE'
                          ? 'text-emerald-400'
                          : s.risk === 'WATCH'
                            ? 'text-amber-400'
                            : s.risk === 'AT_RISK'
                              ? 'text-orange-400'
                              : 'text-red-400'
                      }
                    >
                      {s.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-white/50 text-xs">{s.remaining}</td>
                  <td className="py-3 px-3 text-right text-xs">
                    {s.isIrreversible ? (
                      <span className="text-red-400/70">N/A</span>
                    ) : (
                      <span className="text-white/60">{s.minRequired75}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-white/50">
                    {s.maxPossible.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        s.risk === 'SAFE'
                          ? 'risk-safe'
                          : s.risk === 'WATCH'
                            ? 'risk-watch'
                            : s.risk === 'AT_RISK'
                              ? 'risk-at-risk'
                              : 'risk-irreversible'
                      }`}
                    >
                      {s.risk === 'AT_RISK' ? 'AT RISK' : s.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
