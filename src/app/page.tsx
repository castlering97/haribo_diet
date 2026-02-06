"use client";

import { useEffect, useState, useCallback } from "react";
import WeightChart from "@/components/WeightChart";
import WeightInput from "@/components/WeightInput";

interface WeightRecord {
  date: string;
  weight: number;
}

function getToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  const [data, setData] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/weight");
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = getToday();
  const todayRecord = data.find((d) => d.date === today);

  const handleSave = async (weight: number) => {
    await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, weight }),
    });
    await fetchData();
  };

  // 최근 기록 요약
  const latest = data.length > 0 ? data[data.length - 1] : null;
  const prev = data.length > 1 ? data[data.length - 2] : null;
  const diff = latest && prev ? latest.weight - prev.weight : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      {/* 헤더 */}
      <header className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          하리보 다이어트
        </h1>
        <p className="mt-1 text-sm text-gray-400">우리 강아지 체중 관리</p>
      </header>

      {/* 요약 카드 */}
      {latest && (
        <div className="mx-5 mt-4 flex items-baseline gap-2 rounded-2xl bg-orange-50 px-5 py-4">
          <span className="text-3xl font-bold text-orange-600">
            {latest.weight.toFixed(2)}
          </span>
          <span className="text-sm text-orange-400">kg</span>
          {diff !== null && (
            <span
              className={`ml-auto text-sm font-medium ${
                diff < 0
                  ? "text-green-500"
                  : diff > 0
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              {diff > 0 ? "+" : ""}
              {diff.toFixed(2)} kg
            </span>
          )}
        </div>
      )}

      {/* 그래프 */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-sm font-semibold text-gray-500">체중 변화</h2>
        {loading ? (
          <div className="flex h-52 items-center justify-center text-gray-300">
            불러오는 중...
          </div>
        ) : (
          <WeightChart data={data} />
        )}
      </section>

      {/* 입력 */}
      <section className="mt-8 px-5 pb-12">
        <WeightInput
          key={todayRecord?.weight ?? "new"}
          todayWeight={todayRecord?.weight ?? null}
          onSave={handleSave}
        />
      </section>
    </div>
  );
}
