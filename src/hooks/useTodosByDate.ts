// src/hooks/useTodosByDate.ts
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export function useTodosByDate(userId: string, dateStr: string) {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    if (!userId || !dateStr) return;
    const q = query(
      collection(db, "todos", userId, dateStr),
      orderBy("createdDate", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: TodoItem[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TodoItem, "id">),
      }));
      setTodos(list);
    });

    return () => unsub();
  }, [userId, dateStr]);

  return todos;
}

export async function toggleComplete(userId: string, dateStr: string, todoId: string, done: boolean) {
  const ref = doc(db, "todos", userId, dateStr, todoId);
  await updateDoc(ref, { completed: done });
}

export async function updateTitle(userId: string, dateStr: string, todoId: string, newTitle: string) {
  const ref = doc(db, "todos", userId, dateStr, todoId);
  await updateDoc(ref, { title: newTitle });
}

export async function removeTodo(userId: string, dateStr: string, todoId: string) {
  const ref = doc(db, "todos", userId, dateStr, todoId);
  await deleteDoc(ref);
}