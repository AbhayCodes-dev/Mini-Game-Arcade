import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 10;
const WORDS = ['REACT', 'VITE', 'TAILWIND', 'JAVASCRIPT', 'HOOKS', 'COMPONENT'];

const WordSearch = () => {
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const generateGrid = useCallback(() => {
    // Initialize empty grid
    const newGrid = Array(GRID_SIZE).fill().map(() => 
      Array(GRID_SIZE).fill().map(() => ({
        letter: '',
        isWord: false,
        isFound: false,
        isSelected: false
      }))
    );

    // Place words
    const placedWords = [];
    
    const tryPlaceWord = (word) => {
      const directions = [
        { dr: 0, dc: 1 },  // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal down-right
        { dr: 1, dc: -1 }   // diagonal down-left
      ];
      
      // Try each direction in random order
      const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
      
      for (const direction of shuffledDirections) {
        const { dr, dc } = direction;
        const maxRow = GRID_SIZE - (word.length - 1) * Math.abs(dr);
        const maxCol = GRID_SIZE - (word.length - 1) * Math.abs(dc);
        
        if (maxRow <= 0 || maxCol <= 0) continue;
        
        // Try multiple random positions
        for (let attempts = 0; attempts < 10; attempts++) {
          const startRow = Math.floor(Math.random() * maxRow);
          const startCol = Math.floor(Math.random() * maxCol);
          
          // Check if word can fit
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const r = startRow + i * dr;
            const c = startCol + i * dc;
            if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE ||
                (newGrid[r][c].letter !== '' && newGrid[r][c].letter !== word[i])) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            // Place the word
            for (let i = 0; i < word.length; i++) {
              const r = startRow + i * dr;
              const c = startCol + i * dc;
              newGrid[r][c] = {
                ...newGrid[r][c],
                letter: word[i],
                isWord: true
              };
            }
            placedWords.push({
              word,
              cells: Array(word.length).fill().map((_, i) => ({
                row: startRow + i * dr,
                col: startCol + i * dc
              }))
            });
            return true;
          }
        }
      }
      return false;
    };
    
    // Try to place each word
    for (const word of WORDS) {
      let attempts = 0;
      while (attempts < 100 && !tryPlaceWord(word)) {
        attempts++;
      }
    }
    
    // Fill remaining cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].letter === '') {
          newGrid[row][col].letter = letters.charAt(Math.floor(Math.random() * letters.length));
        }
      }
    }
    
    return { grid: newGrid, words: placedWords };
  }, []);

  const resetGame = useCallback(() => {
    const { grid, words } = generateGrid();
    setGrid(grid);
    setFoundWords([]);
    setSelectedCells([]);
    setGameComplete(false);
    setScore(0);
    setIsFirstRender(false);
  }, [generateGrid]);

  useEffect(() => {
    if (isFirstRender) {
      resetGame();
    }
  }, [resetGame, isFirstRender]);

  const handleCellMouseDown = (row, col) => {
    if (gameComplete || grid[row][col].isFound) return;
    
    setIsDragging(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isDragging || gameComplete || grid[row][col].isFound) return;
    
    setSelectedCells(prev => {
      // Only add if it's adjacent to the last cell
      const lastCell = prev[prev.length - 1];
      if (Math.abs(lastCell.row - row) <= 1 && Math.abs(lastCell.col - col) <= 1) {
        // Check if we're continuing in the same direction
        if (prev.length >= 2) {
          const secondLastCell = prev[prev.length - 2];
          const currentDr = lastCell.row - secondLastCell.row;
          const currentDc = lastCell.col - secondLastCell.col;
          const newDr = row - lastCell.row;
          const newDc = col - lastCell.col;
          
          // If we're not continuing in the same direction, start a new selection from the first cell
          if (currentDr !== newDr || currentDc !== newDc) {
            return [prev[0], { row, col }];
          }
        }
        
        // Don't add if the cell is already in the selection
        if (!prev.some(cell => cell.row === row && cell.col === col)) {
          return [...prev, { row, col }];
        }
      }
      return prev;
    });
  };

  const handleCellMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    checkSelection();
  };

  const checkSelection = useCallback(() => {
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }
    
    // Check if selected cells form a word
    const selectedWord = selectedCells.map(cell => 
      grid[cell.row][cell.col].letter
    ).join('');
    
    const reversedWord = [...selectedCells].reverse().map(cell => 
      grid[cell.row][cell.col].letter
    ).join('');
    
    const foundWord = WORDS.find(word => 
      word === selectedWord || word === reversedWord
    );
    
    if (foundWord && !foundWords.includes(foundWord)) {
      // Mark cells as found
      const newGrid = [...grid];
      selectedCells.forEach(cell => {
        newGrid[cell.row][cell.col].isFound = true;
      });
      setGrid(newGrid);
      setFoundWords(prev => [...prev, foundWord]);
      
      // Calculate score based on word length and add to total
      const wordScore = foundWord.length * 10;
      setScore(prev => prev + wordScore);
      
      // Check if all words found
      if (foundWords.length + 1 === WORDS.length) {
        setGameComplete(true);
      }
    }
    
    setSelectedCells([]);
  }, [selectedCells, grid, foundWords]);

  useEffect(() => {
    // Handle if mouse is released outside the grid
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        checkSelection();
      }
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, checkSelection]);

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Determine if a cell is the first or last in the selection
  const getCellPosition = (row, col) => {
    if (selectedCells.length === 0) return '';
    
    const isFirst = selectedCells[0].row === row && selectedCells[0].col === col;
    const isLast = selectedCells[selectedCells.length - 1].row === row && selectedCells[selectedCells.length - 1].col === col;
    
    if (isFirst) return 'first';
    if (isLast) return 'last';
    return '';
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Word Search</h2>
      
      <div className="mb-4 flex justify-between w-full">
        <div className="text-lg">
          <span className="font-medium text-gray-300">Found:</span>{' '}
          <span className="font-bold text-green-400">{foundWords.length}/{WORDS.length}</span>
        </div>
        <div className="text-lg">
          <span className="font-medium text-gray-300">Score:</span>{' '}
          <span className="font-bold text-yellow-400">{score}</span>
        </div>
      </div>
      
      {gameComplete && (
        <div className="bg-green-900 text-green-100 p-3 rounded-md w-full text-center mb-4 animate-pulse">
          🎉 All words found! Final score: {score} 🎉
        </div>
      )}
      
      <div className="grid grid-cols-10 gap-1 mb-6 bg-gray-800 p-2 rounded-lg shadow-inner">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellPosition = getCellPosition(rowIndex, colIndex);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 flex items-center justify-center font-bold rounded 
                  ${cell.isFound ? 'bg-green-700 text-white' : 
                    isCellSelected(rowIndex, colIndex) ? 'bg-blue-600 text-white' : 
                    'bg-gray-700 text-gray-100 hover:bg-gray-600 cursor-pointer'}
                  ${cellPosition === 'first' ? 'ring-2 ring-yellow-400' : ''}
                  ${cellPosition === 'last' ? 'ring-2 ring-purple-400' : ''}
                  transition-all duration-150`}
                onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleCellMouseUp}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>
      
      <div className="mb-6 w-full">
        <h3 className="font-bold mb-2 text-lg text-gray-300">Words to find:</h3>
        <div className="flex flex-wrap gap-2">
          {WORDS.map(word => (
            <span 
              key={word}
              className={`px-3 py-1 rounded font-medium 
                ${foundWords.includes(word) 
                  ? 'bg-green-700 text-green-100 line-through' 
                  : 'bg-gray-700 text-gray-200'}`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div className="w-full flex gap-3">
        <button
          onClick={resetGame}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          New Game
        </button>
        
        <button
          onClick={() => {
            // Show one word as a hint
            const notFoundWords = WORDS.filter(word => !foundWords.includes(word));
            if (notFoundWords.length > 0 && !gameComplete) {
              alert(`Hint: Look for "${notFoundWords[0]}"`);
            }
          }}
          disabled={gameComplete || foundWords.length === WORDS.length}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Hint
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Drag across letters to select words horizontally, vertically, or diagonally.
      </div>
    </div>
  );
};

export default WordSearch;