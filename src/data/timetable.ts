// ============================================================
// ATTENDGUARD TIMETABLE DATA
// All 10 sections with realistic weekly schedules
// Semester: 29 Aug 2026 - 29 Nov 2026
// ============================================================

import { WeeklySchedule } from '../types';

export const SUBJECTS = [
  'Data Structures',
  'Operating Systems',
  'Computer Networks',
  'Object Oriented Programming',
  'Database Management Systems',
  'Mathematics',
];

export const SEMESTER_START = new Date('2026-08-29');
export const SEMESTER_END = new Date('2026-11-29');

export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const TIMETABLES: Record<string, WeeklySchedule> = {
  A: {
    monday: ['Data Structures', 'Operating Systems'],
    tuesday: ['Mathematics', 'Database Management Systems'],
    wednesday: ['Computer Networks', 'Object Oriented Programming'],
    thursday: ['Operating Systems', 'Mathematics'],
    friday: ['Data Structures', 'Computer Networks'],
    saturday: ['Database Management Systems'],
  },
  B: {
    monday: ['Computer Networks', 'Mathematics'],
    tuesday: ['Data Structures', 'Operating Systems'],
    wednesday: ['Database Management Systems'],
    thursday: ['Object Oriented Programming', 'Computer Networks'],
    friday: ['Mathematics', 'Data Structures'],
    saturday: ['Operating Systems', 'Object Oriented Programming'],
  },
  C: {
    monday: ['Object Oriented Programming', 'Database Management Systems'],
    tuesday: ['Computer Networks'],
    wednesday: ['Mathematics', 'Data Structures'],
    thursday: ['Operating Systems', 'Object Oriented Programming'],
    friday: ['Database Management Systems', 'Mathematics'],
    saturday: ['Data Structures', 'Computer Networks'],
  },
  D: {
    monday: ['Mathematics'],
    tuesday: ['Object Oriented Programming', 'Data Structures'],
    wednesday: ['Operating Systems', 'Database Management Systems'],
    thursday: ['Computer Networks', 'Mathematics'],
    friday: ['Object Oriented Programming', 'Operating Systems'],
    saturday: ['Data Structures', 'Database Management Systems'],
  },
  E: {
    monday: ['Database Management Systems', 'Computer Networks'],
    tuesday: ['Mathematics', 'Object Oriented Programming'],
    wednesday: ['Data Structures', 'Operating Systems'],
    thursday: ['Database Management Systems'],
    friday: ['Computer Networks', 'Mathematics'],
    saturday: ['Object Oriented Programming', 'Data Structures'],
  },
  F: {
    monday: ['Operating Systems'],
    tuesday: ['Data Structures', 'Computer Networks'],
    wednesday: ['Object Oriented Programming', 'Mathematics'],
    thursday: ['Data Structures', 'Operating Systems'],
    friday: ['Database Management Systems', 'Object Oriented Programming'],
    saturday: ['Mathematics', 'Computer Networks'],
  },
  G: {
    monday: ['Data Structures', 'Mathematics'],
    tuesday: ['Operating Systems', 'Database Management Systems'],
    wednesday: ['Computer Networks'],
    thursday: ['Mathematics', 'Object Oriented Programming'],
    friday: ['Operating Systems', 'Data Structures'],
    saturday: ['Database Management Systems', 'Computer Networks'],
  },
  H: {
    monday: ['Computer Networks', 'Object Oriented Programming'],
    tuesday: ['Database Management Systems', 'Mathematics'],
    wednesday: ['Data Structures'],
    thursday: ['Computer Networks', 'Operating Systems'],
    friday: ['Object Oriented Programming', 'Database Management Systems'],
    saturday: ['Mathematics', 'Data Structures'],
  },
  I: {
    monday: ['Object Oriented Programming'],
    tuesday: ['Computer Networks', 'Data Structures'],
    wednesday: ['Database Management Systems', 'Operating Systems'],
    thursday: ['Mathematics', 'Computer Networks'],
    friday: ['Data Structures', 'Object Oriented Programming'],
    saturday: ['Operating Systems', 'Mathematics'],
  },
  J: {
    monday: ['Mathematics', 'Database Management Systems'],
    tuesday: ['Object Oriented Programming', 'Computer Networks'],
    wednesday: ['Operating Systems', 'Data Structures'],
    thursday: ['Database Management Systems', 'Mathematics'],
    friday: ['Computer Networks', 'Operating Systems'],
    saturday: ['Data Structures', 'Object Oriented Programming'],
  },
};

// Demo attendance data (Phase 1 preloaded values)
export const DEMO_ATTENDANCE: Record<string, { attended: number; conducted: number }> = {
  'Data Structures': { attended: 35, conducted: 40 },           // 87.5%
  'Operating Systems': { attended: 26, conducted: 36 },          // 72.2%
  'Computer Networks': { attended: 33, conducted: 35 },          // 94.3%
  'Object Oriented Programming': { attended: 29, conducted: 36 }, // 80.6%
  'Database Management Systems': { attended: 22, conducted: 33 }, // 66.7% → IRREVERSIBLE potential
  'Mathematics': { attended: 27, conducted: 36 },                // 75.0%
};
