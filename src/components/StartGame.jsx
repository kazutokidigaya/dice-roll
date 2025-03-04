import { useState } from "react";
import DiceGame from "./DiceGame";

const StartGame = () => {
  // Declare state inside the component
  const [gameStart, setGameStart] = useState(false);

  return gameStart ? (
    <DiceGame />
  ) : (
    <div className="h-screen md:min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center my-10">
        {/* Dice Image */}
        <div className="flex-shrink-0">
          <img
            src="src/assets/dice-main.png"
            alt="Dice Game"
            className="w-[220px] sm:w-[400px] md:w-auto h-auto animate-bounce"
          />
        </div>
        {/* Game Content */}
        <div className="text-left text-white pb-10 flex justify-center items-center flex-col">
          <h1 className="text-4xl  font-bold mb-4">Dice Game</h1>
          <div className="mb-6">
            <p className="text-lg">Place your bet and test your luck!</p>
            <p className="font-semibold text-xl mt-4">Rules:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Enter your bet amount.</li>
              <li>Click "Roll Dice" to see a random number (1-6).</li>
              <li>If the roll is 4, 5, or 6, you win 2x your bet.</li>
              <li>If the roll is 1, 2, or 3, you lose your bet.</li>
            </ul>
          </div>

          <button
            onClick={() => setGameStart(true)}
            class=" cursor-pointer relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-blacktransition duration-300 ease-out border-2 border-gray-500 rounded-full shadow-md group"
          >
            <span class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gray-500 group-hover:translate-x-0 ease">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span class="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
              Play Now
            </span>
            <span class="relative invisible">Play Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartGame;
