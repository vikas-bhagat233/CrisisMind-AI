import React from "react";

export default function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg bg-base-900 border border-base-600 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-signal outline-none transition-colors resize-none ${
        props.className || ""
      }`}
    />
  );
}
