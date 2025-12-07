
import React, { useState } from 'react';
import { FULL_SCHEDULE_DATA, ANNOUNCEMENTS_DATA } from '../constants.ts';
import { CalendarDaysIcon, MegaphoneIcon, ClipboardDocumentListIcon, AcademicCapIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Timetable from '../components/Timetable.tsx';
import RegistrationForm from '../components/RegistrationForm.tsx';

const About: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState('Kelas IV');

    const handleToggle = (title: string) => {
        setSelectedItem(selectedItem === title ? null : title);
    };

    const infoItems = [
        {
            title: "Jadwal Pelajaran",
            icon: <CalendarDaysIcon className="w-7 h-7 text-white" />,
            bgColor: "bg-blue-500",
            content: "Lihat jadwal pelajaran lengkap untuk semua kelas.",
            detailedContent: (
                <div className="space-y-4">
                    <p className="text-gray-700 text-sm">
                        Fitur ini adalah pusat informasi jadwal untuk seluruh kegiatan belajar mengajar di MI Ceria. Silakan pilih kelas untuk melihat jadwal pelajaran lengkap.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(FULL_SCHEDULE_DATA).map(className => (
                            <button
                                key={className}
                                onClick={() => setSelectedClass(className)}
                                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                                    selectedClass === className 
                                        ? 'bg-blue-500 text-white shadow' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                }`}
                            >
                                {className}
                            </button>
                        ))}
                    </div>

                    <Timetable scheduleData={FULL_SCHEDULE_DATA[selectedClass]} />
                </div>
            )
        },
        {
            title: "Pengumuman Terbaru",
            icon: <MegaphoneIcon className="w-7 h-7 text-white" />,
            bgColor: "bg-yellow-500",
            content: "Pusat informasi resmi dari sekolah.",
            detailedContent: (
                <div className="space-y-3">
                    {ANNOUNCEMENTS_DATA.length > 0 ? (
                        ANNOUNCEMENTS_DATA.map((ann) => (
                            <div key={ann.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-800 flex-1 pr-2">{ann.title}</h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{ann.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">Belum ada pengumuman terbaru.</p>
                    )}
                </div>
            )
        },
        {
            title: "Pendaftaran Siswa Baru",
            icon: <ClipboardDocumentListIcon className="w-7 h-7 text-white" />,
            bgColor: "bg-green-500",
            content: "Isi formulir untuk Pendaftaran Peserta Didik Baru (PPDB).",
            detailedContent: (
                 <div>
                    <p className="text-gray-700 text-sm mb-4">
                        Silakan isi formulir di bawah ini dengan data yang benar dan lengkap untuk melakukan pendaftaran siswa baru di MI Ceria.
                    </p>
                    <RegistrationForm />
                </div>
            )
        },
        {
            title: "Ujian Tengah Semester (UTS)",
            icon: <AcademicCapIcon className="w-7 h-7 text-white" />,
            bgColor: "bg-purple-500",
            content: `Informasi lengkap mengenai pelaksanaan UTS.`,
            detailedContent: (
                <div className="space-y-4 text-sm text-gray-700">
                    <p>
                        Persiapan adalah kunci sukses. Fitur Informasi UTS menyediakan semua yang perlu Anda ketahui tentang Ujian Tengah Semester. Anda akan menemukan jadwal ujian, peraturan, serta tips penting dari sekolah.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-gray-800 mb-3 text-base">Peraturan dan Syarat Peserta</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-green-600 mb-2">Syarat Mengikuti Ujian:</h4>
                                <ul className="space-y-2 pl-5 list-none">
                                    <li className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Telah melunasi biaya administrasi (SPP) hingga bulan pelaksanaan ujian.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Memiliki tingkat kehadiran (tanpa keterangan/alpa) di bawah 20% pada setiap mata pelajaran.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Mengenakan seragam sekolah yang lengkap dan rapi sesuai jadwal.</span>
                                    </li>
                                </ul>
                            </div>
                            
                             <div>
                                <h4 className="font-semibold text-red-600 mb-2">Peserta yang Tidak Diperkenankan Mengikuti Ujian:</h4>
                                <ul className="space-y-2 pl-5 list-none">
                                    <li className="flex items-start">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Memiliki tunggakan biaya administrasi (SPP) pada saat ujian berlangsung.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Tingkat kehadiran (alpa) sama dengan atau lebih dari 20% pada salah satu atau lebih mata pelajaran.</span>
                                    </li>
                                     <li className="flex items-start">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Sedang dalam masa skorsing atau sanksi akademik lainnya yang berlaku.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Ujian Akhir Semester (UAS)",
            icon: <AcademicCapIcon className="w-7 h-7 text-white" />,
            bgColor: "bg-red-500",
            content: `Semua detail terkait UAS sebagai penentu kenaikan kelas.`,
            detailedContent: (
                <div className="space-y-4 text-sm text-gray-700">
                    <p>
                        Ujian Akhir Semester (UAS) adalah momen penentu kenaikan kelas. Halaman ini menyediakan rincian lengkap mengenai jadwal, tata tertib, dan syarat kelulusan.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-gray-800 mb-3 text-base">Peraturan dan Syarat Peserta UAS</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-green-600 mb-2">Syarat Mengikuti Ujian:</h4>
                                <ul className="space-y-2 pl-5 list-none">
                                    <li className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Telah melunasi seluruh biaya administrasi (SPP) untuk semester berjalan.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Tingkat kehadiran (tanpa keterangan/alpa) selama satu semester di bawah 25%.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Telah mengumpulkan semua tugas dan menyelesaikan penilaian harian yang diwajibkan.</span>
                                    </li>
                                </ul>
                            </div>
                            
                             <div>
                                <h4 className="font-semibold text-red-600 mb-2">Peserta yang Tidak Diperkenankan Mengikuti Ujian:</h4>
                                <ul className="space-y-2 pl-5 list-none">
                                    <li className="flex items-start">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Masih memiliki tunggakan biaya administrasi (SPP) yang belum diselesaikan.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Tingkat kehadiran (alpa) mencapai 25% atau lebih.</span>
                                    </li>
                                     <li className="flex items-start">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>Terlibat dalam pelanggaran tata tertib kategori berat yang belum terselesaikan.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
    ];

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Informasi Sekolah</h1>
            <div className="space-y-3">
                {infoItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div 
                            className="p-4 flex items-center space-x-4 cursor-pointer"
                            onClick={() => handleToggle(item.title)}
                            aria-expanded={selectedItem === item.title}
                            aria-controls={`content-${index}`}
                        >
                            <div className={`flex-shrink-0 p-3 rounded-full ${item.bgColor}`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-lg">{item.title}</h2>
                                <p className="text-gray-600 text-sm mt-1">{item.content}</p>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${selectedItem === item.title ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <div
                            id={`content-${index}`}
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedItem === item.title ? 'max-h-[80rem]' : 'max-h-0'}`}
                        >
                            <div className="px-5 pb-4 pt-0">
                                <div className="border-t border-gray-200 pt-3">
                                    {typeof item.detailedContent === 'string' ? (
                                        <p className="text-gray-700 text-sm">{item.detailedContent}</p>
                                    ) : (
                                        item.detailedContent
                                    )}
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

export default About;
