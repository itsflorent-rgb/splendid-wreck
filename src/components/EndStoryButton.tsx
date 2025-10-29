"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function EndStoryButton({ gameId }: { gameId: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function endIt() {
    setErr(null);
    setLoading(true);
    const { error } = await supabase
      .from("games")
      .update({ status: "closed" })
      .eq("id", gameId);
    setLoading(false);
    if (error) setErr(error.message);
    else setDone(true);
  }

  if (done) return <p className="text-sm opacity-90">Story ended.</p>;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={endIt}
        disabled={loading}
        className="rounded-full border border-white/70 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 transition disabled:opacity-50"
      >
        {loading ? "Ending…" : "End the story"}
      </button>
      {err && <span className="text-xs opacity-80">{err}</span>}
    </div>
  );
}
