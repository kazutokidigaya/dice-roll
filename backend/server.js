// server.js
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/roll-dice", (req, res) => {
  const { bet, balance, clientSeed } = req.body;

  // Validate the bet
  if (!bet || bet <= 0) {
    return res.status(400).json({ error: "Invalid bet amount" });
  }
  if (bet > balance) {
    return res.status(400).json({ error: "Bet exceeds current balance" });
  }

  // Generate a random server seed and compute the hash for provable fairness
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const hashProof = crypto
    .createHash("sha256")
    .update(serverSeed + clientSeed)
    .digest("hex");

  // Generate a random dice roll (1–6)
  const roll = Math.floor(Math.random() * 6) + 1;

  // Calculate the new balance:
  // In this example, if the roll is 4, 5, or 6 the payout is 2x (i.e. the player wins their bet back plus an equal amount)
  // Otherwise, the bet is deducted.
  let newBalance;
  if (roll >= 4) {
    newBalance = balance - bet + 3 * bet;
  } else {
    newBalance = balance - bet;
  }

  res.json({
    roll,
    newBalance,
    serverSeed,
    hashProof,
    clientSeed,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
