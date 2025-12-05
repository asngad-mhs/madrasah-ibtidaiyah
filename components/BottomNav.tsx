
import React from 'react';
import type { View } from '../types.ts';
import HomeIcon from './icons/HomeIcon.tsx';
import HomeworkIcon from './icons/HomeworkIcon.tsx';
import GradesIcon from './icons/GradesIcon.tsx';
import ProfileIcon from './icons/ProfileIcon.tsx';
import FinanceIcon from './icons/FinanceIcon.tsx';
import AiTutorIcon from './icons/AiTutorIcon.tsx';

interface TopNavProps {
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

const TopNav: React.FC<TopNavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { label: 'Beranda', view: 'dashboard', icon: <HomeIcon /> },
    { label: 'Tugas', view: 'homework', icon: <HomeworkIcon /> },
    { label: 'Keuangan', view: 'finance', icon: <FinanceIcon /> },
    { label: 'Nilai', view: 'grades', icon: <GradesIcon /> },
    { label: 'Tanya Ustadz AI', view: 'ai_tutor', icon: <AiTutorIcon /> },
    { label: 'Profil', view: 'profile', icon: <ProfileIcon /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-md rounded-b-2xl z-10">
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
    </header>
  );
};

export default TopNav;