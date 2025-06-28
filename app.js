const express = require("express");
const addUserFn = require("./src/services/add-user");
const matchUserFn = require("./src/services/match-user");
const rerankMatchesFn = require("./src/services/rerank-matches");
const pineconeClient = require('./src/client/pinecone-client')
const app = express();
app.use(express.json());

app.get("/", async(req, res) => {
  res.send("The app is working")
})
const {addUser} = addUserFn
const {matchUser} = matchUserFn
const {rerankMatches} = rerankMatchesFn
const {deleteAllVectors} = pineconeClient
app.post("/match", async (req, res) => {
  try {
    // await deleteAllVectors();
    const { currentPlayer, players } = req.body;
    console.log("|| Req.Body ||", req.body)

    if (!currentPlayer || !Array.isArray(players)) {
      return res
        .status(400)
        .json({ error: "player and others array are required" });
    }

    await Promise.all(players.map((user) => addUser(user)));

    const rawMatches = await matchUser(currentPlayer);
    console.log("rawMatches", rawMatches)
    const ranked = await rerankMatches(currentPlayer, rawMatches);
    console.log("AI RESPONSE", ranked)

    res.json({
      message: "🧠 GPT-Ranked Matches",
      matches: ranked.map((m, i) => ({
        rank: i + 1,
        username: m.username,
        reason: m.reason,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : error });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
