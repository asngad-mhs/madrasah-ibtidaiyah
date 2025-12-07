

import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, BellIcon, AcademicCapIcon, CheckBadgeIcon, ArrowLeftIcon, CalendarDaysIcon, MegaphoneIcon, ClipboardDocumentListIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, XMarkIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/solid';

// ====================================================================================
// TYPES (from types.ts)
// ====================================================================================

type View = 'dashboard' | 'homework' | 'grades' | 'profile' | 'ai_tutor' | 'about' | 'finance' | 'achievements';

interface Student {
  name: string;
  nisn: string;
  class: string;
  photoUrl: string;
  school: string;
  address: string;
}

interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  icon: string;
}

interface DaySchedule {
  day: string;
  schedule: ScheduleItem[];
}

interface Grade {
  subject: string;
  uts: number; // Ujian Tengah Semester
  uas: number; // Ujian Akhir Semester
  rata_rata: number;
}

interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface Exam {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
}

enum AttendanceStatus {
  Hadir = 'Hadir',
  Sakit = 'Sakit',
  Izin = 'Izin',
  Alpa = 'Alpa',
}

interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

enum HomeworkStatus {
  Selesai = 'Selesai',
  BelumSelesai = 'Belum Selesai',
}

interface Homework {
  id: number;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: HomeworkStatus;
  description: string;
}

enum PaymentStatus {
  Lunas = 'Lunas',
  BelumLunas = 'Belum Lunas',
}

interface Bill {
    id: number;
    description: string;
    amount: number;
    dueDate: string; // YYYY-MM-DD
    status: PaymentStatus;
}

enum AchievementCategory {
    Akademik = "Akademik",
    NonAkademik = "Non-Akademik",
}

interface Achievement {
    id: number;
    title: string;
    category: AchievementCategory;
    date: string; // YYYY-MM-DD
    description: string;
    icon: string;
}

interface CharacterBadge {
    id: number;
    name: string;
    icon: string;
    description: string;
    date: string; // YYYY-MM-DD
    awardedBy: string;
}

// ====================================================================================
// CONSTANTS (from constants.ts)
// ====================================================================================

const STUDENT_DATA: Student = {
  name: "Mohammad Asngad",
  nisn: "1234567890",
  class: "IV-B",
  photoUrl: "https://picsum.photos/seed/student1/200/200",
  school: "MI Ceria",
  address: "Jl. Pendidikan No. 1, Jakarta",
};

const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: "Senin",
    schedule: [
      { time: "07:00 - 08:30", subject: "Al-Qur'an Hadits", teacher: "Ustadz Hasan", icon: "📖" },
      { time: "08:30 - 10:00", subject: "Bahasa Indonesia", teacher: "Ibu Siti", icon: "🇮🇩" },
      { time: "10:30 - 12:00", subject: "Matematika", teacher: "Bapak Budi", icon: "🧮" },
    ],
  },
  {
    day: "Selasa",
    schedule: [
      { time: "07:00 - 08:30", subject: "Aqidah Akhlaq", teacher: "Ustadzah Fatimah", icon: "🕌" },
      { time: "08:30 - 10:00", subject: "IPA", teacher: "Ibu Wati", icon: "🧪" },
      { time: "10:30 - 12:00", subject: "Bahasa Arab", teacher: "Ustadz Ali", icon: "🇸🇦" },
    ],
  },
  {
    day: "Rabu",
    schedule: [
        { time: "07:00 - 08:30", subject: "Fiqih", teacher: "Ustadz Hasan", icon: "⚖️" },
        { time: "08:30 - 10:00", subject: "IPS", teacher: "Bapak Budi", icon: "🌍" },
        { time: "10:30 - 12:00", subject: "PJOK", teacher: "Bapak Agus", icon: "⚽" },
    ],
  },
    {
    day: "Kamis",
    schedule: [
        { time: "07:00 - 08:30", subject: "SKI", teacher: "Ustadzah Fatimah", icon: "📜" },
        { time: "08:30 - 10:00", subject: "Bahasa Inggris", teacher: "Ibu Wati", icon: "🇬🇧" },
        { time: "10:30 - 12:00", subject: "Seni Budaya", teacher: "Ibu Siti", icon: "🎨" },
    ],
    },
    {
    day: "Jum'at",
    schedule: [
        { time: "07:00 - 08:30", subject: "Pramuka", teacher: "Kak Budi", icon: "⚜️" },
        { time: "08:30 - 10:00", subject: "Praktek Ibadah", teacher: "Ustadz Ali", icon: "🤲" },
    ],
  }
];

const GRADES_DATA: Grade[] = [
  { subject: "Al-Qur'an Hadits", uts: 88, uas: 92, rata_rata: 90 },
  { subject: "Aqidah Akhlaq", uts: 85, uas: 89, rata_rata: 87 },
  { subject: "Fiqih", uts: 90, uas: 85, rata_rata: 87.5 },
  { subject: "Bahasa Indonesia", uts: 82, uas: 88, rata_rata: 85 },
  { subject: "Matematika", uts: 92, uas: 95, rata_rata: 93.5 },
  { subject: "IPA", uts: 86, uas: 90, rata_rata: 88 },
  { subject: "Bahasa Arab", uts: 78, uas: 85, rata_rata: 81.5 },
];

const ANNOUNCEMENTS_DATA: Announcement[] = [
    {
        id: 1,
        title: "Peringatan Maulid Nabi Muhammad SAW",
        date: "25 Oktober 2024",
        content: "Diberitahukan kepada seluruh siswa/siswi MI Ceria bahwa akan diadakan kegiatan peringatan Maulid Nabi Muhammad SAW pada hari Jumat, 28 Oktober 2024. Diharapkan semua siswa mengenakan busana muslim."
    },
    {
        id: 2,
        title: "Info Pelaksanaan Ujian Tengah Semester (UTS)",
        date: "20 Oktober 2024",
        content: "Ujian Tengah Semester Ganjil akan dilaksanakan mulai tanggal 7 November hingga 11 November 2024. Harap siswa mempersiapkan diri dengan baik."
    },
];

const EXAM_DATA: Exam[] = [
    {
        id: "uts_ganjil_2024",
        name: "Ujian Tengah Semester (UTS)",
        startDate: "2024-11-07",
    },
    {
        id: "uas_ganjil_2024",
        name: "Ujian Akhir Semester (UAS)",
        startDate: "2024-12-09",
    }
];

const ATTENDANCE_DATA: AttendanceRecord[] = [
    { date: "2024-11-01", status: AttendanceStatus.Hadir },
    { date: "2024-11-02", status: AttendanceStatus.Hadir },
    { date: "2024-11-03", status: AttendanceStatus.Hadir },
    { date: "2024-11-04", status: AttendanceStatus.Sakit },
    { date: "2024-11-05", status: AttendanceStatus.Hadir },
    { date: "2024-11-08", status: AttendanceStatus.Hadir },
    { date: "2024-11-09", status: AttendanceStatus.Hadir },
    { date: "2024-11-10", status: AttendanceStatus.Izin },
    { date: "2024-11-11", status: AttendanceStatus.Hadir },
    { date: "2024-11-12", status: AttendanceStatus.Alpa },
];

const HOMEWORK_DATA: Homework[] = [
    {
        id: 1,
        subject: "Matematika",
        title: "Latihan Perkalian & Pembagian",
        dueDate: "2024-11-15",
        status: HomeworkStatus.BelumSelesai,
        description: "Kerjakan soal latihan di buku paket halaman 45-46. Tulis jawaban di buku tulis beserta caranya."
    },
    {
        id: 2,
        subject: "Bahasa Indonesia",
        title: "Membuat Puisi Tema Pahlawan",
        dueDate: "2024-11-10",
        status: HomeworkStatus.Selesai,
        description: "Buatlah sebuah puisi dengan tema pahlawan minimal 3 bait. Tulis di kertas HVS dan hias seindah mungkin."
    },
    {
        id: 3,
        subject: "IPA",
        title: "Menggambar Daur Hidup Kupu-kupu",
        dueDate: "2024-11-18",
        status: HomeworkStatus.BelumSelesai,
        description: "Gambarkan siklus hidup atau metamorfosis kupu-kupu di buku gambar. Beri warna dan keterangan di setiap fasenya."
    },
    {
        id: 4,
        subject: "Fiqih",
        title: "Hafalan Niat dan Doa Wudhu",
        dueDate: "2024-11-20",
        status: HomeworkStatus.BelumSelesai,
        description: "Hafalkan niat wudhu dan doa setelah wudhu. Akan dites satu per satu saat pelajaran Fiqih minggu depan."
    }
];

const FINANCE_DATA: Bill[] = [
    {
        id: 1,
        description: "SPP Bulan November 2024",
        amount: 250000,
        dueDate: "2024-11-10",
        status: PaymentStatus.BelumLunas,
    },
    {
        id: 2,
        description: "Biaya Buku Paket Semester Ganjil",
        amount: 450000,
        dueDate: "2024-09-15",
        status: PaymentStatus.Lunas,
    },
    {
        id: 3,
        description: "SPP Bulan Oktober 2024",
        amount: 250000,
        dueDate: "2024-10-10",
        status: PaymentStatus.Lunas,
    },
    {
        id: 4,
        description: "Seragam Olahraga",
        amount: 150000,
        dueDate: "2024-08-20",
        status: PaymentStatus.Lunas,
    },
    {
        id: 5,
        description: "Kegiatan Pramuka Perkemahan",
        amount: 125000,
        dueDate: "2024-11-25",
        status: PaymentStatus.BelumLunas,
    },
     {
        id: 6,
        description: "SPP Bulan September 2024",
        amount: 250000,
        dueDate: "2024-09-10",
        status: PaymentStatus.Lunas,
    }
];

const ACHIEVEMENT_DATA: Achievement[] = [
    {
        id: 1,
        title: "Juara 1 Lomba Tahfidz Qur'an",
        category: AchievementCategory.NonAkademik,
        date: "2024-10-28",
        description: "Meraih juara pertama dalam lomba menghafal Al-Qur'an tingkat kecamatan dalam rangka Maulid Nabi Muhammad SAW.",
        icon: "🏆"
    },
    {
        id: 2,
        title: "Siswa Berprestasi Bulan Oktober",
        category: AchievementCategory.Akademik,
        date: "2024-11-01",
        description: "Diberikan kepada siswa dengan nilai rata-rata tertinggi dan keaktifan di kelas selama bulan Oktober.",
        icon: "⭐"
    },
    {
        id: 3,
        title: "Juara 3 Lomba Cerdas Cermat PAI",
        category: AchievementCategory.Akademik,
        date: "2024-09-15",
        description: "Mewakili sekolah dan berhasil meraih juara ketiga dalam kompetisi Cerdas Cermat Pendidikan Agama Islam.",
        icon: "🥉"
    },
     {
        id: 4,
        title: "Peserta Terbaik Lomba Menggambar",
        category: AchievementCategory.NonAkademik,
        date: "2024-08-17",
        description: "Karya terpilih sebagai yang terbaik dalam lomba menggambar dan mewarnai tema kemerdekaan.",
        icon: "🎨"
    }
];

const CHARACTER_BADGE_DATA: CharacterBadge[] = [
    {
        id: 1,
        name: "Rajin Membantu",
        icon: "🤝",
        description: "Selalu sigap membantu guru dan teman yang kesulitan tanpa diminta.",
        date: "2024-11-05",
        awardedBy: "Ibu Siti"
    },
    {
        id: 2,
        name: "Jujur & Amanah",
        icon: "💎",
        description: "Menemukan dan mengembalikan dompet yang tertinggal di area sekolah.",
        date: "2024-10-20",
        awardedBy: "Bapak Budi"
    },
    {
        id: 3,
        name: "Disiplin Waktu",
        icon: "⏱️",
        description: "Tidak pernah terlambat dan selalu mengumpulkan tugas tepat waktu selama satu semester.",
        date: "2024-09-30",
        awardedBy: "Ibu Wati"
    },
    {
        id: 4,
        name: "Aktif Bertanya",
        icon: "💡",
        description: "Menunjukkan rasa ingin tahu yang tinggi dan aktif bertanya di kelas.",
        date: "2024-09-12",
        awardedBy: "Ustadz Hasan"
    }
];

const FULL_SCHEDULE_DATA: { [key: string]: DaySchedule[] } = {
  "Kelas I": [
    {
      day: "Senin", schedule: [
        { time: "07:30 - 09:00", subject: "Tematik (Tema 1)", teacher: "Ibu Rina", icon: "📚" },
        { time: "09:30 - 11:00", subject: "Al-Qur'an Hadits", teacher: "Ustadz Budi", icon: "📖" },
      ]
    },
    {
      day: "Selasa", schedule: [
        { time: "07:30 - 09:00", subject: "Tematik (Tema 1)", teacher: "Ibu Rina", icon: "📚" },
        { time: "09:30 - 11:00", subject: "Aqidah Akhlaq", teacher: "Ustadzah Aisyah", icon: "🕌" },
      ]
    },
    {
      day: "Rabu", schedule: [
        { time: "07:30 - 09:00", subject: "Matematika", teacher: "Ibu Rina", icon: "🧮" },
        { time: "09:30 - 11:00", subject: "Bahasa Arab", teacher: "Ustadz Budi", icon: "🇸🇦" },
      ]
    },
    {
      day: "Kamis", schedule: [
        { time: "07:30 - 09:00", subject: "PJOK", teacher: "Bapak Doni", icon: "⚽" },
        { time: "09:30 - 11:00", subject: "Fiqih", teacher: "Ustadzah Aisyah", icon: "⚖️" },
      ]
    },
    {
      day: "Jum'at", schedule: [
        { time: "07:30 - 09:00", subject: "Seni Budaya", teacher: "Ibu Rina", icon: "🎨" },
      ]
    },
  ],
  "Kelas IV": SCHEDULE_DATA, // Menggunakan data yang sudah ada untuk Kelas IV
  "Kelas VI": [
    {
      day: "Senin", schedule: [
        { time: "07:00 - 08:30", subject: "Matematika", teacher: "Bapak Hendra", icon: "🧮" },
        { time: "08:30 - 10:00", subject: "Bahasa Indonesia", teacher: "Ibu Diah", icon: "🇮🇩" },
        { time: "10:30 - 12:00", subject: "Al-Qur'an Hadits", teacher: "Ustadz Rahman", icon: "📖" },
      ]
    },
    {
      day: "Selasa", schedule: [
        { time: "07:00 - 08:30", subject: "IPA", teacher: "Bapak Hendra", icon: "🧪" },
        { time: "08:30 - 10:00", subject: "IPS", teacher: "Ibu Diah", icon: "🌍" },
        { time: "10:30 - 12:00", subject: "Aqidah Akhlaq", teacher: "Ustadzah Nurul", icon: "🕌" },
      ]
    },
    {
      day: "Rabu", schedule: [
        { time: "07:00 - 08:30", subject: "Bahasa Arab", teacher: "Ustadz Rahman", icon: "🇸🇦" },
        { time: "08:30 - 10:00", subject: "SKI", teacher: "Ustadzah Nurul", icon: "📜" },
        { time: "10:30 - 12:00", subject: "Bahasa Inggris", teacher: "Ibu Diah", icon: "🇬🇧" },
      ]
    },
     {
      day: "Kamis", schedule: [
        { time: "07:00 - 08:30", subject: "Fiqih", teacher: "Ustadz Rahman", icon: "⚖️" },
        { time: "08:30 - 10:00", subject: "PJOK", teacher: "Bapak Eko", icon: "⚽" },
      ]
    },
    {
      day: "Jum'at", schedule: [
        { time: "07:00 - 08:30", subject: "Pramuka", teacher: "Kak Hendra", icon: "⚜️" },
      ]
    },
  ]
};

// ====================================================================================
// SERVICES (from geminiService.ts)
// ====================================================================================

const askAiTutor = async (prompt: string): Promise<string> => {
  const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

  if (!API_KEY) {
    console.warn("API key is missing. AI Tutor functionality will not work. Please set the API_KEY environment variable.");
    return "Maaf, fitur AI sedang tidak tersedia karena masalah konfigurasi. Kunci API tidak ditemukan.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Kamu adalah 'Ustadz AI', seorang guru yang ramah, sabar, dan cerdas untuk siswa Madrasah Ibtidaiyah (sekolah dasar Islam). Jawablah pertanyaan dengan cara yang mudah dipahami anak-anak, gunakan bahasa Indonesia yang baik dan sopan. Jika relevan, sertakan nilai-nilai atau contoh-contoh Islami yang sederhana. Jaga agar jawabanmu tetap singkat dan jelas.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kesalahan saat mencoba menghubungi Ustadz AI. Coba lagi nanti ya.";
  }
};

// ====================================================================================
// ICONS (from components/icons/*.tsx)
// ====================================================================================

const HomeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const HomeworkIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const GradesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const ProfileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const FinanceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
const AiTutorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const SparklesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M19 3v4M17 5h4M12 21v-4M10 19h4M5 12H1M23 12h-4M12 5V1M12 23v-4m7.07-7.07l-2.83-2.83M9.83 9.83L7 7m10 0l-2.83 2.83M7 17l2.83-2.83" />
  </svg>
);
const InformationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const SunIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const MoonIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const ChatBubbleLeftRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.234c-.383.024-.74.14-1.06.32a7.5 7.5 0 10-9.28 0c-.32-.18-.677-.296-1.06-.32l-3.722-.234A2.003 2.003 0 012.25 15.185v-4.286c0-.97.616-1.813 1.5-2.097M14.25 6.75A4.5 4.5 0 009.75 2.25 4.5 4.5 0 005.25 6.75M14.25 6.75v1.875c0 .621.504 1.125 1.125 1.125h1.5a1.125 1.125 0 011.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.875M14.25 6.75L12 9.75l2.25 3" />
    </svg>
);
const TrophyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.056-5.252A9.954 9.954 0 0112 12.001c1.83 0 3.56.49 5.028 1.32.338.176.65.37.944.582A9.753 9.753 0 0116.5 18.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V15m0 6.75v-1.5m-6.75-6.75h13.5M3.375 19.5h17.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a2.25 2.25 0 012.25 2.25v3.375a2.25 2.25 0 01-4.5 0V9a2.25 2.25 0 012.25-2.25z" />
    </svg>
);
const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


// ====================================================================================
// COMPONENTS (from components/*.tsx)
// ====================================================================================

// --- BottomNav.tsx ---
interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}
const NavItem: React.FC<{
  label: string;
  view: View;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClass = isActive ? 'text-teal-500 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400';
  const activeLabelClass = isActive ? 'font-semibold' : 'font-normal';
  
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none px-1`}
      aria-label={label}
    >
        <div className={activeClass}>{icon}</div>
        <span className={`text-xs mt-1 text-center ${activeClass} ${activeLabelClass}`}>{label}</span>
    </button>
  );
};
const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { label: 'Beranda', view: 'dashboard', icon: <HomeIcon /> },
    { label: 'Tugas', view: 'homework', icon: <HomeworkIcon /> },
    { label: 'Keuangan', view: 'finance', icon: <FinanceIcon /> },
    { label: 'Nilai', view: 'grades', icon: <GradesIcon /> },
    { label: 'Tanya Ustadz AI', view: 'ai_tutor', icon: <AiTutorIcon /> },
    { label: 'Profil', view: 'profile', icon: <ProfileIcon /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-md z-10">
      <div className="max-w-4xl mx-auto">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              label={item.label}
              view={item.view as View}
              icon={item.icon}
              isActive={currentView === item.view}
              onClick={() => setCurrentView(item.view as View)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
};

// --- FeedbackModal.tsx ---
interface FeedbackModalProps {
    onClose: () => void;
}
const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const [category, setCategory] = useState('Saran Fitur Baru');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '') {
            alert('Mohon isi pesan masukan Anda.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            console.log({ category, message });
            setIsSubmitting(false);
            alert('Terima kasih! Masukan Anda telah kami terima.');
            onClose();
        }, 1000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 transform transition-all"  onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Beri Saran & Masukan</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                <option>Saran Fitur Baru</option>
                                <option>Lapor Masalah/Bug</option>
                                <option>Desain & Tampilan</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tuliskan saran atau masalah yang Anda temukan di sini..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" required />
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-4 rounded-b-2xl">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                            {isSubmitting ? 'Mengirim...' : 'Kirim Masukan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- InstallPwaButton.tsx ---
interface InstallButtonProps {
    onClick: () => void;
}
const InstallPwaButton: React.FC<InstallButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 right-5 z-50 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform duration-200 ease-in-out transform hover:scale-110"
            aria-label="Instal Aplikasi"
            title="Instal Aplikasi"
        >
            <DownloadIcon />
        </button>
    );
};

// --- RegistrationForm.tsx ---
const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({ fullName: '', nickname: '', nisn: '', gender: 'Laki-laki', birthPlace: '', birthDate: '', childOrder: '', siblingCount: '', address: '', fatherName: '', fatherJob: '', motherName: '', motherJob: '', phone: '', parentAddress: '', prevSchoolName: '', prevSchoolAddress: '' });
    const [isAddressSame, setIsAddressSame] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsAddressSame(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, parentAddress: prev.address }));
        } else {
             setFormData(prev => ({ ...prev, parentAddress: '' }));
        }
    }
    
    useEffect(() => {
        if (isAddressSame) {
            setFormData(prev => ({ ...prev, parentAddress: prev.address }));
        }
    }, [formData.address, isAddressSame]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Pendaftaran berhasil dikirim! (Data ditampilkan di console untuk demonstrasi)");
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">I. Data Calon Siswa</legend>
                <div>
                    <label htmlFor="fullName" className={labelClass}>Nama Lengkap</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="nickname" className={labelClass}>Nama Panggilan</label>
                    <input type="text" name="nickname" id="nickname" value={formData.nickname} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="nisn" className={labelClass}>NISN (jika ada)</label>
                    <input type="text" name="nisn" id="nisn" value={formData.nisn} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <span className={labelClass}>Jenis Kelamin</span>
                    <div className="mt-2 flex items-center space-x-6">
                        <label className="flex items-center">
                            <input type="radio" name="gender" value="Laki-laki" checked={formData.gender === 'Laki-laki'} onChange={handleChange} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300" />
                            <span className="ml-2 text-gray-700">Laki-laki</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleChange} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300" />
                            <span className="ml-2 text-gray-700">Perempuan</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="birthPlace" className={labelClass}>Tempat Lahir</label>
                        <input type="text" name="birthPlace" id="birthPlace" value={formData.birthPlace} onChange={handleChange} className={inputClass} required/>
                    </div>
                    <div>
                        <label htmlFor="birthDate" className={labelClass}>Tanggal Lahir</label>
                        <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleChange} className={inputClass} required/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="childOrder" className={labelClass}>Anak ke-</label>
                        <input type="number" name="childOrder" id="childOrder" value={formData.childOrder} onChange={handleChange} className={inputClass} />
                    </div>
                     <div>
                        <label htmlFor="siblingCount" className={labelClass}>Jumlah Saudara</label>
                        <input type="number" name="siblingCount" id="siblingCount" value={formData.siblingCount} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className={labelClass}>Alamat Lengkap Siswa</label>
                    <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} className={inputClass} required></textarea>
                </div>
            </fieldset>
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">II. Data Orang Tua/Wali</legend>
                 <div>
                    <label htmlFor="fatherName" className={labelClass}>Nama Ayah</label>
                    <input type="text" name="fatherName" id="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="fatherJob" className={labelClass}>Pekerjaan Ayah</label>
                    <input type="text" name="fatherJob" id="fatherJob" value={formData.fatherJob} onChange={handleChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="motherName" className={labelClass}>Nama Ibu</label>
                    <input type="text" name="motherName" id="motherName" value={formData.motherName} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="motherJob" className={labelClass}>Pekerjaan Ibu</label>
                    <input type="text" name="motherJob" id="motherJob" value={formData.motherJob} onChange={handleChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="phone" className={labelClass}>Nomor Telepon/HP Aktif</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} required/>
                </div>
                <div>
                    <label htmlFor="parentAddress" className={labelClass}>Alamat Lengkap Orang Tua</label>
                     <div className="mt-2 flex items-start">
                        <div className="flex items-center h-5">
                            <input id="same-address" name="same-address" type="checkbox" checked={isAddressSame} onChange={handleAddressCheckbox} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="same-address" className="font-medium text-gray-700">Sama dengan alamat siswa</label>
                        </div>
                    </div>
                    <textarea name="parentAddress" id="parentAddress" value={formData.parentAddress} onChange={handleChange} rows={3} className={`${inputClass} mt-2`} disabled={isAddressSame} required></textarea>
                </div>
            </fieldset>
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">III. Asal Sekolah</legend>
                <div>
                    <label htmlFor="prevSchoolName" className={labelClass}>Nama TK/RA</label>
                    <input type="text" name="prevSchoolName" id="prevSchoolName" value={formData.prevSchoolName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="prevSchoolAddress" className={labelClass}>Alamat TK/RA</label>
                    <textarea name="prevSchoolAddress" id="prevSchoolAddress" value={formData.prevSchoolAddress} onChange={handleChange} rows={2} className={inputClass}></textarea>
                </div>
            </fieldset>
            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Kirim Pendaftaran
            </button>
        </form>
    );
}

// --- Timetable.tsx ---
interface TimetableProps {
  scheduleData: DaySchedule[];
}
const getSubjectColor = (subject: string): string => {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [ 'bg-red-100 border-red-200 text-red-800', 'bg-yellow-100 border-yellow-200 text-yellow-800', 'bg-green-100 border-green-200 text-green-800', 'bg-blue-100 border-blue-200 text-blue-800', 'bg-indigo-100 border-indigo-200 text-indigo-800', 'bg-purple-100 border-purple-200 text-purple-800', 'bg-pink-100 border-pink-200 text-pink-800', 'bg-teal-100 border-teal-200 text-teal-800', ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
const Timetable: React.FC<TimetableProps> = ({ scheduleData }) => {
    if (!scheduleData || scheduleData.length === 0) {
        return <p className="text-center text-gray-500 py-4">Jadwal tidak tersedia untuk kelas ini.</p>;
    }

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
    
    const allTimes = scheduleData.flatMap(day => day.schedule.map(item => item.time));
    // FIX: Explicitly type `uniqueTimes` as `string[]` to ensure correct type inference for sort callback parameters.
    const uniqueTimes: string[] = [...new Set(allTimes)].sort((a, b) => {
        const timeA = parseInt(a.split(':')[0], 10) * 60 + parseInt(a.split(/[:\s-]/)[1], 10);
        const timeB = parseInt(b.split(':')[0], 10) * 60 + parseInt(b.split(/[:\s-]/)[1], 10);
        return timeA - timeB;
    });

    const findSchedule = (day: string, time: string): ScheduleItem | undefined => {
        const daySchedule = scheduleData.find(d => d.day === day);
        return daySchedule?.schedule.find(s => s.time === time);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900 text-left sticky left-0 bg-gray-50 z-10">Waktu</th>
                        {days.map(day => ( <th key={day} className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">{day}</th> ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {uniqueTimes.map(time => (
                        <tr key={time}>
                            <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-700 sticky left-0 bg-white z-10">{time}</td>
                            {days.map(day => {
                                const scheduleItem = findSchedule(day, time);
                                return (
                                    <td key={`${day}-${time}`} className={`p-1 text-center border-l border-gray-200 ${scheduleItem ? getSubjectColor(scheduleItem.subject) : ''}`}>
                                        {scheduleItem ? ( <div> <div className="font-semibold text-xs">{scheduleItem.subject}</div> <div className="text-xs text-gray-600">{scheduleItem.teacher}</div> </div> ) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ====================================================================================
// VIEWS (from views/*.tsx)
// ====================================================================================

// --- Dashboard.tsx ---
interface DashboardProps {
    setCurrentView: (view: View) => void;
}
const DashboardSkeleton: React.FC = () => (
    <div className="p-4 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
            <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-7 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                 <div className="w-14 h-14 rounded-full bg-gray-300"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="bg-gray-200 p-4 rounded-xl h-48"></div>
        <div className="bg-gray-200 p-4 rounded-xl h-32"></div>
    </div>
);
const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
    const [isLoading, setIsLoading] = useState(true);
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('id-ID', { weekday: 'long' });
    const todaySchedule = SCHEDULE_DATA.find(s => s.day === dayOfWeek)?.schedule || [];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const getGreeting = () => {
        const hour = today.getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    const attendanceThisMonth = ATTENDANCE_DATA.filter(record => new Date(record.date).getMonth() === new Date(2024, 10, 1).getMonth());
    const hadirCount = attendanceThisMonth.filter(r => r.status === AttendanceStatus.Hadir).length;
    const totalDays = attendanceThisMonth.length;
    const attendancePercentage = totalDays > 0 ? Math.round((hadirCount / totalDays) * 100) : 0;
    const upcomingExam = EXAM_DATA.find(exam => new Date(exam.startDate) > today);

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="p-4 space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{getGreeting()},</p>
                    <h1 className="text-2xl font-bold text-gray-800">{STUDENT_DATA.name}</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentView('about')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Informasi Sekolah">
                        <InformationIcon />
                    </button>
                    <img src={STUDENT_DATA.photoUrl} alt="Student" className="w-14 h-14 rounded-full border-2 border-teal-400 object-cover shadow-sm" />
                </div>
            </header>
            <section>
                 <h2 className="text-base font-semibold text-gray-600 mb-2">Ringkasan Hari Ini</h2>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="bg-teal-50 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <CheckBadgeIcon className="w-8 h-8 text-teal-500 mb-1" />
                        <p className="text-xs text-gray-600">Absensi</p>
                        <p className="font-bold text-teal-600">{attendancePercentage}%</p>
                    </div>
                     <div className="bg-purple-50 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <AcademicCapIcon className="w-8 h-8 text-purple-500 mb-1" />
                        <p className="text-xs text-gray-600">Ujian</p>
                        <p className="font-bold text-purple-600">{upcomingExam ? upcomingExam.name.split(' ')[0] : 'Aman'}</p>
                    </div>
                     <button onClick={() => setCurrentView('ai_tutor')} className="bg-blue-50 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:bg-blue-100 transition-colors">
                        <div className="w-8 h-8 flex items-center justify-center"><SparklesIcon /></div>
                        <p className="text-xs text-gray-600 mt-1">Tanya AI</p>
                        <p className="font-bold text-blue-600">Coba!</p>
                    </button>
                </div>
            </section>
            <section className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-6 h-6 text-teal-500" />
                        <h2 className="text-lg font-semibold text-gray-700">Jadwal Hari Ini</h2>
                    </div>
                    <span className="text-sm text-gray-500">{dayOfWeek}</span>
                </div>
                {todaySchedule.length > 0 ? (
                    <div className="space-y-3">
                        {todaySchedule.map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl mr-4">{item.icon}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.subject}</p>
                                    <p className="text-sm text-gray-500">{item.teacher}</p>
                                </div>
                                <p className="text-sm font-medium text-teal-600">{item.time}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">Tidak ada jadwal pelajaran hari ini. Selamat berlibur!</p>
                )}
            </section>
            <section className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex items-center space-x-2 mb-3">
                    <BellIcon className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-lg font-semibold text-gray-700">Pengumuman Terbaru</h2>
                </div>
                <div className="space-y-3">
                    {ANNOUNCEMENTS_DATA.slice(0, 2).map((ann) => (
                        <div key={ann.id} className="p-3 bg-yellow-50 rounded-lg">
                             <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800 flex-1 pr-2">{ann.title}</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{ann.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ann.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// --- About.tsx ---
const About: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState('Kelas IV');
    const handleToggle = (title: string) => setSelectedItem(selectedItem === title ? null : title);
    const infoItems = [
        { title: "Jadwal Pelajaran", icon: <CalendarDaysIcon className="w-7 h-7 text-white" />, bgColor: "bg-blue-500", content: "Lihat jadwal pelajaran lengkap untuk semua kelas.", detailedContent: ( <div className="space-y-4"> <p className="text-gray-700 text-sm"> Fitur ini adalah pusat informasi jadwal untuk seluruh kegiatan belajar mengajar di MI Ceria. Silakan pilih kelas untuk melihat jadwal pelajaran lengkap. </p> <div className="flex flex-wrap gap-2"> {Object.keys(FULL_SCHEDULE_DATA).map(className => ( <button key={className} onClick={() => setSelectedClass(className)} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${ selectedClass === className ? 'bg-blue-500 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-blue-100' }`}> {className} </button> ))} </div> <Timetable scheduleData={FULL_SCHEDULE_DATA[selectedClass]} /> </div> ) },
        { title: "Pengumuman Terbaru", icon: <MegaphoneIcon className="w-7 h-7 text-white" />, bgColor: "bg-yellow-500", content: "Pusat informasi resmi dari sekolah.", detailedContent: ( <div className="space-y-3"> {ANNOUNCEMENTS_DATA.length > 0 ? ( ANNOUNCEMENTS_DATA.map((ann) => ( <div key={ann.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"> <div className="flex justify-between items-start"> <h3 className="font-semibold text-gray-800 flex-1 pr-2">{ann.title}</h3> <span className="text-xs text-gray-500 whitespace-nowrap">{ann.date}</span> </div> <p className="text-sm text-gray-600 mt-1">{ann.content}</p> </div> )) ) : ( <p className="text-center text-gray-500 py-4">Belum ada pengumuman terbaru.</p> )} </div> ) },
        { title: "Pendaftaran Siswa Baru", icon: <ClipboardDocumentListIcon className="w-7 h-7 text-white" />, bgColor: "bg-green-500", content: "Isi formulir untuk Pendaftaran Peserta Didik Baru (PPDB).", detailedContent: ( <div> <p className="text-gray-700 text-sm mb-4"> Silakan isi formulir di bawah ini dengan data yang benar dan lengkap untuk melakukan pendaftaran siswa baru di MI Ceria. </p> <RegistrationForm /> </div> ) },
        { title: "Ujian Tengah Semester (UTS)", icon: <AcademicCapIcon className="w-7 h-7 text-white" />, bgColor: "bg-purple-500", content: `Informasi lengkap mengenai pelaksanaan UTS.`, detailedContent: ( <div className="space-y-4 text-sm text-gray-700"> <p> Persiapan adalah kunci sukses. Fitur Informasi UTS menyediakan semua yang perlu Anda ketahui tentang Ujian Tengah Semester. Anda akan menemukan jadwal ujian, peraturan, serta tips penting dari sekolah. </p> <div className="p-4 bg-gray-50 rounded-lg"> <h3 className="font-bold text-gray-800 mb-3 text-base">Peraturan dan Syarat Peserta</h3> <div className="space-y-4"> <div> <h4 className="font-semibold text-green-600 mb-2">Syarat Mengikuti Ujian:</h4> <ul className="space-y-2 pl-5 list-none"> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Telah melunasi biaya administrasi (SPP) hingga bulan pelaksanaan ujian.</span> </li> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Memiliki tingkat kehadiran (tanpa keterangan/alpa) di bawah 20% pada setiap mata pelajaran.</span> </li> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Mengenakan seragam sekolah yang lengkap dan rapi sesuai jadwal.</span> </li> </ul> </div> <div> <h4 className="font-semibold text-red-600 mb-2">Peserta yang Tidak Diperkenankan Mengikuti Ujian:</h4> <ul className="space-y-2 pl-5 list-none"> <li className="flex items-start"> <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Memiliki tunggakan biaya administrasi (SPP) pada saat ujian berlangsung.</span> </li> <li className="flex items-start"> <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Tingkat kehadiran (alpa) sama dengan atau lebih dari 20% pada salah satu atau lebih mata pelajaran.</span> </li> <li className="flex items-start"> <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Sedang dalam masa skorsing atau sanksi akademik lainnya yang berlaku.</span> </li> </ul> </div> </div> </div> </div> ) },
        { title: "Ujian Akhir Semester (UAS)", icon: <AcademicCapIcon className="w-7 h-7 text-white" />, bgColor: "bg-red-500", content: `Semua detail terkait UAS sebagai penentu kenaikan kelas.`, detailedContent: ( <div className="space-y-4 text-sm text-gray-700"> <p> Ujian Akhir Semester (UAS) adalah momen penentu kenaikan kelas. Halaman ini menyediakan rincian lengkap mengenai jadwal, tata tertib, dan syarat kelulusan. </p> <div className="p-4 bg-gray-50 rounded-lg"> <h3 className="font-bold text-gray-800 mb-3 text-base">Peraturan dan Syarat Peserta UAS</h3> <div className="space-y-4"> <div> <h4 className="font-semibold text-green-600 mb-2">Syarat Mengikuti Ujian:</h4> <ul className="space-y-2 pl-5 list-none"> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Telah melunasi seluruh biaya administrasi (SPP) untuk semester berjalan.</span> </li> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Tingkat kehadiran (tanpa keterangan/alpa) selama satu semester di bawah 25%.</span> </li> <li className="flex items-start"> <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Telah mengumpulkan semua tugas dan menyelesaikan penilaian harian yang diwajibkan.</span> </li> </ul> </div> <div> <h4 className="font-semibold text-red-600 mb-2">Peserta yang Tidak Diperkenankan Mengikuti Ujian:</h4> <ul className="space-y-2 pl-5 list-none"> <li className="flex items-start"> <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Masih memiliki tunggakan biaya administrasi (SPP) yang belum diselesaikan.</span> </li> <li className="flex items-start"> <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Tingkat kehadiran (alpa) mencapai 25% atau lebih.</span> </li> <li className="flex items-start"> <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" /> <span>Terlibat dalam pelanggaran tata tertib kategori berat yang belum terselesaikan.</span> </li> </ul> </div> </div> </div> </div> ) },
    ];
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Informasi Sekolah</h1>
            <div className="space-y-3">
                {infoItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div onClick={() => handleToggle(item.title)} className="p-4 flex items-center space-x-4 cursor-pointer" aria-expanded={selectedItem === item.title} aria-controls={`content-${index}`}>
                            <div className={`flex-shrink-0 p-3 rounded-full ${item.bgColor}`}>{item.icon}</div>
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-lg">{item.title}</h2>
                                <p className="text-gray-600 text-sm mt-1">{item.content}</p>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${selectedItem === item.title ? 'rotate-180' : ''}`} />
                        </div>
                        <div id={`content-${index}`} className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedItem === item.title ? 'max-h-[80rem]' : 'max-h-0'}`}>
                            <div className="px-5 pb-4 pt-0">
                                <div className="border-t border-gray-200 pt-3">
                                    {typeof item.detailedContent === 'string' ? <p className="text-gray-700 text-sm">{item.detailedContent}</p> : item.detailedContent}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="text-center text-gray-500 pt-4 mt-4 text-sm">
                <p>Untuk informasi lebih lanjut, hubungi administrasi sekolah.</p>
                <p>&copy; {new Date().getFullYear()} MI Ceria.</p>
            </div>
        </div>
    );
};

// --- Grades.tsx ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          <p className="text-sm text-blue-500">{`UTS: ${payload[0].value}`}</p>
          <p className="text-sm text-teal-500">{`UAS: ${payload[1].value}`}</p>
          <p className="text-sm text-purple-500">{`Rata-rata: ${payload[2].value}`}</p>
        </div>
      );
    }
    return null;
  };
const Grades: React.FC = () => {
    const getGradeColor = (grade: number) => {
        if (grade >= 90) return 'text-green-500';
        if (grade >= 80) return 'text-blue-500';
        if (grade >= 70) return 'text-yellow-500';
        return 'text-red-500';
    }
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Rekap Nilai Siswa</h1>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Grafik Nilai Semester</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={GRADES_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="uts" fill="#38bdf8" name="UTS" />
                    <Bar dataKey="uas" fill="#14b8a6" name="UAS" />
                    <Bar dataKey="rata_rata" fill="#8b5cf6" name="Rata-rata"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Rincian Nilai</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Mata Pelajaran</th>
                <th scope="col" className="px-4 py-3 text-center">UTS</th>
                <th scope="col" className="px-4 py-3 text-center">UAS</th>
                <th scope="col" className="px-4 py-3 text-center">Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              {GRADES_DATA.map((grade, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{grade.subject}</th>
                  <td className="px-4 py-3 text-center">{grade.uts}</td>
                  <td className="px-4 py-3 text-center">{grade.uas}</td>
                  <td className={`px-4 py-3 text-center font-bold ${getGradeColor(grade.rata_rata)}`}>{grade.rata_rata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- AiTutor.tsx ---
interface AiTutorProps { initialText?: string | null; }
const AiTutor: React.FC<AiTutorProps> = ({ initialText }) => {
  const [messages, setMessages] = useState<{sender: 'user' | 'ai'; text: string; }[]>([ { sender: 'ai', text: "Assalamualaikum! Ada yang bisa Ustadz AI bantu? Silakan bertanya tentang pelajaran atau apa saja yang ingin kamu ketahui." } ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (initialText) setInput(initialText); }, [initialText]);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage = { sender: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    const aiResponseText = await askAiTutor(input);
    const aiMessage = { sender: 'ai' as const, text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleSend(); };
  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="grid grid-cols-3 items-center mb-4">
        <div className="col-start-2 text-center"><h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tanya Ustadz AI</h1></div>
        <div className="col-start-3 flex justify-end">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle Dark Mode">
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${ msg.sender === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm dark:bg-gray-700 dark:text-gray-200' }`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-2xl bg-white dark:bg-gray-700 text-gray-800 rounded-bl-none shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ketik pertanyaanmu..." disabled={isLoading} className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors" />
        <button onClick={handleSend} disabled={isLoading} className="ml-3 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-teal-300 dark:disabled:bg-teal-400 transition-colors shadow-md" aria-label="Kirim Pesan">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
        </button>
      </div>
    </div>
  );
};

// --- Homework.tsx ---
const HomeworkView: React.FC = () => {
    const [homeworks, setHomeworks] = useState<Homework[]>(HOMEWORK_DATA);
    const [filter, setFilter] = useState<'Semua' | 'Belum Selesai' | 'Selesai'>('Semua');

    const handleToggleStatus = (id: number) => setHomeworks(homeworks.map(hw => hw.id === id ? { ...hw, status: hw.status === HomeworkStatus.Selesai ? HomeworkStatus.BelumSelesai : HomeworkStatus.Selesai } : hw));
    const filteredHomeworks = useMemo(() => {
        if (filter === 'Belum Selesai') return homeworks.filter(hw => hw.status === HomeworkStatus.BelumSelesai);
        if (filter === 'Selesai') return homeworks.filter(hw => hw.status === HomeworkStatus.Selesai);
        return homeworks;
    }, [homeworks, filter]);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Daftar Tugas & PR</h1>
            <div className="flex justify-center bg-gray-200 rounded-full p-1">
                {(['Semua', 'Belum Selesai', 'Selesai'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${ filter === f ? 'bg-teal-500 text-white shadow' : 'text-gray-600' }`}>{f}</button>
                ))}
            </div>
            <div className="space-y-3">
                {filteredHomeworks.length > 0 ? (
                    filteredHomeworks.map(hw => {
                        const isDone = hw.status === HomeworkStatus.Selesai;
                        const dueDate = new Date(hw.dueDate);
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        dueDate.setHours(0,0,0,0);
                        const isOverdue = dueDate < today && !isDone;

                        return (
                            <div key={hw.id} className={`bg-white rounded-xl shadow-md transition-all duration-300 ${isDone ? 'opacity-60' : ''}`}>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSubjectColor(hw.subject)}`}>{hw.subject}</span>
                                        <div className={`flex items-center text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                                            <ClockIcon className="w-4 h-4 mr-1"/>
                                            <span>Tenggat: {formatDate(hw.dueDate)}</span>
                                            {isOverdue && <span className="ml-2 px-2 py-0.5 text-white bg-red-500 rounded-full text-xs">Terlambat</span>}
                                        </div>
                                    </div>
                                    <h2 className={`font-bold text-gray-800 text-lg mt-2 ${isDone ? 'line-through' : ''}`}>{hw.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">{hw.description}</p>
                                </div>
                                <div className="bg-gray-50 px-4 py-2 rounded-b-xl">
                                    <button onClick={() => handleToggleStatus(hw.id)} className={`w-full text-sm font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${ isDone ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600' }`}>
                                        {isDone ? (<> <CheckCircleIcon className="w-5 h-5 mr-2 text-gray-500" /> Tandai Belum Selesai </>) : (<> <CheckCircleIcon className="w-5 h-5 mr-2" /> Tandai Selesai </>)}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">Tidak ada tugas dalam kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Finance.tsx ---
const Finance: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>(FINANCE_DATA);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const { totalUnpaid, nextDueDate } = useMemo(() => {
        const unpaidBills = bills.filter(b => b.status === PaymentStatus.BelumLunas);
        const total = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
        const upcomingBills = unpaidBills.map(b => new Date(b.dueDate)).filter(d => d >= new Date()).sort((a, b) => a.getTime() - b.getTime());
        return { totalUnpaid: total, nextDueDate: upcomingBills.length > 0 ? upcomingBills[0] : null };
    }, [bills]);
    const handlePayBill = (id: number) => setBills(bills.map(bill => bill.id === id ? { ...bill, status: PaymentStatus.Lunas } : bill));
    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const formatDate = (date: Date | string) => (typeof date === 'string' ? new Date(date) : date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const displayedBills = useMemo(() => {
        const sortedBills = [...bills].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        if (activeTab === 'active') return sortedBills.filter(b => b.status === PaymentStatus.BelumLunas);
        return sortedBills.filter(b => b.status === PaymentStatus.Lunas);
    }, [bills, activeTab]);
    const getStatusBadge = (status: PaymentStatus, dueDate: string) => {
        if (new Date(dueDate) < new Date() && status === PaymentStatus.BelumLunas) return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">Jatuh Tempo</span>;
        switch (status) {
            case PaymentStatus.Lunas: return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">Lunas</span>;
            case PaymentStatus.BelumLunas: return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Belum Lunas</span>;
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Informasi Keuangan</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm font-medium text-red-700">Total Tagihan</h2>
                    <p className="text-2xl font-bold text-red-900 mt-1">{formatCurrency(totalUnpaid)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm font-medium text-blue-700">Jatuh Tempo Berikutnya</h2>
                    <p className="text-lg font-bold text-blue-900 mt-2">{nextDueDate ? formatDate(nextDueDate) : '-'}</p>
                </div>
            </div>
            <div className="flex justify-center bg-gray-200 rounded-full p-1">
                <button onClick={() => setActiveTab('active')} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'active' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}>Tagihan Aktif</button>
                <button onClick={() => setActiveTab('history')} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'history' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}>Riwayat Pembayaran</button>
            </div>
            <div className="space-y-3">
                {displayedBills.length > 0 ? (
                    displayedBills.map(bill => (
                        <div key={bill.id} className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800">{bill.description}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1"><CalendarDaysIcon className="w-4 h-4 mr-1" /><span>Jatuh Tempo: {formatDate(bill.dueDate)}</span></div>
                                </div>
                                {getStatusBadge(bill.status, bill.dueDate)}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-lg font-semibold text-gray-700">{formatCurrency(bill.amount)}</p>
                                {bill.status === PaymentStatus.BelumLunas && (<button onClick={() => handlePayBill(bill.id)} className="bg-green-500 text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center"><CreditCardIcon className="w-4 h-4 mr-2"/>Bayar</button>)}
                            </div>
                        </div>
                    ))
                ) : ( <div className="text-center py-10 bg-white rounded-lg shadow-sm"><p className="text-gray-500">{activeTab === 'active' ? 'Tidak ada tagihan aktif.' : 'Belum ada riwayat pembayaran.'}</p></div> )}
            </div>
        </div>
    );
};

// --- Achievements.tsx ---
interface AchievementsProps { setCurrentView: (view: View) => void; }
const Achievements: React.FC<AchievementsProps> = ({ setCurrentView }) => {
    const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges');
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
        <div className="p-4 space-y-4">
             <header className="flex items-center">
                <button onClick={() => setCurrentView('profile')} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon className="w-6 h-6 text-gray-700" /></button>
                <h1 className="text-xl font-bold text-gray-800 text-center flex-1">Rapor Karakter & Prestasi</h1>
                 <div className="w-8"></div>
            </header>
            <div className="text-center">
                 <img src={STUDENT_DATA.photoUrl} alt="Student" className="w-20 h-20 rounded-full border-4 border-teal-400 object-cover mb-2 mx-auto" />
                <h2 className="text-lg font-bold">{STUDENT_DATA.name}</h2>
                <p className="text-sm text-gray-500">{STUDENT_DATA.class}</p>
            </div>
            <div className="flex justify-center bg-gray-200 rounded-full p-1">
                <button onClick={() => setActiveTab('badges')} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'badges' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}>Lencana Karakter</button>
                <button onClick={() => setActiveTab('achievements')} className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'achievements' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}>Prestasi & Kejuaraan</button>
            </div>
            {activeTab === 'badges' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {CHARACTER_BADGE_DATA.map(badge => (
                        <div key={badge.id} className="bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h3 className="font-bold text-gray-800 text-sm">{badge.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{formatDate(badge.date)}</p>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'achievements' && (
                 <div className="space-y-3">
                    {ACHIEVEMENT_DATA.map(achievement => (
                        <div key={achievement.id} className="bg-white rounded-xl shadow-md p-4 flex items-start space-x-4">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${achievement.category === AchievementCategory.Akademik ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{achievement.category}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                <p className="text-xs text-gray-400 mt-2 text-right">{formatDate(achievement.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Profile.tsx ---
interface ProfileProps { setCurrentView: (view: View) => void; }
const Profile: React.FC<ProfileProps> = ({ setCurrentView }) => {
    const [currentDate] = useState(new Date(2024, 10, 1));
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const getStatusColor = (status: AttendanceStatus) => {
        switch(status) {
            case AttendanceStatus.Hadir: return 'bg-teal-400 text-white';
            case AttendanceStatus.Sakit: return 'bg-yellow-400 text-white';
            case AttendanceStatus.Izin: return 'bg-blue-400 text-white';
            case AttendanceStatus.Alpa: return 'bg-red-400 text-white';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const record = ATTENDANCE_DATA.find(r => r.date === dateStr);
        calendarDays.push(<div key={day} title={record?.status} className={`w-10 h-10 flex items-center justify-center rounded-full ${record ? getStatusColor(record.status) : 'bg-gray-100 text-gray-700'}`}>{day}</div>);
    }
    const totalAchievements = ACHIEVEMENT_DATA.length;
    const totalBadges = CHARACTER_BADGE_DATA.length;

    return (
        <>
            <div className="space-y-6">
                <div className="bg-teal-500 text-white p-6 rounded-b-3xl">
                    <div className="flex flex-col items-center text-center">
                        <img src={STUDENT_DATA.photoUrl} alt="Student" className="w-24 h-24 rounded-full border-4 border-white object-cover mb-4"/>
                        <h1 className="text-2xl font-bold">{STUDENT_DATA.name}</h1>
                        <p className="text-teal-100">{STUDENT_DATA.nisn}</p>
                    </div>
                </div>
                <div className="p-4 space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Informasi Siswa</h2>
                        <div className="space-y-2 text-gray-600">
                            <div className="flex justify-between"><span>Sekolah:</span> <span className="font-medium text-gray-800">{STUDENT_DATA.school}</span></div>
                            <div className="flex justify-between"><span>Kelas:</span> <span className="font-medium text-gray-800">{STUDENT_DATA.class}</span></div>
                            <div className="flex justify-between"><span>Alamat:</span> <span className="font-medium text-gray-800 text-right">{STUDENT_DATA.address}</span></div>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                             <div className="flex-shrink-0 p-3 rounded-full bg-yellow-500 text-white"><TrophyIcon /></div>
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-lg">Rapor Karakter & Prestasi</h2>
                                <p className="text-gray-600 text-sm mt-1">{totalAchievements} Prestasi & {totalBadges} Lencana Karakter</p>
                            </div>
                        </div>
                        <button onClick={() => setCurrentView('achievements')} className="mt-4 w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200">Lihat Detail</button>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Absensi Bulan Ini</h2>
                        <div className="text-center font-semibold mb-2">{currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2"><span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span></div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">{calendarDays}</div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-400 mr-1.5"></span>Hadir</div>
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></span>Sakit</div>
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-400 mr-1.5"></span>Izin</div>
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></span>Alpa</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                             <div className="flex-shrink-0 p-3 rounded-full bg-blue-500 text-white"><ChatBubbleLeftRightIcon /></div>
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-lg">Pusat Bantuan & Masukan</h2>
                                <p className="text-gray-600 text-sm mt-1">Punya saran atau menemukan masalah? Beri tahu kami.</p>
                            </div>
                        </div>
                        <button onClick={() => setIsFeedbackModalOpen(true)} className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">Beri Masukan</button>
                    </div>
                </div>
            </div>
            {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
        </>
    );
};

// ====================================================================================
// APP (from App.tsx)
// ====================================================================================

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [sharedText, setSharedText] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') as View;
    const text = params.get('text');
    const validViews: View[] = ['dashboard', 'homework', 'grades', 'profile', 'ai_tutor', 'about', 'finance', 'achievements'];
    if (view && validViews.includes(view)) {
      setCurrentView(view);
      if (view === 'ai_tutor' && text) setSharedText(text);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log(`'beforeinstallprompt' event has been fired.`);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setInstallPrompt(null);
  };
  
  useEffect(() => {
    const showNotification = (title: string, body: string, id: string) => {
      const notificationKey = `notification_shown_${id}`;
      if (localStorage.getItem(notificationKey)) return;
      new Notification(title, { body: body, icon: '/assets/icon.svg' });
      localStorage.setItem(notificationKey, 'true');
    };

    const checkAndShowNotifications = async () => {
      if (!('Notification' in window)) return;
      let permission = Notification.permission;
      if (permission === 'default') permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if (ANNOUNCEMENTS_DATA.length > 0) {
          const latestAnnouncement = ANNOUNCEMENTS_DATA.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
          showNotification("Pengumuman Baru", latestAnnouncement.title, `announcement_${latestAnnouncement.id}`);
        }
        const today = new Date();
        const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        EXAM_DATA.forEach(exam => {
          const examDate = new Date(exam.startDate);
          if (examDate > today && examDate <= oneWeekFromNow) {
            showNotification("Ujian Mendatang", `${exam.name} akan dimulai pada ${examDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}.`, `exam_${exam.id}`);
          }
        });
      }
    };
    setTimeout(checkAndShowNotifications, 2000);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard setCurrentView={setCurrentView} />;
      case 'homework': return <HomeworkView />;
      case 'finance': return <Finance />;
      case 'grades': return <Grades />;
      case 'profile': return <Profile setCurrentView={setCurrentView} />;
      case 'ai_tutor': return <AiTutor initialText={sharedText} />;
      case 'about': return <About />;
      case 'achievements': return <Achievements setCurrentView={setCurrentView} />;
      default: return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen antialiased bg-gray-100 dark:bg-gray-900 sm:max-w-4xl sm:mx-auto">
        <div className="w-full min-h-screen flex flex-col bg-white dark:bg-gray-800 shadow-lg">
            <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 overflow-y-auto pt-20 pb-4">
            {renderView()}
            </main>
        </div>
        {installPrompt && <InstallPwaButton onClick={handleInstallClick} />}
    </div>

  );
};

// ====================================================================================
// RENDER (from index.tsx)
// ====================================================================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);