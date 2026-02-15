/**
 * API 요청/응답 타입 정의
 */

// 체중 등록/수정 요청
export interface PetWeightRequest {
  memberId: number;
  petId: number;
  weight: number;
}

// 체중 등록/수정 응답
export interface PetWeightResponse {
  success: boolean;
  data?: {
    petId: number;
    weight: number;
    date: string;
  };
  error?: string;
}

// 체중 기록 (목록 조회용)
export interface WeightRecord {
  date: string;
  weight: number;
}

// 체중 목록 조회 응답
export interface WeightListResponse {
  success: boolean;
  data?: WeightRecord[];
  error?: string;
}
