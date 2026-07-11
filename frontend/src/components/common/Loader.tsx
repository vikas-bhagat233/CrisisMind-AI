import React from "react";
import Spinner from "../ui/Spinner";

export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-muted text-sm py-8 justify-center">
      <Spinner />
      {label}
    </div>
  );
}
