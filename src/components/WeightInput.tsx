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
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-500">
        오늘의 체중 (kg)
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="예: 5.40"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg font-semibold text-gray-800 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <button
          onClick={handleSave}
          disabled={saving || !value}
          className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
        >
          {saving ? "..." : saved ? "OK" : isUpdate ? "수정" : "저장"}
        </button>
      </div>
      {isUpdate && (
        <p className="text-xs text-gray-400">
          오늘 이미 {todayWeight.toFixed(2)}kg 기록됨 — 수정하면 덮어씁니다
        </p>
      )}
    </div>
  );
}
