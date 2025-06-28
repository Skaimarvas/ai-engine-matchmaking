import { openai } from "../client/openai-client";


export async function embedUserProfile(profile: {
  id: string;
  username: string;
  games: string[];
  availability: string[];
  play_style: string[];
  honor_rating: number;
  bio: string;
}): Promise<number[]> {
  const input = 
  `
  Games: ${profile.games.join(", ")},
  Availability: ${profile.availability.join(", ")},
  Play Style: ${profile.play_style.join(", ")},
  Honor: ${profile.honor_rating}, 
  Bio: ${profile.bio} `;
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });
  return res.data[0].embedding;
}