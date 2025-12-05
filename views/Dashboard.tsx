
import React, { useState, useEffect } from 'react';
import { STUDENT_DATA, ANNOUNCEMENTS_DATA, SCHEDULE_DATA, ATTENDANCE_DATA, EXAM_DATA } from '../constants.ts';
import { CalendarIcon, BellIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { AttendanceStatus, View } from '../types.ts';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';
import InformationIcon from '../components/icons/InformationIcon.tsx';

interface DashboardProps {
    setCurrentView: (view: View) => void;
}

const DashboardSkeleton: React.FC = () => (
    <div className="p-4 space-y-6 animate-pulse">
        {/* Header Skeleton */}
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
        
        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-3 gap-3">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Schedule Skeleton */}
        <div className="bg-gray-200 p-4 rounded-xl h-48"></div>

        {/* Announcements Skeleton */}
        <div className="bg-gray-200 p-4 rounded-xl h-32"></div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
    const [isLoading, setIsLoading] = useState(true);
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('id-ID', { weekday: 'long' });
    const todaySchedule = SCHEDULE_DATA.find(s => s.day === dayOfWeek)?.schedule || [];

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const getGreeting = () => {
        const hour = today.getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    // Calculate Attendance
    const attendanceThisMonth = ATTENDANCE_DATA.filter(record => 
        new Date(record.date).getMonth() === new Date(2024, 10, 1).getMonth() // Hardcoded to Nov for demo
    );
    const hadirCount = attendanceThisMonth.filter(r => r.status === AttendanceStatus.Hadir).length;
    const totalDays = attendanceThisMonth.length;
    const attendancePercentage = totalDays > 0 ? Math.round((hadirCount / totalDays) * 100) : 0;

    // Find upcoming exam
    const upcomingExam = EXAM_DATA.find(exam => new Date(exam.startDate) > today);


    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="p-4 space-y-6 transition-opacity duration-500 ease-in-out opacity-100">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{getGreeting()},</p>
                    <h1 className="text-2xl font-bold text-gray-800">{STUDENT_DATA.name}</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentView('about')}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Informasi Sekolah"
                    >
                        <InformationIcon />
                    </button>
                    <img
                        src={STUDENT_DATA.photoUrl}
                        alt="Student"
                        className="w-14 h-14 rounded-full border-2 border-teal-400 object-cover shadow-sm"
                    />
                </div>
            </header>
            
            {/* Quick Stats */}
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
                     <button
                        onClick={() => setCurrentView('ai_tutor')}
                        className="bg-blue-50 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:bg-blue-100 transition-colors"
                    >
                        <div className="w-8 h-8 flex items-center justify-center"><SparklesIcon /></div>
                        <p className="text-xs text-gray-600 mt-1">Tanya AI</p>
                        <p className="font-bold text-blue-600">Coba!</p>
                    </button>
                </div>
            </section>

            {/* Jadwal Hari Ini */}
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

            {/* Pengumuman */}
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

export default Dashboard;