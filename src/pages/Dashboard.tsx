import { useNavigate } from "react-router-dom";
import { useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Dashboard() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate(); // วันสุดท้ายของเดือน
  };

  const getStartDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // index 0-6
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth);

  // สร้าง array ของวันในปฏิทิน (รวมช่องว่างก่อนวันจริง)
  const calendarDays: (number | null)[] = Array(startDay).fill(null).concat(
    Array.from({ length: totalDays }, (_, i) => i + 1)
  );

  // เต็ม 42 ช่อง (7x6)
  while (calendarDays.length < 42) calendarDays.push(null);

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Tab Bar */}
      <div className="flex justify-center mb-4 space-x-2">
        <button className="border px-4 py-1 rounded bg-gray-100 font-medium">Year</button>
        <button className="border px-4 py-1 rounded bg-gray-200 font-medium">Month</button>
        <button className="border px-4 py-1 rounded bg-gray-100 font-medium">Day</button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-1">
        {WEEKDAYS.map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center gap-y-2">
        {calendarDays.map((day, idx) => (
          <div key={idx} className="h-10 flex items-center justify-center text-sm text-gray-800">
            {day ? day : ""}
          </div>
        ))}
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