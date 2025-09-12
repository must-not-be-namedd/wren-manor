import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users } from 'lucide-react';
import { ManorCard, ManorCardContent, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { Badge } from '@/components/ui/badge';

interface TeamScore {
  teamId: string;
  teamName: string;
  completionTime: number; // in milliseconds
  puzzlesCompleted: number;
  lastUpdated: number;
}

export const LeaderboardWidget = () => {
  const [topTeams, setTopTeams] = useState<TeamScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        // Get all team progress from localStorage
        const allProgress = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('wren-manor-progress-')) {
            try {
              const progress = JSON.parse(localStorage.getItem(key) || '{}');
              if (progress.teamId && progress.playerName) {
                const completedPuzzles = [
                  progress.p1, progress.p2, progress.p3, progress.p4, 
                  progress.p5, progress.p6, progress.p7, progress.p8, progress.p9
                ].filter(Boolean).length;

                if (completedPuzzles > 0) {
                  allProgress.push({
                    teamId: progress.teamId,
                    teamName: progress.playerName,
                    completionTime: progress.completionTime || (Date.now() - (progress.startTime || Date.now())),
                    puzzlesCompleted: completedPuzzles,
                    lastUpdated: progress.lastUpdated || Date.now()
                  });
                }
              }
            } catch (e) {
              // Skip invalid entries
            }
          }
        }

        // Sort by completion time (fastest first) and take top 3
        const sorted = allProgress
          .sort((a, b) => a.completionTime - b.completionTime)
          .slice(0, 3);

        setTopTeams(sorted);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏅';
    }
  };

  if (isLoading) {
    return (
      <ManorCard className="w-80 h-48">
        <ManorCardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </ManorCardContent>
      </ManorCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-20 right-4 z-50"
    >
      <ManorCard className="w-80 shadow-lg border-primary/20">
        <ManorCardHeader className="pb-3">
          <ManorCardTitle className="flex items-center space-x-2 text-sm">
            <Trophy className="h-4 w-4 text-accent" />
            <span>Top Teams</span>
          </ManorCardTitle>
        </ManorCardHeader>
        <ManorCardContent className="space-y-3">
          {topTeams.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No teams yet</p>
            </div>
          ) : (
            topTeams.map((team, index) => (
              <motion.div
                key={team.teamId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getRankIcon(index)}</span>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {team.teamName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Team {team.teamId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs text-accent">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(team.completionTime)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {team.puzzlesCompleted}/9
                  </Badge>
                </div>
              </motion.div>
            ))
          )}
        </ManorCardContent>
      </ManorCard>
    </motion.div>
  );
};
