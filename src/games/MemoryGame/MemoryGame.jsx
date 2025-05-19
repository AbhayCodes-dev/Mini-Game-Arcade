import { useState, useEffect, useCallback } from 'react';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const MemoryGame = ({ onGameEnd }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = useCallback(() => {
    const doubledEmojis = [...emojis, ...emojis];
    const shuffled = doubledEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (id) => {
    if (flipped.length >= 2 || flipped.includes(id) || solved.includes(id)) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        setSolved(prev => [...prev, firstId, secondId]);
        setFlipped([]);

        if (solved.length + 2 === cards.length) {
          setGameComplete(true);
          const finalScore = Math.floor(10000 / moves);
          if (onGameEnd) {
            onGameEnd(finalScore);
          }
        }
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              newFlipped.includes(card.id) ? { ...card, flipped: false } : card
            )
          );
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Memory Game</h2>
      
      <div className="mb-4 text-lg bg-gray-800 px-4 py-2 rounded-lg">
        <span className="font-semibold">Moves: <span className="text-purple-400">{moves}</span></span>
        {gameComplete && (
          <span className="ml-4 text-green-400 font-bold">Completed!</span>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map(card => {
          const isFlippedOrSolved = card.flipped || solved.includes(card.id);
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`w-16 h-16 flex items-center justify-center text-3xl cursor-pointer rounded-lg shadow-md transition-all duration-500 ${
                isFlippedOrSolved
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-700'
                  : 'bg-indigo-700 hover:bg-indigo-600'
              }`}
              style={{
                perspective: '1000px',
                transform: isFlippedOrSolved ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {isFlippedOrSolved ? (
                <span className="transform rotate-y-180" style={{ display: 'inline-block' }}>{card.emoji}</span>
              ) : (
                <span className="text-white font-bold">?</span>
              )}
            </div>
          );
        })}
      </div>
      
      <button
        onClick={initializeGame}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-lg"
      >
        {gameComplete ? 'Play Again' : 'Reset Game'}
      </button>
      
      {gameComplete && (
        <div className="mt-4 text-lg bg-gray-800 px-4 py-2 rounded-lg">
          Your score: <span className="text-green-400 font-bold">{Math.floor(10000 / moves)}</span> (lower moves = higher score)
        </div>
      )}
    </div>
  );
};

export default MemoryGame;