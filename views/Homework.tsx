
import React, { useState, useMemo } from 'react';
import { HOMEWORK_DATA } from '../constants';
import type { Homework } from '../types';
import { HomeworkStatus } from '../types';
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const getSubjectColor = (subject: string): string => {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-100 text-red-800', 'bg-yellow-100 text-yellow-800',
    'bg-green-100 text-green-800', 'bg-blue-100 text-blue-800',
    'bg-indigo-100 text-indigo-800', 'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800', 'bg-teal-100 text-teal-800',
  ];
  return colors[Math.abs(hash) % colors.length];
};

const Homework: React.FC = () => {
    const [homeworks, setHomeworks] = useState<Homework[]>(HOMEWORK_DATA);
    const [filter, setFilter] = useState<'Semua' | 'Belum Selesai' | 'Selesai'>('Semua');

    const handleToggleStatus = (id: number) => {
        setHomeworks(homeworks.map(hw => {
            if (hw.id === id) {
                return { ...hw, status: hw.status === HomeworkStatus.Selesai ? HomeworkStatus.BelumSelesai : HomeworkStatus.Selesai };
            }
            return hw;
        }));
    };

    const filteredHomeworks = useMemo(() => {
        if (filter === 'Belum Selesai') {
            return homeworks.filter(hw => hw.status === HomeworkStatus.BelumSelesai);
        }
        if (filter === 'Selesai') {
            return homeworks.filter(hw => hw.status === HomeworkStatus.Selesai);
        }
        return homeworks;
    }, [homeworks, filter]);
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Daftar Tugas & PR</h1>
            
            <div className="flex justify-center bg-gray-200 rounded-full p-1">
                {(['Semua', 'Belum Selesai', 'Selesai'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                            filter === f ? 'bg-teal-500 text-white shadow' : 'text-gray-600'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredHomeworks.length > 0 ? (
                    filteredHomeworks.map(hw => {
                        const isDone = hw.status === HomeworkStatus.Selesai;
                        const dueDate = new Date(hw.dueDate);
                        const today = new Date();
                        today.setHours(0,0,0,0); // Compare dates only
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
                                    <button
                                        onClick={() => handleToggleStatus(hw.id)}
                                        className={`w-full text-sm font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                                            isDone ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'
                                        }`}
                                    >
                                        {isDone ? (
                                            <>
                                                <CheckCircleIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Tandai Belum Selesai
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                                Tandai Selesai
                                            </>
                                        )}
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

export default Homework;
