import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skull, Crown, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGameProgress, type GameProgress } from '@/lib/gameState';
import { LeaderboardWidget } from '@/components/LeaderboardWidget';

interface LayoutProps {
  children: ReactNode;
  showProgress?: boolean;
}

export const Layout = ({ children, showProgress = true }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const gameProgress = await getGameProgress('', '');
        setProgress(gameProgress);
      } catch (error) {
        console.error('Error loading progress:', error);
        setProgress(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (showProgress) {
      loadProgress();
    } else {
      setIsLoading(false);
    }
  }, [showProgress]);

  const progressItems = [
    { completed: progress?.p1 || false, label: 'Weapon', path: '/puzzle-1' },
    { completed: progress?.p2 || false, label: 'Timeline', path: '/puzzle-2' },
    { completed: progress?.p3 || false, label: 'Alibis', path: '/puzzle-3' },
    { completed: progress?.p4 || false, label: 'Code', path: '/puzzle-4' },
    { completed: progress?.p5 || false, label: 'Cipher', path: '/puzzle-5' },
    { completed: progress?.p6 || false, label: 'Evidence', path: '/puzzle-6' },
    { completed: progress?.p7 || false, label: 'Verdict', path: '/puzzle-7' },
    { completed: progress?.p8 || false, label: 'Inspect', path: '/puzzle-8' },
    { completed: progress?.p9 || false, label: 'Final', path: '/puzzle-9' }
  ];

  return (
    <div className="min-h-screen bg-gradient-manor">
      {/* Header */}
      <header className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Skull className="h-8 w-8 text-primary animate-pulse-blood" />
                <Crown className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="font-mystery text-2xl font-bold text-foreground">
                  Wren Manor
                </h1>
                <p className="text-sm text-muted-foreground font-detective">
                  A Murder Mystery
                </p>
              </div>
            </motion.div>

            {showProgress && progress?.playerName && !isLoading && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground font-detective">
                  <Clock className="h-4 w-4" />
                  <span>Team: {progress.teamId}</span>
                </div>
                <div className="hidden lg:flex items-center space-x-1">
                  {progressItems.map((item, index) => {
                    // A puzzle is accessible if the previous puzzle is completed (or it's the first puzzle)
                    const isAccessible = index === 0 || progressItems[index - 1]?.completed;
                    
                    return (
                      <motion.button
                        key={item.label}
                        onClick={() => isAccessible && navigate(item.path)}
                        className={`px-2 py-1 rounded-md text-xs font-medium font-detective transition-manor ${
                          item.completed 
                            ? 'bg-primary/20 text-primary border border-primary/30' 
                            : isAccessible 
                              ? 'bg-accent/20 text-accent border border-accent/30'
                              : 'bg-muted/20 text-muted-foreground'
                        } ${isAccessible ? 'cursor-pointer hover:bg-primary/30' : 'cursor-not-allowed'}`}
                        whileHover={isAccessible ? { scale: 1.05 } : {}}
                      >
                        {item.label} {item.completed ? '✓' : isAccessible ? '•' : '🔒'}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="md:hidden lg:hidden flex items-center">
                  <span className="text-xs text-muted-foreground font-detective">
                    Progress: {progressItems.filter(p => p.completed).length}/{progressItems.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto w-full max-w-6xl px-4 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Leaderboard Widget */}
      <LeaderboardWidget />

      {/* Atmospheric Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-blood" />
      </div>
    </div>
  );
};