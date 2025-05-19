import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const Snake = ({ onGameEnd }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef();
  const gameAreaRef = useRef(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) return generateFood();
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        onGameEnd(score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => prev + 1);
        if (score > 0 && score % 5 === 0) {
          setSpeed(prev => Math.max(prev - 10, 50));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, isPaused, onGameEnd, score]);

  useEffect(() => {
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
    
    const handleKeyDown = (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
    
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  };

  const handleTouchControls = (direction) => {
    switch (direction) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-purple-300">Snake Game</h2>
      <div className="mb-4 flex gap-8">
        <span className="font-semibold text-lg">Score: <span className="text-green-400">{score}</span></span>
        {isPaused && <span className="text-yellow-300 font-bold animate-pulse">PAUSED</span>}
      </div>
      
      <div 
        ref={gameAreaRef}
        className="relative border-2 border-gray-600 bg-gray-800 focus:outline-none"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE 
        }}
        tabIndex="0"
      >
        {/* Food */}
        <div 
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 1,
            top: food.y * CELL_SIZE + 1
          }}
        />
        
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-500' : 'bg-green-600'} rounded-sm`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              boxShadow: index === 0 ? '0 0 5px rgba(74, 222, 128, 0.5)' : 'none'
            }}
          />
        ))}
        
        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-gray-800 p-4 rounded-lg border border-purple-500 text-center">
              <h3 className="text-xl font-bold mb-2 text-red-400">Game Over!</h3>
              <p className="mb-4">Your score: <span className="text-green-400 font-bold">{score}</span></p>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Controls */}
      <div className="mt-6 md:hidden grid grid-cols-3 gap-2 w-40">
        <div className="col-start-2">
          <button
            onClick={() => handleTouchControls('UP')}
            className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg"
          >
            ↑
          </button>
        </div>
        <div className="col-start-1">
          <button
            onClick={() => handleTouchControls('LEFT')}
            className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg"
          >
            ←
          </button>
        </div>
        <div className="col-start-2">
          <button
            onClick={() => handleTouchControls('DOWN')}
            className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg"
          >
            ↓
          </button>
        </div>
        <div className="col-start-3">
          <button
            onClick={() => handleTouchControls('RIGHT')}
            className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition shadow-md"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-md"
        >
          Reset Game
        </button>
      </div>
      
      <div className="mt-6 text-gray-400 text-sm">
        <p>Controls: Arrow keys to move, Space to pause</p>
      </div>
    </div>
  );
};

export default Snake;