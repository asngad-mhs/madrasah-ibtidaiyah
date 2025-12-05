
import React from 'react';
import { GRADES_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          <p className="text-sm text-blue-500">{`UTS: ${payload[0].value}`}</p>
          <p className="text-sm text-teal-500">{`UAS: ${payload[1].value}`}</p>
          <p className="text-sm text-purple-500">{`Rata-rata: ${payload[2].value}`}</p>
        </div>
      );
    }
  
    return null;
  };

const Grades: React.FC = () => {
    const getGradeColor = (grade: number) => {
        if (grade >= 90) return 'text-green-500';
        if (grade >= 80) return 'text-blue-500';
        if (grade >= 70) return 'text-yellow-500';
        return 'text-red-500';
    }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Rekap Nilai Siswa</h1>
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Grafik Nilai Semester</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={GRADES_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="uts" fill="#38bdf8" name="UTS" />
                    <Bar dataKey="uas" fill="#14b8a6" name="UAS" />
                    <Bar dataKey="rata_rata" fill="#8b5cf6" name="Rata-rata"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Rincian Nilai</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Mata Pelajaran</th>
                <th scope="col" className="px-4 py-3 text-center">UTS</th>
                <th scope="col" className="px-4 py-3 text-center">UAS</th>
                <th scope="col" className="px-4 py-3 text-center">Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              {GRADES_DATA.map((grade, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{grade.subject}</th>
                  <td className="px-4 py-3 text-center">{grade.uts}</td>
                  <td className="px-4 py-3 text-center">{grade.uas}</td>
                  <td className={`px-4 py-3 text-center font-bold ${getGradeColor(grade.rata_rata)}`}>{grade.rata_rata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Grades;
