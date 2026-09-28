import { Logo } from './Logo';
import { RiskLevel } from '../types';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: 'forecast' | 'planner' | 'insights') => void;
  section: string;
  onSectionChange: (section: string) => void;
  showTabs: boolean;
  overallRisk?: RiskLevel;
}

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export function Navbar({
  activeTab,
  onTabChange,
  section,
  onSectionChange,
  showTabs,
  overallRisk,
}: NavbarProps) {
  const tabs: Array<{ key: 'forecast' | 'planner' | 'insights'; label: string }> = [
    { key: 'forecast', label: 'Dashboard' },
    { key: 'planner', label: 'Planner' },
    { key: 'insights', label: 'Insights' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-[#0a0a0c]/90 backdrop-blur-md">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo size={28} showWordmark />
      </div>

      {/* Center tabs */}
      {showTabs && (
        <div className="flex-1 flex items-center justify-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 font-medium ${
                activeTab === tab.key
                  ? 'text-white bg-white/[0.08]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto">
        {showTabs && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Section</span>
            <select
              value={section}
              onChange={e => onSectionChange(e.target.value)}
              className="bg-[#111115] border border-white/[0.08] rounded-md px-2.5 py-1 text-sm text-white/80 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
            >
              {SECTIONS.map(s => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              overallRisk === 'IRREVERSIBLE'
                ? 'bg-red-500'
                : overallRisk === 'AT_RISK'
                  ? 'bg-orange-400'
                  : overallRisk === 'WATCH'
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
            } animate-pulse`}
          />
          <span className="text-xs text-white/50 font-medium tracking-wide">
            Prediction Engine Active
          </span>
        </div>
      </div>
    </nav>
  );
}
