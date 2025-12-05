
import React, { useState } from 'react';
import { STUDENT_DATA, ACHIEVEMENT_DATA, CHARACTER_BADGE_DATA } from '../constants.ts';
import { AchievementCategory, View } from '../types.ts';
import { ArrowLeftIcon, StarIcon, LightBulbIcon } from '@heroicons/react/24/solid';

interface AchievementsProps {
    setCurrentView: (view: View) => void;
}

const Achievements: React.FC<AchievementsProps> = ({ setCurrentView }) => {
    const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="p-4 space-y-4">
             <header className="flex items-center">
                <button onClick={() => setCurrentView('profile')} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 text-center flex-1">Rapor Karakter & Prestasi</h1>
                 <div className="w-8"></div>
            </header>
            
            <div className="text-center">
                 <img
                    src={STUDENT_DATA.photoUrl}
                    alt="Student"
                    className="w-20 h-20 rounded-full border-4 border-teal-400 object-cover mb-2 mx-auto"
                />
                <h2 className="text-lg font-bold">{STUDENT_DATA.name}</h2>
                <p className="text-sm text-gray-500">{STUDENT_DATA.class}</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center bg-gray-200 rounded-full p-1">
                <button
                    onClick={() => setActiveTab('badges')}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'badges' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}
                >
                    Lencana Karakter
                </button>
                <button
                    onClick={() => setActiveTab('achievements')}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === 'achievements' ? 'bg-teal-500 text-white shadow' : 'text-gray-600'}`}
                >
                    Prestasi & Kejuaraan
                </button>
            </div>

            {/* Content */}
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
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${achievement.category === AchievementCategory.Akademik ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {achievement.category}
                                    </span>
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

export default Achievements;