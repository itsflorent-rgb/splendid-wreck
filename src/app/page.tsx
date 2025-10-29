"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateSlug, generateKey } from "@/lib/utils";
import { pressStart } from "@/app/fonts";
import Image from "next/image";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // after creation
  const [slug, setSlug] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);

  // public (friends) link and private host link
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = useMemo(
    () => (slug ? `${origin}/g/${slug}` : ""),
    [slug, origin]
  );
  const hostUrl = useMemo(
    () => (slug && adminKey ? `${origin}/g/${slug}?host=${adminKey}` : ""),
    [slug, adminKey, origin]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    setLoading(true);
    setError(null);

    const newSlug = generateSlug();
    const newAdminKey = generateKey();

    try {
      // create game with admin_key
      const { data: game, error: gameError } = await supabase
        .from("games")
        .insert({ slug: newSlug, admin_key: newAdminKey })
        .select()
        .single();
      if (gameError || !game) throw gameError;

      // first entry
      const { error: entryError } = await supabase.from("entries").insert({
        game_id: game.id,
        position: 0,
        text: value,
      });
      if (entryError) throw entryError;

      // store for UI
      setSlug(newSlug);
      setAdminKey(newAdminKey);
      setText("");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    const msg = `Help me complete my thought on ship wreck:\n${shareUrl}\n\nOpen the link and add the next line. You’ll only see the previous line until the end!`;
    await navigator.clipboard.writeText(msg);
    alert("Copied!");
  }

  return (
      <main className="relative min-h-screen bg-pink-500 text-white">
      {/* tiny, out-of-the-way header */}
      <header className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <Image
          src="/logo-shipwreck.png"
          alt="ship wreck logo"
          width={28}
          height={28}
          className="opacity-90"
          priority
        />
        <span className="text-xs uppercase tracking-widest opacity-80">ship wreck</span>
      </header>

    <section className="min-h-screen bg-pink-500 text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-8 text-center">
        {/* form (before creation) */}
        {!slug && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className={[
                pressStart.className,
                "block w-full bg-transparent text-white placeholder-white/60",
                "outline-none border-4 border-white rounded-3xl px-6 py-8",
                "text-1xl sm:text-2xl md:text-2xl lg:text-3xl text-center",
              ].join(" ")}
              type="text"
              placeholder="Start your story…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              autoFocus
            />
            {error && <p className="text-red-200 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-100 transition disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create & Get Share Link"}
            </button>
          </form>
        )}

        {/* share panel (after creation) */}
        {slug && (
          <div className="space-y-4">
            <p className="text-sm opacity-80">
              Share this with friends to complete the story:
            </p>

            <div className="rounded-2xl border border-white/50 p-5 text-left">
              <p className="whitespace-pre-wrap text-sm">
                {`Help me complete the story on Ship Wreck:\n${shareUrl}\n\nOpen the link and add the next line. Each player only sees the previous line!`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopy}
                className="rounded-full border border-white/70 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 transition"
              >
                Copy message
              </button>
              {/* Host-only link (private) */}
              {hostUrl && (
                <a
                  href={hostUrl}
                  className="rounded-full border border-white/70 px-4 py-2 text-xs uppercase tracking-widest hover:bg白/10 transition"
                >
                  View live thread*
                </a>
              )}
            </div>

            <p className="text-[10px] opacity-70">
              *Watch the story unfold and decide when to end it. 
            </p>
          </div>
        )}
      </div>
        </section>
    </main>
  );
}
