import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { GameContext } from "../contexts/GameContext";
import ScoreBoard from "../components/ScoreBoard";
import NotFound from "../pages/NotFound";
import { FaChevronLeft, FaTrophy, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

// Import all game components
import TicTacToe from "../games/TicTacToe/TicTacToe";
import Snake from "../games/Snake/Snake";
import MemoryGame from "../games/MemoryGame/MemoryGame";
import Hangman from "../games/Hangman/Hangman";
import Sudoku from "../games/Sudoku/Sudoku";
import Minesweeper from "../games/Minesweeper/Minesweeper";
import WordSearch from "../games/WordSearch/WordSearch";
import QuizGame from "../games/QuizGame/QuizGame";
import ConnectFour from "../games/ConnectFour/ConnectFour";
import RockPaperScissors from "../games/RockPaperScissors/RockPaperScissors";

// Game metadata
const gameInfo = {
  "tic-tac-toe": { name: "Tic Tac Toe", color: "from-purple-500 to-pink-500" },
  "snake": { name: "Snake", color: "from-green-500 to-teal-500" },
  "memory-game": { name: "Memory Game", color: "from-blue-500 to-cyan-500" },
  "hangman": { name: "Hangman", color: "from-orange-500 to-red-500" },
  "sudoku": { name: "Sudoku", color: "from-indigo-500 to-purple-500" },
  "minesweeper": { name: "Minesweeper", color: "from-gray-500 to-slate-500" },
  "word-search": { name: "Word Search", color: "from-emerald-500 to-green-500" },
  "quiz-game": { name: "Quiz Game", color: "from-yellow-500 to-orange-500" },
  "connect-four": { name: "Connect Four", color: "from-red-500 to-pink-500" },
  "rock-paper-scissors": { name: "Rock Paper Scissors", color: "from-cyan-500 to-blue-500" }
};

// Map game IDs to their components
const gameComponents = {
  "tic-tac-toe": TicTacToe,
  "snake": Snake,
  "memory-game": MemoryGame,
  "hangman": Hangman,
  "sudoku": Sudoku,
  "minesweeper": Minesweeper,
  "word-search": WordSearch,
  "quiz-game": QuizGame,
  "connect-four": ConnectFour,
  "rock-paper-scissors": RockPaperScissors
};

const GamePage = () => {
  const { gameId } = useParams();
  const { updateScore } = useContext(GameContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const GameComponent = gameComponents[gameId];
  const currentGame = gameInfo[gameId];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!GameComponent) {
    return <NotFound />;
  }

  const handleGameEnd = (score) => {
    updateScore(gameId, score);
    setGameStarted(false);
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      {/* Header */}
      <div className={`bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <div className="p-2 rounded-full bg-gray-700/50 group-hover:bg-gray-600/50 transition-all duration-300">
                  <FaChevronLeft className="text-sm" />
                </div>
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              
              {currentGame && (
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 bg-gradient-to-b ${currentGame.color} rounded-full`}></div>
                  <h1 className={`text-2xl font-bold bg-gradient-to-r ${currentGame.color} bg-clip-text text-transparent`}>
                    {currentGame.name}
                  </h1>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowScoreboard(!showScoreboard)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
              >
                <FaTrophy className="text-sm" />
                <span className="hidden sm:inline">Scoreboard</span>
              </button>
              
              <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 text-gray-300 hover:text-white">
                <FaCog className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-6 py-8">
        <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Game Component */}
          <div className={`transition-all duration-500 ${showScoreboard ? 'lg:w-3/4' : 'w-full'}`}>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
              {/* Game Status Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${gameStarted ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                  <span className="text-gray-300 font-medium">
                    {gameStarted ? 'Game in Progress' : 'Ready to Play'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>

              {/* Game Component Wrapper */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 rounded-lg"></div>
                <GameComponent 
                  onGameEnd={handleGameEnd} 
                  onGameStart={handleGameStart}
                />
              </div>
            </div>
          </div>

          {/* Scoreboard Sidebar */}
          {showScoreboard && (
            <div className={`lg:w-1/4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaTrophy className="text-yellow-400 text-xl" />
                  <h2 className="text-xl font-bold text-white">Scoreboard</h2>
                </div>
                
                <ScoreBoard gameId={gameId} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        <button className="group relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
          <FaTrophy className="text-white text-xl" />
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Stats
          </div>
        </button>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default GamePage;