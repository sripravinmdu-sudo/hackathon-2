import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ForecastPoint, RiskLevel } from '../types';

interface ForecastChartProps {
  points: ForecastPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ForecastPoint }>;
  label?: string;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: '#10b981',
  WATCH: '#f59e0b',
  AT_RISK: '#f97316',
  IRREVERSIBLE: '#ef4444',
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload as ForecastPoint;
  const pct = data.percentage;
  const risk = data.risk;

  const riskLabels: Record<RiskLevel, string> = {
    SAFE: 'Safe',
    WATCH: 'Watch',
    AT_RISK: 'At Risk',
    IRREVERSIBLE: 'Irreversible',
  };

  return (
    <div className="bg-[#111115] border border-white/[0.12] rounded-xl p-4 shadow-xl shadow-black/50 min-w-[180px]">
      <p className="text-white/50 text-xs mb-2 font-medium">{data.dateLabel}</p>
      <p
        className="text-2xl font-bold mb-2 tracking-tight"
        style={{ color: RISK_COLORS[risk], letterSpacing: '-0.02em' }}
      >
        {pct.toFixed(1)}%
      </p>
      <div className="space-y-1 text-xs text-white/40">
        <p>Attended: <span className="text-white/70">{data.attended}</span></p>
        <p>Conducted: <span className="text-white/70">{data.conducted}</span></p>
      </div>
      <div className="mt-2 pt-2 border-t border-white/[0.06]">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{
            color: RISK_COLORS[risk],
            background: `${RISK_COLORS[risk]}18`,
            border: `1px solid ${RISK_COLORS[risk]}30`,
          }}
        >
          {riskLabels[risk]}
        </span>
      </div>
    </div>
  );
}

export function ForecastChart({ points }: ForecastChartProps) {
  if (!points.length) return null;

  const minY = Math.max(0, Math.min(...points.map(p => p.percentage)) - 5);
  const maxY = Math.min(100, Math.max(...points.map(p => p.percentage)) + 5);

  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Attendance Forecast</h2>
          <p className="text-xs text-white/40 mt-0.5">
            CURRENT → FORECAST → SEMESTER END
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-emerald-400 inline-block" />
            <span>75% Detention</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-indigo-400 inline-block" />
            <span>90% Target</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="pctGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[Math.floor(minY), Math.ceil(maxY)]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={75}
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="6 3"
            label={{ value: '75%', fill: '#10b981', fontSize: 11, position: 'insideBottomRight' }}
          />
          <ReferenceLine
            y={90}
            stroke="#6366f1"
            strokeWidth={1}
            strokeDasharray="6 3"
            label={{ value: '90%', fill: '#6366f1', fontSize: 11, position: 'insideTopRight' }}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#pctGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
