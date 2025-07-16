import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { saveScore, getLeaderboard, GameScore } from '../lib/storage';

interface GameResults {
  playerName: string;
  score: number;
  timeLeft: number;
  chipsCollected: number;
  totalChips: number;
  success: boolean;
  gameTime: number;
}

const SummaryPage: React.FC = () => {
  const router = useRouter();
  const [results, setResults] = useState<GameResults | null>(null);
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get game results from session storage
    const gameData = sessionStorage.getItem('gameResults');
    if (gameData) {
      const parsedResults: GameResults = JSON.parse(gameData);
      setResults(parsedResults);

      // Calculate final score with bonuses
      let finalScore = parsedResults.score;
      
      // Time bonus
      const timeBonus = parsedResults.timeLeft * 10;
      finalScore += timeBonus;
      
      // All chips bonus
      if (parsedResults.chipsCollected === parsedResults.totalChips) {
        finalScore += 500;
      }
      
      // Success bonus
      if (parsedResults.success) {
        finalScore += 1000;
      }

      // Save to leaderboard
      const scoreToSave = {
        playerName: parsedResults.playerName,
        score: finalScore,
        timeLeft: parsedResults.timeLeft,
        chipsCollected: parsedResults.chipsCollected,
      };

      // Check if it's a new record
      const currentLeaderboard = getLeaderboard();
      const isTopScore = currentLeaderboard.length === 0 || finalScore > currentLeaderboard[0].score;
      const isTop5 = currentLeaderboard.length < 5 || finalScore > currentLeaderboard[4].score;

      if (isTopScore || isTop5) {
        setIsNewRecord(true);
        setShowCelebration(true);
      }

      saveScore(scoreToSave);
      setLeaderboard(getLeaderboard());
      
      // Update results with final score
      setResults({ ...parsedResults, score: finalScore });
      
      // Clean up session storage
      sessionStorage.removeItem('gameResults');
    } else {
      // No results found, redirect to home
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatGameTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateGrade = () => {
    if (!results) return 'F';
    
    const efficiency = (results.chipsCollected / results.totalChips) * 100;
    const timeEfficiency = (results.timeLeft / 120) * 100;
    const overall = (efficiency + timeEfficiency) / 2;

    if (results.success) {
      if (overall >= 90) return 'S+';
      if (overall >= 80) return 'S';
      if (overall >= 70) return 'A';
      if (overall >= 60) return 'B';
      return 'C';
    } else {
      if (efficiency >= 70) return 'D';
      return 'F';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hacker-dark flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-4xl font-mono text-hacker-green"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            PROCESSING RESULTS...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const grade = calculateGrade();
  const rankPosition = leaderboard.findIndex(score => score.playerName === results.playerName) + 1;

  return (
    <>
      <Head>
        <title>Hacker Maze Escape - Mission Results</title>
        <meta name="description" content="View your game results and ranking" />
      </Head>

      <div className="min-h-screen bg-hacker-dark text-hacker-green overflow-hidden">
        {/* Matrix background */}
        <div className="fixed inset-0 z-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-hacker-matrix opacity-10 font-mono text-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
              }}
              animate={{
                y: ['0vh', '120vh'],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 10,
              }}
            >
              {Array.from({ length: Math.floor(Math.random() * 10) + 3 }).map((_, j) => (
                <div key={j}>
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => {
                setTimeout(() => setShowCelebration(false), 3000);
              }}
            >
              <motion.div
                className="text-center space-y-4"
                initial={{ scale: 0, rotateZ: -180 }}
                animate={{ scale: 1, rotateZ: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="text-8xl font-bold text-yellow-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    textShadow: [
                      '0 0 20px #ffff00',
                      '0 0 40px #ffff00, 0 0 60px #ffff00',
                      '0 0 20px #ffff00',
                    ],
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  NEW RECORD!
                </motion.div>
                <motion.div
                  className="text-2xl font-mono text-hacker-green"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  TOP HACKER ACHIEVEMENT UNLOCKED
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="relative z-10 min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold font-mono mb-4">
                <span className={`${results.success ? 'text-hacker-green' : 'text-red-400'} neon-glow`}>
                  {results.success ? 'MISSION COMPLETE' : 'MISSION FAILED'}
                </span>
              </h1>
              
              <div className="text-xl font-mono text-gray-400">
                Operator: <span className="text-hacker-matrix">{results.playerName}</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Results */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Grade card */}
                <div className="bg-black bg-opacity-80 border-2 border-hacker-green rounded-lg p-6 neon-border">
                  <div className="text-center">
                    <div className="text-sm font-mono text-gray-400 mb-2">PERFORMANCE GRADE</div>
                    <motion.div
                      className={`text-6xl font-bold ${
                        grade === 'S+' || grade === 'S' ? 'text-yellow-400' :
                        grade === 'A' ? 'text-hacker-green' :
                        grade === 'B' || grade === 'C' ? 'text-blue-400' :
                        'text-red-400'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
                    >
                      {grade}
                    </motion.div>
                    
                    {rankPosition > 0 && (
                      <div className="text-sm font-mono text-gray-400 mt-2">
                        Leaderboard Rank: #{rankPosition}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="bg-black bg-opacity-80 border-2 border-hacker-green rounded-lg p-6 neon-border">
                  <h3 className="text-xl font-bold font-mono text-hacker-green mb-4">SCORE BREAKDOWN</h3>
                  
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Score:</span>
                      <span className="text-hacker-matrix">{(results.score - (results.timeLeft * 10) - (results.chipsCollected === results.totalChips ? 500 : 0) - (results.success ? 1000 : 0)).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Time Bonus ({formatTime(results.timeLeft)}):</span>
                      <span className="text-green-400">+{(results.timeLeft * 10).toLocaleString()}</span>
                    </div>
                    
                    {results.chipsCollected === results.totalChips && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">All Chips Bonus:</span>
                        <span className="text-yellow-400">+500</span>
                      </div>
                    )}
                    
                    {results.success && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Success Bonus:</span>
                        <span className="text-green-400">+1,000</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-hacker-green">FINAL SCORE:</span>
                        <span className="text-hacker-matrix">{results.score.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-black bg-opacity-80 border-2 border-hacker-green rounded-lg p-6 neon-border">
                  <h3 className="text-xl font-bold font-mono text-hacker-green mb-4">MISSION STATS</h3>
                  
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                    <div className="space-y-2">
                      <div>
                        <div className="text-gray-400">Status:</div>
                        <div className={results.success ? 'text-green-400' : 'text-red-400'}>
                          {results.success ? 'SUCCESS' : 'FAILED'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400">Data Chips:</div>
                        <div className="text-blue-400">
                          {results.chipsCollected} / {results.totalChips}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="text-gray-400">Time Left:</div>
                        <div className="text-hacker-matrix">
                          {formatTime(results.timeLeft)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400">Total Time:</div>
                        <div className="text-gray-300">
                          {formatGameTime(results.gameTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <motion.div
                  className="flex space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <button
                    onClick={() => router.push('/game')}
                    className="flex-1 btn-hack py-3"
                  >
                    RETRY MISSION
                  </button>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 px-6 py-3 border-2 border-gray-500 text-gray-300 font-mono uppercase tracking-wider transition-all duration-300 hover:bg-gray-500 hover:text-black"
                  >
                    MAIN MENU
                  </button>
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
                  <h3 className="text-xl font-bold font-mono text-hacker-green mb-4 text-center">
                    GLOBAL LEADERBOARD
                  </h3>

                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((score, index) => (
                        <motion.div
                          key={score.id}
                          className={`flex items-center justify-between p-3 rounded border ${
                            score.playerName === results.playerName
                              ? 'bg-hacker-green bg-opacity-20 border-hacker-green'
                              : 'bg-gray-900 bg-opacity-50 border-gray-700'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`text-lg font-bold ${
                              index === 0 ? 'text-yellow-400' :
                              index === 1 ? 'text-gray-300' :
                              index === 2 ? 'text-yellow-600' :
                              'text-gray-400'
                            }`}>
                              #{index + 1}
                            </div>
                            
                            <div>
                              <div className={`font-mono font-bold ${
                                score.playerName === results.playerName ? 'text-hacker-matrix' : 'text-hacker-green'
                              }`}>
                                {score.playerName}
                                {score.playerName === results.playerName && ' (YOU)'}
                              </div>
                              <div className="text-xs text-gray-400">
                                {score.chipsCollected} chips • {formatTime(score.timeLeft)} left
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-mono font-bold text-hacker-matrix">
                              {score.score.toLocaleString()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <div className="font-mono">Loading leaderboard...</div>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div className="bg-black bg-opacity-80 border-2 border-hacker-green rounded-lg p-6 neon-border">
                  <h3 className="text-xl font-bold font-mono text-hacker-green mb-4">ACHIEVEMENTS</h3>
                  
                  <div className="space-y-2 text-sm font-mono">
                    {results.success && (
                      <motion.div
                        className="flex items-center space-x-2 text-green-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <span>✓</span>
                        <span>Mission Accomplished</span>
                      </motion.div>
                    )}
                    
                    {results.chipsCollected === results.totalChips && (
                      <motion.div
                        className="flex items-center space-x-2 text-yellow-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <span>✓</span>
                        <span>Data Collector</span>
                      </motion.div>
                    )}
                    
                    {results.timeLeft > 60 && results.success && (
                      <motion.div
                        className="flex items-center space-x-2 text-blue-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        <span>✓</span>
                        <span>Speed Runner</span>
                      </motion.div>
                    )}
                    
                    {isNewRecord && (
                      <motion.div
                        className="flex items-center space-x-2 text-yellow-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <span>🏆</span>
                        <span>New Record!</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryPage;