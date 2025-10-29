import "./globals.css";
import type { Metadata } from "next";
import { workSans } from "./fonts"; // ✅ import only from fonts.ts

export const metadata: Metadata = {
  title: "ship wreck",
  description: "A social writing game inspired by cadavre exquis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${workSans.className} bg-FF4AA2-500 text-white`}>
        {children}
      </body>
    </html>
  );
}
