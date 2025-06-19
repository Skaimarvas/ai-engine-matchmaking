import { index } from "./client/pinecone-client";
import { embedUserProfile } from "./embed-user";

export async function matchUser(user: {
  username: string;
  games: string[];
  honor: number;
}) {
  const vector = await embedUserProfile(user);

  const res = await index.query({
    vector,
    topK: 5,
    includeMetadata: true,
  });

  return res.matches;
}
