'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from './lib/auth';
import Header from './components/Header';
import Calendar from './components/Calendar';

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const router = useRouter();
  const user = getCurrentUser();

  // Aya göre arka plan rengi belirleme fonksiyonu
  const getMonthColor = (month) => {
    const monthColors = [
      'rgba(135, 206, 235, 0.3)', // Ocak - Gökyüzü mavisi
      'rgba(176, 224, 230, 0.3)', // Şubat - Toz mavi
      'rgba(144, 238, 144, 0.3)', // Mart - Açık yeşil
      'rgba(50, 205, 50, 0.3)',   // Nisan - Yeşil
      'rgba(255, 182, 193, 0.3)', // Mayıs - Açık pembe
      'rgba(255, 215, 0, 0.3)',   // Haziran - Altın sarısı
      'rgba(255, 165, 0, 0.3)',   // Temmuz - Turuncu
      'rgba(255, 99, 71, 0.3)',   // Ağustos - Mercan
      'rgba(210, 180, 140, 0.3)', // Eylül - Tan
      'rgba(255, 140, 0, 0.3)',   // Ekim - Koyu turuncu
      'rgba(165, 42, 42, 0.3)',   // Kasım - Kahverengi
      'rgba(192, 192, 192, 0.3)', // Aralık - Gümüş gri
    ];
    return monthColors[month - 1];
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div style={{ backgroundColor: getMonthColor(selectedMonth), minHeight: '100vh' }}>
      <Header
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <div className="month-title">
        {new Date(selectedYear, selectedMonth - 1).toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
      </div>
      <Calendar selectedMonth={selectedMonth} selectedYear={selectedYear} />
    </div>
  );
}