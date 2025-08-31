import React, { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

export default function InlineEditNumber({ value, min = 0, step = 1, suffix, onSave, onCancel }) {
  const [val, setVal] = useState(value);
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  function commit() {
    let n = Number(val);
    if (isNaN(n)) n = value;
    if (n < min) n = min;
    onSave(Number(n));
  }
  function handleKey(e) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") onCancel?.();
  }

  return (
    <div className="inline-flex items-center gap-2">
      <input
        ref={ref}
        type="number"
        step={step}
        min={min}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
        className="w-24 text-right px-2 py-1 rounded-lg bg-neutral-900 border border-white/10 outline-none focus:border-emerald-500"
      />
      {suffix && <span className="text-neutral-400">{suffix}</span>}
      <button
        onClick={commit}
        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700"
        title="Save"
      >
        <Check className="h-4 w-4 text-white" />
      </button>
      <button
        onClick={onCancel}
        className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
        title="Cancel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
