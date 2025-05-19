import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem('gameScores');
    return savedScores ? JSON.parse(savedScores) : {};
  });

  const updateScore = (gameId, newScore) => {
    setScores(prev => {
      const currentHigh = prev[gameId] || 0;
      const updated = {
        ...prev,
        [gameId]: Math.max(currentHigh, newScore)
      };
      localStorage.setItem('gameScores', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <GameContext.Provider value={{ scores, updateScore }}>
      {children}
    </GameContext.Provider>
  );
};