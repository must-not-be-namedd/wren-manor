import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Clock, Users, Crown, ArrowLeft, RefreshCw } from 'lucide-react';
import { getLeaderboard, getGameProgress, type LeaderboardEntry } from '@/lib/gameState';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentProgress = getGameProgress();

  const loadLeaderboard = () => {
    const data = getLeaderboard();
    setLeaderboard(data);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const refreshLeaderboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadLeaderboard();
      setIsRefreshing(false);
    }, 500);
  };

  const formatTime = (milliseconds: number) => {
    if (milliseconds === 0) return 'In Progress';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getProgressBadge = (progress: number) => {
    if (progress === 3) return { text: 'Complete', variant: 'default' as const, color: 'text-green-500' };
    if (progress === 2) return { text: 'Advanced', variant: 'secondary' as const, color: 'text-yellow-500' };
    if (progress === 1) return { text: 'Beginner', variant: 'outline' as const, color: 'text-blue-500' };
    return { text: 'Starting', variant: 'outline' as const, color: 'text-muted-foreground' };
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-accent animate-glow" />;
    if (index === 1) return <Medal className="h-6 w-6 text-yellow-500" />;
    if (index === 2) return <Medal className="h-6 w-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const isCurrentPlayer = (entry: LeaderboardEntry) => {
    return entry.playerName === currentProgress.playerName && entry.teamId === currentProgress.teamId;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Trophy className="h-12 w-12 text-accent animate-glow" />
          </div>
          
          <h1 className="font-manor text-4xl md:text-5xl font-bold text-foreground">
            Investigation Leaderboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Track the progress of all investigators attempting to solve the mystery at Wren Manor. 
            Rankings are based on progress completed and total completion time.
          </p>
        </motion.div>

        {/* Leaderboard Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <ManorButton
            variant="secondary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </ManorButton>

          <ManorButton
            variant="outline"
            onClick={refreshLeaderboard}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </ManorButton>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="grid md:grid-cols-3 gap-4">
            <ManorCard className="text-center">
              <ManorCardContent className="p-4">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{leaderboard.length}</div>
                <div className="text-sm text-muted-foreground">Total Investigators</div>
              </ManorCardContent>
            </ManorCard>

            <ManorCard className="text-center">
              <ManorCardContent className="p-4">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {leaderboard.filter(entry => entry.currentProgress === 3).length}
                </div>
                <div className="text-sm text-muted-foreground">Cases Solved</div>
              </ManorCardContent>
            </ManorCard>

            <ManorCard className="text-center">
              <ManorCardContent className="p-4">
                <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {leaderboard.length > 0 && leaderboard[0].completionTime 
                    ? formatTime(leaderboard[0].completionTime)
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Best Time</div>
              </ManorCardContent>
            </ManorCard>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ManorCard className="border-primary/20">
            <ManorCardHeader>
              <ManorCardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span>Rankings</span>
              </ManorCardTitle>
              <ManorCardDescription>
                Investigators ranked by progress and completion time
              </ManorCardDescription>
            </ManorCardHeader>
            
            <ManorCardContent className="p-0">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-body">
                    No investigators have started their journey yet. Be the first to enter Wren Manor!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-6">
                  {leaderboard.map((entry, index) => {
                    const progressBadge = getProgressBadge(entry.currentProgress);
                    const isCurrentUser = isCurrentPlayer(entry);
                    
                    return (
                      <motion.div
                        key={`${entry.playerName}-${entry.teamId}-${entry.timestamp}`}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-manor ${
                          isCurrentUser 
                            ? 'bg-primary/10 border-primary/30 shadow-blood' 
                            : 'bg-card/30 border-border hover:bg-card/50'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12">
                            {getRankIcon(index)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                                {entry.playerName}
                              </h3>
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs px-2 py-0 text-primary border-primary/30">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-sm text-muted-foreground">
                                Team: {entry.teamId}
                              </span>
                              <Badge variant={progressBadge.variant} className={`text-xs ${progressBadge.color}`}>
                                {progressBadge.text}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {entry.currentProgress}/3 Puzzles
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(entry.completionTime)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ManorCardContent>
          </ManorCard>
        </motion.div>

        {/* Call to Action */}
        {currentProgress.playerName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center"
          >
            <ManorCard className="max-w-md mx-auto bg-accent/5 border-accent/20">
              <ManorCardContent className="text-center p-6">
                <Crown className="h-10 w-10 text-accent mx-auto mb-3 animate-glow" />
                <h3 className="font-manor text-lg font-semibold text-foreground mb-2">
                  Continue Your Investigation
                </h3>
                <p className="text-sm text-muted-foreground mb-4 font-body">
                  Return to Wren Manor and climb the leaderboard by solving more puzzles.
                </p>
                <ManorButton onClick={() => navigate('/')} variant="candlelight">
                  Return to Manor
                </ManorButton>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center pt-8"
        >
          <div className="w-24 h-0.5 bg-gradient-blood mx-auto mb-4" />
          <p className="text-xs text-muted-foreground font-body italic">
            "In the game of mystery, every second counts, and every clue matters..."
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Leaderboard;