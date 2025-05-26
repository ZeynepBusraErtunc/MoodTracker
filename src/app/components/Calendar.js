'use client';

import { useState, useEffect } from 'react';
import MoodPopup from './MoodPopup';
import { getAllMoodData } from '../lib/moodData';

export default function Calendar({ selectedMonth, selectedYear }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [moodData, setMoodData] = useState({});

  useEffect(() => {
    const fetchMoodData = async () => {
      const data = await getAllMoodData();
      console.log('Fetched moodData:', data); // Veriyi konsolda kontrol et
      setMoodData(data);
    };
    fetchMoodData();
  }, [selectedMonth, selectedYear]);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
  const lastDayOfMonth = new Date(selectedYear, selectedMonth - 1, daysInMonth).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const emptyDaysStart = Array.from({ length: adjustedFirstDay }, () => null);
  const emptyDaysEnd = Array.from({ length: lastDayOfMonth === 0 ? 0 : 7 - lastDayOfMonth }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDoubleClick = (day) => {
    const dateKey = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(dateKey);
    setShowPopup(true);
  };

  return (
    <>
      <div className={`calendar ${showPopup ? 'blur' : ''}`}>
        {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
          <div key={day} className="day header">
            {day}
          </div>
        ))}
        {emptyDaysStart.map((_, index) => (
          <div key={`empty-start-${index}`} className="day empty"></div>
        ))}
        {days.map((day) => {
          const dateKey = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const mood = moodData[dateKey]?.mood || '';
          return (
            <div
              key={day}
              className="day"
              onDoubleClick={() => handleDoubleClick(day)}
            >
              <span className="day-number">{day}</span>
              {mood && <span className="mood-emoji">{mood.split(' ')[1]}</span>}
            </div>
          );
        })}
        {emptyDaysEnd.map((_, index) => (
          <div key={`empty-end-${index}`} className="day empty"></div>
        ))}
      </div>
      {showPopup && (
        <MoodPopup
          date={selectedDate}
          onClose={() => {
            setShowPopup(false);
            const fetchMoodData = async () => {
              const data = await getAllMoodData();
              console.log('Updated moodData:', data); // Güncellenmiş veriyi kontrol et
              setMoodData(data);
            };
            fetchMoodData();
          }}
        />
      )}
    </>
  );
}