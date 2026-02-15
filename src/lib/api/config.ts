/**
 * API 설정
 *
 * 환경변수로 백엔드 서버 URL을 설정할 수 있습니다.
 * - NEXT_PUBLIC_API_BASE_URL: 백엔드 서버의 기본 URL (예: http://localhost:8080)
 *
 * 기본값은 "" (빈 문자열)로, Next.js 내장 mock API를 사용합니다.
 * 실제 Spring Boot 서버 연결 시 환경변수를 설정하세요.
 */

// 백엔드 API 기본 URL (환경변수 또는 기본값: 로컬 mock API)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// API 버전 prefix
export const API_VERSION = "/api/v1";

// 전체 API URL
export const API_URL = `${API_BASE_URL}${API_VERSION}`;
