// ============================================================
// ATTENDGUARD CALCULATION ENGINE
// Core attendance mathematics - all real, no fake values
// ============================================================

import { SubjectInput, SubjectCalc, RiskLevel, ForecastPoint, DashboardData, WeeklySchedule } from '../types';
import { TIMETABLES, SEMESTER_START, SEMESTER_END } from '../data/timetable';

// ---- Date Utilities -----------------------------------------------

function getDayKey(date: Date): keyof WeeklySchedule {
  const day = date.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const map: Record<number, keyof WeeklySchedule> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };
  return map[day] ?? 'monday';
}

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0; // Not Sunday
}

/**
 * Count classes for each subject between startDate (exclusive) and endDate (inclusive).
 * Uses the timetable for the given section.
 */
export function countRemainingClasses(
  section: string,
  fromDate: Date,
  toDate: Date
): Record<string, number> {
  const schedule = TIMETABLES[section];
  if (!schedule) return {};

  const counts: Record<string, number> = {};
  const cursor = new Date(fromDate);
  cursor.setDate(cursor.getDate() + 1); // start from next day

  while (cursor <= toDate) {
    if (isWeekday(cursor)) {
      const dayKey = getDayKey(cursor);
      const classes = schedule[dayKey] || [];
      for (const subj of classes) {
        counts[subj] = (counts[subj] || 0) + 1;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return counts;
}

/**
 * Count classes already conducted for each subject between semStart and today.
 * This gives a reference for total-classes-from-timetable perspective.
 */
export function countConductedFromTimetable(
  section: string,
  fromDate: Date,
  toDate: Date
): Record<string, number> {
  return countRemainingClasses(section, new Date(fromDate.getTime() - 86400000), toDate);
}

// ---- Risk Calculation -----------------------------------------------

export function calcRisk(percentage: number, isIrreversible: boolean): RiskLevel {
  if (isIrreversible) return 'IRREVERSIBLE';
  if (percentage >= 90) return 'SAFE';
  if (percentage >= 75) return 'WATCH';
  if (percentage >= 60) return 'AT_RISK';
  return 'IRREVERSIBLE';
}

export function calcRiskFromAttendedTotal(attended: number, total: number, isIrrev: boolean): RiskLevel {
  if (total === 0) return 'SAFE';
  const pct = (attended / total) * 100;
  if (isIrrev) return 'IRREVERSIBLE';
  if (pct >= 85) return 'SAFE';
  if (pct >= 75) return 'WATCH';
  if (pct >= 60) return 'AT_RISK';
  return 'IRREVERSIBLE';
}

// ---- Core Math -----------------------------------------------

/**
 * Minimum future classes X to attend so that (A+X)/(C+R) >= T/100
 * X >= T*(C+R)/100 - A
 * Clamped to [0, R]
 */
export function minClassesForTarget(
  attended: number,
  conducted: number,
  remaining: number,
  targetPct: number
): number {
  const needed = (targetPct / 100) * (conducted + remaining) - attended;
  if (needed <= 0) return 0;
  return Math.min(Math.ceil(needed), remaining);
}

/**
 * How many classes can be missed from remaining while staying >= targetPct
 * (C + R) * T/100 <= A + (R - missed) => missed <= R - (T(C+R)/100 - A)
 */
export function maxMissableClasses(
  attended: number,
  conducted: number,
  remaining: number,
  targetPct: number
): number {
  if (remaining === 0) return 0;
  const threshold = (targetPct / 100) * (conducted + remaining);
  const canMiss = (attended + remaining) - threshold;
  return Math.max(0, Math.floor(canMiss));
}

/**
 * Final attendance % if all remaining classes are attended
 */
export function maxPossibleAttendance(
  attended: number,
  conducted: number,
  remaining: number
): number {
  if (conducted + remaining === 0) return 0;
  return ((attended + remaining) / (conducted + remaining)) * 100;
}

/**
 * Final attendance % if exactly X future classes are attended
 */
export function projectedAttendance(
  attended: number,
  conducted: number,
  remaining: number,
  futureAttended: number
): number {
  if (conducted + remaining === 0) return 0;
  const fa = Math.min(futureAttended, remaining);
  return ((attended + fa) / (conducted + remaining)) * 100;
}

// ---- Subject Calculation -----------------------------------------------

export function calculateSubject(
  subj: SubjectInput,
  remaining: number
): SubjectCalc {
  const { id, name, attended, conducted } = subj;
  const percentage = conducted === 0 ? 0 : (attended / conducted) * 100;

  const maxPoss = maxPossibleAttendance(attended, conducted, remaining);
  const isIrreversible = maxPoss < 75;

  const min75 = minClassesForTarget(attended, conducted, remaining, 75);
  const min90 = minClassesForTarget(attended, conducted, remaining, 90);

  const miss90 = percentage >= 90
    ? maxMissableClasses(attended, conducted, remaining, 90)
    : 0;

  const miss75 = maxMissableClasses(attended, conducted, remaining, 75);

  const projMin = projectedAttendance(attended, conducted, remaining, min75);
  const projAll = projectedAttendance(attended, conducted, remaining, remaining);

  const risk: RiskLevel = isIrreversible
    ? 'IRREVERSIBLE'
    : percentage >= 85
      ? 'SAFE'
      : percentage >= 75
        ? 'WATCH'
        : percentage >= 60
          ? 'AT_RISK'
          : 'IRREVERSIBLE';

  return {
    id,
    name,
    attended,
    conducted,
    percentage,
    remaining,
    maxPossible: maxPoss,
    minRequired75: min75,
    minRequired90: min90,
    missable90: miss90,
    projectedIfMinimum: projMin,
    projectedIfAll: projAll,
    risk,
    isIrreversible,
    canMissAndStaySafe: miss75,
  };
}

// ---- Forecast Series -----------------------------------------------

/**
 * Build a time-series forecast from today until planningDate
 * Based on section timetable: assume student attends MIN required classes
 */
export function buildForecastSeries(
  section: string,
  subjects: SubjectInput[],
  today: Date,
  planningDate: Date
): ForecastPoint[] {
  const schedule = TIMETABLES[section];
  if (!schedule) return [];

  // Build aggregate totals
  let totalAttended = subjects.reduce((s, x) => s + x.attended, 0);
  let totalConducted = subjects.reduce((s, x) => s + x.conducted, 0);

  const points: ForecastPoint[] = [];

  // First point = today
  points.push({
    date: today.toISOString().split('T')[0],
    dateLabel: formatDateLabel(today),
    attended: totalAttended,
    conducted: totalConducted,
    percentage: totalConducted === 0 ? 0 : (totalAttended / totalConducted) * 100,
    risk: getRiskForPct(totalConducted === 0 ? 0 : (totalAttended / totalConducted) * 100),
  });

  // Count remaining per subject to semester end
  const remainingToEnd = countRemainingClasses(section, today, SEMESTER_END);

  // Precompute min75 for each subject
  const minNeeded: Record<string, number> = {};
  for (const subj of subjects) {
    const rem = remainingToEnd[subj.name] || 0;
    minNeeded[subj.name] = minClassesForTarget(subj.attended, subj.conducted, rem, 75);
  }

  // Track attended and conducted counts as we step through dates
  const currentAttended: Record<string, number> = {};
  const currentConducted: Record<string, number> = {};
  const classesNeedAttended: Record<string, number> = {};
  for (const subj of subjects) {
    currentAttended[subj.name] = subj.attended;
    currentConducted[subj.name] = subj.conducted;
    classesNeedAttended[subj.name] = minNeeded[subj.name];
  }

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);

  // Sample every ~4 days for chart performance
  let dayCount = 0;
  while (cursor <= planningDate) {
    if (isWeekday(cursor)) {
      const dayKey = getDayKey(cursor);
      const classesToday = schedule[dayKey] || [];

      for (const subj of classesToday) {
        currentConducted[subj] = (currentConducted[subj] || 0) + 1;
        if ((classesNeedAttended[subj] || 0) > 0) {
          currentAttended[subj] = (currentAttended[subj] || 0) + 1;
          classesNeedAttended[subj]--;
        }
      }
    }

    dayCount++;
    if (dayCount % 4 === 0 || cursor.getTime() === planningDate.getTime()) {
      const tAtt = Object.values(currentAttended).reduce((a, b) => a + b, 0);
      const tCon = Object.values(currentConducted).reduce((a, b) => a + b, 0);
      const pct = tCon === 0 ? 0 : (tAtt / tCon) * 100;
      points.push({
        date: cursor.toISOString().split('T')[0],
        dateLabel: formatDateLabel(cursor),
        attended: tAtt,
        conducted: tCon,
        percentage: pct,
        risk: getRiskForPct(pct),
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function getRiskForPct(pct: number): RiskLevel {
  if (pct >= 85) return 'SAFE';
  if (pct >= 75) return 'WATCH';
  if (pct >= 60) return 'AT_RISK';
  return 'IRREVERSIBLE';
}

// ---- Semester Progress -----------------------------------------------

export function calcSemesterProgress(today: Date): number {
  const total = SEMESTER_END.getTime() - SEMESTER_START.getTime();
  const elapsed = today.getTime() - SEMESTER_START.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// ---- Dashboard Builder -----------------------------------------------

export function buildDashboard(
  section: string,
  subjects: SubjectInput[],
  today: Date,
  planningDate: Date
): DashboardData {
  const remainingToEnd = countRemainingClasses(section, today, SEMESTER_END);
  const remainingToPlan = countRemainingClasses(section, today, planningDate);

  const calcs: SubjectCalc[] = subjects.map(subj => {
    const rem = remainingToEnd[subj.name] || 0;
    return calculateSubject(subj, rem);
  });

  const totalAttended = subjects.reduce((s, x) => s + x.attended, 0);
  const totalConducted = subjects.reduce((s, x) => s + x.conducted, 0);
  const overallAttendance = totalConducted === 0 ? 0 : (totalAttended / totalConducted) * 100;

  const totalRemaining = Object.values(remainingToPlan).reduce((a, b) => a + b, 0);

  const safeCount = calcs.filter(c => c.risk === 'SAFE').length;
  const atRiskCount = calcs.filter(c => c.risk === 'AT_RISK' || c.risk === 'IRREVERSIBLE').length;

  const forecastPoints = buildForecastSeries(section, subjects, today, planningDate);
  const semesterProgress = calcSemesterProgress(today);

  return {
    subjects: calcs,
    overallAttendance,
    totalRemaining,
    safeCount,
    atRiskCount,
    forecastPoints,
    semesterProgress,
    generatedAt: new Date(),
  };
}

// ---- Insights Generator -----------------------------------------------

export function generateInsights(subjects: SubjectCalc[]): string[] {
  const insights: string[] = [];

  for (const s of subjects) {
    if (s.isIrreversible) {
      insights.push(
        `${s.name} cannot mathematically recover to 75% this semester. Maximum possible: ${s.maxPossible.toFixed(1)}%.`
      );
    } else if (s.risk === 'AT_RISK') {
      insights.push(
        `${s.name} needs attention. Attend at least ${s.minRequired75} of the next ${s.remaining} classes to stay above 75%.`
      );
    } else if (s.risk === 'WATCH') {
      if (s.minRequired75 === 0) {
        insights.push(
          `${s.name} is safe. You can miss up to ${s.canMissAndStaySafe} class${s.canMissAndStaySafe !== 1 ? 'es' : ''} while remaining above 75%.`
        );
      } else {
        insights.push(
          `${s.name} is borderline. Attend ${s.minRequired75} of ${s.remaining} remaining classes to stay above 75%.`
        );
      }
    } else if (s.risk === 'SAFE' && s.percentage >= 90) {
      insights.push(
        `${s.name} has a strong buffer at ${s.percentage.toFixed(1)}%. You can miss up to ${s.canMissAndStaySafe} class${s.canMissAndStaySafe !== 1 ? 'es' : ''} and stay above 75%.`
      );
    }
  }

  return insights;
}
