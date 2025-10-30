// src/app/g/[slug]/page.tsx  (SERVER COMPONENT)
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { pressStart } from "@/app/fonts";
import EndStoryButton from "@/components/EndStoryButton";
import ComposerBox from "@/components/ComposerBox";
import FinalShare from "@/components/FinalShare";
import Link from "next/link";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function GamePage({ params, searchParams }: Props) {
  const { slug } = params;
  const hostParam = typeof searchParams?.host === "string" ? searchParams.host : undefined;

  // game
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (gameError || !game) {
    return (
      <main className="relative min-h-screen bg-pink-500 text-white">
        {/* tiny header */}
        <header className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
          <Image
            src="/logo-splendidwreck.png"
            alt="splendid wreck logo"
            width={28}
            height={28}
            className="opacity-90"
            priority
          />
          <span className="text-xs uppercase tracking-widest opacity-80">splendid wreck</span>
        </header>

        <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center p-6 text-center">
          <h1 className="mb-3 text-3xl font-semibold">No game found</h1>
          <Link
            href="/"
            className="mt-6 rounded-full border border-white/50 px-3 py-1 text-xs uppercase tracking-widest hover:bg-white/10 transition"
          >
            start your own
          </Link>
        </section>
      </main>
    );
  }

const isHost = !!hostParam && hostParam === game.admin_key;

  // entries (need last one for composer)
  const { data: entriesRaw } = await supabase
    .from("entries")
    .select("*")
    .eq("game_id", game.id)
    .order("position", { ascending: true });

  const entries = entriesRaw ?? [];
  const last = entries[entries.length - 1];
  const previousText = last ? last.text : "";
  const lastPos = entries.length - 1;

  // Host CLOSED → single-paragraph final story

  // Host CLOSED → single, share-ready visual
if (isHost && game.status === "closed") {
  const paragraph = entries.map((e) => e.text.trim()).join(" ");
  return (
    <main className="relative min-h-screen bg-pink-500 text-white">
      <header className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <Image src="/logo-splendidwreck.png" alt="splendid wreck logo" width={28} height={28} className="opacity-90" priority />
        <span className="text-xs uppercase tracking-widest opacity-80">splendid wreck</span>
      </header>

      <section className="mx-auto max-w-5xl p-6 pt-20 text-center">
        <div className="mb-6 text-xs opacity-80">
          <span className="uppercase tracking-widest">final</span>{" "}
          <code className="bg-white/10 rounded px-2 py-0.5">{slug}</code>
        </div>

        {/* Share-ready visual + Download button */}
        <FinalShare paragraph={paragraph} slug={slug} />
      </section>
    </main>
  );
}
  return (
    <main className="relative min-h-screen bg-pink-500 text-white">
      {/* tiny header */}
      <header className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <Image src="/logo-splendidwreck.png" alt="splendid wreck logo" width={28} height={28} className="opacity-90" priority />
        <span className="text-xs uppercase tracking-widest opacity-80">splendid wreck</span>
      </header>

      <section className="mx-auto max-w-4xl p-6 pt-20">
        <div className="mb-6 text-xs opacity-80">
          <span className="uppercase tracking-widest">{isHost ? "thread" : "add your line"}</span>{" "}
          <code className="bg-white/10 rounded px-2 py-0.5">{slug}</code>
        </div>

        {isHost ? (
          <>
            {/* HOST OPEN VIEW: simple list + End Story button */}
            <ol className="space-y-4">
              {entries.map((e) => (
                <li key={e.id} className="rounded-2xl border border-white/25 p-4 md:p-6">
                  <p className={`${pressStart.className} text-lg md:text-2xl`}>{e.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <EndStoryButton gameId={game.id} />
            </div>
          </>
        ) : (
          <>
            {/* NON-HOST VIEW: ONLY the big composer box (no static list) */}
            <ComposerBox
              previousText={previousText}
              gameId={game.id}
              lastPos={lastPos}
              maxChars={100}
            />
          </>
        )}
      </section>
    </main>
  );
}
