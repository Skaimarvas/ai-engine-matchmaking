const express = require("express");
const addUserFn = require("./src/services/add-user");
const matchUserFn = require("./src/services/match-user");
const rerankMatchesFn = require("./src/services/rerank-matches");
const pineconeClient = require("./src/client/pinecone-client");
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("The app is working");
});
const { addUser } = addUserFn;
const { matchUser } = matchUserFn;
const { rerankMatches } = rerankMatchesFn;
const { deleteAllVectors, checkPineconeConnection } = pineconeClient;
app.post("/match", async (req, res) => {
  try {
    let ranked;

    const isConnected = await checkPineconeConnection();
    if (!isConnected) {
      return res
        .status(500)
        .json({ error: "Pinecone connection check failed" });
    }

    await deleteAllVectors();
    const { currentPlayer, players } = req.body;

    if (!currentPlayer || !Array.isArray(players)) {
      return res
        .status(400)
        .json({ error: "currentPlayer and players array are requiredd" });
    }

    await Promise.all(players.map((user) => addUser(user)));

    const rawMatches = await matchUser(currentPlayer);
    ranked = await rerankMatches(currentPlayer, rawMatches);

    if (ranked && ranked?.status === 404) {
      return res.status(404).json({
        error: ranked.message ?? "No matches found",
        code: 404,
      });
    }
    if (ranked && Array.isArray(ranked) && ranked.length > 0) {
      return res.json({
        message: "🧠 GPT-Ranked Matches",
        matches: ranked.map((m, i) => ({
          rank: i + 1,
          username: m.username,
          reason: m.reason,
        })),
      });
    } else {
      throw new Error("No valid matches found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : error });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
