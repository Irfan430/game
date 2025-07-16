import React from 'react';
import { motion } from 'framer-motion';

interface ScoreBoardProps {
  score: number;
  chipsCollected: number;
  totalChips: number;
  timeLeft: number;
  level?: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  chipsCollected,
  totalChips,
  timeLeft,
  level = 1,
}) => {
  const calculateScoreMultiplier = (): number => {
    if (timeLeft > 90) return 2.0;
    if (timeLeft > 60) return 1.5;
    if (timeLeft > 30) return 1.2;
    return 1.0;
  };

  const getChipProgress = (): number => {
    return totalChips > 0 ? (chipsCollected / totalChips) * 100 : 0;
  };

  return (
    <div className="bg-black bg-opacity-80 border-2 border-hacker-green p-4 rounded-lg neon-border">
      <div className="grid grid-cols-2 gap-4 text-hacker-green font-mono">
        {/* Score Section */}
        <div className="space-y-2">
          <div className="text-sm opacity-80">SCORE</div>
          <motion.div
            className="text-2xl font-bold neon-glow"
            key={score}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {score.toLocaleString()}
          </motion.div>
          
          <div className="text-xs opacity-60">
            Multiplier: {calculateScoreMultiplier().toFixed(1)}x
          </div>
        </div>

        {/* Level Section */}
        <div className="space-y-2">
          <div className="text-sm opacity-80">LEVEL</div>
          <div className="text-2xl font-bold text-hacker-matrix">
            {level}
          </div>
        </div>

        {/* Chips Section */}
        <div className="space-y-2">
          <div className="text-sm opacity-80">DATA CHIPS</div>
          <div className="flex items-center space-x-2">
            <motion.div
              className="text-xl font-bold text-blue-400"
              key={chipsCollected}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.2 }}
            >
              {chipsCollected}
            </motion.div>
            <div className="text-sm opacity-60">/ {totalChips}</div>
          </div>
          
          {/* Progress bar for chips */}
          <div className="w-full h-1 bg-gray-800 rounded">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded"
              initial={{ width: 0 }}
              animate={{ width: `${getChipProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="space-y-2">
          <div className="text-sm opacity-80">STATUS</div>
          <motion.div
            className="text-sm"
            animate={{ 
              color: timeLeft > 60 ? '#00ff00' : timeLeft > 30 ? '#ffff00' : '#ff0000'
            }}
          >
            {timeLeft > 60 ? 'STABLE' : timeLeft > 30 ? 'WARNING' : 'CRITICAL'}
          </motion.div>
          
          <div className="text-xs opacity-60">
            {chipsCollected === totalChips ? 'ALL CHIPS COLLECTED' : 'COLLECTING DATA...'}
          </div>
        </div>
      </div>

      {/* Bonus notifications */}
      <motion.div
        className="mt-4 space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {chipsCollected === totalChips && (
          <motion.div
            className="text-xs text-yellow-400 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            BONUS: ALL CHIPS COLLECTED! +500 PTS
          </motion.div>
        )}
        
        {calculateScoreMultiplier() > 1.5 && (
          <motion.div
            className="text-xs text-green-400 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            SPEED BONUS ACTIVE!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ScoreBoard;