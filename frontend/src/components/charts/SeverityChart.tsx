import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function SeverityChart({ data }: { data: { label: string; score: number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#1B2130" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#8B93A3", fontSize: 11 }} axisLine={{ stroke: "#262E40" }} />
          <YAxis tick={{ fill: "#8B93A3", fontSize: 11 }} axisLine={{ stroke: "#262E40" }} />
          <Tooltip
            contentStyle={{ background: "#131722", border: "1px solid #262E40", borderRadius: 8 }}
            labelStyle={{ color: "#E8EAED" }}
          />
          <Bar dataKey="score" fill="#3D9AF7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
