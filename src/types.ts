// ============================================================
// ATTENDGUARD TYPES
// ============================================================

export type RiskLevel = 'SAFE' | 'WATCH' | 'AT_RISK' | 'IRREVERSIBLE';

export interface SubjectInput {
  id: string;
  name: string;
  attended: number;
  conducted: number;
}

export interface SubjectCalc {
  id: string;
  name: string;
  attended: number;
  conducted: number;
  percentage: number;
  remaining: number; // from timetable
  maxPossible: number;
  minRequired75: number; // classes to attend to stay ≥75%
  minRequired90: number; // classes to attend to reach ≥90%
  missable90: number;    // classes can miss and stay ≥90% (only when current ≥90%)
  projectedIfMinimum: number; // final % if only attends min for 75%
  projectedIfAll: number;    // final % if attends all remaining
  risk: RiskLevel;
  isIrreversible: boolean;
  canMissAndStaySafe: number; // classes can miss and stay ≥75%
}

export interface TimetableEntry {
  subject: string;
  duration: 1; // 1 class period
}

export type DaySchedule = string[]; // list of subject names

export interface WeeklySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
}

export interface SectionTimetable {
  section: string;
  schedule: WeeklySchedule;
}

export interface ForecastPoint {
  date: string;
  dateLabel: string;
  attended: number;
  conducted: number;
  percentage: number;
  risk: RiskLevel;
}

export interface DashboardData {
  subjects: SubjectCalc[];
  overallAttendance: number;
  totalRemaining: number;
  safeCount: number;
  atRiskCount: number;
  forecastPoints: ForecastPoint[];
  semesterProgress: number;
  generatedAt: Date;
}

export interface AppState {
  section: string;
  planningDate: string;
  subjects: SubjectInput[];
  dashboard: DashboardData | null;
  activeView: 'setup' | 'dashboard';
  selectedSubject: string | null;
  whatIfClasses: number;
  activeTab: 'forecast' | 'planner' | 'insights';
}
