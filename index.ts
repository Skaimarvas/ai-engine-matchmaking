import { addUser } from "./add-user";
import { filterByOverlap } from "./filter-results";
import { matchUser } from "./match-user";


async function run() {
  await addUser({
    id: "u1",
    username: "kai",
    games: ["valorant", "lol"],
    honor: 80,
  });

  await addUser({
    id: "u2",
    username: "lucy",
    games: ["minecraft", "apex"],
    honor: 85,
  });

  // Match a new user
  const rawMatches = await matchUser({
    username: "ghost",
    games: ["wow", "cs2"],
    honor: 65,
  });
  // @ts-ignore
  const filtered = filterByOverlap(["valorant", "cs2"], rawMatches, 70);

  console.log("🔍 Best matches:", filtered.map((m) => [m.id, m.metadata]));
}

run();