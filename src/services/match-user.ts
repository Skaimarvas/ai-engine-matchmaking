import { index } from "../client/pinecone-client";
import { embedUserProfile } from "./embed-user";

export async function matchUser(user: {
  id: string;
  username: string;
  games: string[];
  availability: string[];
  play_style: string[];
  honor_rating: number;
  bio: string;
}) {
  const vector = await embedUserProfile(user);

  const res = await index.query({
    vector,
    topK: 5,
    includeMetadata: true,
    filter: {
      honor_rating: { $gte: user.honor_rating },
    },
  });
  return res.matches;
}
