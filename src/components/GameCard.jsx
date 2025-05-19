import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GameContext } from '../contexts/GameContext';
import { motion } from 'framer-motion';

const GameCard = ({ game }) => {
  const { scores } = useContext(GameContext);
  const highScore = scores[game.id] || 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-full"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        borderColor: "rgba(168, 85, 247, 0.4)"
      }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/game/${game.id}`}>
        <div className={`h-48 bg-gradient-to-br ${game.color} opacity-90 flex items-center justify-center relative overflow-hidden`}>
          <motion.div
            animate={{
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.4 }}
            className="text-white z-10 drop-shadow-lg"
          >
            <game.icon className="text-7xl" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-purple-900/20"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 transition-colors">{game.name}</h3>
          <p className="text-gray-400 mb-4 line-clamp-2">{game.description}</p>
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-gray-800 text-sm font-medium text-gray-300 rounded-full">{game.category}</span>
            {highScore > 0 && (
              <motion.span
                className="px-3 py-1 bg-purple-900/30 text-sm font-semibold text-purple-300 rounded-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                High Score: {highScore}
              </motion.span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;