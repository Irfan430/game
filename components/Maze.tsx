import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MazeData, MazeCell } from '../lib/mazeGenerator';
import Player from './Player';

interface MazeProps {
  mazeData: MazeData;
  playerPosition: { x: number; y: number };
  onPlayerMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isPlayerMoving: boolean;
  collectedChips: Set<string>;
  activatedFirewalls: { x: number; y: number }[];
  onLockerClick: (lockerId: string) => void;
  unlockedLockers: Set<string>;
}

const Maze: React.FC<MazeProps> = ({
  mazeData,
  playerPosition,
  onPlayerMove,
  isPlayerMoving,
  collectedChips,
  activatedFirewalls,
  onLockerClick,
  unlockedLockers,
}) => {
  const cellSize = 30; // Size of each cell in pixels
  const gridWidth = mazeData.grid[0]?.length || 0;
  const gridHeight = mazeData.grid.length || 0;

  // Memoize cell rendering for performance
  const renderedCells = useMemo(() => {
    const cells: JSX.Element[] = [];

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const cell = mazeData.grid[y][x];
        const key = `${x}-${y}`;
        
        cells.push(
          <MazeCell
            key={key}
            cell={cell}
            cellSize={cellSize}
            isCollected={collectedChips.has(key)}
            isFirewallActive={activatedFirewalls.some(fw => fw.x === x && fw.y === y)}
            isLockerUnlocked={cell.lockerId ? unlockedLockers.has(cell.lockerId) : false}
            onLockerClick={onLockerClick}
          />
        );
      }
    }

    return cells;
  }, [mazeData.grid, collectedChips, activatedFirewalls, unlockedLockers, onLockerClick, cellSize, gridHeight, gridWidth]);

  const containerStyle = {
    width: gridWidth * cellSize,
    height: gridHeight * cellSize,
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative">
        {/* Game container */}
        <motion.div
          className="relative border-2 border-hacker-green rounded-lg overflow-hidden neon-border"
          style={containerStyle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          {/* Background grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00ff00 1px, transparent 1px),
                linear-gradient(to bottom, #00ff00 1px, transparent 1px)
              `,
              backgroundSize: `${cellSize}px ${cellSize}px`,
            }}
          />

          {/* Render all maze cells */}
          {renderedCells}

          {/* Player component */}
          <Player
            x={playerPosition.x}
            y={playerPosition.y}
            onMove={onPlayerMove}
            isMoving={isPlayerMoving}
            cellSize={cellSize}
          />

          {/* Matrix rain effect overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-hacker-matrix text-xs opacity-20 font-mono"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                animate={{
                  y: [0, containerStyle.height + 20],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 10,
                }}
              >
                {Array.from({ length: Math.floor(Math.random() * 10) + 5 }).map((_, j) => (
                  <div key={j}>
                    {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Minimap */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-black bg-opacity-80 border border-hacker-green rounded p-2">
          <div className="text-xs text-hacker-green font-mono mb-1">MINIMAP</div>
          <div className="relative w-full h-24 bg-gray-900 rounded overflow-hidden">
            {/* Minimap grid */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #333 1px, transparent 1px),
                  linear-gradient(to bottom, #333 1px, transparent 1px)
                `,
                backgroundSize: `${96 / gridWidth}px ${96 / gridHeight}px`,
              }}
            />
            
            {/* Player dot on minimap */}
            <div
              className="absolute w-1 h-1 bg-hacker-green rounded-full"
              style={{
                left: `${(playerPosition.x / gridWidth) * 100}%`,
                top: `${(playerPosition.y / gridHeight) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
            
            {/* Exit dot on minimap */}
            <div
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${(mazeData.exit.x / gridWidth) * 100}%`,
                top: `${(mazeData.exit.y / gridHeight) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 border border-hacker-green rounded p-3">
          <div className="text-xs text-hacker-green font-mono mb-2">LEGEND</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-hacker-green rounded-full"></div>
              <span className="text-gray-300">Player</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <span className="text-gray-300">Data Chip</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-sm animate-pulse"></div>
              <span className="text-gray-300">Firewall</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 border border-yellow-400"></div>
              <span className="text-gray-300">Locker</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Exit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual cell component for better performance
interface MazeCellProps {
  cell: MazeCell;
  cellSize: number;
  isCollected: boolean;
  isFirewallActive: boolean;
  isLockerUnlocked: boolean;
  onLockerClick: (lockerId: string) => void;
}

const MazeCell: React.FC<MazeCellProps> = ({
  cell,
  cellSize,
  isCollected,
  isFirewallActive,
  isLockerUnlocked,
  onLockerClick,
}) => {
  const { x, y, type, hasChip, hasFirewall, hasLocker, lockerId, isExit } = cell;

  const getCellStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      width: cellSize,
      height: cellSize,
      left: x * cellSize,
      top: y * cellSize,
    };

    return baseStyle;
  };

  const getCellClasses = () => {
    if (type === 'wall') return 'maze-wall';
    return 'maze-path';
  };

  const handleLockerClick = () => {
    if (hasLocker && lockerId && !isLockerUnlocked) {
      onLockerClick(lockerId);
    }
  };

  return (
    <div
      className={`maze-cell ${getCellClasses()}`}
      style={getCellStyle()}
    >
      {/* Exit portal */}
      {isExit && (
        <motion.div
          className="absolute inset-1 maze-exit rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
            EXIT
          </div>
        </motion.div>
      )}

      {/* Data chip */}
      {hasChip && !isCollected && (
        <motion.div
          className="absolute inset-2 maze-chip"
          animate={{
            rotateY: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotateY: { duration: 3, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            D
          </div>
        </motion.div>
      )}

      {/* Firewall */}
      {hasFirewall && isFirewallActive && (
        <motion.div
          className="absolute inset-1 maze-firewall"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            🔥
          </div>
        </motion.div>
      )}

      {/* Locker */}
      {hasLocker && !isLockerUnlocked && (
        <motion.div
          className="absolute inset-1 maze-locker cursor-pointer"
          onClick={handleLockerClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 5px #ffff00',
              '0 0 15px #ffff00',
              '0 0 5px #ffff00',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
            🔒
          </div>
        </motion.div>
      )}

      {/* Unlocked locker */}
      {hasLocker && isLockerUnlocked && (
        <div className="absolute inset-1 bg-gray-600 border border-gray-500 opacity-50">
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">
            🔓
          </div>
        </div>
      )}
    </div>
  );
};

export default Maze;