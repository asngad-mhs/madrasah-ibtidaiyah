
import React, { useState } from 'react';
import { STUDENT_DATA, ATTENDANCE_DATA, ACHIEVEMENT_DATA, CHARACTER_BADGE_DATA } from '../constants.ts';
import { AttendanceStatus, View } from '../types.ts';
import FeedbackModal from '../components/FeedbackModal.tsx';
import ChatBubbleLeftRightIcon from '../components/icons/ChatBubbleLeftRightIcon.tsx';
import TrophyIcon from '../components/icons/TrophyIcon.tsx';


interface ProfileProps {
    setCurrentView: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ setCurrentView }) => {
    const [currentDate] = useState(new Date(2024, 10, 1)); // November 2024
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
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const record = ATTENDANCE_DATA.find(r => r.date === dateStr);
        calendarDays.push(
            <div key={day} title={record?.status} className={`w-10 h-10 flex items-center justify-center rounded-full ${record ? getStatusColor(record.status) : 'bg-gray-100 text-gray-700'}`}>
                {day}
            </div>
        );
    }

    const totalAchievements = ACHIEVEMENT_DATA.length;
    const totalBadges = CHARACTER_BADGE_DATA.length;

    return (
        <>
            <div className="space-y-6">
                <div className="bg-teal-500 text-white p-6 rounded-b-3xl">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={STUDENT_DATA.photoUrl}
                            alt="Student"
                            className="w-24 h-24 rounded-full border-4 border-white object-cover mb-4"
                        />
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
                             <div className="flex-shrink-0 p-3 rounded-full bg-yellow-500 text-white">
                                <TrophyIcon />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-lg">Rapor Karakter & Prestasi</h2>
                                <p className="text-gray-600 text-sm mt-1">{totalAchievements} Prestasi & {totalBadges} Lencana Karakter</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setCurrentView('achievements')}
                            className="mt-4 w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                        >
                            Lihat Detail
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Absensi Bulan Ini</h2>
                        <div className="text-center font-semibold mb-2">{currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {calendarDays}
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-400 mr-1.5"></span>Hadir</div>
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></span>Sakit</div>
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-400 mr-1.5"></span>Izin</div>
                            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></span>Alpa</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                             <div className="flex-shrink-0 p-3 rounded-full bg-blue-500 text-white">
                                <ChatBubbleLeftRightIcon />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-lg">Pusat Bantuan & Masukan</h2>
                                <p className="text-gray-600 text-sm mt-1">Punya saran atau menemukan masalah? Beri tahu kami.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsFeedbackModalOpen(true)}
                            className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Beri Masukan
                        </button>
                    </div>

                </div>
            </div>
            {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
        </>
    );
};

export default Profile;
