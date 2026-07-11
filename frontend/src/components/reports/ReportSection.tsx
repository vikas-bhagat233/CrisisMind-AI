import React from "react";

export default function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5">
      <h3 className="eyebrow mb-3">{title}</h3>
      {children}
    </section>
  );
}
