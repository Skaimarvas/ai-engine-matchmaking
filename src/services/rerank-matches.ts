// ai-engine/rerankMatches.ts

import { RecordMetadata, RecordSparseValues, RecordValues } from "@pinecone-database/pinecone";
import { openai } from "../client/openai-client";

type Match = {
  id: string;
  score?: number;
  values?: RecordValues;
  sparseValues?: RecordSparseValues;
  metadata?: RecordMetadata;
};

export async function rerankMatches(
  user: {
    id: string;
    username: string;
    games: string[];
    availability: string[];
    play_style: string[];
    honor_rating: number;
    bio: string;
  },
  matches: Match[]
) {
  const userProfile = `
User:
  - Username: ${user.username},
  - Games: ${user.games.join(", ")},
  - Availability: ${user.availability.join(", ")},
  - Play Style: ${user.play_style.join(", ")},
  - Honor: ${user.honor_rating},
  - Bio: ${user.bio}
`;

  const candidates = matches
    .map(
      (m, i) => `
Candidate ${i + 1}:
  - Id: ${m.id}
  - Username: ${m.metadata?.username},
  - Games: ${m.metadata?.games},
  - Availability: ${m.metadata?.availability},
  - Play Style: ${m.metadata?.play_style},
  - Honor: ${m.metadata?.honor_rating},
  - Bio: ${m.metadata?.bio}
`
    )
    .join("\n");

  const prompt = `
You are an intelligent matchmaking assistant for gamers.

Given the following player and potential matches, rank the top 3 best matches and explain your reasoning to the user using second-person language kindly. in 1 sentence per match. Here is a rule: 
- If no candidate, user, or possible match is found, return an object with a status code of 404. The object should also include a message explaining the reason for the 404 status — specifically, that no relevant data was found and Return JSON in this format:
  { status: 404, message: "..."}

${userProfile}

${candidates}

Return JSON in this format:
[
  { "id": "u1", "username": "lucy", "reason": "They both like FPS and have high honor" },
  ...
]
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const json = extractJSONFromResponse(response.choices[0].message.content!);
  return json;
}

function extractJSONFromResponse(text: string): any {
  try {
    // Try to find array
    const jsonStartArr = text.indexOf("[");
    const jsonEndArr = text.lastIndexOf("]");
    if (jsonStartArr !== -1 && jsonEndArr !== -1) {
      const json = text.slice(jsonStartArr, jsonEndArr + 1);
      return JSON.parse(json);
    }
    // Try to find object
    const jsonStartObj = text.indexOf("{");
    const jsonEndObj = text.lastIndexOf("}");
    if (jsonStartObj !== -1 && jsonEndObj !== -1) {
      const json = text.slice(jsonStartObj, jsonEndObj + 1);
      return JSON.parse(json);
    }
    // Fallback
    throw new Error("No valid JSON found");
  } catch (e) {
    console.error("❌ Failed to parse GPT response:", text);
    return [];
  }
}
