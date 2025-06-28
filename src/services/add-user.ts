import { index } from "../client/pinecone-client";
import { embedUserProfile } from "./embed-user";

export async function addUser(user: {
  id: string;
  username: string;
  games: string[];
  availability: string[];
  play_style: string[];
  honor_rating: number;
  bio: string;
}) {
  const vector = await embedUserProfile(user);
  

await index.upsert([
  {
    id: user.id,
    values: vector,
    metadata: {
      username: user.username,
      games: user.games.join(", "),
      availability: user.availability.join(", "),
      play_style: user.play_style.join(", "),
      honor_rating: user.honor_rating,
      bio: user.bio,
    },
  },
]);

  console.log(`✅ User ${user.username} added to Pinecone`);
}
