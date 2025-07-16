import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { generateMaze, MazeData, isValidMove, getCellAt } from '../lib/mazeGenerator';
import { generateRandomPuzzle, Puzzle } from '../lib/puzzles';
import { getSettings, GameSettings } from '../lib/storage';
import Maze from '../components/Maze';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import PuzzleModal from '../components/PuzzleModal';
import SettingsModal from '../components/SettingsModal';

interface GameState {
  maze: MazeData;
  playerPosition: { x: number; y: number };
  score: number;
  timeLeft: number;
  chipsCollected: number;
  collectedChips: Set<string>;
  unlockedLockers: Set<string>;
  isGameRunning: boolean;
  isPlayerMoving: boolean;
  currentPuzzle: Puzzle | null;
  showPuzzle: boolean;
  showSettings: boolean;
  firewalls: { x: number; y: number; direction: { x: number; y: number } }[];
  gameStartTime: number;
}

const GamePage: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [settings, setSettings] = useState<GameSettings>({ soundEnabled: true, musicEnabled: true });
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const firewallIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  useEffect(() => {
    const initGame = () => {
      const name = sessionStorage.getItem('playerName') || 'Anonymous';
      setPlayerName(name);
      setSettings(getSettings());

      const maze = generateMaze(21, 21);
      const initialState: GameState = {
        maze,
        playerPosition: maze.playerStart,
        score: 0,
        timeLeft: 120, // 2 minutes
        chipsCollected: 0,
        collectedChips: new Set(),
        unlockedLockers: new Set(),
        isGameRunning: true,
        isPlayerMoving: false,
        currentPuzzle: null,
        showPuzzle: false,
        showSettings: false,
        firewalls: maze.firewalls.map(fw => ({
          x: fw.x,
          y: fw.y,
          direction: { x: Math.random() > 0.5 ? 1 : -1, y: Math.random() > 0.5 ? 1 : -1 }
        })),
        gameStartTime: Date.now(),
      };

      setGameState(initialState);
      setIsLoading(false);
    };

    initGame();
  }, []);

  // Firewall movement
  useEffect(() => {
    if (!gameState?.isGameRunning) return;

    firewallIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;

        const updatedFirewalls = prev.firewalls.map(firewall => {
          const newX = firewall.x + firewall.direction.x;
          const newY = firewall.y + firewall.direction.y;

          // Check if new position is valid
          if (isValidMove(prev.maze.grid, newX, newY, prev.maze.grid[0].length, prev.maze.grid.length)) {
            return { ...firewall, x: newX, y: newY };
          } else {
            // Reverse direction if hitting a wall
            return {
              ...firewall,
              direction: { x: -firewall.direction.x, y: -firewall.direction.y }
            };
          }
        });

        return { ...prev, firewalls: updatedFirewalls };
      });
    }, 2000); // Move every 2 seconds

    return () => {
      if (firewallIntervalRef.current) {
        clearInterval(firewallIntervalRef.current);
      }
    };
  }, [gameState?.isGameRunning]);

  // Handle player movement
  const handlePlayerMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState || !gameState.isGameRunning || gameState.isPlayerMoving) return;

    const { playerPosition, maze } = gameState;
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

    // Check if move is valid
    if (!isValidMove(maze.grid, newX, newY, maze.grid[0].length, maze.grid.length)) {
      return;
    }

    setGameState(prev => {
      if (!prev) return prev;

      let newState = { ...prev, playerPosition: { x: newX, y: newY }, isPlayerMoving: true };
      let scoreIncrease = 10; // Base movement score

      // Check for chip collection
      const chipKey = `${newX}-${newY}`;
      const cell = getCellAt(maze.grid, newX, newY);
      
      if (cell?.hasChip && !prev.collectedChips.has(chipKey)) {
        const newCollectedChips = new Set(prev.collectedChips);
        newCollectedChips.add(chipKey);
        
        newState = {
          ...newState,
          collectedChips: newCollectedChips,
          chipsCollected: prev.chipsCollected + 1,
        };
        scoreIncrease += 100; // Chip bonus
      }

      // Check for firewall collision
      const hitFirewall = prev.firewalls.some(fw => fw.x === newX && fw.y === newY);
      if (hitFirewall) {
        // Reduce time by 10 seconds
        newState.timeLeft = Math.max(0, prev.timeLeft - 10);
        scoreIncrease -= 50; // Penalty
      }

      // Check for exit
      if (newX === maze.exit.x && newY === maze.exit.y) {
        endGame(true);
        return newState;
      }

      // Update score with multiplier
      const timeMultiplier = prev.timeLeft > 90 ? 2 : prev.timeLeft > 60 ? 1.5 : prev.timeLeft > 30 ? 1.2 : 1;
      newState.score = prev.score + Math.floor(scoreIncrease * timeMultiplier);

      // Reset moving state after animation
      setTimeout(() => {
        setGameState(current => current ? { ...current, isPlayerMoving: false } : current);
      }, 200);

      return newState;
    });
  }, [gameState]);

  // Handle locker click
  const handleLockerClick = useCallback((lockerId: string) => {
    if (!gameState || !gameState.isGameRunning || gameState.unlockedLockers.has(lockerId)) return;

    const puzzle = generateRandomPuzzle();
    setGameState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        currentPuzzle: puzzle,
        showPuzzle: true,
        isGameRunning: false, // Pause game during puzzle
      };
    });
  }, [gameState]);

  // Handle puzzle success
  const handlePuzzleSuccess = useCallback(() => {
    setGameState(prev => {
      if (!prev || !prev.currentPuzzle) return prev;

      // Find the locker that was clicked and unlock it
      const lockerToUnlock = prev.maze.lockers.find(locker => 
        Math.abs(locker.x - prev.playerPosition.x) <= 1 && 
        Math.abs(locker.y - prev.playerPosition.y) <= 1
      );

      if (lockerToUnlock) {
        const newUnlockedLockers = new Set(prev.unlockedLockers);
        newUnlockedLockers.add(lockerToUnlock.id);

        return {
          ...prev,
          unlockedLockers: newUnlockedLockers,
          score: prev.score + 200, // Puzzle solve bonus
          showPuzzle: false,
          currentPuzzle: null,
          isGameRunning: true,
        };
      }

      return {
        ...prev,
        showPuzzle: false,
        currentPuzzle: null,
        isGameRunning: true,
      };
    });
  }, []);

  // Handle puzzle failure
  const handlePuzzleFailure = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 10), // 10 second penalty
        showPuzzle: false,
        currentPuzzle: null,
        isGameRunning: true,
      };
    });
  }, []);

  // Handle time update
  const handleTimeUpdate = useCallback((timeLeft: number) => {
    setGameState(prev => {
      if (!prev) return prev;
      return { ...prev, timeLeft };
    });
  }, []);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    endGame(false);
  }, []);

  // End game function
  const endGame = (success: boolean) => {
    setGameState(prev => {
      if (!prev) return prev;
      return { ...prev, isGameRunning: false };
    });

    // Navigate to summary page with results
    const gameData = {
      playerName,
      score: gameState?.score || 0,
      timeLeft: gameState?.timeLeft || 0,
      chipsCollected: gameState?.chipsCollected || 0,
      totalChips: gameState?.maze.chips.length || 0,
      success,
      gameTime: Date.now() - (gameState?.gameStartTime || Date.now()),
    };

    sessionStorage.setItem('gameResults', JSON.stringify(gameData));
    router.push('/summary');
  };

  // Handle ESC key for pause/settings
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGameState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            showSettings: !prev.showSettings,
            isGameRunning: prev.showSettings, // Resume if closing settings
          };
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
            INITIALIZING MAZE...
          </motion.div>
          
          <div className="w-64 h-2 bg-gray-800 rounded overflow-hidden">
            <motion.div
              className="h-full bg-hacker-green"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
          
          <div className="text-sm font-mono text-gray-400">
            Generating quantum pathways...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!gameState) return null;

  return (
    <>
      <Head>
        <title>Hacker Maze Escape - Game in Progress</title>
        <meta name="description" content="Navigate the digital maze and escape!" />
      </Head>

      <div className="min-h-screen bg-hacker-dark text-hacker-green">
        {/* Game HUD */}
        <div className="fixed top-0 left-0 right-0 z-40 p-4 bg-black bg-opacity-80 border-b border-hacker-green">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Left side - Score and stats */}
            <ScoreBoard
              score={gameState.score}
              chipsCollected={gameState.chipsCollected}
              totalChips={gameState.maze.chips.length}
              timeLeft={gameState.timeLeft}
            />

            {/* Center - Timer */}
            <Timer
              initialTime={120}
              onTimeUp={handleTimeUp}
              onTimeUpdate={handleTimeUpdate}
              isRunning={gameState.isGameRunning}
            />

            {/* Right side - Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setGameState(prev => prev ? { ...prev, showSettings: true, isGameRunning: false } : prev)}
                className="p-2 border border-hacker-green rounded hover:bg-hacker-green hover:text-black transition-colors duration-300"
              >
                <span className="font-mono text-sm">PAUSE</span>
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-black transition-colors duration-300"
              >
                <span className="font-mono text-sm">EXIT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game area */}
        <div className="pt-24">
          <Maze
            mazeData={gameState.maze}
            playerPosition={gameState.playerPosition}
            onPlayerMove={handlePlayerMove}
            isPlayerMoving={gameState.isPlayerMoving}
            collectedChips={gameState.collectedChips}
            activatedFirewalls={gameState.firewalls}
            onLockerClick={handleLockerClick}
            unlockedLockers={gameState.unlockedLockers}
          />
        </div>

        {/* Game status overlay */}
        {!gameState.isGameRunning && !gameState.showPuzzle && !gameState.showSettings && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center space-y-4">
              <motion.div
                className="text-4xl font-mono text-hacker-green"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                GAME PAUSED
              </motion.div>
              
              <div className="text-sm font-mono text-gray-400">
                Press ESC to continue or use PAUSE button
              </div>
            </div>
          </motion.div>
        )}

        {/* Puzzle Modal */}
        <PuzzleModal
          puzzle={gameState.currentPuzzle}
          isOpen={gameState.showPuzzle}
          onClose={() => setGameState(prev => prev ? { ...prev, showPuzzle: false, currentPuzzle: null, isGameRunning: true } : prev)}
          onSuccess={handlePuzzleSuccess}
          onFailure={handlePuzzleFailure}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={gameState.showSettings}
          onClose={() => setGameState(prev => prev ? { ...prev, showSettings: false, isGameRunning: true } : prev)}
          settings={settings}
          onSettingsChange={setSettings}
        />

        {/* Game status notifications */}
        <AnimatePresence>
          {gameState.timeLeft <= 30 && gameState.timeLeft > 0 && (
            <motion.div
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900 border-2 border-red-500 rounded-lg p-4 z-30"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              <div className="text-red-400 font-mono text-center">
                <div className="text-lg font-bold">⚠️ CRITICAL TIME REMAINING</div>
                <div className="text-sm">Escape immediately!</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions overlay */}
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 border border-hacker-green rounded p-3 z-30">
          <div className="text-xs font-mono space-y-1">
            <div className="text-hacker-green font-bold">CONTROLS:</div>
            <div>WASD / Arrow Keys: Move</div>
            <div>Click Lockers: Solve puzzle</div>
            <div>ESC: Pause game</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;