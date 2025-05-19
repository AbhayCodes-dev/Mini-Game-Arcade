import { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [score, setScore] = useState({ x: 0, o: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [animateWin, setAnimateWin] = useState(false);

  useEffect(() => {
    // Check for winner after each move
    const result = calculateWinner(board);
    if (result) {
      const { winner, line } = result;
      setWinner(winner);
      setWinningLine(line);
      setIsGameOver(true);
      setAnimateWin(true);
      
      if (winner !== 'draw') {
        setScore(prevScore => ({
          ...prevScore,
          [winner.toLowerCase()]: prevScore[winner.toLowerCase()] + 1
        }));
      } else {
        setScore(prevScore => ({
          ...prevScore,
          draws: prevScore.draws + 1
        }));
      }
      
      // Add to game history
      setGameHistory(prev => [
        ...prev, 
        { 
          winner: winner, 
          board: [...board],
          date: new Date().toLocaleTimeString()
        }
      ]);
    } else if (!board.includes(null)) {
      // It's a draw
      setWinner('draw');
      setIsGameOver(true);
      setScore(prevScore => ({
        ...prevScore,
        draws: prevScore.draws + 1
      }));
      
      // Add to game history
      setGameHistory(prev => [
        ...prev, 
        { 
          winner: 'draw', 
          board: [...board],
          date: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, [board]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (isGameOver || board[i]) return;
    
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setIsGameOver(false);
    setAnimateWin(false);
  };

  const resetScores = () => {
    setScore({ x: 0, o: 0, draws: 0 });
    setGameHistory([]);
    resetGame();
  };

  const isInWinningLine = (index) => {
    return winningLine && winningLine.includes(index);
  };

  const renderSquare = (i) => {
    const isWinningSquare = isInWinningLine(i);
    const squareValue = board[i];
    
    return (
      <button
        className={`w-16 h-16 border border-gray-700 text-3xl font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-200
          ${isWinningSquare && animateWin ? 'animate-pulse' : ''}
          ${squareValue === 'X' ? 'text-pink-400' : squareValue === 'O' ? 'text-cyan-400' : 'text-gray-600'}
          ${isWinningSquare ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}
          ${isGameOver && !isWinningSquare ? 'opacity-70' : 'opacity-100'}`}
        onClick={() => handleClick(i)}
        disabled={isGameOver || board[i] !== null}
      >
        {squareValue}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (winner === 'draw') {
      return <span className="text-yellow-400">Game ended in a draw!</span>;
    } else if (winner) {
      return (
        <span className={winner === 'X' ? 'text-pink-400' : 'text-cyan-400'}>
          Winner: <span className="font-bold text-2xl">{winner}</span>
        </span>
      );
    } else {
      return (
        <span>
          Next player: <span className={isXNext ? 'text-pink-400 font-bold' : 'text-cyan-400 font-bold'}>{isXNext ? 'X' : 'O'}</span>
        </span>
      );
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-gray-100 p-6 rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">Tic Tac Toe</h2>
      
      <div className="mb-6 text-lg p-2 min-h-12 text-center">
        {getStatusMessage()}
      </div>
      
      <div className="grid grid-cols-3 gap-1 mb-6 bg-gray-800 p-3 rounded-lg shadow-lg">
        {Array(9).fill(null).map((_, i) => (
          <div key={i}>{renderSquare(i)}</div>
        ))}
      </div>
      
      <div className="flex justify-between w-full p-4 bg-gray-800 rounded-lg mb-6">
        <div className="text-center">
          <div className="font-bold text-pink-400 text-lg">X</div>
          <div className="text-xl font-semibold">{score.x}</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-yellow-400 text-lg">Draws</div>
          <div className="text-xl font-semibold">{score.draws}</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-cyan-400 text-lg">O</div>
          <div className="text-xl font-semibold">{score.o}</div>
        </div>
      </div>
      
      <div className="flex gap-4 w-full">
        <button
          onClick={resetGame}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          New Game
        </button>
        <button
          onClick={resetScores}
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset Scores
        </button>
      </div>
      
      {gameHistory.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Game History</h3>
          <div className="max-h-32 overflow-y-auto bg-gray-800 rounded-lg p-2">
            {gameHistory.map((game, index) => (
              <div key={index} className="flex justify-between items-center p-1 border-b border-gray-700 text-sm">
                <span>Game {index + 1}</span>
                <span className={
                  game.winner === 'X' 
                    ? 'text-pink-400' 
                    : game.winner === 'O' 
                      ? 'text-cyan-400' 
                      : 'text-yellow-400'
                }>
                  {game.winner === 'draw' ? 'Draw' : `${game.winner} won`}
                </span>
                <span className="text-gray-400 text-xs">{game.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;