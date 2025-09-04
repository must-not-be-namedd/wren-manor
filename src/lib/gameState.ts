// Game State Management for Wren Manor Murder Mystery

export interface GameProgress {
  p1: boolean; // Intro Puzzle (weapon identified)
  p2: boolean; // Order Drag & Drop (timeline reconstructed)  
  p3: boolean; // Timeline Drop (alibis placed)
  p4: boolean; // Logic-Based Killing Puzzle
  p5: boolean; // Contradictory Dialogues – Web of Lies
  p6: boolean; // Query the Killer (Database Clue)
  p7: boolean; // Pattern Decryption – Combined Clues
  p8: boolean; // Inspect the Page – Hidden Elements
  p9: boolean; // Hard Code – Final Killer Reveal
  weapon: string;
  killer: string;
  currentPage: number;
  startTime: number;
  completionTime?: number;
  playerName: string;
  teamId: string;
}

export interface LeaderboardEntry {
  playerName: string;
  teamId: string;
  completionTime: number;
  currentProgress: number;
  timestamp: number;
}

const STORAGE_KEY = 'wren-manor-progress';
const LEADERBOARD_KEY = 'wren-manor-leaderboard';

export const getGameProgress = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading game progress:', error);
  }
  
  return {
    p1: false,
    p2: false,
    p3: false,
    p4: false,
    p5: false,
    p6: false,
    p7: false,
    p8: false,
    p9: false,
    weapon: '',
    killer: '',
    currentPage: 0,
    startTime: Date.now(),
    playerName: '',
    teamId: ''
  };
};

export const saveGameProgress = (progress: GameProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    updateLeaderboard(progress);
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading leaderboard:', error);
  }
  return [];
};

const updateLeaderboard = (progress: GameProgress): void => {
  try {
    const leaderboard = getLeaderboard();
    const currentProgress = [progress.p1, progress.p2, progress.p3, progress.p4, progress.p5, progress.p6, progress.p7, progress.p8, progress.p9].filter(Boolean).length;
    
    const existingEntryIndex = leaderboard.findIndex(
      entry => entry.playerName === progress.playerName && entry.teamId === progress.teamId
    );
    
    const newEntry: LeaderboardEntry = {
      playerName: progress.playerName,
      teamId: progress.teamId,
      completionTime: progress.completionTime || 0,
      currentProgress,
      timestamp: Date.now()
    };
    
    if (existingEntryIndex >= 0) {
      leaderboard[existingEntryIndex] = newEntry;
    } else {
      leaderboard.push(newEntry);
    }
    
    // Sort by progress (desc), then by completion time (asc)
    leaderboard.sort((a, b) => {
      if (a.currentProgress !== b.currentProgress) {
        return b.currentProgress - a.currentProgress;
      }
      return a.completionTime - b.completionTime;
    });
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

export const resetGameProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting game progress:', error);
  }
};