
import React from 'react';
import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav.tsx';
import Dashboard from './views/Dashboard.tsx';
import About from './views/About.tsx';
import Grades from './views/Grades.tsx';
import Profile from './views/Profile.tsx';
import AiTutor from './views/AiTutor.tsx';
import Homework from './views/Homework.tsx';
import Finance from './views/Finance.tsx';
import Achievements from './views/Achievements.tsx';
import type { View } from './types.ts';
import { ANNOUNCEMENTS_DATA, EXAM_DATA } from './constants.ts';
import InstallPwaButton from './components/InstallPwaButton.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Handle deep linking from URL parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') as View;
    const validViews: View[] = ['dashboard', 'homework', 'grades', 'profile', 'ai_tutor', 'about', 'finance', 'achievements'];
    if (view && validViews.includes(view)) {
      setCurrentView(view);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log(`'beforeinstallprompt' event has been fired.`);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setInstallPrompt(null);
  };
  
  useEffect(() => {
    const showNotification = (title: string, body: string, id: string) => {
      const notificationKey = `notification_shown_${id}`;
      if (localStorage.getItem(notificationKey)) {
        return; // Already shown
      }

      // FIX: Correctly assign body and icon properties
      new Notification(title, { body: body, icon: '/assets/icon.svg' });
      localStorage.setItem(notificationKey, 'true');
    };

    const checkAndShowNotifications = async () => {
      if (!('Notification' in window)) {
        console.log("Browser tidak mendukung notifikasi.");
        return;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        // Cek pengumuman terbaru
        if (ANNOUNCEMENTS_DATA.length > 0) {
          const latestAnnouncement = ANNOUNCEMENTS_DATA.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
          showNotification(
            "Pengumuman Baru",
            latestAnnouncement.title,
            `announcement_${latestAnnouncement.id}`
          );
        }

        // Cek ujian yang akan datang (misal, dalam 7 hari ke depan)
        const today = new Date();
        const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        EXAM_DATA.forEach(exam => {
          const examDate = new Date(exam.startDate);
          if (examDate > today && examDate <= oneWeekFromNow) {
            showNotification(
              "Ujian Mendatang",
              `${exam.name} akan dimulai pada ${examDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}.`,
              `exam_${exam.id}`
            );
          }
        });
      }
    };

    // Panggil fungsi setelah jeda singkat untuk memastikan UI utama dimuat dulu
    setTimeout(checkAndShowNotifications, 2000);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'homework':
        return <Homework />;
      case 'finance':
        return <Finance />;
      case 'grades':
        return <Grades />;
      case 'profile':
        return <Profile setCurrentView={setCurrentView} />;
      case 'ai_tutor':
        return <AiTutor />;
       case 'about':
        return <About />;
       case 'achievements':
        return <Achievements setCurrentView={setCurrentView} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen antialiased bg-white dark:bg-gray-800 shadow-lg sm:max-w-4xl sm:mx-auto">
      <div className="w-full h-screen flex flex-col">
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-y-auto pt-20 pb-4">
          {renderView()}
        </main>
      </div>
      {installPrompt && <InstallPwaButton onClick={handleInstallClick} />}
    </div>
  );
};

export default App;