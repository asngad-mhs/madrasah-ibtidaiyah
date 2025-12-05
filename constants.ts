
import type { Student, DaySchedule, Grade, Announcement, AttendanceRecord, Exam, Homework, Bill, Achievement, CharacterBadge } from './types.ts';
import { AttendanceStatus, HomeworkStatus, PaymentStatus, AchievementCategory } from './types.ts';

export const STUDENT_DATA: Student = {
  name: "Mohammad Asngad",
  nisn: "1234567890",
  class: "IV-B",
  photoUrl: "https://picsum.photos/seed/student1/200/200",
  school: "MI Ceria",
  address: "Jl. Pendidikan No. 1, Jakarta",
};

export const SCHEDULE_DATA: DaySchedule[] = [
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

export const GRADES_DATA: Grade[] = [
  { subject: "Al-Qur'an Hadits", uts: 88, uas: 92, rata_rata: 90 },
  { subject: "Aqidah Akhlaq", uts: 85, uas: 89, rata_rata: 87 },
  { subject: "Fiqih", uts: 90, uas: 85, rata_rata: 87.5 },
  { subject: "Bahasa Indonesia", uts: 82, uas: 88, rata_rata: 85 },
  { subject: "Matematika", uts: 92, uas: 95, rata_rata: 93.5 },
  { subject: "IPA", uts: 86, uas: 90, rata_rata: 88 },
  { subject: "Bahasa Arab", uts: 78, uas: 85, rata_rata: 81.5 },
];

export const ANNOUNCEMENTS_DATA: Announcement[] = [
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

export const EXAM_DATA: Exam[] = [
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


export const ATTENDANCE_DATA: AttendanceRecord[] = [
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

export const HOMEWORK_DATA: Homework[] = [
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

export const FINANCE_DATA: Bill[] = [
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

export const ACHIEVEMENT_DATA: Achievement[] = [
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

export const CHARACTER_BADGE_DATA: CharacterBadge[] = [
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


export const FULL_SCHEDULE_DATA: { [key: string]: DaySchedule[] } = {
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