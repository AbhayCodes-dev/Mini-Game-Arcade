
import GameCard from "../components/GameCard";
import { FaGamepad, FaChess, FaPuzzlePiece, FaBrain, FaDice, FaChessBoard } from "react-icons/fa";
import { GiCardPickup, GiSnake, GiStonePile, GiSwordsEmblem, GiHangingSign } from "react-icons/gi";
import { BsGridFill, BsSearch, BsQuestionSquareFill } from "react-icons/bs";
import { useState, useEffect } from "react";

const games = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic X and O game for two players',
    category: 'Strategy',
    icon: FaGamepad,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Guide the snake to eat food and grow',
    category: 'Arcade',
    icon: GiSnake,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    description: 'Find matching pairs of cards',
    category: 'Puzzle',
    icon: GiCardPickup,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'hangman',
    name: 'Hangman',
    description: 'Guess the word before the man hangs',
    category: 'Word',
    icon: GiHangingSign,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Fill the grid with numbers 1-9',
    category: 'Puzzle',
    icon: FaBrain,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Find all mines without triggering them',
    category: 'Strategy',
    icon: GiStonePile,
    color: 'from-gray-500 to-slate-500'
  },
  {
    id: 'word-search',
    name: 'Word Search',
    description: 'Find hidden words in a grid',
    category: 'Word',
    icon: BsSearch,
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'quiz-game',
    name: 'Quiz Game',
    description: 'Test your knowledge with trivia questions',
    category: 'Trivia',
    icon: BsQuestionSquareFill,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    description: 'Connect four discs in a row',
    category: 'Strategy',
    icon: FaChessBoard,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    description: 'Classic hand game against computer',
    category: 'Arcade',
    icon: GiSwordsEmblem,
    color: 'from-cyan-500 to-blue-500'
  }
];

const Dashboard = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const categories = ['All', ...new Set(games.map(game => game.category))];

  const filteredGames = games.filter(game => {
    const matchesFilter = filter === 'All' || game.category === filter;
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-6">
      {/* Header Section */}
      <div className={`text-center mb-14 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Game Hub
        </h1>
        <p className="text-gray-300 text-xl font-light">
          Discover amazing games and challenge yourself
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className={`mb-10 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-full px-6 py-3 w-72 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-xl"
            />
            <BsSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  filter === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className={`transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isLoaded ? 'slideInUp 0.8s ease-out forwards' : 'none'
              }}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>

      {/* No Results */}
      {filteredGames.length === 0 && (
        <div className="text-center py-20 bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-800 shadow-2xl max-w-lg mx-auto">
          <div className="text-7xl mb-6">🎮</div>
          <h3 className="text-2xl text-gray-300 mb-3 font-semibold">No games found</h3>
          <p className="text-gray-400">Try adjusting your search or filter</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;