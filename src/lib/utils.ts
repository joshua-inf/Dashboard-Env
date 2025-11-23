import { clsx, type ClassValue } from "clsx";
import OpenAI from "openai";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
