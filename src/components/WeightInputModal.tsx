"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  todayWeight: number | null;
  onSave: (weight: number) => Promise<void>;
}

export default function WeightInputModal({ isOpen, onClose, todayWeight, onSave }: Props) {
  const [value, setValue] = useState(
    todayWeight !== null ? todayWeight.toString() : ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const w = parseFloat(value);
    if (isNaN(w) || w <= 0) return;

    setSaving(true);
    try {
      await onSave(w);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isUpdate = todayWeight !== null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full space-y-4 rounded-t-3xl bg-white p-6 sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">
            {isUpdate ? "체중 수정" : "체중 기록"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <svg className="size-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isUpdate && (
          <p className="text-sm text-gray-500">
            오늘 기록: {todayWeight.toFixed(2)}kg
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="체중 입력"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-800 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-400"
          />
          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
            <span className="text-sm text-gray-600">kg</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !value}
          className="w-full rounded-xl bg-orange-500 py-3 text-base font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? "저장 중..." : isUpdate ? "수정하기" : "저장하기"}
        </button>
      </div>
    </div>
  );
}
