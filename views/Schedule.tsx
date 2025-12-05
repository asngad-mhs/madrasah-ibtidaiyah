
import React, { useState } from 'react';
import { SCHEDULE_DATA } from '../constants';
import type { DaySchedule } from '../types';

const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string>(
    SCHEDULE_DATA.find(d => d.day === new Date().toLocaleDateString('id-ID', { weekday: 'long' }))?.day || SCHEDULE_DATA[0].day
  );

  const activeSchedule = SCHEDULE_DATA.find(d => d.day === activeDay);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Jadwal Pelajaran</h1>
      
      <div className="flex justify-center bg-gray-200 rounded-full p-1 mb-6">
        {SCHEDULE_DATA.map(({ day }) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`w-full py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              activeDay === day ? 'bg-teal-500 text-white shadow' : 'text-gray-600'
            }`}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{activeDay}</h2>
        {activeSchedule && activeSchedule.schedule.length > 0 ? (
          <ul className="space-y-4">
            {activeSchedule.schedule.map((item, index) => (
              <li key={index} className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mr-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.subject}</p>
                  <p className="text-sm text-gray-500">{item.teacher}</p>
                </div>
                <p className="text-sm font-medium text-gray-600">{item.time}</p>
              </li>
            ))}
          </ul>
        ) : (
           <div className="text-center py-10">
                <p className="text-gray-500">Tidak ada jadwal untuk hari ini.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
