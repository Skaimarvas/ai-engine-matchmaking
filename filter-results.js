"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByOverlap = filterByOverlap;
function filterByOverlap(inputGames, matches, honorThreshold) {
    return matches.filter((match) => {
        const theirGames = (match.metadata.games || "").split(", ");
        const overlap = inputGames.some((g) => theirGames.includes(g));
        const honorOk = match.metadata.honor >= honorThreshold;
        return overlap && honorOk;
    });
}
