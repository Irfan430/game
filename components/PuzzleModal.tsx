import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, validateAnswer } from '../lib/puzzles';

interface PuzzleModalProps {
  puzzle: Puzzle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({
  puzzle,
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && puzzle) {
      setUserAnswer('');
      setTimeLeft(puzzle.timeLimit);
      setIsSubmitted(false);
      
      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, puzzle]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFailure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const handleSubmit = () => {
    if (!puzzle || isSubmitted) return;

    setIsSubmitted(true);

    if (validateAnswer(puzzle, userAnswer)) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1000);
  };

  const handleFailure = () => {
    setTimeout(() => {
      onFailure();
      onClose();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-yellow-500';
    return 'text-hacker-green';
  };

  const getResultMessage = () => {
    if (!isSubmitted) return null;
    
    const isCorrect = puzzle && validateAnswer(puzzle, userAnswer);
    return (
      <motion.div
        className={`text-center font-mono text-lg ${
          isCorrect ? 'text-green-400' : 'text-red-400'
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {isCorrect ? 'ACCESS GRANTED!' : 'ACCESS DENIED!'}
        <div className="text-sm mt-2">
          {isCorrect ? 'Puzzle solved successfully!' : `Correct answer: ${puzzle?.answer}`}
        </div>
      </motion.div>
    );
  };

  if (!puzzle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-hacker-dark border-2 border-hacker-green rounded-lg p-8 max-w-md w-full mx-4 neon-border"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.h2
                className="text-2xl font-bold text-hacker-green font-mono mb-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SECURITY CHALLENGE
              </motion.h2>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  TYPE: {puzzle.type.toUpperCase()}
                </div>
                <div className={`text-sm font-mono ${getTimerColor()}`}>
                  TIME: {timeLeft}s
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              <>
                {/* Question */}
                <div className="mb-6">
                  <div className="text-hacker-green font-mono text-lg mb-4 text-center">
                    {puzzle.question}
                  </div>

                  {/* Input */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-black border-2 border-hacker-green rounded px-4 py-3 text-hacker-green font-mono text-center focus:outline-none focus:border-hacker-matrix neon-border"
                      placeholder={puzzle.type === 'typing' ? 'Type the phrase...' : 'Enter answer...'}
                      autoComplete="off"
                    />
                    
                    <motion.div
                      className="absolute inset-0 border-2 border-hacker-matrix rounded pointer-events-none"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>

                  {/* Hint */}
                  <div className="text-xs text-gray-400 text-center mt-2">
                    {puzzle.type === 'typing' 
                      ? 'Type exactly as shown (case sensitive)'
                      : 'Enter numeric answer only'
                    }
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-hacker-green to-red-500"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(timeLeft / puzzle.timeLimit) * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!userAnswer.trim()}
                    className="flex-1 btn-hack disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    SUBMIT
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-red-500 text-red-500 font-mono uppercase tracking-wider transition-all duration-300 hover:bg-red-500 hover:text-black"
                  >
                    ABORT
                  </button>
                </div>
              </>
            ) : (
              /* Result */
              <div className="text-center">
                {getResultMessage()}
              </div>
            )}

            {/* Glitch effect overlay */}
            <motion.div
              className="absolute inset-0 bg-hacker-green opacity-10 pointer-events-none"
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 2 }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PuzzleModal;