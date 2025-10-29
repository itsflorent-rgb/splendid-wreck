"use client";

import { useState } from "react";
import { pressStart } from "@/app/fonts";

type Props = {
  previousText: string;                // last fragment in the chain
  placeholder?: string;
  fontSizeClass?: string;              // lets you reuse at different sizes
  onSubmit: (nextText: string) => Promise<void> | void;
};

export default function TurnComposer({
  previousText,
  placeholder = "…your words",
  fontSizeClass = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = value.trim();
    if (!next) return;
    setLoading(true);
    try {
      await onSubmit(next);
      setValue(""); // clear after submit
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* inline row that looks like a single sentence */}
      <div
        className={[
          pressStart.className,
          "flex flex-wrap items-baseline",
          "gap-x-2 gap-y-3",
          "text-white",
          fontSizeClass,
        ].join(" ")}
      >
        {/* previous words: not editable */}
        <span className="shrink-0">
          {previousText}
        </span>

        {/* tiny non-breaking space so the caret doesn’t glue to the last letter */}
        <span aria-hidden className="opacity-0 select-none"> </span>

        {/* input continues the sentence */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={[
            "min-w-[8rem] flex-1",
            "bg-transparent",
            "text-white placeholder-white/60",
            "border-0 outline-none focus:outline-none",
            "caret-white",
          ].join(" ")}
          placeholder={placeholder}
          autoFocus
          disabled={loading}
        />
      </div>

      {/* subtle controls */}
      <div className="mt-3 flex items-center gap-3 text-xs opacity-80">
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-full border border-white/70 px-4 py-2 uppercase tracking-widest hover:bg-white/10 transition disabled:opacity-50"
        >
          {loading ? "saving…" : "add your line"}
        </button>
        <span>Press Enter to submit</span>
      </div>
    </form>
  );
}
