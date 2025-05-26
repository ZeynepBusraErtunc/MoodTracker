'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../lib/auth';

export default function Header({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="header">
      <div className="dropdown">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString('tr-TR', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Çıkış Yap
      </button>
    </div>
  );
}