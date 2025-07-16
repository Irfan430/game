import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getLeaderboard, getSettings, GameScore, GameSettings, saveSettings } from '../lib/storage';
import SettingsModal from '../components/SettingsModal';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);
  const [settings, setSettings] = useState<GameSettings>({ soundEnabled: true, musicEnabled: true });
  const [showSettings, setShowSettings] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
    setSettings(getSettings());
  }, []);

  const handleStartGame = () => {
    if (!playerName.trim()) {
      setShowNameInput(true);
      return;
    }
    // Store player name in session storage for the game
    sessionStorage.setItem('playerName', playerName.trim());
    router.push('/game');
  };

  const handleNameSubmit = () => {
    if (playerName.trim()) {
      handleStartGame();
    }
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Matrix rain characters
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  return (
    <>
      <Head>
        <title>Hacker Maze Escape - Enter the Digital Labyrinth</title>
        <meta name="description" content="Navigate through a digital maze, solve puzzles, and escape before time runs out!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-hacker-dark text-hacker-green overflow-hidden">
        {/* Matrix background */}
        <div className="fixed inset-0 z-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-hacker-matrix opacity-20 font-mono text-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
              }}
              animate={{
                y: ['0vh', '120vh'],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 10,
              }}
            >
              {Array.from({ length: Math.floor(Math.random() * 15) + 5 }).map((_, j) => (
                <div key={j} className="leading-4">
                  {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="p-6">
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-mono text-sm opacity-60">
                NEXUS_SECURITY_SYSTEM_v2.1.3
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 border border-hacker-green rounded hover:bg-hacker-green hover:text-black transition-colors duration-300"
              >
                <span className="font-mono text-sm">SETTINGS</span>
              </button>
            </motion.div>
          </header>

          {/* Main content area */}
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left side - Game intro */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Title */}
                <div className="space-y-4">
                  <motion.h1
                    className="text-6xl lg:text-7xl font-bold font-mono neon-glow"
                    data-text="HACKER MAZE"
                    animate={{
                      textShadow: [
                        '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00',
                        '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
                        '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    HACKER MAZE
                  </motion.h1>
                  
                  <motion.h2
                    className="text-2xl font-mono text-hacker-matrix"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ESCAPE
                  </motion.h2>
                </div>

                {/* Description */}
                <motion.div
                  className="space-y-4 text-gray-300 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-lg">
                    Navigate through a digital labyrinth filled with security protocols.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Collect data chips for extra points</li>
                    <li>• Solve puzzles to unlock passages</li>
                    <li>• Avoid moving firewall defenses</li>
                    <li>• Escape before time runs out</li>
                  </ul>
                </motion.div>

                {/* Player name input */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-mono opacity-80">HACKER ALIAS:</label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                      placeholder="Enter your alias..."
                      className="bg-black border-2 border-hacker-green rounded px-4 py-3 text-hacker-green font-mono focus:outline-none focus:border-hacker-matrix neon-border"
                      maxLength={20}
                    />
                  </div>

                  <motion.button
                    onClick={handleStartGame}
                    className="btn-hack w-full py-4 text-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    INITIATE BREACH
                  </motion.button>

                  {showNameInput && !playerName.trim() && (
                    <motion.div
                      className="text-red-400 text-sm font-mono text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ALIAS REQUIRED FOR SECURITY CLEARANCE
                    </motion.div>
                  )}
                </motion.div>

                {/* Controls */}
                <motion.div
                  className="bg-black bg-opacity-50 border border-hacker-green rounded p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="text-sm font-mono space-y-2">
                    <div className="text-hacker-green font-bold mb-2">CONTROLS:</div>
                    <div>MOVEMENT: WASD or Arrow Keys</div>
                    <div>INTERACT: Click on lockers</div>
                    <div>PAUSE: ESC</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right side - Leaderboard */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="bg-black bg-opacity-80 border-2 border-hacker-green rounded-lg p-6 neon-border">
                  <motion.h3
                    className="text-2xl font-bold font-mono text-hacker-green mb-6 text-center"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    TOP HACKERS
                  </motion.h3>

                  {leaderboard.length > 0 ? (
                    <div className="space-y-4">
                      {leaderboard.map((score, index) => (
                        <motion.div
                          key={score.id}
                          className="flex items-center justify-between p-3 bg-gray-900 bg-opacity-50 rounded border border-gray-700"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`text-lg font-bold ${
                              index === 0 ? 'text-yellow-400' :
                              index === 1 ? 'text-gray-300' :
                              index === 2 ? 'text-yellow-600' :
                              'text-gray-400'
                            }`}>
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-mono text-hacker-green font-bold">
                                {score.playerName}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(score.date)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-mono font-bold text-hacker-matrix">
                              {score.score.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {score.chipsCollected} chips • {formatTime(score.timeLeft)} left
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className="text-center text-gray-400 py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="text-6xl mb-4 opacity-20">🏆</div>
                      <div className="font-mono">NO RECORDS FOUND</div>
                      <div className="text-sm mt-2">Be the first to escape!</div>
                    </motion.div>
                  )}
                </div>

                {/* System status */}
                <motion.div
                  className="bg-black bg-opacity-50 border border-gray-600 rounded p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <div className="text-xs font-mono space-y-1 text-gray-400">
                    <div className="flex justify-between">
                      <span>SYSTEM STATUS:</span>
                      <span className="text-hacker-green">ONLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SECURITY LEVEL:</span>
                      <span className="text-red-400">MAXIMUM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FIREWALL:</span>
                      <span className="text-yellow-400">ACTIVE</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-6 text-center">
            <motion.div
              className="text-xs font-mono text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              UNAUTHORIZED ACCESS DETECTED • INITIATING COUNTERMEASURES
            </motion.div>
          </footer>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </>
  );
};

export default HomePage;