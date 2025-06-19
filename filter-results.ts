export function filterByOverlap(
  inputGames: string[],
  matches: {
    id: string;
    score: number;
    metadata: any;
  }[],
  honorThreshold: number
) {
  return matches.filter((match) => {
    const theirGames = (match.metadata.games || "").split(", ");
    const overlap = inputGames.some((g) => theirGames.includes(g));
    const honorOk = match.metadata.honor >= honorThreshold;
    return overlap && honorOk;
  });
}