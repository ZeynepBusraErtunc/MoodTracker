"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./Calendar.css";

export default function Calendar({ month, setMonth, year, setYear, userId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMoods = localStorage.getItem(`moods_${userId}`);
      return savedMoods ? JSON.parse(savedMoods) : {};
    }
    return {};
  });
  const router = useRouter();

  const getMonthColor = (month) => {
    const monthColors = [
      "rgba(135, 206, 235, 0.3)", // Ocak - Gökyüzü mavisi
      "rgba(176, 224, 230, 0.3)", // Şubat - Toz mavi
      "rgba(144, 238, 144, 0.3)", // Mart - Açık yeşil
      "rgba(50, 205, 50, 0.3)",   // Nisan - Yeşil
      "rgba(255, 182, 193, 0.3)", // Mayıs - Açık pembe
      "rgba(255, 215, 0, 0.3)",   // Haziran - Altın sarısı
      "rgba(255, 165, 0, 0.3)",   // Temmuz - Turuncu
      "rgba(255, 99, 71, 0.3)",   // Ağustos - Mercan
      "rgba(210, 180, 140, 0.3)", // Eylül - Tan
      "rgba(255, 140, 0, 0.3)",   // Ekim - Koyu turuncu
      "rgba(165, 42, 42, 0.3)",   // Kasım - Kahverengi
      "rgba(192, 192, 192, 0.3)", // Aralık - Gümüş gri
    ];
    return monthColors[month];
  };

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    calm: "😌",
    excited: "🤩",
    tired: "🥱"
  };

  const moodColors = {
    happy: "rgba(255, 255, 153, 0.5)", // Pastel sarı
    sad: "rgba(173, 216, 230, 0.5)",   // Pastel mavi
    angry: "rgba(255, 182, 193, 0.5)", // Pastel kırmızı
    calm: "rgba(144, 238, 144, 0.5)",  // Pastel yeşil
    excited: "rgba(255, 215, 0, 0.5)", // Pastel altın
    tired: "rgba(202, 202, 202, 0.5)"  // Pastel gri
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayIndex = (year, month) => {
    const firstDay = new Date(year, month, 1);
    return (firstDay.getDay() + 6) % 7; 
  };

  const handleDateClick = async (day) => {
    const date = `${day} ${monthNames[month]} ${year}`;
    setSelectedDate(date);
    try {
      const res = await fetch(`http://localhost:5000/api/moods/${userId}/${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`);
      const data = await res.json();
      setMood(data.mood || "");
      setNote(data.note || "");
      setMoods((prev) => ({ ...prev, [date]: { mood: data.mood || "", note: data.note || "" } }));
    } catch (err) {
      console.error("Error fetching mood:", err);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !mood) return;
    const [day] = selectedDate.split(" ");
    const date = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    try {
      await fetch("http://localhost:5000/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date, mood, note }),
      });
      setMoods((prev) => {
        const updatedMoods = { ...prev, [selectedDate]: { mood, note } };
        if (typeof window !== "undefined") {
          localStorage.setItem(`moods_${userId}`, JSON.stringify(updatedMoods));
        }
        return updatedMoods;
      });
      setSelectedDate(null); 
      setMood("");
      setNote("");
    } catch (err) {
      console.error("Error saving mood:", err);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userId");
    }
    router.push("/");
  };

  useEffect(() => {
    if (userId && typeof window !== "undefined") {
      const savedMoods = localStorage.getItem(`moods_${userId}`);
      if (savedMoods) {
        setMoods(JSON.parse(savedMoods));
      } else {
        // Backend'den verileri çekme denemesi
        const fetchInitialMoods = async () => {
          try {
            const currentMonth = month;
            const currentYear = year;
            const daysInMonth = getDaysInMonth(currentYear, currentMonth);
            const initialMoods = {};
            for (let day = 1; day <= daysInMonth; day++) {
              const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              const res = await fetch(`http://localhost:5000/api/moods/${userId}/${date}`);
              const data = await res.json();
              if (data.mood) {
                initialMoods[`${day} ${monthNames[currentMonth]} ${currentYear}`] = { mood: data.mood, note: data.note || "" };
              }
            }
            if (Object.keys(initialMoods).length > 0) {
              setMoods((prev) => ({ ...prev, ...initialMoods }));
              localStorage.setItem(`moods_${userId}`, JSON.stringify({ ...moods, ...initialMoods }));
            }
          } catch (err) {
            console.error("Error fetching initial moods:", err);
          }
        };
        fetchInitialMoods();
      }
    }
  }, [userId, month, year]);

  const daysInMonth = getDaysInMonth(year, month);
  const startDayIndex = getStartDayIndex(year, month);
  const days = Array.from({ length: startDayIndex + daysInMonth }, (_, i) => i < startDayIndex ? null : i - startDayIndex + 1);

  return (
    <div className="calendar-container" style={{ backgroundColor: getMonthColor(month), minHeight: "100vh" }}>
      <div className="navbar">
        <div className="left-controls">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {monthNames.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => 2020 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="right-logout">
          <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
        </div>
      </div>
      <div className="month-title">{monthNames[month]} {year}</div>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {days.map((day, idx) => {
          const date = day ? `${day} ${monthNames[month]} ${year}` : null;
          const mood = day ? moods[date]?.mood : null;
          const backgroundColor = mood ? moodColors[mood] : "#f9f9f9";
          return (
            <div key={idx} className="day" onClick={() => day && handleDateClick(day)} style={{ backgroundColor }}>
              {day && (
                <div className="day-content">
                  <span className="day-number">{day}</span>
                  {mood && <span className="mood-emoji">{moodEmojis[mood]}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="popup-overlay">
          <div className="mood-form">
            <h2>{selectedDate} için Ruh Hali</h2>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="">Ruh Hali Seç</option>
              {Object.keys(moodEmojis).map((m) => (
                <option key={m} value={m}>{m} {moodEmojis[m]}</option>
              ))}
            </select>
            <textarea
              placeholder="Not ekle..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="no-resize"
            />
            <button onClick={handleSave}>Kaydet</button>
            <button onClick={() => setSelectedDate(null)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}