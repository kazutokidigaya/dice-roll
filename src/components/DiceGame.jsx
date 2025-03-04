import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers"; // For Web3 integration if needed
import Confetti from "react-confetti";
import "./DiceGame.css";

const DiceGame = () => {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState("");
  const [diceRoll, setDiceRoll] = useState(null);
  const [result, setResult] = useState(null); // "win" or "loss"
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const diceRef = useRef(null);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const storedBalance = localStorage.getItem("playerBalance");
    if (storedBalance) {
      setBalance(parseInt(storedBalance, 10));
    } else {
      localStorage.setItem("playerBalance", "1000");
    }

    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          console.log("Connected wallet:", accounts[0]);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Update localStorage when balance changes
  useEffect(() => {
    localStorage.setItem("playerBalance", balance.toString());
  }, [balance]);

  // Function to trigger dice animation
  const rollDiceEffect = (random) => {
    if (diceRef.current) {
      diceRef.current.style.animation = "rolling 4s";
      setTimeout(() => {
        switch (random) {
          case 1:
            diceRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
            break;
          case 6:
            diceRef.current.style.transform = "rotateX(180deg) rotateY(0deg)";
            break;
          case 2:
            diceRef.current.style.transform = "rotateX(-90deg) rotateY(0deg)";
            break;
          case 5:
            diceRef.current.style.transform = "rotateX(90deg) rotateY(0deg)";
            break;
          case 3:
            diceRef.current.style.transform = "rotateX(0deg) rotateY(90deg)";
            break;
          case 4:
            diceRef.current.style.transform = "rotateX(0deg) rotateY(-90deg)";
            break;
          default:
            break;
        }
        diceRef.current.style.animation = "none";
      }, 4050);
    }
  };

  const handleRollDice = async () => {
    const betAmount = parseInt(bet);
    if (isNaN(betAmount) || betAmount <= 0) {
      setError("Please enter a valid bet amount.");
      return;
    }
    if (betAmount > balance) {
      setError("Bet exceeds current balance!");
      return;
    }
    setError(null);

    // Generate a clientSeed
    const clientSeed = Math.random().toString(36).substring(2, 15);

    try {
      const response = await fetch(
        "https://dice-roll-red.vercel.app/roll-dice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bet: betAmount, balance, clientSeed }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      const { roll, newBalance, serverSeed, hashProof } = data;

      // Trigger dice animation based on the roll
      rollDiceEffect(roll);

      setTimeout(() => {
        setDiceRoll(roll);
        if (roll >= 4) {
          setBalance(newBalance);
          setResult("win");
          setShowConfetti(true);
        } else {
          setBalance(newBalance);
          setResult("loss");
          setShowConfetti(true);
        }
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }, 4050);
    } catch (err) {
      console.error(err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500 w-full  mb-4"
          role="alert"
          tabIndex="-1"
          aria-labelledby="hs-with-list-label"
        >
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="shrink-0 size-4 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </div>
            <div className="ms-4">
              <h3 id="hs-with-list-label" className="text-sm font-semibold">
                Error
              </h3>
              <p className="mt-2">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="cursor-pointer ml-auto text-red-800 dark:text-red-500 text-xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="h-[100%] w-[100%] flex items-center justify-center p-4">
        {/* Confetti for win/loss */}
        {showConfetti && result === "win" && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            numberOfPieces={200}
            recycle={false}
            colors={["#00FF00", "#66FF66", "#33CC33"]}
          />
        )}
        {showConfetti && result === "loss" && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            numberOfPieces={200}
            recycle={false}
            colors={["#FF0000", "#FF6666", "#CC3333"]}
          />
        )}

        {/* Main Game Card */}
        <div className="flex-row items-center gap-12 p-8 rounded-lg">
          {/* Dice Animation */}
          <div className="flex-shrink-0 flex justify-center items-center m-20">
            <div className="dice" ref={diceRef}>
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
              <div className="face right"></div>
              <div className="face left"></div>
            </div>
          </div>
          {/* Game Content */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">Dice Game</h1>

            <div>
              <input
                type="number"
                id="number-input"
                aria-describedby="helper-text-explanation"
                className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Bet Amount"
                required
                value={bet}
                onChange={(e) => setBet(e.target.value)}
              />
              <p className="text-gray-300 mb-4">Current Balance: ${balance}</p>
              {diceRoll !== null && (
                <p className="text-gray-300 mb-4">
                  Dice Rolled: <span className="font-bold">{diceRoll}</span>{" "}
                  {result === "win" ? "(Win!)" : "(Loss!)"}
                </p>
              )}
            </div>

            <button
              onClick={handleRollDice}
              className="cursor-pointer relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
            >
              <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
              <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
              <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
              <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
              <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
              <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
                Roll Dice
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceGame;
