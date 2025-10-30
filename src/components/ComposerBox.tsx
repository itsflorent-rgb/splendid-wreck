// src/components/ComposerBox.tsx
"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { pressStart } from "@/app/fonts";

export default function ComposerBox({
  previousText,
  gameId,
  lastPos,
  maxChars = 100,
}: {
  previousText: string;
  gameId: string;
  lastPos: number;
  maxChars?: number;
}) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(() => maxChars - value.length, [value, maxChars]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error } = await supabase.from("entries").insert({
        game_id: gameId,
        position: Math.max(0, lastPos + 1),
        text,
      });
      if (error) throw error;
      setSubmitted(true); // thank-you state
   } catch (err: unknown) {
  if (err instanceof Error) setError(err.message);
  else setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-white/25 p-6 text-center">
        <p className="text-sm opacity-90">Thanks! Your line was added.</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/25 p-4 md:p-6">
        {/* Big writing area */}
        <div
          className={[
            "relative rounded-xl bg-transparent text-white",
            "border border-white/20 p-4 md:p-6",
            "min-h-[40vh] overflow-auto",
          ].join(" ")}
        >
          {/* Previous line at the top */}
          <p className={`${pressStart.className} text-xl md:text-2xl leading-relaxed whitespace-pre-wrap`}>
            {previousText}
            {previousText ? " " : ""}
          </p>

          {/* User continuation */}
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) setValue(e.target.value);
            }}
            className={[
              pressStart.className,
              "mt-2 block w-full bg-transparent text-white placeholder-white/60",
              "outline-none border-none focus:outline-none resize-none",
              "text-xl md:text-2xl leading-relaxed",
            ].join(" ")}
            placeholder="…add your line"
            rows={6}
            maxLength={maxChars}
            autoFocus
          />
        </div>

        {/* Controls */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting || value.trim().length === 0}
            className="rounded-full border border-pink/70 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 transition disabled:opacity-50"
          >
            {submitting ? "saving…" : "add your line"}
          </button>

          {/* Character counter */}
          <div className="text-xs opacity-80">
            {remaining} / {maxChars}
          </div>
        </div>

        {error && <p className="mt-2 text-xs opacity-90">{error}</p>}
      </form>

      {/* Moved footer hint INSIDE component; shown only when not submitted */}
      <div className="mt-3 text-[11px] opacity-70">
        You’ll only see the previous line when adding yours.
      </div>
    </>
  );
}
