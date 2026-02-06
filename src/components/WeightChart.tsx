"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface WeightRecord {
  date: string;
  weight: number;
}

export default function WeightChart({ data }: { data: WeightRecord[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
        아직 기록이 없어요
      </div>
    );
  }

  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const padding = Math.max((maxW - minW) * 0.2, 0.2);
  const goalWeight = data.length > 0 ? data[0].weight : undefined;

  const formatDate = (dateStr: string) => {
    const [, m, d] = dateStr.split("-");
    return `${parseInt(m)}/${parseInt(d)}`;
  };

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: "#999" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minW - padding, maxW + padding]}
            tick={{ fontSize: 12, fill: "#999" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v.toFixed(1)}`}
          />
          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined
                ? [`${value.toFixed(2)} kg`, "체중"]
                : ["", ""]
            }
            labelFormatter={(label) => formatDate(String(label))}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          {goalWeight && data.length > 1 && (
            <ReferenceLine
              y={goalWeight}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ fill: "#f97316", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#ea580c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
