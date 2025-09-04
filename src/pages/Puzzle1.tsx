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
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

const Puzzle1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const progress = getGameProgress();
  
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Redirect if no player info
  useEffect(() => {
    if (!progress.playerName || !progress.teamId) {
      navigate('/');
      return;
    }
  }, [progress.playerName, progress.teamId, navigate]);

  const scrambledLetters = ['D', 'A', 'G', 'G', 'E', 'R'];
  const correctAnswer = 'DAGGER';

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: "Enter Your Answer",
        description: "Please unscramble the letters to reveal the weapon.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      if (answer.toUpperCase() === correctAnswer) {
        const newProgress = {
          ...progress,
          p1: true,
          weapon: 'Dagger',
          currentPage: 1,
        };
        
        saveGameProgress(newProgress);
        
        toast({
          title: "Weapon Identified: Dagger",
          description: "The murder weapon has been revealed! Proceed to reconstruct the timeline.",
        });
        
        setTimeout(() => {
          navigate('/puzzle2');
        }, 2000);
      } else {
        toast({
          title: "Incorrect Answer",
          description: "The letters don't form the correct weapon. Try again.",
          variant: "destructive",
        });
        setIsChecking(false);
      }
    }, 1000);
  };

  const handleNextPuzzle = () => {
    navigate('/puzzle2');
  };

  if (!progress.playerName || !progress.teamId) {
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
            Puzzle 1 of 3
          </Badge>
          <h1 className="font-manor text-4xl font-bold text-foreground">
            The Weapon Unveiled
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            A victim lies still in the grand parlor of Wren Manor. The killer's tool remains 
            hidden among scattered clues. Unscramble the letters to reveal the murder weapon.
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
                The letters below spell out the weapon used in this heinous crime. 
                Arrange them to reveal the truth.
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
                  disabled={progress.p1 || isChecking}
                  maxLength={6}
                />
              </div>

              {/* Hint Section */}
              <div className="space-y-3">
                <ManorButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full"
                  disabled={progress.p1}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </ManorButton>
                
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-accent/10 border border-accent/20 rounded-lg"
                  >
                    <p className="text-sm text-muted-foreground text-center font-body">
                      💡 This weapon has a sharp blade and a handle, often used by assassins 
                      and rogues throughout history. It rhymes with "stagger."
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {progress.p1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center space-x-2 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-primary font-semibold">
                        Weapon Identified: {progress.weapon}
                      </span>
                    </div>
                    <ManorButton onClick={handleNextPuzzle} size="lg" className="w-full">
                      Proceed to Timeline Reconstruction
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
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-body italic">
            "The shadows whisper secrets, but only the keen-eyed detective can hear their truths..."
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Puzzle1;