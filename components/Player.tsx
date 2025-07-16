import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PlayerProps {
  x: number;
  y: number;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isMoving: boolean;
  cellSize: number;
}

const Player: React.FC<PlayerProps> = ({ x, y, onMove, isMoving, cellSize }) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isMoving) return; // Prevent movement during animation

    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        event.preventDefault();
        onMove('up');
        break;
      case 'arrowdown':
      case 's':
        event.preventDefault();
        onMove('down');
        break;
      case 'arrowleft':
      case 'a':
        event.preventDefault();
        onMove('left');
        break;
      case 'arrowright':
      case 'd':
        event.preventDefault();
        onMove('right');
        break;
    }
  }, [onMove, isMoving]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <motion.div
      className="absolute z-10 flex items-center justify-center"
      style={{
        width: cellSize,
        height: cellSize,
        left: x * cellSize,
        top: y * cellSize,
      }}
      animate={{
        x: 0,
        y: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Player visual */}
      <motion.div
        className="w-full h-full rounded-full relative"
        style={{
          background: 'radial-gradient(circle, #00ff00, #00ff41)',
          boxShadow: '0 0 15px #00ff00, inset 0 0 10px rgba(255,255,255,0.2)',
        }}
        animate={{
          scale: isMoving ? [1, 0.9, 1] : [1, 1.05, 1],
          boxShadow: [
            '0 0 15px #00ff00',
            '0 0 25px #00ff00, 0 0 35px #00ff41',
            '0 0 15px #00ff00',
          ],
        }}
        transition={{
          duration: isMoving ? 0.2 : 2,
          repeat: isMoving ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Player core */}
        <motion.div
          className="absolute inset-2 rounded-full bg-white opacity-80"
          animate={{
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Scanning effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-hacker-green"
          animate={{
            scale: [1, 1.3],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Directional indicator */}
        {isMoving && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xs font-bold text-black">►</div>
          </motion.div>
        )}
      </motion.div>

      {/* Movement trail effect */}
      {isMoving && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,0,0.3), transparent)',
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default Player;