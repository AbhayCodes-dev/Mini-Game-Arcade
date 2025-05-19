import { useState, useEffect } from 'react';

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: "Paris"
  },
  {
    question: "Which language is used for web development?",
    options: ["Java", "C++", "Python", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Text Makeup Language"
    ],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which of these is a JavaScript framework?",
    options: ["Django", "Flask", "React", "Laravel"],
    answer: "React"
  },
  {
    question: "What year was JavaScript created?",
    options: ["1990", "1995", "2000", "2005"],
    answer: "1995"
  }
];

const QuizGame = ({ onGameEnd }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    resetQuiz();
  }, []);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestion] = { 
        selected: null, 
        correct: false,
        timeOut: true
      };
      setAnsweredQuestions(newAnsweredQuestions);
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setTimeLeft(10);
    setTimerActive(true);
    setAnsweredQuestions([]);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setTimerActive(false);
    
    const isCorrect = option === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = { 
      selected: option,
      correct: isCorrect,
      timeOut: false
    };
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setTimerActive(true);
    setTimeLeft(10);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
      if (typeof onGameEnd === 'function') {
        onGameEnd(score);
      }
    }
  };

  const getOptionClass = (option) => {
    let classes = "w-full text-left px-4 py-3 my-2 rounded border-2 font-medium transition";
    
    if (selectedOption !== null) {
      if (option === questions[currentQuestion].answer) {
        classes += " bg-green-900 border-green-500 text-green-100";
      } else if (option === selectedOption && option !== questions[currentQuestion].answer) {
        classes += " bg-red-900 border-red-500 text-red-100";
      } else {
        classes += " bg-gray-800 border-gray-600 text-gray-400";
      }
    } else {
      classes += " bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-purple-500 cursor-pointer";
    }
    
    return classes;
  };

  const getTimeBarColor = () => {
    if (timeLeft > 6) return "bg-green-500";
    if (timeLeft > 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Quiz Game</h2>
      
      {showScore ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg w-full">
          <div className="text-2xl mb-6">
            You scored <span className="text-purple-400 font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>!
          </div>
          
          {answeredQuestions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl mb-4 font-semibold text-purple-400">Summary</h3>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      answeredQuestions[index]?.correct ? 'bg-green-900/30' : 
                      answeredQuestions[index]?.timeOut ? 'bg-yellow-900/30' : 'bg-red-900/30'
                    }`}
                  >
                    <div className="font-medium">{index + 1}. {q.question}</div>
                    <div className="mt-2 text-sm">
                      {answeredQuestions[index]?.timeOut ? (
                        <span className="text-yellow-400">Time ran out - No answer selected</span>
                      ) : (
                        <>
                          <span className="text-gray-400">Your answer: </span>
                          <span className={answeredQuestions[index]?.correct ? 'text-green-400' : 'text-red-400'}>
                            {answeredQuestions[index]?.selected || 'None'}
                          </span>
                        </>
                      )}
                    </div>
                    {!answeredQuestions[index]?.correct && (
                      <div className="mt-1 text-sm">
                        <span className="text-gray-400">Correct answer: </span>
                        <span className="text-green-400">{q.answer}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition font-medium"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="w-full mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-purple-400">
                Question {currentQuestion + 1}/{questions.length}
              </span>
              <span className="font-semibold">
                Score: <span className="text-purple-400">{score}</span>
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="w-full mb-8 p-6 bg-gray-800 rounded-lg">
            <div className="text-xl font-semibold mb-6 text-gray-100">
              {questions[currentQuestion].question}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">
                  Time remaining: <span className={timeLeft <= 3 ? 'text-red-400 font-bold' : ''}>{timeLeft}s</span>
                </div>
                {timeLeft <= 3 && timerActive && (
                  <div className="text-red-400 text-sm animate-pulse">Hurry up!</div>
                )}
              </div>
              <div className="w-full bg-gray-700 h-3 rounded-full">
                <div 
                  className={`${getTimeBarColor()} h-3 rounded-full transition-all duration-1000`}
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={getOptionClass(option)}
                  onClick={() => !selectedOption && handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {selectedOption !== null && (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition font-medium"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Show Results'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default QuizGame;