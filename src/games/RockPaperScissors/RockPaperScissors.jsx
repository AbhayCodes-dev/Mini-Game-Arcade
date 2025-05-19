
import { useState, useEffect } from 'react';

const choices = ['rock', 'paper', 'scissors'];

const outcomes = {
  rock: { rock: 0, paper: -1, scissors: 1 },
  paper: { rock: 1, paper: 0, scissors: -1 },
  scissors: { rock: -1, paper: 1, scissors: 0 }
};

const RockPaperScissors = ({ onGameEnd }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [gameCount, setGameCount] = useState(0);
  const [roundHistory, setRoundHistory] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const playGame = (choice) => {
    setShowAnimation(false);
    
    setShowAnimation(true);
    
    setTimeout(() => {
      const computer = choices[Math.floor(Math.random() * choices.length)];
      setPlayerChoice(choice);
      setComputerChoice(computer);
      
      const gameResult = outcomes[choice][computer];
      setResult(gameResult);
      
      setScore(prev => ({
        player: gameResult === 1 ? prev.player + 1 : prev.player,
        computer: gameResult === -1 ? prev.computer + 1 : prev.computer
      }));
      
      setRoundHistory(prev => [
        ...prev, 
        {
          player: choice,
          computer,
          result: gameResult
        }
      ]);
      
      setGameCount(prev => prev + 1);
      
      setShowAnimation(false);
    }, 1500);
  };

  useEffect(() => {
    if (gameCount > 0 && gameCount % 5 === 0) {
      if (typeof onGameEnd === 'function') {
        onGameEnd(score.player);
      }
    }
  }, [gameCount, score.player, onGameEnd]);

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0 });
    setGameCount(0);
    setRoundHistory([]);
  };

  const getChoiceEmoji = (choice) => {
    switch (choice) {
      case 'rock': return '✊';
      case 'paper': return '✋';
      case 'scissors': return '✌️';
      default: return '';
    }
  };

  const getResultMessage = () => {
    if (result === null) return '';
    if (result === 0) return "It's a tie!";
    return result === 1 ? 'You win!' : 'Computer wins!';
  };

  const getAnimationText = () => {
    if (!showAnimation) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white animate-bounce">
        Rock, Paper, Scissors... Shoot!
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg min-h-96 relative">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Rock Paper Scissors</h2>
      
      <div className="mb-6 p-3 bg-gray-800 rounded-lg w-full max-w-md text-center">
        <div className="text-xl font-semibold">
          <span className="text-green-400">You: {score.player}</span> - 
          <span className="text-red-400"> Computer: {score.computer}</span>
        </div>
        <div className="text-sm text-gray-400 mt-1">Games played: {gameCount}</div>
      </div>
      
      {showAnimation ? (
        getAnimationText()
      ) : (
        <>
          {playerChoice && computerChoice && (
            <div className="flex justify-center items-center gap-12 mb-8">
              <div className="text-center transition-all duration-300 transform hover:scale-110">
                <div className="text-6xl mb-3 bg-gray-800 p-6 rounded-full">{getChoiceEmoji(playerChoice)}</div>
                <div className="font-semibold text-green-400">You</div>
              </div>
              
              <div className="text-4xl font-bold text-gray-400">VS</div>
              
              <div className="text-center transition-all duration-300 transform hover:scale-110">
                <div className="text-6xl mb-3 bg-gray-800 p-6 rounded-full">{getChoiceEmoji(computerChoice)}</div>
                <div className="font-semibold text-red-400">Computer</div>
              </div>
            </div>
          )}
          
          {result !== null && (
            <div className={`text-2xl font-bold mb-8 p-3 rounded-lg ${
              result === 1 ? 'text-green-400 bg-green-900/30' :
              result === -1 ? 'text-red-400 bg-red-900/30' : 'text-gray-400 bg-gray-800/50'
            }`}>
              {getResultMessage()}
            </div>
          )}
        </>
      )}
      
      <div className="flex gap-4 mb-8">
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => !showAnimation && playGame(choice)}
            disabled={showAnimation}
            className={`px-6 py-4 bg-gray-800 border-2 border-purple-500 rounded-lg text-4xl hover:bg-gray-700 transition-all transform hover:scale-105 ${showAnimation ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          >
            {getChoiceEmoji(choice)}
          </button>
        ))}
      </div>
      
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-all font-medium"
      >
        Reset Game
      </button>
      
      {roundHistory.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2 text-purple-400">Game History</h3>
          <div className="bg-gray-800 rounded-lg p-2 max-h-40 overflow-y-auto">
            {roundHistory.slice(-5).map((round, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
                <div className="flex items-center">
                  <span className="mr-2">Round {gameCount - roundHistory.length + index + 1}:</span>
                  <span className="text-lg">{getChoiceEmoji(round.player)}</span>
                </div>
                <div className={
                  round.result === 1 ? 'text-green-400' :
                  round.result === -1 ? 'text-red-400' : 'text-gray-400'
                }>
                  {round.result === 1 ? 'Win' : round.result === -1 ? 'Loss' : 'Tie'}
                </div>
                <span className="text-lg">{getChoiceEmoji(round.computer)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;