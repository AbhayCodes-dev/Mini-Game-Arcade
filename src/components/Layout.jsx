import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <footer className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-dark'} text-white py-6`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">© 2023 Game Dashboard. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-accent transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-accent text-white shadow-lg z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;