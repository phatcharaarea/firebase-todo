import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import TodoModal from "../components/TodoModal";
import DayCell from "../components/DayCell";
import DayView from "../components/DayView";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const userId = "test-user";

// 👇 Helper สร้าง dateStr
function formatDate(year: number, month: number, day: number): string {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    }
    
export default function Dashboard() {
const [viewMode, setViewMode] = useState<"year" | "month" | "day">("month");
  const today = new Date();
  const [modalDate, setModalDate] = useState<string | null>(null);
    const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [title, setTitle] = useState("");

  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const [refreshKey, setRefreshKey] = useState(0);

  // 👉 สร้าง array วันที่
  const days: (number | null)[] = Array(startDay).fill(null).concat(
    Array.from({ length: totalDays }, (_, i) => i + 1)
  );
  while (days.length < 42) days.push(null);


  const openModal = (dateStr: string) => {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    setStartTime(`${hour}:${minute}`);
    setEndTime(`${hour}:${minute}`);
    setModalDate(dateStr);
};

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-xl font-bold text-center py-4">📅 ปฏิทิน To-do</h1>

      <div className="flex justify-center gap-4 py-2">
        {["year", "month", "day"].map((mode) => (
            <button
            key={mode}
            onClick={() => setViewMode(mode as "year" | "month" | "day")}
            className={`px-4 py-1 rounded ${
                viewMode === mode ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            >
            {mode.toUpperCase()}
            </button>
        ))}
        </div>

        {viewMode === "day" && <DayView />}
        {viewMode === "month" && (
            <>
            <div className="grid grid-cols-7 text-center font-semibold text-sm border-b">
                {WEEKDAYS.map((d, i) => (
                <div key={i} className="py-1">
                    {d}
                </div>
                ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 gap-px bg-gray-200 flex-1 text-[12px]">
                {days.map((day, idx) => {
                const dateStr = day ? formatDate(year, month, day) : "";

                return (
                    <DayCell
                    key={idx}
                    day={day}
                    dateStr={dateStr}
                    userId={userId}
                    // onAddClick={() => setModalDate(dateStr)}
                    onAddClick={() => openModal(dateStr)}
                      onAdded={() => setRefreshKey(k => k + 1)} // ✅ ส่งเข้าไป
                     triggerReload={refreshKey}
                    />
                );
                })}
            </div>

            {/* ✅ Modal เพิ่ม To-do */}
            <TodoModal
            key={modalDate} // บังคับให้ re-render
            isOpen={!!modalDate}
            dateStr={modalDate || ""}
            title={title}
            setTitle={setTitle}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            onClose={() => setModalDate(null)}
            onSubmit={async () => {
                if (!modalDate) return;

                const ref = collection(db, "todos", userId, modalDate);
                await addDoc(ref, {
                title,
                completed: false,
                createdDate: serverTimestamp(),
                timeRange: `${startTime}-${endTime}`,
                });

                setTitle("");
                setStartTime("00:00");
                setEndTime("00:00");
                setModalDate(null);
                setRefreshKey((k) => k + 1);
            }}
            />
            </>
        )}
    </div>
  );
}
