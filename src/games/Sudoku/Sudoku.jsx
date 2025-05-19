import { useState, useEffect } from 'react';

const Sudoku = ({ onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [notes, setNotes] = useState(Array(9).fill().map(() => Array(9).fill().map(() => [])));
  const [isNotesMode, setIsNotesMode] = useState(false);

  // Generate a new Sudoku board
  const generateBoard = (diff = difficulty) => {
    // Sample boards with different difficulties
    const boards = {
      easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ],
      medium: [
        [0, 2, 0, 6, 0, 8, 0, 0, 0],
        [5, 8, 0, 0, 0, 9, 7, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0],
        [3, 7, 0, 0, 0, 0, 5, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 8, 0, 0, 0, 0, 1, 3],
        [0, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 9, 8, 0, 0, 0, 3, 6],
        [0, 0, 0, 3, 0, 6, 0, 9, 0]
      ],
      hard: [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0]
      ]
    };
    
    setDifficulty(diff);
    const selectedBoard = boards[diff] || boards.medium;
    setBoard(JSON.parse(JSON.stringify(selectedBoard)));
    setInitialBoard(JSON.parse(JSON.stringify(selectedBoard)));
    setSelectedCell(null);
    setTimer(0);
    setIsComplete(false);
    setNotes(Array(9).fill().map(() => Array(9).fill().map(() => [])));
  };

  useEffect(() => {
    generateBoard();
    const interval = setInterval(() => {
      setTimer(prev => !isComplete ? prev + 1 : prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    if (isNotesMode) {
      // Handle notes mode
      setNotes(prevNotes => {
        const newNotes = [...prevNotes];
        const cellNotes = [...newNotes[row][col]];
        
        const index = cellNotes.indexOf(num);
        if (index > -1) {
          cellNotes.splice(index, 1); // Remove note if already exists
        } else {
          cellNotes.push(num); // Add note
        }
        
        newNotes[row][col] = cellNotes.sort((a, b) => a - b);
        return newNotes;
      });
    } else {
      // Regular input mode
      const newBoard = [...board];
      newBoard[row][col] = num === newBoard[row][col] ? 0 : num; // Toggle number if already set
      setBoard(newBoard);

      // Clear notes for this cell when setting a value
      if (num !== 0) {
        const newNotes = [...notes];
        newNotes[row][col] = [];
        setNotes(newNotes);
      }
      
      checkCompletion(newBoard);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    // Only allow clearing cells that weren't initially filled
    if (initialBoard[row][col] === 0) {
      const newBoard = [...board];
      newBoard[row][col] = 0;
      setBoard(newBoard);
      
      // Also clear notes
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkCompletion = (currentBoard) => {
    // Check if board is filled
    let filled = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentBoard[i][j] === 0) {
          filled = false;
          break;
        }
      }
      if (!filled) break;
    }
    
    if (filled) {
      // Simple validation - this is not a full solver but checks basic rules
      let valid = true;
      
      // Check rows
      for (let i = 0; i < 9; i++) {
        const row = new Set();
        for (let j = 0; j < 9; j++) {
          if (row.has(currentBoard[i][j])) {
            valid = false;
            break;
          }
          row.add(currentBoard[i][j]);
        }
        if (!valid) break;
      }
      
      // Check columns
      if (valid) {
        for (let j = 0; j < 9; j++) {
          const col = new Set();
          for (let i = 0; i < 9; i++) {
            if (col.has(currentBoard[i][j])) {
              valid = false;
              break;
            }
            col.add(currentBoard[i][j]);
          }
          if (!valid) break;
        }
      }
      
      // Check 3x3 boxes
      if (valid) {
        for (let boxRow = 0; boxRow < 3; boxRow++) {
          for (let boxCol = 0; boxCol < 3; boxCol++) {
            const box = new Set();
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                const row = boxRow * 3 + i;
                const col = boxCol * 3 + j;
                if (box.has(currentBoard[row][col])) {
                  valid = false;
                  break;
                }
                box.add(currentBoard[row][col]);
              }
              if (!valid) break;
            }
            if (!valid) break;
          }
          if (!valid) break;
        }
      }
      
      if (valid) {
        setIsComplete(true);
        // Score calculation based on difficulty and time
        const difficultyMultiplier = {
          easy: 1,
          medium: 1.5,
          hard: 2
        };
        const score = Math.round(1000 * difficultyMultiplier[difficulty] - timer * 2);
        onGameEnd(Math.max(0, score));
      }
    }
  };

  const getCellClass = (row, col) => {
    let classes = 'w-10 h-10 border flex items-center justify-center text-xl transition-colors';
    
    // Cell is part of the initial board
    if (initialBoard[row][col] !== 0) {
      classes += ' bg-gray-700 text-white font-bold';
    } 
    // Cell is selected
    else if (selectedCell?.row === row && selectedCell?.col === col) {
      classes += ' bg-blue-800 text-white cursor-pointer';
    } 
    // Cell has user-entered value
    else if (board[row][col] !== 0) {
      classes += ' bg-gray-800 text-blue-300 cursor-pointer';
    } 
    // Empty cell
    else {
      classes += ' bg-gray-800 hover:bg-gray-700 cursor-pointer';
    }
    
    // Add thicker borders for 3x3 blocks
    if (row % 3 === 0) classes += ' border-t-2 border-t-purple-500';
    if (col % 3 === 0) classes += ' border-l-2 border-l-purple-500';
    if (row === 8) classes += ' border-b-2 border-b-purple-500';
    if (col === 8) classes += ' border-r-2 border-r-purple-500';
    
    return classes;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-purple-300">Sudoku</h2>
      
      <div className="mb-4 flex flex-wrap justify-center gap-4 items-center">
        <div className="px-3 py-1 bg-gray-700 rounded-full">
          <span className="font-semibold">Time: </span>
          <span className="text-yellow-300 font-mono">{formatTime(timer)}</span>
        </div>
        
        <div className="px-3 py-1 bg-gray-700 rounded-full capitalize">
          <span className="font-semibold">Difficulty: </span>
          <span className={`
            ${difficulty === 'easy' ? 'text-green-400' : ''}
            ${difficulty === 'medium' ? 'text-yellow-400' : ''}
            ${difficulty === 'hard' ? 'text-red-400' : ''}
          `}>{difficulty}</span>
        </div>
        
        {isComplete && <span className="px-3 py-1 bg-green-600 text-white rounded-full font-bold animate-pulse">Completed!</span>}
      </div>
      
      <div className="grid grid-cols-9 gap-0 border-2 border-purple-500 mb-6 shadow-lg shadow-purple-900/20">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 ? cell : notes[rowIndex][colIndex].length > 0 ? (
                <div className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full p-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <div 
                      key={num} 
                      className="flex items-center justify-center text-xs"
                    >
                      {notes[rowIndex][colIndex].includes(num) ? num : ''}
                    </div>
                  ))}
                </div>
              ) : ''}
            </div>
          ))
        ))}
      </div>
      
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-lg mb-4 transition ${
            isNotesMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setIsNotesMode(!isNotesMode)}
        >
          {isNotesMode ? 'Notes Mode: ON' : 'Notes Mode: OFF'}
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-md"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClearCell}
          className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center justify-center text-lg font-bold hover:from-red-700 hover:to-pink-700 transition shadow-md"
        >
          ⌫
        </button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => generateBoard('easy')}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Easy
        </button>
        <button
          onClick={() => generateBoard('medium')}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        >
          Medium
        </button>
        <button
          onClick={() => generateBoard('hard')}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Hard
        </button>
      </div>
      
      <div className="mt-2 text-gray-400 text-sm">
        <p>Click cells to select and use number buttons to fill</p>
      </div>
      
      {isComplete && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-green-500">
          <div className="text-lg text-green-400 font-bold">Puzzle Complete!</div>
          <div className="mt-2">
            Your score: <span className="text-yellow-300 font-bold">{Math.max(0, Math.round(1000 * {easy: 1, medium: 1.5, hard: 2}[difficulty] - timer * 2))}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sudoku;