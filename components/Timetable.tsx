
import React from 'react';
import type { DaySchedule, ScheduleItem } from '../types.ts';

interface TimetableProps {
  scheduleData: DaySchedule[];
}

const getSubjectColor = (subject: string): string => {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-100 border-red-200 text-red-800',
    'bg-yellow-100 border-yellow-200 text-yellow-800',
    'bg-green-100 border-green-200 text-green-800',
    'bg-blue-100 border-blue-200 text-blue-800',
    'bg-indigo-100 border-indigo-200 text-indigo-800',
    'bg-purple-100 border-purple-200 text-purple-800',
    'bg-pink-100 border-pink-200 text-pink-800',
    'bg-teal-100 border-teal-200 text-teal-800',
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};


const Timetable: React.FC<TimetableProps> = ({ scheduleData }) => {
    if (!scheduleData || scheduleData.length === 0) {
        return <p className="text-center text-gray-500 py-4">Jadwal tidak tersedia untuk kelas ini.</p>;
    }

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
    
    const allTimes = scheduleData.flatMap(day => day.schedule.map(item => item.time));
    // Fix: Explicitly type `uniqueTimes` as `string[]`. This ensures `time` in the map function is a string,
    // and also allows TypeScript to correctly infer the types for `a` and `b` in the sort function.
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
                        {days.map(day => (
                            <th key={day} className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">{day}</th>
                        ))}
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
                                        {scheduleItem ? (
                                            <div>
                                                <div className="font-semibold text-xs">{scheduleItem.subject}</div>
                                                <div className="text-xs text-gray-600">{scheduleItem.teacher}</div>
                                            </div>
                                        ) : null}
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

export default Timetable;