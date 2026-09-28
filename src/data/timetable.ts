// ============================================================
// ATTENDGUARD TIMETABLE DATA
// All 10 sections with realistic weekly schedules
// Semester: 29 Aug 2026 - 29 Nov 2026
// ============================================================

import { WeeklySchedule } from '../types';

export const SEMESTER_START = new Date('2026-08-29');
export const SEMESTER_END = new Date('2026-11-29');

export const SUBJECTS_BY_SECTION: Record<string, string[]> = {
  'II-BME': [
    'Transforms and Boundary Value Problems',
    'Biomedical Signals and Systems',
    'Electric and Electronic Circuits',
    'Digital Logic for Medical Systems',
    'Medical Physics',
    'Professional Ethics',
    'Universal Human Values-II',
    'Verbal Reasoning',
    'Social Engineering'
  ],
  'II-ECE-DS-A': [
    'Transforms and Boundary Value Problems',
    'Solid State Devices',
    'Computer Organization and Architecture',
    'Digital Logic Design',
    'Electromagnetic Theory and Interference',
    'Professional Ethics',
    'Universal Human Values-II',
    'Verbal Reasoning',
    'Social Engineering',
    'Devices and Digital IC Lab'
  ],
  'II-ECE-DS-B': [
    'Transforms and Boundary Value Problems',
    'Solid State Devices',
    'Computer Organization and Architecture',
    'Digital Logic Design',
    'Electromagnetic Theory and Interference',
    'Professional Ethics',
    'Universal Human Values-II',
    'Verbal Reasoning',
    'Social Engineering',
    'Devices and Digital IC Lab'
  ],
  'III-BME': [
    'Probability and Statistics',
    'Microcontrollers and Its Application in Medicine',
    'Biomedical Signal Processing',
    'Biometrics',
    'Modern wireless communication system',
    'Principles of Medical Imaging',
    'Analytical and Logical Thinking Skills',
    'Indian Art Form',
    'Community Connect'
  ],
  'I-ECE-A': [
    'German',
    'Philosophy of Engineering',
    'Advanced Calculus and Complex Analysis',
    'Chemistry',
    'Electronic System and PCB Design',
    'Programming for Problem Solving',
    'Basic Civil and Mechanical Workshop',
    'General Aptitude',
    'NSS',
    'Biology'
  ]
};

export const SECTIONS = Object.keys(SUBJECTS_BY_SECTION);

export const TIMETABLES: Record<string, WeeklySchedule> = {
  'II-BME': {
    monday: ['Medical Physics', 'Electric and Electronic Circuits', 'Social Engineering', 'Digital Logic for Medical Systems'],
    tuesday: ['Electric and Electronic Circuits', 'Medical Physics', 'Biomedical Signals and Systems', 'Transforms and Boundary Value Problems', 'Verbal Reasoning'],
    wednesday: ['Biomedical Signals and Systems', 'Digital Logic for Medical Systems', 'Transforms and Boundary Value Problems', 'Verbal Reasoning', 'Universal Human Values-II'],
    thursday: ['Transforms and Boundary Value Problems', 'Medical Physics', 'Biomedical Signals and Systems', 'Digital Logic for Medical Systems', 'Digital Logic for Medical Systems'],
    friday: ['Professional Ethics', 'Transforms and Boundary Value Problems', 'Electric and Electronic Circuits', 'Digital Logic for Medical Systems', 'Universal Human Values-II'],
    saturday: [],
  },
  'II-ECE-DS-A': {
    monday: ['Electromagnetic Theory and Interference', 'Transforms and Boundary Value Problems', 'Social Engineering', 'Universal Human Values-II', 'Devices and Digital IC Lab'],
    tuesday: ['Computer Organization and Architecture', 'Transforms and Boundary Value Problems', 'Electromagnetic Theory and Interference', 'Digital Logic Design', 'Universal Human Values-II', 'Verbal Reasoning'],
    wednesday: ['Transforms and Boundary Value Problems', 'Solid State Devices', 'Computer Organization and Architecture', 'Digital Logic Design', 'Verbal Reasoning'],
    thursday: ['Solid State Devices', 'Computer Organization and Architecture', 'Transforms and Boundary Value Problems', 'Professional Ethics', 'Devices and Digital IC Lab'],
    friday: ['Digital Logic Design', 'Solid State Devices', 'Electromagnetic Theory and Interference', 'Computer Organization and Architecture'],
    saturday: [],
  },
  'II-ECE-DS-B': {
    monday: ['Devices and Digital IC Lab', 'Digital Logic Design', 'Solid State Devices', 'Computer Organization and Architecture', 'Social Engineering'],
    tuesday: ['Devices and Digital IC Lab', 'Computer Organization and Architecture', 'Digital Logic Design', 'Electromagnetic Theory and Interference', 'Transforms and Boundary Value Problems'],
    wednesday: ['Universal Human Values-II', 'Social Engineering', 'Electromagnetic Theory and Interference', 'Transforms and Boundary Value Problems', 'Digital Logic Design'],
    thursday: ['Universal Human Values-II', 'Verbal Reasoning', 'Transforms and Boundary Value Problems', 'Computer Organization and Architecture', 'Solid State Devices', 'Electromagnetic Theory and Interference'],
    friday: ['Verbal Reasoning', 'Professional Ethics', 'Transforms and Boundary Value Problems', 'Solid State Devices', 'Computer Organization and Architecture'],
    saturday: [],
  },
  'III-BME': {
    monday: ['Analytical and Logical Thinking Skills', 'Microcontrollers and Its Application in Medicine', 'Modern wireless communication system', 'Microcontrollers and Its Application in Medicine', 'Principles of Medical Imaging', 'Indian Art Form'],
    tuesday: ['Biomedical Signal Processing', 'Analytical and Logical Thinking Skills', 'Biomedical Signal Processing', 'Biometrics', 'Probability and Statistics', 'Microcontrollers and Its Application in Medicine'],
    wednesday: ['Biomedical Signal Processing', 'Probability and Statistics', 'Principles of Medical Imaging', 'Biometrics'],
    thursday: ['Community Connect', 'Probability and Statistics', 'Biomedical Signal Processing', 'Modern wireless communication system', 'Microcontrollers and Its Application in Medicine'],
    friday: ['Community Connect', 'Principles of Medical Imaging', 'Probability and Statistics', 'Biometrics', 'Modern wireless communication system'],
    saturday: [],
  },
  'I-ECE-A': {
    monday: ['Philosophy of Engineering', 'Chemistry', 'Advanced Calculus and Complex Analysis', 'Electronic System and PCB Design', 'Biology', 'General Aptitude'],
    tuesday: ['Electronic System and PCB Design', 'Chemistry', 'Advanced Calculus and Complex Analysis', 'Programming for Problem Solving'],
    wednesday: ['Chemistry', 'Philosophy of Engineering', 'Programming for Problem Solving', 'Programming for Problem Solving', 'Biology', 'Programming for Problem Solving'],
    thursday: ['German', 'Advanced Calculus and Complex Analysis', 'General Aptitude', 'NSS'],
    friday: ['Programming for Problem Solving', 'Advanced Calculus and Complex Analysis', 'Electronic System and PCB Design', 'Chemistry', 'Biology', 'German'],
    saturday: [],
  }
};

// Demo attendance data generation (randomized realism)
export function getDemoAttendanceForSubject(subject: string) {
  // Give a random attended/conducted between 60% and 95%
  const conducted = 30 + Math.floor(Math.random() * 10);
  const percentage = 60 + Math.random() * 35; 
  const attended = Math.floor((percentage / 100) * conducted);
  return { attended, conducted };
}


