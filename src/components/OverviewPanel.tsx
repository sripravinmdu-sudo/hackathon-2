import { DashboardData } from '../types';
import { SEMESTER_END } from '../data/timetable';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'default' | 'safe' | 'watch' | 'risk' | 'danger';
  animate?: boolean;
}

function MetricCard({ label, value, sub, accent = 'default', animate }: MetricCardProps) {
  const colors = {
    default: 'text-white',
    safe: 'text-emerald-400',
    watch: 'text-amber-400',
    risk: 'text-orange-400',
    danger: 'text-red-400',
  };

  return (
    <div className={`surface-card p-6 ${animate ? 'animate-in' : ''}`}>
      <p className="label-subtle mb-3">{label}</p>
      <p className={`text-4xl font-bold tracking-tight ${colors[accent]}`} style={{ letterSpacing: '-0.03em' }}>
        {value}
      </p>
      {sub && <p className="text-xs text-white/30 mt-2">{sub}</p>}
    </div>
  );
}

interface SemesterProgressProps {
  progress: number;
}

function SemesterProgress({ progress }: SemesterProgressProps) {
  const today = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((SEMESTER_END.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="surface-card p-4 flex items-center gap-6">
      <div className="flex-shrink-0">
        <p className="label-subtle mb-1">Semester Progress</p>
        <p className="text-2xl font-bold text-white tracking-tight">{progress.toFixed(0)}%</p>
        <p className="text-xs text-white/30 mt-0.5">{daysLeft} days left</p>
      </div>
      <div className="flex-1">
        <div className="flex text-xs text-white/30 justify-between mb-1.5">
          <span>29 Aug 2026</span>
          <span>29 Nov 2026</span>
        </div>
        <div className="relative h-1.5 bg-white/[0.06] rounded-full overflow-visible">
          <div
            className="absolute left-0 top-0 h-full bg-indigo-500/50 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-indigo-400 rounded-full border-2 border-[#0a0a0c] shadow-md shadow-indigo-500/40 z-10"
            style={{ left: `calc(${Math.min(97, progress)}% - 7px)` }}
          />
        </div>
        <div className="flex text-xs text-white/25 justify-center mt-1.5">
          <span>Today: {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

interface OverviewPanelProps {
  data: DashboardData;
  onSubjectClick: (id: string) => void;
}

export function OverviewPanel({ data, onSubjectClick }: OverviewPanelProps) {
  const overallRisk =
    data.overallAttendance >= 85
      ? 'safe'
      : data.overallAttendance >= 75
        ? 'watch'
        : data.overallAttendance >= 60
          ? 'risk'
          : 'danger';

  const lastCalc = data.generatedAt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-white tracking-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Attendance Command Center
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            A mathematical forecast of where your semester is heading.
          </p>
        </div>
        <div className="text-right text-xs text-white/30">
          <p>Last calculated</p>
          <p className="text-white/50 font-mono">{lastCalc}</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Overall Attendance"
          value={`${data.overallAttendance.toFixed(1)}%`}
          sub={`${overallRisk === 'safe' ? 'Above target' : overallRisk === 'watch' ? 'Near threshold' : 'Below threshold'}`}
          accent={overallRisk as 'safe' | 'watch' | 'risk' | 'danger'}
          animate
        />
        <MetricCard
          label="Classes Remaining"
          value={data.totalRemaining}
          sub="Until planning date"
          animate
        />
        <MetricCard
          label="Safe Subjects"
          value={`${data.safeCount} / ${data.subjects.length}`}
          sub="Above 75% threshold"
          accent="safe"
          animate
        />
        <MetricCard
          label="Need Attention"
          value={data.atRiskCount}
          sub={data.atRiskCount === 0 ? 'All subjects clear' : 'Subjects at risk'}
          accent={data.atRiskCount > 0 ? 'danger' : 'safe'}
          animate
        />
      </div>

      {/* Semester progress */}
      <SemesterProgress progress={data.semesterProgress} />
    </div>
  );
}
