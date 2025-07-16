import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  onTimeUpdate: (timeLeft: number) => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, onTimeUpdate, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTimeUpdate(newTime);
        
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeLeft <= 30) return 'text-red-500';
    if (timeLeft <= 60) return 'text-yellow-500';
    return 'text-hacker-green';
  };

  const getTimerAnimation = () => {
    if (timeLeft <= 10) {
      return {
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, repeat: Infinity }
      };
    }
    return {};
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-hacker-green font-mono text-sm">TIME:</div>
      <motion.div
        className={`font-mono text-2xl font-bold ${getTimerColor()} neon-glow`}
        animate={getTimerAnimation()}
      >
        {formatTime(timeLeft)}
      </motion.div>
      
      {/* Progress bar */}
      <div className="w-32 h-2 bg-gray-800 border border-hacker-green rounded">
        <motion.div
          className="h-full bg-gradient-to-r from-hacker-green to-green-400 rounded"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / initialTime) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {timeLeft <= 30 && (
        <motion.div
          className="text-red-500 font-mono text-sm blink"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          CRITICAL!
        </motion.div>
      )}
    </div>
  );
};

export default Timer;