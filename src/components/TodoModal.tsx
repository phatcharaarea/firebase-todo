import React from "react";

interface Props {
  isOpen: boolean;
  dateStr: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  endTime: string;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSubmit: () => void;
}

const TodoModal: React.FC<Props> = ({
  isOpen,
  dateStr,
  title,
  setTitle,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-bold mb-4">➕ เพิ่ม To-do ({dateStr})</h2>

        <input
          type="text"
          placeholder="เรื่องที่ต้องทำ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2 mb-3"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;