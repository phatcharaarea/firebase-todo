import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  timeRange?: string;
}

interface Props {
  day: number | null;
  dateStr: string;
  userId: string;
  onAddClick: () => void;
onAdded: () => void; // ✅ เพิ่ม
  triggerReload?: number; // เพิ่มตัวแปรไว้หากภายนอกอยาก trigger
}

const DayCell: React.FC<Props> = ({ day, dateStr, userId, onAddClick ,triggerReload}) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    if (!day) return;

    const ref = collection(db, "todos", userId, dateStr);
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Todo[];

    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, [dateStr, day, userId,triggerReload]);

  const handleDelete = async (todoId: string) => {
    const ref = doc(db, "todos", userId, dateStr, todoId);
    await deleteDoc(ref);
    fetchTodos(); // โหลดใหม่หลังลบ
  };

  return (
    <div
      onClick={day ? onAddClick : undefined}
      className={`bg-white p-1 h-full cursor-pointer flex flex-col border ${
        day ? "hover:bg-blue-50" : "bg-gray-100 cursor-default"
      }`}
    >
      <div className="font-semibold mb-1 text-xs">{day}</div>

      {todos.map((todo) => (
        <div
          key={todo.id}
          className="text-[10px] bg-blue-100 px-1 py-[1px] mb-1 rounded flex justify-between items-center gap-1"
          onClick={(e) => e.stopPropagation()} // ป้องกัน modal
        >
          <div className="flex-1">
            {todo.timeRange && (
              <div className="text-[10px] text-gray-600">🕒 {todo.timeRange}</div>
            )}
            <div className="truncate">📝 {todo.title}</div>
          </div>

          <button
            onClick={() => handleDelete(todo.id)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default DayCell;