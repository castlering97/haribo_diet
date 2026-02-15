"use client";

import { useEffect, useState, useCallback } from "react";
import WeightChart from "@/components/WeightChart";
import WeightInputModal from "@/components/WeightInputModal";
import { savePetWeight, getPetWeights, type WeightRecord } from "@/lib/api";

// TODO: 실제 환경에서는 로그인 후 얻은 값을 사용
// 현재는 개발용 기본값
const DEFAULT_MEMBER_ID = 1;
const DEFAULT_PET_ID = 1;

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
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // TODO: 실제 환경에서는 인증/선택된 펫 정보를 사용
  const memberId = DEFAULT_MEMBER_ID;
  const petId = DEFAULT_PET_ID;

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await getPetWeights(memberId, petId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error ?? "데이터를 불러오는데 실패했습니다");
      }
    } catch (e) {
      setError("서버에 연결할 수 없습니다");
      console.error("Failed to fetch weight data:", e);
    } finally {
      setLoading(false);
    }
  }, [memberId, petId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = getToday();
  const todayRecord = data.find((d) => d.date === today);

  const handleSave = async (weight: number) => {
    const response = await savePetWeight({
      memberId,
      petId,
      weight,
    });

    if (!response.success) {
      throw new Error(response.error ?? "저장에 실패했습니다");
    }

    await fetchData();
  };

  // 최근 기록 요약
  const latest = data.length > 0 ? data[data.length - 1] : null;
  const prev = data.length > 1 ? data[data.length - 2] : null;
  const diff = latest && prev ? latest.weight - prev.weight : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          하리보 다이어트
        </h1>
        <p className="mt-1 text-sm text-gray-400">우리 강아지 체중 관리</p>
      </header>

      <div className="space-y-4 px-5 pb-12">
        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 그래프 */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-medium text-gray-800">체중 추이</h2>
          {loading ? (
            <div className="flex h-52 items-center justify-center text-gray-300">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="flex h-52 items-center justify-center text-gray-300">
              데이터를 표시할 수 없습니다
            </div>
          ) : (
            <WeightChart data={data} />
          )}
        </div>

        {/* 현재 체중 카드 */}
        {latest && (
          <div className="flex items-center gap-2 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-orange-500">
                {latest.weight.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">kg</span>
            </div>
            {diff !== null && (
              <span
                className={`ml-auto rounded-full px-3 py-1 text-sm font-medium ${
                  diff < 0
                    ? "bg-green-50 text-green-600"
                    : diff > 0
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-50 text-gray-400"
                }`}
              >
                {diff > 0 ? "+" : ""}
                {diff.toFixed(2)} kg
              </span>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-10 flex size-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600"
      >
        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Weight Input Modal */}
      <WeightInputModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        todayWeight={todayRecord?.weight ?? null}
        onSave={handleSave}
      />
    </div>
  );
}
