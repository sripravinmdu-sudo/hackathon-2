import { useState, useCallback } from 'react';
import { SubjectInput, DashboardData, RiskLevel } from './types';
import { buildDashboard } from './engine/calculator';
import { Navbar } from './components/Navbar';
import { SetupPanel } from './components/SetupPanel';
import { OverviewPanel } from './components/OverviewPanel';
import { ForecastChart } from './components/ForecastChart';
import { SubjectGrid } from './components/SubjectGrid';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { Planner } from './components/Planner';
import { InsightsPanel } from './components/InsightsPanel';
import { IrreversibleBanner } from './components/IrreversibleBanner';

type ActiveTab = 'forecast' | 'planner' | 'insights';

export default function App() {
  const [view, setView] = useState<'setup' | 'dashboard'>('setup');
  const [section, setSection] = useState('A');
  const [planningDate, setPlanningDate] = useState('');
  const [subjects, setSubjects] = useState<SubjectInput[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [whatIfClasses, setWhatIfClasses] = useState(5);
  const [activeTab, setActiveTab] = useState<ActiveTab>('forecast');

  const handleGenerate = useCallback(
    (data: { section: string; planningDate: string; subjects: SubjectInput[] }) => {
      const today = new Date();
      const planDate = new Date(data.planningDate);

      const dash = buildDashboard(data.section, data.subjects, today, planDate);

      setSection(data.section);
      setPlanningDate(data.planningDate);
      setSubjects(data.subjects);
      setDashboard(dash);
      setView('dashboard');
      setActiveTab('forecast');
      setSelectedSubjectId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const handleSectionChange = useCallback(
    (newSection: string) => {
      if (!planningDate || subjects.length === 0) return;
      setSection(newSection);
      const today = new Date();
      const planDate = new Date(planningDate);
      const dash = buildDashboard(newSection, subjects, today, planDate);
      setDashboard(dash);
    },
    [planningDate, subjects]
  );

  const overallRisk: RiskLevel | undefined = dashboard
    ? dashboard.overallAttendance >= 85
      ? 'SAFE'
      : dashboard.overallAttendance >= 75
        ? 'WATCH'
        : dashboard.overallAttendance >= 60
          ? 'AT_RISK'
          : 'IRREVERSIBLE'
    : undefined;

  return (
    <div className="min-h-screen">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        section={section}
        onSectionChange={handleSectionChange}
        showTabs={view === 'dashboard'}
        overallRisk={overallRisk}
      />

      <main className="pt-14">
        {view === 'setup' ? (
          <SetupPanel onGenerate={handleGenerate} />
        ) : (
          dashboard && (
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
              {/* Overview always visible */}
              <OverviewPanel
                data={dashboard}
                onSubjectClick={setSelectedSubjectId}
              />

              {/* Tab content */}
              {activeTab === 'forecast' && (
                <div className="space-y-8 animate-fade">
                  <IrreversibleBanner subjects={dashboard.subjects} />
                  <ForecastChart points={dashboard.forecastPoints} />
                  <SubjectGrid
                    subjects={dashboard.subjects}
                    selectedId={selectedSubjectId}
                    onSelect={setSelectedSubjectId}
                  />
                  <WhatIfSimulator
                    subjects={dashboard.subjects}
                    whatIfClasses={whatIfClasses}
                    onWhatIfChange={setWhatIfClasses}
                  />
                </div>
              )}

              {activeTab === 'planner' && (
                <div className="animate-fade">
                  <Planner
                    section={section}
                    subjects={dashboard.subjects}
                    currentPlanningDate={planningDate}
                  />
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="animate-fade">
                  <InsightsPanel subjects={dashboard.subjects} />
                </div>
              )}

              {/* Back to setup */}
              <div className="pt-4 pb-8 flex justify-center">
                <button
                  onClick={() => setView('setup')}
                  className="btn-ghost text-sm"
                >
                  ← Edit attendance data
                </button>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
