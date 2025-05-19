import { useState, useEffect, useCallback } from 'react';

const BOARD_SIZE = 10;
const MINE_COUNT = 15;

const Minesweeper = ({ onGameEnd }) => {
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [flags, setFlags] = useState(MINE_COUNT);
  const [revealedCount, setRevealedCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [gameTime, setGameTime] = useState(0);
  const [gameStats, setGameStats] = useState({
    played: 0,
    won: 0,
    bestTime: null
  });

  // Create initial board with empty cells
  const initializeBoard = useCallback(() => {
    return Array(BOARD_SIZE).fill().map(() => 
      Array(BOARD_SIZE).fill().map(() => ({
        isMine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0
      }))
    );
  }, []);

  // Place mines on the board, avoiding the first clicked cell
  const placeMines = useCallback((board, firstRow, firstCol) => {
    let minesPlaced = 0;
    const newBoard = JSON.parse(JSON.stringify(board));
    
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      
      // Don't place mine on first click or where mines already exist
      if ((row !== firstRow || col !== firstCol) && !newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate adjacent mines for each cell
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
              if (newBoard[r][c].isMine) count++;
            }
          }
          newBoard[row][col].adjacentMines = count;
        }
      }
    }
    
    return newBoard;
  }, []);

  // Reset the game to initial state
  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setGameStatus('playing');
    setFlags(MINE_COUNT);
    setRevealedCount(0);
    setFirstClick(true);
    setGameTime(0);
  }, [initializeBoard]);

  // Initialize the game when component mounts
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Track game time
  useEffect(() => {
    let timer;
    if (gameStatus === 'playing' && !firstClick) {
      timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus, firstClick]);

  // Reveal a cell and handle game logic
  const revealCell = (row, col) => {
    if (gameStatus !== 'playing' || board[row][col].revealed || board[row][col].flagged) return;
    
    // Place mines after first click to ensure first click is safe
    if (firstClick) {
      const newBoard = placeMines(board, row, col);
      setBoard(newBoard);
      setFirstClick(false);
      revealCell(row, col); // Recursively call with new board
      return;
    }
    
    const newBoard = JSON.parse(JSON.stringify(board));
    
    // If clicked on mine, game over
    if (newBoard[row][col].isMine) {
      // Reveal all mines
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (newBoard[r][c].isMine) newBoard[r][c].revealed = true;
        }
      }
      setBoard(newBoard);
      setGameStatus('lost');
      setGameStats(prev => ({
        ...prev,
        played: prev.played + 1
      }));
      
      // Only call onGameEnd if it exists
      if (typeof onGameEnd === 'function') {
        onGameEnd(revealedCount);
      }
      return;
    }
    
    // Function to reveal cells recursively for empty cells
    const revealAdjacent = (r, c) => {
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || 
          newBoard[r][c].revealed || newBoard[r][c].flagged) return;
      
      newBoard[r][c].revealed = true;
      
      if (newBoard[r][c].adjacentMines === 0) {
        // Reveal all adjacent cells if this is an empty cell
        for (let i = Math.max(0, r - 1); i <= Math.min(BOARD_SIZE - 1, r + 1); i++) {
          for (let j = Math.max(0, c - 1); j <= Math.min(BOARD_SIZE - 1, c + 1); j++) {
            if (i !== r || j !== c) revealAdjacent(i, j);
          }
        }
      }
    };
    
    revealAdjacent(row, col);
    
    // Count revealed cells
    let revealed = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[r][c].revealed) revealed++;
      }
    }
    
    setBoard(newBoard);
    setRevealedCount(revealed);
    
    // Check if player has won
    const totalSafeCells = BOARD_SIZE * BOARD_SIZE - MINE_COUNT;
    if (revealed >= totalSafeCells) {
      setGameStatus('won');
      
      // Update stats
      setGameStats(prev => {
        const newStats = {
          played: prev.played + 1,
          won: prev.won + 1,
          bestTime: prev.bestTime === null || gameTime < prev.bestTime ? gameTime : prev.bestTime
        };
        return newStats;
      });
      
      // Only call onGameEnd if it exists
      if (typeof onGameEnd === 'function') {
        const score = MINE_COUNT * 10 + revealed;
        onGameEnd(score);
      }
    }
  };

  // Toggle flag on a cell
  const toggleFlag = (e, row, col) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || board[row][col].revealed) return;
    
    const newBoard = JSON.parse(JSON.stringify(board));
    if (newBoard[row][col].flagged) {
      newBoard[row][col].flagged = false;
      setFlags(prev => prev + 1);
    } else if (flags > 0) {
      newBoard[row][col].flagged = true;
      setFlags(prev => prev - 1);
    }
    setBoard(newBoard);
  };

  // Get color for cell numbers
  const getCellColor = (adjacentMines) => {
    const colors = [
      'text-transparent', // 0
      'text-blue-400',    // 1
      'text-green-400',   // 2
      'text-red-400',     // 3
      'text-purple-400',  // 4
      'text-yellow-400',  // 5
      'text-teal-400',    // 6
      'text-pink-400',    // 7
      'text-gray-400'     // 8
    ];
    return colors[adjacentMines];
  };

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-6 rounded-lg shadow-lg text-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Minesweeper</h2>
      
      <div className="mb-4 flex justify-between w-full max-w-md p-4 bg-gray-800 rounded-lg">
        <div className="text-lg">
          <span className="text-purple-400 font-bold">{flags}</span> 
          <span className="text-sm ml-1">🚩</span>
        </div>
        
        <div className="text-lg">
          <span className="text-sm mr-1">⏱️</span>
          <span>{formatTime(gameTime)}</span>
        </div>
        
        <div className="text-lg">
          {gameStatus === 'won' ? (
            <span className="text-green-400 font-bold">You Won! 🎉</span>
          ) : gameStatus === 'lost' ? (
            <span className="text-red-400 font-bold">Game Over! 💣</span>
          ) : (
            <span>{revealedCount}/{BOARD_SIZE * BOARD_SIZE - MINE_COUNT}</span>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-10 gap-0 border-2 border-gray-700">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 border border-gray-700 flex items-center justify-center text-sm font-bold
                  ${cell.revealed 
                    ? cell.isMine 
                      ? 'bg-red-900' 
                      : 'bg-gray-700'
                    : 'bg-gray-600 hover:bg-gray-500 cursor-pointer'}
                  ${cell.flagged && !cell.revealed ? 'bg-yellow-800' : ''}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
              >
                {cell.revealed ? (
                  cell.isMine ? (
                    '💣'
                  ) : (
                    <span className={getCellColor(cell.adjacentMines)}>
                      {cell.adjacentMines > 0 ? cell.adjacentMines : ''}
                    </span>
                  )
                ) : cell.flagged ? (
                  '🚩'
                ) : (
                  ''
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition font-medium"
        >
          New Game
        </button>
        
        {gameStatus !== 'playing' && (
          <button
            onClick={() => {
              // Auto-flag all mines for visual demonstration if game is over
              if (gameStatus === 'lost') {
                const newBoard = JSON.parse(JSON.stringify(board));
                for (let r = 0; r < BOARD_SIZE; r++) {
                  for (let c = 0; c < BOARD_SIZE; c++) {
                    if (newBoard[r][c].isMine && !newBoard[r][c].revealed) {
                      newBoard[r][c].flagged = true;
                    }
                  }
                }
                setBoard(newBoard);
                setFlags(0);
              }
            }}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            {gameStatus === 'lost' ? 'Show All Mines' : 'Play Again'}
          </button>
        )}
      </div>
      
      <div className="mt-2 text-gray-400 p-4 bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-2">
          <span>Left click: Reveal cell</span>
          <span>Right click: Flag cell</span>
        </div>
        
        {gameStats.played > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-sm">Games: {gameStats.played} | Won: {gameStats.won}</div>
            {gameStats.bestTime !== null && (
              <div className="text-sm mt-1">Best time: {formatTime(gameStats.bestTime)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Minesweeper;