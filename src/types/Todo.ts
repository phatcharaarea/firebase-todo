export interface Todo {
  id: string;
  title: string;
  timeRange: string;
  completed: boolean;
  createdDate: any; // ถ้าใช้ timestamp จาก Firebase
}