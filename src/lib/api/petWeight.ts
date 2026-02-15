import { API_URL } from "./config";
import type { PetWeightRequest, PetWeightResponse, WeightListResponse } from "./types";

/**
 * 애완동물 체중 API 서비스
 */

/**
 * 체중 등록/수정
 * - 오늘 이미 기록이 있으면 수정됨
 * - 없으면 새로 등록
 */
export async function savePetWeight(request: PetWeightRequest): Promise<PetWeightResponse> {
  const response = await fetch(`${API_URL}/pet/weight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: errorText || `HTTP ${response.status}`,
    };
  }

  return response.json();
}

/**
 * 체중 목록 조회
 * - memberId와 petId로 해당 펫의 체중 기록을 조회
 */
export async function getPetWeights(memberId: number, petId: number): Promise<WeightListResponse> {
  const response = await fetch(`${API_URL}/pet/weight?memberId=${memberId}&petId=${petId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: errorText || `HTTP ${response.status}`,
    };
  }

  return response.json();
}
