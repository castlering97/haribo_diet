import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "weights.json");

interface WeightRecord {
  date: string; // YYYY-MM-DD
  weight: number; // kg
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

// GET: 전체 체중 기록 조회
export async function GET() {
  const weights = await readWeights();
  weights.sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json(weights);
}

// POST: 오늘 체중 upsert
export async function POST(request: Request) {
  const body = await request.json();
  const { date, weight } = body as { date: string; weight: number };

  if (!date || typeof weight !== "number" || weight <= 0) {
    return NextResponse.json(
      { error: "date (YYYY-MM-DD)와 weight (양수)가 필요합니다." },
      { status: 400 }
    );
  }

  const weights = await readWeights();
  const existingIndex = weights.findIndex((w) => w.date === date);

  if (existingIndex >= 0) {
    weights[existingIndex].weight = weight;
  } else {
    weights.push({ date, weight });
  }

  weights.sort((a, b) => a.date.localeCompare(b.date));
  await writeWeights(weights);

  return NextResponse.json({ date, weight });
}
