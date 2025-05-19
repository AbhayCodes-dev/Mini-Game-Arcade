import { useContext, useState, useEffect } from 'react';
import { GameContext } from '../contexts/GameContext';
import { motion } from 'framer-motion';

const ScoreBoard = ({ gameId }) => {
  const { scores } = useContext(GameContext);
  const [animateScore, setAnimateScore] = useState(false);
  
  const score = scores[gameId] || 0;
  
  const allScores = Object.entries(scores)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => value)
    .sort((a, b) => b - a);
  
  const rank = score > 0 ? allScores.indexOf(score) + 1 : allScores.length > 0 ? allScores.length + 1 : 1;
  
  const highScore = allScores.length > 0 ? allScores[0] : 0;
  
  const gamesPlayed = Object.values(scores).filter(s => s !== undefined && s !== null && s > 0).length;

  useEffect(() => {
    setAnimateScore(true);
    const timer = setTimeout(() => setAnimateScore(false), 1000);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <motion.div
      className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl shadow-xl mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        borderColor: "rgba(168, 85, 247, 0.4)"
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Your Stats</h3>
        <motion.div
          className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm font-medium"
          animate={{ scale: animateScore ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          #{rank} Rank
        </motion.div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-400">High Score</span>
            <span className="text-sm text-gray-400">
              {highScore}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${highScore > 0 ? Math.min(100, (score / highScore) * 100) : 0}%`
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Current Score</span>
            <motion.span
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
              animate={{
                scale: animateScore ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {score}
            </motion.span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-sm">Games Played</span>
            <span className="text-lg font-semibold text-white">
              {gamesPlayed}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreBoard;