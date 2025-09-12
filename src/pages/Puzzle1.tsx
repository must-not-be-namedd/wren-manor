import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sword, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { getGameProgress, saveGameProgress, type GameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

const Puzzle1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Load game progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        // Try to get from localStorage first for player info
        const stored = localStorage.getItem('wren-manor-player');
        let playerName = '';
        let teamId = '';
        
        if (stored) {
          const playerData = JSON.parse(stored);
          playerName = playerData.playerName || '';
          teamId = playerData.teamId || '';
        }
        
        // Only redirect to home if we definitely have no player data
        // Give it a chance to load from URL params or other sources
        if (!playerName || !teamId) {
          console.log('No player data found in localStorage, redirecting to home after delay...');
          // Add a delay to allow for any async loading
          setTimeout(() => {
            navigate('/');
          }, 1000);
          return;
        }
        
        console.log(`Loading progress for ${playerName} (Team: ${teamId})`);
        const gameProgress = await getGameProgress(playerName, teamId);
        setProgress(gameProgress);
        
        // If we have progress but somehow ended up on wrong puzzle, redirect appropriately
        if (gameProgress && gameProgress.p1 && gameProgress.currentPage > 0) {
          console.log('Player already completed puzzle 1, redirecting to next puzzle...');
          navigate('/puzzle-2');
          return;
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        // Don't immediately redirect on error - give user a chance to retry
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, [navigate]);

  const scrambledLetters = ['G', 'R', 'E', 'G', 'D', 'A'];
  const correctAnswer = 'DAGGER';

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Enter Your Answer",
        description: "Please unscramble the letters to reveal the weapon.",
        variant: "destructive",
      });
      return;
    }

    if (!progress) {
      toast({
        title: "Error",
        description: "Game progress not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    setTimeout(async () => {
      if (answer.toUpperCase() === correctAnswer) {
        try {
          console.log('Correct answer! Saving progress and proceeding to next puzzle...');
          const newProgress: GameProgress = {
            ...progress,
            p1: true,
            weapon: 'Dagger',
            currentPage: 1,
          };
          
          console.log('Saving new progress:', newProgress);
          await saveGameProgress(newProgress);
          setProgress(newProgress);
          
          toast({
            title: "🗡️ Weapon Identified: Dagger",
            description: "The murder weapon has been revealed! Proceeding to timeline reconstruction...",
            duration: 3000,
          });
          
          // Ensure localStorage is updated before navigation
          const playerData = {
            playerName: newProgress.playerName,
            teamId: newProgress.teamId
          };
          localStorage.setItem('wren-manor-player', JSON.stringify(playerData));
          
          console.log('Navigating to puzzle 2 in 2 seconds...');
        setTimeout(() => {
          navigate('/puzzle-2');
        }, 2000);
        } catch (error) {
          console.error('Error saving progress:', error);
          toast({
            title: "Error",
            description: "Failed to save progress. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Incorrect Answer",
          description: `"${answer}" is not correct. The letters spell a different weapon. Try again!`,
          variant: "destructive",
        });
      }
      setIsChecking(false);
    }, 1000);
  };

  const handleNextPuzzle = () => {
    navigate('/puzzle-2');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse font-body">Loading puzzle...</div>
        </div>
      </Layout>
    );
  }

  if (!progress?.playerName || !progress?.teamId) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Puzzle Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            Puzzle 1 of 9
          </Badge>
          <h1 className="font-manor text-4xl font-bold text-foreground">
            The Murder Weapon
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Lord Ashcroft lies motionless in his study, blood pooling beneath his still form. 
            The weapon used in this heinous crime lies hidden among these scattered letters. 
            Unscramble them to reveal the instrument of death.
          </p>
        </motion.div>

        {/* Puzzle Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ManorCard className="border-primary/20 shadow-blood">
            <ManorCardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Sword className="h-12 w-12 text-primary animate-pulse-blood" />
              </div>
              <ManorCardTitle>Unscramble the Murder Weapon</ManorCardTitle>
              <ManorCardDescription>
                These letters, found clutched in Lord Ashcroft's cold hand, spell the name of his killer's weapon. 
                Arrange them to reveal the instrument of his demise.
              </ManorCardDescription>
            </ManorCardHeader>
            
            <ManorCardContent className="space-y-6">
              {/* Scrambled Letters */}
              <div className="space-y-3">
                <Label className="text-center block font-manor text-lg">
                  Scrambled Letters:
                </Label>
                <div className="flex justify-center space-x-3">
                  {scrambledLetters.map((letter, index) => (
                    <motion.div
                      key={index}
                      className="w-12 h-12 bg-muted/20 border border-border rounded-lg flex items-center justify-center font-mono text-xl font-bold text-foreground"
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-3">
                <Label htmlFor="weapon" className="font-manor">
                  Your Answer:
                </Label>
                <Input
                  id="weapon"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                  placeholder="Enter the weapon name"
                  className="text-center text-lg font-mono tracking-widest bg-input/50 border-border focus:border-primary"
                  disabled={progress?.p1 || isChecking}
                  maxLength={6}
                />
              </div>


              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {progress?.p1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center space-x-2 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-primary font-semibold">
                        Weapon Identified: {progress?.weapon}
                      </span>
                    </div>
                     <ManorButton onClick={handleNextPuzzle} size="lg" className="w-full">
                      Proceed to Reconstruct the Night
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </ManorButton>
                  </motion.div>
                ) : (
                  <ManorButton 
                    onClick={handleSubmit}
                    disabled={isChecking || !answer.trim()}
                    size="lg"
                    className="w-full"
                  >
                    {isChecking ? 'Checking Answer...' : 'Check Answer'}
                  </ManorButton>
                )}
              </div>
            </ManorCardContent>
          </ManorCard>
        </motion.div>

        {/* Atmospheric Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-detective italic">
            "The storm masks their voices, but the order of events does not change..."
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Puzzle1;