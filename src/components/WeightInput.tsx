"use client";

import { useState } from "react";

interface Props {
  todayWeight: number | null;
  onSave: (weight: number) => Promise<void>;
}

export default function WeightInput({ todayWeight, onSave }: Props) {
  const [value, setValue] = useState(
    todayWeight !== null ? todayWeight.toString() : ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const w = parseFloat(value);
    if (isNaN(w) || w <= 0) return;

    setSaving(true);
    setSaved(false);
    try {
      await onSave(w);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const isUpdate = todayWeight !== null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-base font-medium text-gray-800">오늘의 체중</h2>
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="체중 입력"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-800 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
          <span className="text-sm text-gray-600">kg</span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !value}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? "..." : saved ? "OK" : isUpdate ? "수정" : "저장"}
        </button>
      </div>
      {isUpdate && (
        <p className="mt-2 text-xs text-gray-400">
          오늘 이미 {todayWeight.toFixed(2)}kg 기록됨
        </p>
      )}
    </div>
  );
}
