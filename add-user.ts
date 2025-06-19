import { index } from "./client/pinecone-client";
import { embedUserProfile } from "./embed-user";

export async function addUser(user: {
  id: string;
  username: string;
  games: string[];
  honor: number;
}) {
  const vector = await embedUserProfile(user);

  await index.upsert([
    {
      id: user.id,
      values: vector,
      metadata: {
        username: user.username,
        games: user.games.join(", "),
        honor: user.honor,
      },
    },
  ]);

  console.log(`✅ User ${user.username} added to Pinecone`);
}
