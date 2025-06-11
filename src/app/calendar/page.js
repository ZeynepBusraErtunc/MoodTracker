'use client';

import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';

export default function MoodCalendar() {
  const [month, setMonth] = useState(new Date().getMonth()); 
  const [year, setYear] = useState(new Date().getFullYear());
  const [userId, setUserId] = useState(null);

  const getMonthColor = (month) => {
    const monthColors = [
      'rgba(135, 206, 235, 0.3)', // Ocak - Gökyüzü mavisi
      'rgba(176, 224, 230, 0.3)', // Şubat - Toz mavi
      'rgba(144, 238, 144, 0.3)', // Mart - Açık yeşil
      'rgba(50, 205, 50, 0.3)',   // Nisan - Yeşil
      'rgba(255, 182, 193, 0.3)', // Mayıs - Açık pembe
      'rgba(255, 215, 144, 0.3)', // Haziran - Altın sarısı
      'rgba(255, 165, 0, 0.3)',   // Temmuz - Turuncu
      'rgba(255, 99, 85, 0.3)',   // Ağustos - Mercan
      'rgba(210, 180, 140, 0.3)', // Eylül - Tan
      'rgba(255, 140, 0, 0.5)',   // Ekim - Koyu turuncu
      'rgba(165, 42, 42, 0.3)',   // Kasım - Kahverengi
      'rgba(192, 192, 192, 0.3)', // Aralık - Gümüş gri
    ];
    return monthColors[month];
  };

  useEffect(() => {
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    setUserId(storedUserId);
  }, []);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: getMonthColor(month) }}>
      <Calendar month={month} setMonth={setMonth} year={year} setYear={setYear} userId={userId} />
    </div>
  );
}