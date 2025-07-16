export type CellType = 'wall' | 'path' | 'player' | 'exit' | 'chip' | 'firewall' | 'locker';

export interface MazeCell {
  x: number;
  y: number;
  type: CellType;
  visited?: boolean;
  isExit?: boolean;
  hasChip?: boolean;
  hasFirewall?: boolean;
  hasLocker?: boolean;
  lockerId?: string;
}

export interface MazeData {
  grid: MazeCell[][];
  playerStart: { x: number; y: number };
  exit: { x: number; y: number };
  chips: { x: number; y: number }[];
  firewalls: { x: number; y: number }[];
  lockers: { x: number; y: number; id: string }[];
}

// Directions for maze generation
const DIRECTIONS = [
  { x: 0, y: -2 }, // Up
  { x: 2, y: 0 },  // Right
  { x: 0, y: 2 },  // Down
  { x: -2, y: 0 }, // Left
];

// Initialize empty maze grid
const initializeGrid = (width: number, height: number): MazeCell[][] => {
  const grid: MazeCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      grid[y][x] = {
        x,
        y,
        type: 'wall',
        visited: false,
      };
    }
  }
  
  return grid;
};

// Check if coordinates are within grid bounds
const isValidCell = (x: number, y: number, width: number, height: number): boolean => {
  return x >= 0 && x < width && y >= 0 && y < height;
};

// Get unvisited neighbors for maze generation
const getUnvisitedNeighbors = (
  cell: MazeCell,
  grid: MazeCell[][],
  width: number,
  height: number
): MazeCell[] => {
  const neighbors: MazeCell[] = [];
  
  for (const dir of DIRECTIONS) {
    const newX = cell.x + dir.x;
    const newY = cell.y + dir.y;
    
    if (isValidCell(newX, newY, width, height) && !grid[newY][newX].visited) {
      neighbors.push(grid[newY][newX]);
    }
  }
  
  return neighbors;
};

// Recursive backtracking algorithm for maze generation
const generateMazeRecursive = (
  current: MazeCell,
  grid: MazeCell[][],
  width: number,
  height: number
): void => {
  current.visited = true;
  current.type = 'path';
  
  const neighbors = getUnvisitedNeighbors(current, grid, width, height);
  
  // Shuffle neighbors for randomness
  for (let i = neighbors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
  }
  
  for (const neighbor of neighbors) {
    if (!neighbor.visited) {
      // Remove wall between current and neighbor
      const wallX = current.x + (neighbor.x - current.x) / 2;
      const wallY = current.y + (neighbor.y - current.y) / 2;
      
      if (isValidCell(wallX, wallY, width, height)) {
        grid[wallY][wallX].type = 'path';
        grid[wallY][wallX].visited = true;
      }
      
      generateMazeRecursive(neighbor, grid, width, height);
    }
  }
};

// Add special items to the maze
const addSpecialItems = (grid: MazeCell[][], width: number, height: number): {
  chips: { x: number; y: number }[];
  firewalls: { x: number; y: number }[];
  lockers: { x: number; y: number; id: string }[];
} => {
  const pathCells: { x: number; y: number }[] = [];
  
  // Find all path cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x].type === 'path') {
        pathCells.push({ x, y });
      }
    }
  }
  
  const chips: { x: number; y: number }[] = [];
  const firewalls: { x: number; y: number }[] = [];
  const lockers: { x: number; y: number; id: string }[] = [];
  
  // Shuffle path cells
  for (let i = pathCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pathCells[i], pathCells[j]] = [pathCells[j], pathCells[i]];
  }
  
  // Add chips (5-8 chips)
  const chipCount = Math.floor(Math.random() * 4) + 5;
  for (let i = 0; i < Math.min(chipCount, pathCells.length); i++) {
    const cell = pathCells[i];
    chips.push(cell);
    grid[cell.y][cell.x].hasChip = true;
  }
  
  // Add firewalls (2-4 firewalls)
  const firewallCount = Math.floor(Math.random() * 3) + 2;
  for (let i = chipCount; i < Math.min(chipCount + firewallCount, pathCells.length); i++) {
    const cell = pathCells[i];
    firewalls.push(cell);
    grid[cell.y][cell.x].hasFirewall = true;
  }
  
  // Add lockers (3-5 lockers)
  const lockerCount = Math.floor(Math.random() * 3) + 3;
  for (let i = chipCount + firewallCount; i < Math.min(chipCount + firewallCount + lockerCount, pathCells.length); i++) {
    const cell = pathCells[i];
    const lockerId = `locker_${Date.now()}_${i}`;
    lockers.push({ ...cell, id: lockerId });
    grid[cell.y][cell.x].hasLocker = true;
    grid[cell.y][cell.x].lockerId = lockerId;
  }
  
  return { chips, firewalls, lockers };
};

// Find a valid path from start to end using BFS
const findPath = (
  grid: MazeCell[][],
  start: { x: number; y: number },
  end: { x: number; y: number },
  width: number,
  height: number
): boolean => {
  const visited = new Set<string>();
  const queue = [start];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.x},${current.y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (current.x === end.x && current.y === end.y) {
      return true;
    }
    
    // Check 4 directions (not diagonal)
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];
    
    for (const neighbor of neighbors) {
      if (
        isValidCell(neighbor.x, neighbor.y, width, height) &&
        grid[neighbor.y][neighbor.x].type === 'path' &&
        !visited.has(`${neighbor.x},${neighbor.y}`)
      ) {
        queue.push(neighbor);
      }
    }
  }
  
  return false;
};

// Main maze generation function
export const generateMaze = (width: number = 21, height: number = 21): MazeData => {
  // Ensure odd dimensions for proper maze generation
  const mazeWidth = width % 2 === 0 ? width + 1 : width;
  const mazeHeight = height % 2 === 0 ? height + 1 : height;
  
  const grid = initializeGrid(mazeWidth, mazeHeight);
  
  // Start generation from top-left corner (1,1)
  const startCell = grid[1][1];
  generateMazeRecursive(startCell, grid, mazeWidth, mazeHeight);
  
  // Find valid start and end positions
  const pathCells: { x: number; y: number }[] = [];
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (grid[y][x].type === 'path') {
        pathCells.push({ x, y });
      }
    }
  }
  
  // Player starts at first path cell (usually top-left area)
  const playerStart = pathCells[0] || { x: 1, y: 1 };
  
  // Exit should be far from start
  let exit = pathCells[pathCells.length - 1] || { x: mazeWidth - 2, y: mazeHeight - 2 };
  
  // Ensure there's a path from start to exit
  let attempts = 0;
  while (!findPath(grid, playerStart, exit, mazeWidth, mazeHeight) && attempts < 10) {
    exit = pathCells[Math.floor(Math.random() * pathCells.length)];
    attempts++;
  }
  
  // If still no path, create a simple path
  if (!findPath(grid, playerStart, exit, mazeWidth, mazeHeight)) {
    exit = { x: mazeWidth - 2, y: mazeHeight - 2 };
    grid[exit.y][exit.x].type = 'path';
  }
  
  // Set exit cell
  grid[exit.y][exit.x].isExit = true;
  
  // Add special items
  const { chips, firewalls, lockers } = addSpecialItems(grid, mazeWidth, mazeHeight);
  
  return {
    grid,
    playerStart,
    exit,
    chips,
    firewalls,
    lockers,
  };
};

// Utility function to get cell at position
export const getCellAt = (grid: MazeCell[][], x: number, y: number): MazeCell | null => {
  if (!grid || !grid[y] || !grid[y][x]) return null;
  return grid[y][x];
};

// Check if movement is valid
export const isValidMove = (
  grid: MazeCell[][],
  x: number,
  y: number,
  width: number,
  height: number
): boolean => {
  if (!isValidCell(x, y, width, height)) return false;
  const cell = getCellAt(grid, x, y);
  return cell ? cell.type !== 'wall' : false;
};

// Get all adjacent cells
export const getAdjacentCells = (
  grid: MazeCell[][],
  x: number,
  y: number,
  width: number,
  height: number
): MazeCell[] => {
  const adjacent: MazeCell[] = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
  ];
  
  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;
    const cell = getCellAt(grid, newX, newY);
    if (cell && isValidCell(newX, newY, width, height)) {
      adjacent.push(cell);
    }
  }
  
  return adjacent;
};