export interface GameScore {
  id: string;
  playerName: string;
  score: number;
  timeLeft: number;
  chipsCollected: number;
  date: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

const STORAGE_KEYS = {
  LEADERBOARD: 'hacker-maze-leaderboard',
  SETTINGS: 'hacker-maze-settings',
  CURRENT_GAME: 'hacker-maze-current-game',
};

// Leaderboard functions
export const getLeaderboard = (): GameScore[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
};

export const saveScore = (score: Omit<GameScore, 'id' | 'date'>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const leaderboard = getLeaderboard();
    const newScore: GameScore = {
      ...score,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 5 scores
    const topScores = leaderboard.slice(0, 5);
    
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(topScores));
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

export const clearLeaderboard = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
};

// Settings functions
export const getSettings = (): GameSettings => {
  if (typeof window === 'undefined') {
    return { soundEnabled: true, musicEnabled: true };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : { soundEnabled: true, musicEnabled: true };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { soundEnabled: true, musicEnabled: true };
  }
};

export const saveSettings = (settings: GameSettings): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Current game state functions
export const saveCurrentGame = (gameState: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving current game:', error);
  }
};

export const getCurrentGame = (): any => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading current game:', error);
    return null;
  }
};

export const clearCurrentGame = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
};