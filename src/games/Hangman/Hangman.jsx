import { useState, useCallback } from "react";

const words = ["REACT", "JAVASCRIPT", "DEVELOPER", "COMPONENT", "TAILWIND", "VITE"];
const MAX_WRONG_GUESSES = 6;

const Hangman = ({ onGameEnd }) => {
  const [selectedWord, setSelectedWord] = useState(() => 
    words[Math.floor(Math.random() * words.length)]
  );
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing"); 

  const displayWord = selectedWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  const remainingLetters = selectedWord
    .split("")
    .filter(letter => !guessedLetters.includes(letter));

  const handleGuess = useCallback(
    (letter) => {
      if (guessedLetters.includes(letter) || gameStatus !== "playing") return;

      const newGuessedLetters = [...guessedLetters, letter];
      setGuessedLetters(newGuessedLetters);

      if (!selectedWord.includes(letter)) {
        const newWrongGuesses = wrongGuesses + 1;
        setWrongGuesses(newWrongGuesses);

        if (newWrongGuesses >= MAX_WRONG_GUESSES) {
          setGameStatus("lost");
          if (onGameEnd) {
            onGameEnd(0);
          }
        }
      } else {

        const allLettersGuessed = selectedWord.split('').every(
          letter => newGuessedLetters.includes(letter)
        );
        
        if (allLettersGuessed) {
          setGameStatus("won");
          const score = MAX_WRONG_GUESSES - wrongGuesses;
          if (onGameEnd) {
            onGameEnd(score);
          }
        }
      }
    },
    [guessedLetters, selectedWord, wrongGuesses, gameStatus, onGameEnd]
  );

  const resetGame = () => {
    setSelectedWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus("playing");
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const hangmanParts = [
    <circle key="head" cx="150" cy="70" r="20" className="stroke-current fill-none stroke-2" />,
    <line key="body" x1="150" y1="90" x2="150" y2="150" className="stroke-current stroke-2" />,
    <line key="left-arm" x1="150" y1="120" x2="120" y2="100" className="stroke-current stroke-2" />,
    <line key="right-arm" x1="150" y1="120" x2="180" y2="100" className="stroke-current stroke-2" />,
    <line key="left-leg" x1="150" y1="150" x2="120" y2="180" className="stroke-current stroke-2" />,
    <line key="right-leg" x1="150" y1="150" x2="180" y2="180" className="stroke-current stroke-2" />,
  ];

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Hangman</h2>
      
      <div className="mb-6">
        <svg width="300" height="250" className="stroke-current text-gray-300">
          {/* Gallows */}
          <line x1="50" y1="20" x2="50" y2="230" strokeWidth="3" />
          <line x1="20" y1="230" x2="150" y2="230" strokeWidth="3" />
          <line x1="50" y1="20" x2="150" y2="20" strokeWidth="3" />
          <line x1="150" y1="20" x2="150" y2="50" strokeWidth="3" />
          
          {/* Hangman parts - only show based on wrong guesses */}
          {hangmanParts.slice(0, wrongGuesses)}
        </svg>
      </div>
      
      <div className="text-3xl font-mono mb-6 tracking-widest bg-gray-800 px-6 py-4 rounded-lg">{displayWord}</div>
      
      {gameStatus === "playing" ? (
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors
                ${
                  guessedLetters.includes(letter)
                    ? selectedWord.includes(letter)
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              {letter}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-6 text-xl bg-gray-800 p-4 rounded-lg text-center">
          {gameStatus === "won" ? "You won! 🎉" : "You lost! 😢"}
          <div className="mt-2">The word was: <span className="font-bold text-green-400">{selectedWord}</span></div>
        </div>
      )}
      
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-lg"
      >
        {gameStatus === "playing" ? "Reset Game" : "Play Again"}
      </button>
      
      <div className="mt-4 text-lg bg-gray-800 px-4 py-2 rounded-lg">
        Wrong guesses: <span className={wrongGuesses > 3 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
          {wrongGuesses}
        </span>/{MAX_WRONG_GUESSES}
      </div>
    </div>
  );
};

export default Hangman;