import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  DocumentData,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Todo } from "../types/Todo";

const userId = "test-user";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const formatFullDate = (date: Date) =>
  date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const timeToPixel = (time: string) => {
  const [hour, min] = time.split(":").map(Number);
  return hour * 40 + (min / 60) * 40;
};

const isOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
  return !(aEnd <= bStart || bEnd <= aStart);
};

export default function DayView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const dateStr = formatDate(selectedDate);

  const goToPreviousDay = () =>
    setSelectedDate((prev) => new Date(prev.getTime() - 86400000));
  const goToNextDay = () =>
    setSelectedDate((prev) => new Date(prev.getTime() + 86400000));

  useEffect(() => {
    const fetchTodos = async () => {
      const ref = collection(db, "todos", userId, dateStr);
      const q = query(ref);
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item): item is Todo => "timeRange" in item);
      setTodos(data);
    };
    fetchTodos();
  }, [dateStr]);

  const handleAddTodo = async () => {
    if (!title.trim()) return;

    const conflict = todos.some((t) => {
      const [s1, e1] = t.timeRange.split("-");
      const [s2, e2] = [startTime, endTime];
      return !(e1 <= s2 || e2 <= s1);
    });

    if (conflict) {
      alert("เวลานี้มีงานแล้ว");
      return;
    }

    const ref = collection(db, "todos", userId, dateStr);
    await addDoc(ref, {
      title,
      completed: false,
      createdDate: serverTimestamp(),
      timeRange: `${startTime}-${endTime}`,
    });
    setTitle("");
    setStartTime("00:00");
    setEndTime("00:00");
    setModalOpen(false);
    const snapshot = await getDocs(query(ref));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Todo[];
    setTodos(data);
  };

  const arrangeColumns = (items: Todo[]) => {
    const sorted = [...items].sort((a, b) => {
    return (a.timeRange || "").localeCompare(b.timeRange || "");
    });
    const columns: Todo[][] = [];

    sorted.forEach((todo) => {
    if (!todo.timeRange) return null; // หรือ continue / ไม่ render   
      const [startA, endA] = todo.timeRange.split("-");
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!todo.timeRange) return null; // หรือ continue / ไม่ render
        const [bStart, bEnd] = col.length > 0 ? col[col.length - 1].timeRange.split("-") : ["", ""];
        if (!col.some((t) => {
          return isOverlap(startA, endA, bStart, bEnd);
        })) {
          col.push(todo);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([todo]);
    });

    const layout: { todo: Todo; col: number; colCount: number }[] = [];
    columns.forEach((col, i) => {
      col.forEach((todo) => {
        layout.push({ todo, col: i, colCount: columns.length });
      });
    });

    return layout;
  };

  const layout = arrangeColumns(todos);

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">📆 {formatFullDate(selectedDate)}</h2>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button onClick={goToPreviousDay} className="px-2">←</button>
        {Array.from({ length: 7 }, (_, i) => {
          const date = new Date(selectedDate);
          date.setDate(selectedDate.getDate() - 3 + i);
          const str = formatDate(date);
          return (
            <button
              key={str}
              onClick={() => setSelectedDate(date)}
              className={`px-3 py-1 rounded ${
                formatDate(selectedDate) === str ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
        <button onClick={goToNextDay} className="px-2">→</button>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ➕ เพิ่ม To-do
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-semibold mb-2">เพิ่ม To-do</h3>
            <input
              type="text"
              placeholder="รายละเอียด..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border w-full p-2 rounded mb-2"
            />
            <div className="flex gap-2 mb-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-1 rounded w-full"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-1 rounded w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="text-sm text-gray-500"
              >ยกเลิก</button>
              <button
                onClick={handleAddTodo}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
              >เพิ่ม</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative text-sm" style={{ height: 24 * 40 }}>
        {Array.from({ length: 24 }, (_, h) => (
          <div
            key={h}
            className="flex absolute left-0 right-0 border-b border-gray-300"
            style={{ top: h * 40, height: 40 }}
          >
            <div className="w-14 text-right pr-2 pt-1 text-gray-500">
              {`${h.toString().padStart(2, "0")}:00`}
            </div>
            <div className="flex-1 relative pl-2" />
          </div>
        ))}

        {layout.map(({ todo, col, colCount }) => {
          const [start, end] = todo.timeRange?.split("-") || ["", ""];
          const top = timeToPixel(start);
          const height = timeToPixel(end) - top;
          const left = `calc(3.5rem + ${(col / colCount) * 100}%)`; // ชดเชยเวลา (w-14)
          const width = `calc(${100 / colCount}% - 1rem)`;

          return (
            <div
              key={todo.id}
              className="absolute bg-blue-100 border-l-4 border-blue-500 px-2 py-1 rounded shadow"
              style={{ top, height, left, width }}
            >
              <div className="font-medium">✅ {todo.title}</div>
              <div className="text-xs text-gray-500">{todo.timeRange}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
