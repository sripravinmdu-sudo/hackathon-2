import { useState, useEffect } from 'react';
import { SubjectInput } from '../types';
import { SUBJECTS_BY_SECTION, SECTIONS, getDemoAttendanceForSubject, SEMESTER_START, SEMESTER_END } from '../data/timetable';
import { Logo } from './Logo';

interface SetupPanelProps {
  onGenerate: (data: {
    section: string;
    planningDate: string;
    subjects: SubjectInput[];
  }) => void;
  userSection: string;
}

export function SetupPanel({ onGenerate, userSection }: SetupPanelProps) {
  const [section, setSection] = useState(userSection);
  const [planningDate, setPlanningDate] = useState('');
  const [subjects, setSubjects] = useState<SubjectInput[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = new Date();

  useEffect(() => {
    const sectionSubjects = SUBJECTS_BY_SECTION[section] || [];
    const initial: SubjectInput[] = sectionSubjects.map((name, i) => {
      const demo = getDemoAttendanceForSubject(name);
      return {
        id: `subj-${i}`,
        name,
        attended: demo.attended,
        conducted: demo.conducted,
      };
    });
    setSubjects(initial);

    // Default planning date: 4 weeks from today
    const defaultPlan = new Date(today);
    defaultPlan.setDate(defaultPlan.getDate() + 28);
    const clamped = defaultPlan > SEMESTER_END ? SEMESTER_END : defaultPlan;
    setPlanningDate(clamped.toISOString().split('T')[0]);
  }, []);

  const semesterTotalDays = Math.ceil(
    (SEMESTER_END.getTime() - SEMESTER_START.getTime()) / (1000 * 60 * 60 * 24)
  );
  const semesterElapsedDays = Math.max(
    0,
    Math.ceil((today.getTime() - SEMESTER_START.getTime()) / (1000 * 60 * 60 * 24))
  );
  const semesterProgress = Math.min(100, (semesterElapsedDays / semesterTotalDays) * 100);

  function updateSubject(id: string, field: 'attended' | 'conducted', value: string) {
    const num = parseInt(value, 10);
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: isNaN(num) ? 0 : Math.max(0, num) };
        // Auto-correct: attended can't exceed conducted
        if (field === 'attended' && updated.attended > updated.conducted) {
          updated.conducted = updated.attended;
        }
        return updated;
      })
    );
    setErrors(prev => ({ ...prev, [id]: '' }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!planningDate) {
      newErrors['planningDate'] = 'Please select a planning date.';
    } else {
      const pd = new Date(planningDate);
      if (pd <= today) newErrors['planningDate'] = 'Planning date must be after today.';
      else if (pd > SEMESTER_END)
        newErrors['planningDate'] = 'Planning date cannot be after semester end (29 Nov 2026).';
      else if (pd < SEMESTER_START)
        newErrors['planningDate'] = 'Planning date cannot be before semester start.';
    }

    for (const s of subjects) {
      if (s.attended < 0) newErrors[s.id] = 'Attended cannot be negative.';
      else if (s.conducted < 0) newErrors[s.id] = 'Conducted cannot be negative.';
      else if (s.attended > s.conducted) newErrors[s.id] = 'Attended cannot exceed conducted.';
      else if (s.conducted === 0) newErrors[s.id] = 'Enter at least 1 conducted class.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleGenerate() {
    if (!validate()) return;
    onGenerate({ section, planningDate, subjects });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="pt-24 pb-10 px-6 text-center">
        <div className="flex justify-center mb-6">
          <Logo size={48} showWordmark={false} />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs text-indigo-300 font-medium tracking-wide">Demo Data Loaded</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
          Know the risk. <span className="text-indigo-400">Plan ahead.</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
          AttendGuard turns your attendance and timetable into a forecast for the rest of your semester.
        </p>
      </div>

      {/* Setup Panel */}
      <div className="flex-1 px-6 pb-16 max-w-5xl mx-auto w-full">
        <div className="surface-card p-8 mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">Build your forecast</h2>
          <p className="text-white/40 text-sm mb-8">
            Tell AttendGuard where you are today. We'll calculate the road ahead.
          </p>

          {/* Config row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Section */}
            <div>
              <label className="label-subtle mb-2 block">Class Section</label>
              <select
                value={section}
                onChange={e => {
                  setSection(e.target.value);
                  // Update subjects based on selected section
                  const sectionSubjects = SUBJECTS_BY_SECTION[e.target.value] || [];
                  const initial: SubjectInput[] = sectionSubjects.map((name, i) => {
                    const demo = getDemoAttendanceForSubject(name);
                    return { id: `subj-${i}`, name, attended: demo.attended, conducted: demo.conducted };
                  });
                  setSubjects(initial);
                }}
                className="input-field w-full"
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Today */}
            <div>
              <label className="label-subtle mb-2 block">Today</label>
              <div className="input-field text-white/70 cursor-not-allowed flex items-center gap-2">
                <span className="text-emerald-400 text-xs">●</span>
                <span>
                  {today.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-xs text-white/30 mt-1">Auto-detected from your system</p>
            </div>

            {/* Planning date */}
            <div>
              <label className="label-subtle mb-2 block">Plan Until</label>
              <input
                type="date"
                value={planningDate}
                min={today.toISOString().split('T')[0]}
                max={SEMESTER_END.toISOString().split('T')[0]}
                onChange={e => {
                  setPlanningDate(e.target.value);
                  setErrors(prev => ({ ...prev, planningDate: '' }));
                }}
                className="input-field w-full"
              />
              {errors['planningDate'] && (
                <p className="text-red-400 text-xs mt-1">{errors['planningDate']}</p>
              )}
            </div>
          </div>

          {/* Semester Timeline */}
          <div className="mb-8 p-4 bg-white/[0.02] rounded-lg border border-white/[0.05]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium">Semester 2026</span>
              <span className="text-xs text-white/40">
                {semesterProgress.toFixed(0)}% completed
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <span>29 Aug</span>
              <div className="flex-1 relative h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-indigo-500/60 rounded-full transition-all duration-700"
                  style={{ width: `${semesterProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-[#0a0a0c] shadow-lg shadow-indigo-500/30"
                  style={{ left: `calc(${semesterProgress}% - 6px)` }}
                />
              </div>
              <span>29 Nov</span>
            </div>
            <p className="text-xs text-white/25 text-center">
              {Math.max(0, Math.ceil((SEMESTER_END.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))} days remaining
            </p>
          </div>

          {/* Attendance Table */}
          <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-widest text-xs">
            Subject Attendance
          </h3>
          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-xs text-white/40 font-medium tracking-wider">Subject</th>
                  <th className="text-right px-4 py-3 text-xs text-white/40 font-medium tracking-wider">Attended</th>
                  <th className="text-right px-4 py-3 text-xs text-white/40 font-medium tracking-wider">Conducted</th>
                  <th className="text-right px-4 py-3 text-xs text-white/40 font-medium tracking-wider">%</th>
                  <th className="text-center px-4 py-3 text-xs text-white/40 font-medium tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, i) => {
                  const pct = subj.conducted === 0 ? 0 : (subj.attended / subj.conducted) * 100;
                  const risk =
                    pct >= 85 ? 'SAFE' : pct >= 75 ? 'WATCH' : pct >= 60 ? 'AT_RISK' : 'LOW';

                  return (
                    <tr
                      key={subj.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                        i === subjects.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-white/80 font-medium text-sm">{subj.name}</td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          value={subj.attended}
                          min={0}
                          max={subj.conducted}
                          onChange={e => updateSubject(subj.id, 'attended', e.target.value)}
                          className="w-16 bg-[#0d0d10] border border-white/[0.08] rounded px-2 py-1 text-sm text-white/80 text-right focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          value={subj.conducted}
                          min={subj.attended}
                          onChange={e => updateSubject(subj.id, 'conducted', e.target.value)}
                          className="w-16 bg-[#0d0d10] border border-white/[0.08] rounded px-2 py-1 text-sm text-white/80 text-right focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            risk === 'SAFE'
                              ? 'text-emerald-400'
                              : risk === 'WATCH'
                                ? 'text-amber-400'
                                : risk === 'AT_RISK'
                                  ? 'text-orange-400'
                                  : 'text-red-400'
                          }`}
                        >
                          {pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                            risk === 'SAFE'
                              ? 'risk-safe'
                              : risk === 'WATCH'
                                ? 'risk-watch'
                                : risk === 'AT_RISK'
                                  ? 'risk-at-risk'
                                  : 'risk-irreversible'
                          }`}
                        >
                          {risk === 'AT_RISK' ? 'AT RISK' : risk}
                        </span>
                      </td>
                      {errors[subj.id] && (
                        <td colSpan={5} className="px-4 pb-2 text-red-400 text-xs">
                          {errors[subj.id]}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="btn-primary text-base px-10 py-4 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all duration-300"
          >
            Generate Forecast →
          </button>
        </div>
      </div>
    </div>
  );
}
