import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHome, FaRocket, FaGamepad } from 'react-icons/fa';

const NotFound = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-purple-400/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className={`text-center z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black text-purple-500/20 blur-sm">
            404
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
            Looks like you've ventured into uncharted territory. The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Game Controller Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg animate-bounce">
            <FaGamepad className="text-3xl text-white" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaHome className="text-lg group-hover:animate-pulse" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600 text-gray-300 hover:text-white rounded-full font-semibold hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300"
          >
            <FaRocket className="text-lg group-hover:animate-pulse" />
            Go Back
          </button>
        </div>

        {/* Fun Message */}
        <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-sm">
            🎮 While you're here, why not try one of our amazing games?
          </p>
        </div>
      </div>

      {/* Animated Waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.1)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.1)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            fill="url(#wave-gradient)"
            className="animate-pulse"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;