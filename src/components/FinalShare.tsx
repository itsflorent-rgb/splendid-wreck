"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import { pressStart } from "@/app/fonts";

/**
 * Renders a single, share-ready visual of the finished story,
 * with the ship wreck logo and the whole story as one paragraph.
 * White on pink, Press Start 2P.
 */
export default function FinalShare({
  paragraph,
  slug,
}: {
  paragraph: string;
  slug: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!ref.current) return;
    try {
      setDownloading(true);
      // Higher quality export: scale up to avoid pixelation
      const dataUrl = await htmlToImage.toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ec4899", // Tailwind pink-500
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `ship-wreck-${slug}.png`;
      a.click();
    } catch (e) {
      alert("Could not generate image. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* This box is what we capture as the social image */}
      <div
        ref={ref}
        className={[
          // fixed social-friendly size; tweak as you like
          "mx-auto",
          "w-[900px] max-w-full",
          "rounded-3xl",
          "bg-pink-500 text-white",
          "border border-white/30",
          "p-8 md:p-10",
        ].join(" ")}
        // Ensure white background when exporting (we also set backgroundColor)
      >
        {/* Tiny header inside the image */}
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/logo-shipwreck.png"
            alt="ship wreck logo"
            width={28}
            height={28}
            className="opacity-90"
            priority
          />
          <span className="text-xs uppercase tracking-widest opacity-80">
            ship wreck
          </span>
        </div>

        {/* The final story as one paragraph */}
        <p
          className={`${pressStart.className} text-xl md:text-2xl leading-relaxed whitespace-pre-wrap`}
        >
          {paragraph}
        </p>
      </div>

      {/* Controls (kept outside so they aren't captured) */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-full border border-white/70 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10 transition disabled:opacity-50"
        >
          {downloading ? "Preparing image…" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
