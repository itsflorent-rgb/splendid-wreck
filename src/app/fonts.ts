// src/app/fonts.ts
import { Work_Sans, Press_Start_2P } from "next/font/google";

export const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});
