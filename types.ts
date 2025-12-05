
export type View = 'dashboard' | 'homework' | 'grades' | 'profile' | 'ai_tutor' | 'about' | 'finance' | 'achievements';

export interface Student {
  name: string;
  nisn: string;
  class: string;
  photoUrl: string;
  school: string;
  address: string;
}

export interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  icon: string;
}

export interface DaySchedule {
  day: string;
  schedule: ScheduleItem[];
}

export interface Grade {
  subject: string;
  uts: number; // Ujian Tengah Semester
  uas: number; // Ujian Akhir Semester
  rata_rata: number;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
}

export interface Exam {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
}

export enum AttendanceStatus {
  Hadir = 'Hadir',
  Sakit = 'Sakit',
  Izin = 'Izin',
  Alpa = 'Alpa',
}

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export enum HomeworkStatus {
  Selesai = 'Selesai',
  BelumSelesai = 'Belum Selesai',
}

export interface Homework {
  id: number;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: HomeworkStatus;
  description: string;
}

export enum PaymentStatus {
  Lunas = 'Lunas',
  BelumLunas = 'Belum Lunas',
}

export interface Bill {
    id: number;
    description: string;
    amount: number;
    dueDate: string; // YYYY-MM-DD
    status: PaymentStatus;
}

export enum AchievementCategory {
    Akademik = "Akademik",
    NonAkademik = "Non-Akademik",
}

export interface Achievement {
    id: number;
    title: string;
    category: AchievementCategory;
    date: string; // YYYY-MM-DD
    description: string;
    icon: string;
}

export interface CharacterBadge {
    id: number;
    name: string;
    icon: string;
    description: string;
    date: string; // YYYY-MM-DD
    awardedBy: string;
}
