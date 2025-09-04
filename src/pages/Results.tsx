import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Badge } from '@/components/ui/badge';
import { Crown, Skull, Clock, Users, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { getGameProgress, resetGameProgress } from '@/lib/gameState';

const Results = () => {
  const navigate = useNavigate();
  const progress = getGameProgress();

  // Redirect if not authorized or puzzles incomplete
  useEffect(() => {
    if (!progress.playerName || !progress.teamId) {
      navigate('/');
      return;
    }
    if (!progress.p1 || !progress.p2 || !progress.p3) {
      navigate('/');
      return;
    }
  }, [progress, navigate]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handlePlayAgain = () => {
    resetGameProgress();
    navigate('/');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  if (!progress.playerName || !progress.teamId || !progress.p1 || !progress.p2 || !progress.p3) {
    return null;
  }

  const completionTime = progress.completionTime || 0;
  const totalTime = completionTime ? formatTime(completionTime) : 'Still investigating...';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Victory Header */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <Crown className="h-20 w-20 text-accent animate-glow" />
              <Skull className="h-10 w-10 text-primary absolute bottom-0 right-0 animate-pulse-blood" />
            </div>
          </div>
          
          <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10 text-lg px-4 py-2">
            Case Closed
          </Badge>
          
          <h1 className="font-manor text-5xl md:text-6xl font-bold text-foreground mb-4">
            Mystery Solved!
          </h1>
          
          <motion.p 
            className="text-xl text-accent max-w-2xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Congratulations, Detective {progress.playerName}! You have successfully 
            unraveled the dark secrets of Wren Manor.
          </motion.p>
        </motion.div>

        {/* Investigation Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <ManorCard className="border-primary/20 shadow-blood">
            <ManorCardHeader className="text-center">
              <ManorCardTitle className="text-2xl flex items-center justify-center space-x-2">
                <Skull className="h-8 w-8 text-primary" />
                <span>Investigation Summary</span>
              </ManorCardTitle>
              <ManorCardDescription>
                Your complete findings from the Wren Manor investigation
              </ManorCardDescription>
            </ManorCardHeader>
            
            <ManorCardContent className="space-y-6">
              {/* Evidence Collected */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-2xl mb-2">🗡️</div>
                  <h3 className="font-manor font-semibold text-foreground mb-1">Murder Weapon</h3>
                  <p className="text-primary font-bold">{progress.weapon}</p>
                  {progress.p1 && <Badge variant="outline" className="mt-2 text-green-500 border-green-500/30">✓ Identified</Badge>}
                </div>
                
                <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-2xl mb-2">⏰</div>
                  <h3 className="font-manor font-semibold text-foreground mb-1">Time Window</h3>
                  <p className="text-primary font-bold">8:20 - 8:45 PM</p>
                  {progress.p2 && <Badge variant="outline" className="mt-2 text-green-500 border-green-500/30">✓ Reconstructed</Badge>}
                </div>
                
                <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-manor font-semibold text-foreground mb-1">Suspects Cleared</h3>
                  <p className="text-primary font-bold">2 of 5</p>
                  {progress.p3 && <Badge variant="outline" className="mt-2 text-green-500 border-green-500/30">✓ Verified</Badge>}
                </div>
              </div>

              {/* Final Deduction */}
              <div className="p-6 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="font-manor text-xl font-semibold text-foreground mb-3 text-center">
                  Final Deduction
                </h3>
                <p className="text-muted-foreground leading-relaxed font-body text-center">
                  Through careful investigation, you have eliminated <strong className="text-green-500">Eleanor (Maid)</strong> and{' '}
                  <strong className="text-green-500">Reginald (Butler)</strong> from suspicion. Their verified alibis 
                  place them away from the scene during the critical murder window. The remaining suspects—
                  <strong className="text-primary"> Victoria, Harrison, and Marcel</strong>—await further investigation.
                </p>
              </div>

              {/* Performance Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-card/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <span className="font-medium text-foreground">Investigation Time</span>
                  </div>
                  <span className="font-bold text-accent">{totalTime}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-card/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span className="font-medium text-foreground">Team ID</span>
                  </div>
                  <span className="font-bold text-accent">{progress.teamId}</span>
                </div>
              </div>
            </ManorCardContent>
          </ManorCard>
        </motion.div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center"
        >
          <ManorCard className="max-w-md mx-auto bg-gradient-candlelight/10 border-accent/30">
            <ManorCardContent className="text-center p-8">
              <Trophy className="h-16 w-16 text-accent mx-auto mb-4 animate-glow" />
              <h3 className="font-manor text-2xl font-bold text-foreground mb-2">
                Master Detective
              </h3>
              <p className="text-muted-foreground font-body">
                You have successfully completed all three puzzles and uncovered 
                the truth behind the murder at Wren Manor.
              </p>
            </ManorCardContent>
          </ManorCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <ManorButton 
            variant="candlelight"
            onClick={handleViewLeaderboard}
            size="lg"
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Leaderboard
          </ManorButton>
          
          <ManorButton 
            variant="secondary"
            onClick={handlePlayAgain}
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </ManorButton>
        </motion.div>

        {/* Atmospheric Conclusion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-center space-y-4 pt-8"
        >
          <div className="w-24 h-0.5 bg-gradient-blood mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto font-body italic leading-relaxed">
            "The shadows of Wren Manor have revealed their secrets to you, Detective. 
            Though this case is closed, the echoes of mystery will forever linger 
            in these hallowed halls..."
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground pt-4">
            <Skull className="h-4 w-4" />
            <span>Case File: Wren Manor Murder Mystery</span>
            <Crown className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Results;