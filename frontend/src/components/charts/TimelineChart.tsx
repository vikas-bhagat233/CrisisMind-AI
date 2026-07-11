import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function TimelineChart({ data }: { data: { day: string; incidents: number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#1B2130" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "#8B93A3", fontSize: 11 }} axisLine={{ stroke: "#262E40" }} />
          <YAxis tick={{ fill: "#8B93A3", fontSize: 11 }} axisLine={{ stroke: "#262E40" }} />
          <Tooltip
            contentStyle={{ background: "#131722", border: "1px solid #262E40", borderRadius: 8 }}
            labelStyle={{ color: "#E8EAED" }}
          />
          <Line type="monotone" dataKey="incidents" stroke="#3D9AF7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
