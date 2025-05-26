'use client';

import { useState, useEffect } from 'react';
import { saveMoodData, getMoodData } from '../lib/moodData';

export default function MoodPopup({ date, onClose }) {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');

  const moods = [
    'Mutlu 😊',
    'Üzgün 😢',
    'Kızgın 😠',
    'Heyecanlı 🤩',
    'Huzurlu 😌',
    'Endişeli 😟',
    'Yorgun 😴',
  ];

  useEffect(() => {
    const data = getMoodData(date);
    setMood(data.mood || '');
    setNote(data.note || '');
  }, [date]);

  const handleSave = () => {
    saveMoodData(date, mood, note);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>{new Date(date).toLocaleDateString('tr-TR')}</h3>
        <label>
          Ruh Halin:
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">Seçiniz</option>
            {moods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Not:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bugün nasıl geçti?"
          />
        </label>
        <button onClick={handleSave}>Kaydet</button>
      </div>
    </div>
  );
}