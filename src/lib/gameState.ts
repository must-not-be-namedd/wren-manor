// Game State Management for Wren Manor Murder Mystery
import { supabase } from "@/integrations/supabase/client";

export interface GameProgress {
  id?: string;
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
  id?: string;
  playerName: string;
  teamId: string;
  completionTime: number;
  currentProgress: number;
  timestamp: number;
}

export const getGameProgress = async (playerName: string, teamId: string): Promise<GameProgress> => {
  try {
    if (!playerName || !teamId) {
      return getDefaultProgress();
    }

    const { data, error } = await supabase
      .from('game_progress')
      .select('*')
      .eq('player_name', playerName)
      .eq('team_id', teamId)
      .maybeSingle();

    if (error) {
      console.error('Error reading game progress:', error);
      return getDefaultProgress();
    }

    if (data) {
      const progress: GameProgress = {
        id: data.id,
        p1: data.p1,
        p2: data.p2,
        p3: data.p3,
        p4: data.p4,
        p5: data.p5,
        p6: data.p6,
        p7: data.p7,
        p8: data.p8,
        p9: data.p9,
        weapon: data.weapon || '',
        killer: data.killer || '',
        currentPage: data.current_page,
        startTime: data.start_time,
        completionTime: data.completion_time || undefined,
        playerName: data.player_name,
        teamId: data.team_id
      };
      console.log('Loaded game progress from Supabase:', progress);
      return progress;
    }
  } catch (error) {
    console.error('Error reading game progress:', error);
  }
  
  return getDefaultProgress();
};

const getDefaultProgress = (): GameProgress => {
  const defaultProgress = {
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
  
  console.log('Using default progress:', defaultProgress);
  return defaultProgress;
};

export const saveGameProgress = async (progress: GameProgress): Promise<void> => {
  try {
    console.log('Saving game progress:', progress);
    
    const gameData = {
      player_name: progress.playerName,
      team_id: progress.teamId,
      p1: progress.p1,
      p2: progress.p2,
      p3: progress.p3,
      p4: progress.p4,
      p5: progress.p5,
      p6: progress.p6,
      p7: progress.p7,
      p8: progress.p8,
      p9: progress.p9,
      weapon: progress.weapon,
      killer: progress.killer,
      current_page: progress.currentPage,
      start_time: progress.startTime,
      completion_time: progress.completionTime
    };

    const { error } = await supabase
      .from('game_progress')
      .upsert(gameData, { 
        onConflict: 'player_name,team_id'
      });

    if (error) {
      console.error('Error saving game progress:', error);
      return;
    }
    
    console.log('Progress saved successfully');
    await updateLeaderboard(progress);
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('current_progress', { ascending: false })
      .order('completion_time', { ascending: true });

    if (error) {
      console.error('Error reading leaderboard:', error);
      return [];
    }

    return data?.map(entry => ({
      id: entry.id,
      playerName: entry.player_name,
      teamId: entry.team_id,
      completionTime: entry.completion_time,
      currentProgress: entry.current_progress,
      timestamp: entry.timestamp
    })) || [];
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
};

const updateLeaderboard = async (progress: GameProgress): Promise<void> => {
  try {
    const currentProgress = [progress.p1, progress.p2, progress.p3, progress.p4, progress.p5, progress.p6, progress.p7, progress.p8, progress.p9].filter(Boolean).length;
    
    const leaderboardData = {
      player_name: progress.playerName,
      team_id: progress.teamId,
      completion_time: progress.completionTime || 0,
      current_progress: currentProgress,
      timestamp: Date.now()
    };

    const { error } = await supabase
      .from('leaderboard')
      .upsert(leaderboardData, { 
        onConflict: 'player_name,team_id'
      });

    if (error) {
      console.error('Error updating leaderboard:', error);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

export const resetGameProgress = async (playerName: string, teamId: string): Promise<void> => {
  try {
    if (!playerName || !teamId) return;
    
    const { error } = await supabase
      .from('game_progress')
      .delete()
      .eq('player_name', playerName)
      .eq('team_id', teamId);

    if (error) {
      console.error('Error resetting game progress:', error);
    }
  } catch (error) {
    console.error('Error resetting game progress:', error);
  }
};