import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameSettings } from '../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const toggleSound = () => {
    onSettingsChange({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  const toggleMusic = () => {
    onSettingsChange({
      ...settings,
      musicEnabled: !settings.musicEnabled,
    });
  };

  const resetSettings = () => {
    onSettingsChange({
      soundEnabled: true,
      musicEnabled: true,
    });
  };

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
            <div className="text-center mb-8">
              <motion.h2
                className="text-2xl font-bold text-hacker-green font-mono mb-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SYSTEM SETTINGS
              </motion.h2>
              
              <div className="text-sm text-gray-400">
                Configure audio preferences
              </div>
            </div>

            {/* Settings Options */}
            <div className="space-y-6 mb-8">
              {/* Sound Effects */}
              <div className="flex items-center justify-between p-4 border border-hacker-green rounded bg-black bg-opacity-30">
                <div>
                  <div className="text-hacker-green font-mono font-bold">SOUND EFFECTS</div>
                  <div className="text-xs text-gray-400">Movement, puzzle, and interaction sounds</div>
                </div>
                
                <motion.button
                  onClick={toggleSound}
                  className={`relative w-16 h-8 rounded-full border-2 transition-colors duration-300 ${
                    settings.soundEnabled 
                      ? 'border-hacker-green bg-hacker-green bg-opacity-20' 
                      : 'border-gray-500 bg-gray-800'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 ${
                      settings.soundEnabled 
                        ? 'left-8 bg-hacker-green shadow-lg' 
                        : 'left-1 bg-gray-500'
                    }`}
                    animate={{
                      x: settings.soundEnabled ? 0 : 0,
                      boxShadow: settings.soundEnabled ? '0 0 10px #00ff00' : '0 0 0px #666',
                    }}
                  />
                  
                  <div className={`absolute inset-0 flex items-center justify-center text-xs font-mono ${
                    settings.soundEnabled ? 'text-hacker-green' : 'text-gray-500'
                  }`}>
                    {settings.soundEnabled ? 'ON' : 'OFF'}
                  </div>
                </motion.button>
              </div>

              {/* Background Music */}
              <div className="flex items-center justify-between p-4 border border-hacker-green rounded bg-black bg-opacity-30">
                <div>
                  <div className="text-hacker-green font-mono font-bold">BACKGROUND MUSIC</div>
                  <div className="text-xs text-gray-400">Ambient hacker soundtracks</div>
                </div>
                
                <motion.button
                  onClick={toggleMusic}
                  className={`relative w-16 h-8 rounded-full border-2 transition-colors duration-300 ${
                    settings.musicEnabled 
                      ? 'border-hacker-green bg-hacker-green bg-opacity-20' 
                      : 'border-gray-500 bg-gray-800'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 ${
                      settings.musicEnabled 
                        ? 'left-8 bg-hacker-green shadow-lg' 
                        : 'left-1 bg-gray-500'
                    }`}
                    animate={{
                      x: settings.musicEnabled ? 0 : 0,
                      boxShadow: settings.musicEnabled ? '0 0 10px #00ff00' : '0 0 0px #666',
                    }}
                  />
                  
                  <div className={`absolute inset-0 flex items-center justify-center text-xs font-mono ${
                    settings.musicEnabled ? 'text-hacker-green' : 'text-gray-500'
                  }`}>
                    {settings.musicEnabled ? 'ON' : 'OFF'}
                  </div>
                </motion.button>
              </div>

              {/* Audio Status */}
              <div className="p-4 border border-gray-600 rounded bg-gray-900 bg-opacity-50">
                <div className="text-center text-sm text-gray-400 font-mono">
                  AUDIO STATUS: {settings.soundEnabled || settings.musicEnabled ? (
                    <span className="text-hacker-green">ACTIVE</span>
                  ) : (
                    <span className="text-red-400">MUTED</span>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={resetSettings}
                className="flex-1 px-6 py-3 border-2 border-yellow-500 text-yellow-500 font-mono uppercase tracking-wider transition-all duration-300 hover:bg-yellow-500 hover:text-black"
              >
                RESET
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 btn-hack"
              >
                CLOSE
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-hacker-green rounded-full animate-pulse" />
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-hacker-green rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Glitch effect overlay */}
            <motion.div
              className="absolute inset-0 bg-hacker-green opacity-5 pointer-events-none rounded-lg"
              animate={{ opacity: [0, 0.05, 0] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 3 }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;