import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
 * Mock API for Spring Boot backend
 * POST /api/v1/pet/weight - 체중 등록/수정
 * GET /api/v1/pet/weight - 체중 목록 조회
 */

const DATA_FILE = path.join(process.cwd(), "data", "weights.json");

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

async function readWeights(): Promise<WeightRecord[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWeights(weights: WeightRecord[]): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(weights, null, 2));
}

// GET: 체중 목록 조회
export async function GET() {
  const weights = await readWeights();
  weights.sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    success: true,
    data: weights,
  });
}

// POST: 체중 등록/수정
export async function POST(request: Request) {
  const body = await request.json();
  const { memberId, petId, weight } = body as {
    memberId: number;
    petId: number;
    weight: number;
  };

  // Validation
  if (typeof memberId !== "number" || typeof petId !== "number") {
    return NextResponse.json(
      { success: false, error: "memberId와 petId가 필요합니다." },
      { status: 400 }
    );
  }

  if (typeof weight !== "number" || weight <= 0) {
    return NextResponse.json(
      { success: false, error: "weight는 양수여야 합니다." },
      { status: 400 }
    );
  }

  const today = getToday();
  const weights = await readWeights();
  const existingIndex = weights.findIndex((w) => w.date === today);

  if (existingIndex >= 0) {
    weights[existingIndex].weight = weight;
  } else {
    weights.push({ date: today, weight });
  }

  weights.sort((a, b) => a.date.localeCompare(b.date));
  await writeWeights(weights);

  return NextResponse.json({
    success: true,
    data: {
      petId,
      weight,
      date: today,
    },
  });
}
