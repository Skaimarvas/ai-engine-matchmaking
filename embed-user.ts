// ai-engine/embedUser.ts
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedUserProfile(profile: {
  username: string;
  games: string[];
  honor: number;
}): Promise<number[]> {
  const input = `Games: ${profile.games.join(", ")}, Honor: ${profile.honor}`;
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });
  return res.data[0].embedding;
}