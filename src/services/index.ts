import { addUser } from "./add-user";
import { matchesArray, player } from "../libs/data/mock-data";
import { matchUser } from "./match-user";
import { rerankMatches } from "./rerank-matches";

async function run() {
  const addUsers = async () => {
    return Promise.all(matchesArray.map((user) => addUser(user)));
  };

  await addUsers();
  const rawMatches = await matchUser(player);
  const ranked = await rerankMatches(player, rawMatches);
  console.log("🧠 GPT-Ranked Matches:");
  ranked.forEach((m: any, i: number) =>
    console.log(`${i + 1}. ${m.username} — ${m.reason}`)
  );
}

run();
