"use client";

import TurnComposer from "@/components/TurnComposer";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function ClientComposer({
  previousText,
  gameId,
  lastPos,
}: {
  previousText: string;
  gameId: string;
  lastPos: number;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(nextText: string) {
    setError(null);
    const { error } = await supabase.from("entries").insert({
      game_id: gameId,
      position: Math.max(0, lastPos + 1),
      text: nextText,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Show thank-you; do NOT reload and do NOT navigate.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <p className="text-sm opacity-90">Thanks! Your line was added.</p>
      </div>
    );
  }

  return (
    <>
      <TurnComposer
        previousText={previousText}
        onSubmit={onSubmit}
        fontSizeClass="text-lg md:text-2xl lg:text-3xl"
        placeholder="…add your line"
      />
      {error && <p className="mt-2 text-xs text-white/80">{error}</p>}
    </>
  );
}
