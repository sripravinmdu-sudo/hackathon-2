import { useState } from 'react';
import { SubjectCalc } from '../types';
import { countRemainingClasses, projectedAttendance } from '../engine/calculator';
import { SEMESTER_END, SEMESTER_START } from '../data/timetable';

interface PlannerProps {
  section: string;
  subjects: SubjectCalc[];
  currentPlanningDate: string;
}

export function Planner({ section, subjects, currentPlanningDate }: PlannerProps) {
  const today = new Date();
  const [targetDate, setTargetDate] = useState(currentPlanningDate);

  const planDate = targetDate ? new Date(targetDate) : null;

  const remaining = planDate
    ? countRemainingClasses(section, today, planDate)
    : {};

  const totalRemaining = Object.values(remaining).reduce((a, b) => a + b, 0);

  // Compute projected if attending minimum required
  const subjectProjections = subjects.map(s => {
    const rem = remaining[s.name] || 0;
    const proj = projectedAttendance(s.attended, s.conducted, rem, rem); // if all attended
    return { ...s, planRemaining: rem, planProjected: proj };
  });

  const totalAttended = subjects.reduce((s, x) => s + x.attended, 0);
  const totalConducted = subjects.reduce((s, x) => s + x.conducted, 0);
  const projOverall = projectedAttendance(totalAttended, totalConducted, totalRemaining, totalRemaining);
  const currentOverall = totalConducted === 0 ? 0 : (totalAttended / totalConducted) * 100;

  const risk =
    projOverall >= 85 ? 'safe' : projOverall >= 75 ? 'watch' : 'risk';

  // Timeline progress
  const todayPct = Math.min(100, ((today.getTime() - SEMESTER_START.getTime()) / (SEMESTER_END.getTime() - SEMESTER_START.getTime())) * 100);
  const planPct = planDate
    ? Math.min(100, ((planDate.getTime() - SEMESTER_START.getTime()) / (SEMESTER_END.getTime() - SEMESTER_START.getTime())) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Plan Ahead</h2>
        <p className="text-white/40 text-sm">
          See how your attendance changes before your next decision.
        </p>
      </div>

      {/* Date selector */}
      <div className="surface-card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="label-subtle mb-2 block">Plan Until Date</label>
            <input
              type="date"
              value={targetDate}
              min={today.toISOString().split('T')[0]}
              max={SEMESTER_END.toISOString().split('T')[0]}
              onChange={e => setTargetDate(e.target.value)}
              className="input-field w-full md:w-64"
            />
          </div>
          {planDate && (
            <div className="flex-1 text-sm text-white/50">
              <span className="text-white/30">Planning for: </span>
              <span className="text-white/70 font-medium">
                {planDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Timeline visualization */}
        {planDate && (
          <div className="mb-6">
            <p className="label-subtle mb-3">Timeline</p>
            <div className="relative">
              <div className="flex justify-between text-xs text-white/30 mb-2">
                <span>29 Aug</span>
                <span>29 Nov</span>
              </div>
              <div className="relative h-2 bg-white/[0.04] rounded-full">
                {/* Elapsed */}
                <div
                  className="absolute left-0 h-full bg-indigo-500/30 rounded-l-full"
                  style={{ width: `${todayPct}%` }}
                />
                {/* Today marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-[#0a0a0c] z-20"
                  style={{ left: `calc(${Math.min(97, todayPct)}% - 6px)` }}
                  title="Today"
                />
                {/* Plan marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-[#0a0a0c] z-20"
                  style={{ left: `calc(${Math.min(97, planPct)}% - 6px)` }}
                  title="Plan date"
                />
              </div>
              <div className="flex justify-between text-xs text-white/25 mt-2">
                <span style={{ marginLeft: `${Math.min(90, todayPct)}%` }}>
                  Today
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Summary cards */}
        {planDate && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
              <p className="label-subtle mb-2">Classes by this date</p>
              <p className="text-2xl font-bold text-white tracking-tight">{totalRemaining}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
              <p className="label-subtle mb-2">Projected (if all attend)</p>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  risk === 'safe' ? 'text-emerald-400' : risk === 'watch' ? 'text-amber-400' : 'text-orange-400'
                }`}
              >
                {projOverall.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
              <p className="label-subtle mb-2">Current Overall</p>
              <p className="text-2xl font-bold text-white/60 tracking-tight">{currentOverall.toFixed(1)}%</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
              <p className="label-subtle mb-2">Risk Level</p>
              <p
                className={`text-xl font-bold ${
                  risk === 'safe' ? 'text-emerald-400' : risk === 'watch' ? 'text-amber-400' : 'text-orange-400'
                }`}
              >
                {risk === 'safe' ? 'Safe' : risk === 'watch' ? 'Watch' : 'At Risk'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subject breakdown */}
      {planDate && (
        <div className="surface-card p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-widest text-xs">
            Subject Breakdown by {planDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-3 text-xs text-white/40 font-medium">Subject</th>
                  <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">Current</th>
                  <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">Classes Ahead</th>
                  <th className="text-right py-2 px-3 text-xs text-white/40 font-medium">If All Attended</th>
                  <th className="text-center py-2 px-3 text-xs text-white/40 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjectProjections.map(s => {
                  const projRisk =
                    s.planProjected >= 85
                      ? 'SAFE'
                      : s.planProjected >= 75
                        ? 'WATCH'
                        : 'AT_RISK';
                  return (
                    <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-3 px-3 text-white/70 font-medium">{s.name}</td>
                      <td className="py-3 px-3 text-right text-white/50 font-mono">
                        {s.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-right text-white/60">{s.planRemaining}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold">
                        <span
                          className={
                            projRisk === 'SAFE'
                              ? 'text-emerald-400'
                              : projRisk === 'WATCH'
                                ? 'text-amber-400'
                                : 'text-orange-400'
                          }
                        >
                          {s.planProjected.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            projRisk === 'SAFE'
                              ? 'risk-safe'
                              : projRisk === 'WATCH'
                                ? 'risk-watch'
                                : 'risk-at-risk'
                          }`}
                        >
                          {projRisk === 'AT_RISK' ? 'AT RISK' : projRisk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
