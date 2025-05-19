// ConnectFour.jsx
import { useState } from 'react';

const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;

const ConnectFour = ({ onGameEnd }) => {
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ red: 0, yellow: 0 });

  const resetGame = () => {
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
  };

  const dropPiece = (col) => {
    if (winner) return;
    
    // Find the first empty row in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        
        if (checkWin(row, col)) {
          setWinner(currentPlayer);
          const newScores = {
            ...scores,
            [currentPlayer]: scores[currentPlayer] + 1
          };
          setScores(newScores);
          if (onGameEnd) {
            onGameEnd(newScores[currentPlayer]);
          }
          return;
        }
        
        if (checkDraw()) {
          setWinner('draw');
          return;
        }
        
        setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        return;
      }
    }
  };

  const checkWin = (row, col) => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],    // vertical
      [1, 1],    // diagonal down-right
      [1, -1]    // diagonal down-left
    ];
    
    for (const [dr, dc] of directions) {
      let count = 1;
      
      // Check in positive direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const r = row + i * dr;
        const c = col + i * dc;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) break;
        count++;
      }
      
      // Check in negative direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const r = row - i * dr;
        const c = col - i * dc;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) break;
        count++;
      }
      
      if (count >= WIN_LENGTH) return true;
    }
    
    return false;
  };

  const checkDraw = () => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const getCellClass = (row, col) => {
    let classes = "w-12 h-12 rounded-full border-2 border-gray-700 transition-colors";
    
    if (board[row][col] === 'red') {
      classes += " bg-red-500";
    } else if (board[row][col] === 'yellow') {
      classes += " bg-yellow-400";
    } else {
      classes += " bg-gray-800 hover:bg-gray-700 cursor-pointer";
    }
    
    return classes;
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">Connect Four</h2>
      
      <div className="mb-4 flex justify-between w-full max-w-md">
        <div className="text-lg">
          <span className={`font-bold ${currentPlayer === 'red' ? 'text-red-500' : 'text-gray-400'}`}>Red</span>
          <span className="mx-2">vs</span>
          <span className={`font-bold ${currentPlayer === 'yellow' ? 'text-yellow-400' : 'text-gray-400'}`}>Yellow</span>
        </div>
        <div className="text-lg">
          Score: <span className="text-red-500 font-bold">{scores.red}</span> - <span className="text-yellow-400 font-bold">{scores.yellow}</span>
        </div>
      </div>
      
      {winner && (
        <div className="mb-4 text-xl font-bold rounded-lg bg-gray-800 p-3 text-center w-full max-w-md">
          {winner === 'draw' ? "It's a draw!" : `${winner === 'red' ? '🔴 Red' : '🟡 Yellow'} wins!`}
        </div>
      )}
      
      <div className="bg-indigo-900 p-3 rounded-lg mb-4 shadow-lg">
        {/* Column headers for dropping pieces */}
        <div className="flex mb-1">
          {Array(COLS).fill().map((_, col) => (
            <div 
              key={`header-${col}`}
              className="w-12 h-6 flex justify-center cursor-pointer"
              onClick={() => dropPiece(col)}
            >
              <div className={`w-4 h-4 rounded-full ${currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-400'} opacity-70 hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
        
        {/* Game board */}
        <div className="bg-indigo-800 p-2 rounded-lg">
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {row.map((cell, colIndex) => (
                <div 
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                  onClick={() => !cell && dropPiece(colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-lg"
      >
        {winner ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
};

export default ConnectFour;