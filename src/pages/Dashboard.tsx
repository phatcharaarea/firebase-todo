import { useNavigate } from "react-router-dom";
import { useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Dashboard() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getStartDay = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDay(currentYear, currentMonth);

  const days: (number | null)[] = Array(startDay).fill(null).concat(
    Array.from({ length: totalDays }, (_, i) => i + 1)
  );

  while (days.length < 42) days.push(null); // เต็ม 6 แถว

  return (
      <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="py-4 text-center text-2xl font-bold">📅 ปฏิทินรายเดือน</div>

      {/* Tab Controls */}
      <div className="flex justify-center gap-3 mb-2">
        <button className="px-3 py-1 rounded bg-gray-100 text-sm">ปี</button>
        <button className="px-3 py-1 rounded bg-blue-100 text-sm font-semibold">เดือน</button>
        <button className="px-3 py-1 rounded bg-gray-100 text-sm">วัน</button>
      </div>

      {/* Calendar */}
      <div className="flex-1 grid grid-rows-[auto,1fr] max-w-[100vw] px-2">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-700 border-b border-gray-300">
          {WEEKDAYS.map((day, idx) => (
            <div key={idx} className="py-2">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 grid-rows-6 gap-px bg-gray-300 h-full border-t border-gray-300">
          {days.map((day, index) => (
            <div
              key={index}
              className={`bg-white flex items-center justify-center text-sm 
                hover:bg-blue-100 cursor-pointer select-none
                ${day ? 'text-gray-900' : 'text-transparent'}`}
              onClick={() => day && alert(`ดูรายการวันที่ ${day}/${currentMonth + 1}/${currentYear}`)}
            >
              {day || "."}
            </div>
          ))}
        </div>
      </div>
    </div>
    // <div className="p-8">
    //     <h1 className="text-2xl font-bold">Dashboard</h1>
    //     <button
    //         onClick={goToLogin}
    //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //     >
    //     🔐 ไปที่หน้า Login
    //     </button>
    // </div>
  );
}