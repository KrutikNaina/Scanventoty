import React from "react";

export default function AuthDivider({ text = "or" }) {
  return (
    <div className="relative my-6">
      <div className="h-px w-full bg-white/10" />
      <span className="absolute inset-0 -top-3 mx-auto w-12 text-center text-xs text-neutral-400 bg-neutral-950 dark:bg-neutral-950">
        {text}
      </span>
    </div>
  );
}
