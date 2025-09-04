import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gavel, Crown, Key, Trophy } from 'lucide-react';
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

const Puzzle9 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const progress = getGameProgress();
  
  const [finalCode, setFinalCode] = useState('');
  const [accusation, setAccusation] = useState('');
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showAccusationForm, setShowAccusationForm] = useState(false);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);

  const encryptedFinalCode = 'NBSDFM XJUI UIF EBHHFS JO UIF XJOF DFMMBS';
  const correctDecryption = 'MARCEL WITH THE DAGGER IN THE WINE CELLAR';
  const correctAccusation = 'MARCEL WITH THE DAGGER IN THE WINE CELLAR';

  useEffect(() => {
    if (!progress.p8) {
      navigate('/');
      return;
    }
  }, [progress, navigate]);

  const caesarCipherDecode = (text: string, shift: number): string => {
    return text.replace(/[A-Z]/g, (char) => {
      const charCode = char.charCodeAt(0);
      const shifted = ((charCode - 65 - shift + 26) % 26) + 65;
      return String.fromCharCode(shifted);
    });
  };

  const handleCodeSubmit = () => {
    const userCode = finalCode.trim().toUpperCase();
    
    if (userCode === correctDecryption) {
      setShowAccusationForm(true);
      toast({
        title: "Final Code Cracked!",
        description: "Now make your formal accusation to solve the murder mystery.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect Code",
        description: "The cipher remains unsolved. Check your decryption method.",
        variant: "destructive",
      });
    }
  };

  const handleFinalAccusation = () => {
    const userAccusation = accusation.trim().toUpperCase();
    
    if (userAccusation === correctAccusation) {
      const newProgress = { 
        ...progress, 
        p9: true,
        completionTime: Date.now() - progress.startTime,
        killer: 'MARCEL'
      };
      saveGameProgress(newProgress);
      setPuzzleSolved(true);
      setShowVictoryAnimation(true);
      
      toast({
        title: "Murder Solved!",
        description: "You've successfully unmasked the killer of Wren Manor!",
        variant: "default",
      });

      // Navigate to results after victory animation
      setTimeout(() => {
        navigate('/results');
      }, 3000);
    } else {
      toast({
        title: "Incorrect Accusation",
        description: "Your accusation doesn't match the evidence. Review the clues carefully.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Gavel className="h-8 w-8 text-primary animate-pulse-blood" />
            <h1 className="font-manor text-4xl font-bold text-foreground">Final Judgment</h1>
            <Crown className="h-8 w-8 text-accent animate-glow" />
          </div>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The investigation reaches its climax. Decode the final message and make your 
            formal accusation to expose the killer of Wren Manor.
          </p>
        </div>

        {/* Evidence Summary */}
        <ManorCard className="bg-accent/5 border-accent/20">
          <ManorCardHeader>
            <ManorCardTitle className="text-accent">Investigation Summary</ManorCardTitle>
            <ManorCardDescription>
              All evidence points to one conclusion
            </ManorCardDescription>
          </ManorCardHeader>
          <ManorCardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Physical Evidence:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Weapon: Antique dagger from the collection</li>
                  <li>• Location: Wine cellar (key holder access)</li>
                  <li>• Motive: £15,000 suspicious bonus payment</li>
                  <li>• Opportunity: Kitchen access during blackout</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Testimony Analysis:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Marcel contradicted about location</li>
                  <li>• Charles was being framed (false evidence)</li>
                  <li>• Hidden conspiracy revealed in manor documents</li>
                  <li>• Timeline confirms Marcel's guilt</li>
                </ul>
              </div>
            </div>
          </ManorCardContent>
        </ManorCard>

        {/* Final Cipher */}
        <ManorCard>
          <ManorCardHeader>
            <ManorCardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <span>The Final Cipher</span>
            </ManorCardTitle>
            <ManorCardDescription>
              Decode this message to reveal the killer's identity and method
            </ManorCardDescription>
          </ManorCardHeader>
          <ManorCardContent className="space-y-4">
            <div className="p-6 bg-gradient-blood/10 border border-primary/30 rounded-lg font-mono text-xl text-center">
              {encryptedFinalCode}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <Badge variant="outline" className="mb-2">Caesar Cipher • Shift -1</Badge>
              <p>This final encryption reveals WHO killed WHERE with WHAT</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="finalCode" className="text-foreground">Decoded Message:</Label>
              <Input
                id="finalCode"
                value={finalCode}
                onChange={(e) => setFinalCode(e.target.value.toUpperCase())}
                placeholder="Enter the complete decoded solution"
                className="bg-input/50 border-border focus:border-primary"
                disabled={showAccusationForm}
              />
            </div>
            
            <div className="text-center">
              <ManorButton 
                onClick={handleCodeSubmit}
                disabled={showAccusationForm || !finalCode.trim()}
              >
                Decode Final Message
              </ManorButton>
            </div>
          </ManorCardContent>
        </ManorCard>

        {/* Final Accusation Form */}
        {showAccusationForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ManorCard className="bg-primary/5 border-primary/30">
              <ManorCardHeader>
                <ManorCardTitle className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  <span>Formal Accusation</span>
                </ManorCardTitle>
                <ManorCardDescription>
                  State your final accusation in the exact format: "PERSON with the WEAPON in the LOCATION"
                </ManorCardDescription>
              </ManorCardHeader>
              <ManorCardContent className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Required Format:</h4>
                  <p className="text-muted-foreground italic">
                    "[KILLER'S NAME] WITH THE [WEAPON] IN THE [LOCATION]"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Example: "MARCEL WITH THE DAGGER IN THE WINE CELLAR"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accusation" className="text-foreground">Your Final Accusation:</Label>
                  <Input
                    id="accusation"
                    value={accusation}
                    onChange={(e) => setAccusation(e.target.value.toUpperCase())}
                    placeholder="WHO WITH THE WHAT IN THE WHERE"
                    className="bg-input/50 border-border focus:border-primary text-lg"
                  />
                </div>
                
                <div className="text-center">
                  <ManorButton 
                    onClick={handleFinalAccusation}
                    disabled={!accusation.trim()}
                    size="lg"
                    className="bg-gradient-blood hover:shadow-blood"
                  >
                    Make Final Accusation
                  </ManorButton>
                </div>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        )}

        {/* Victory Animation */}
        {showVictoryAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-background/95 flex items-center justify-center z-50"
          >
            <ManorCard className="max-w-2xl mx-auto text-center bg-gradient-blood border-none shadow-manor">
              <ManorCardContent className="pt-8 pb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Trophy className="h-24 w-24 text-accent" />
                </motion.div>
                
                <h2 className="font-manor text-4xl font-bold text-primary-foreground mb-4">
                  Mystery Solved!
                </h2>
                
                <div className="space-y-4 text-primary-foreground/90">
                  <p className="text-xl">
                    Marcel the Chef committed the murder in the wine cellar with the antique dagger.
                  </p>
                  <p className="text-lg">
                    Paid £15,000 to frame Charles the Butler, but his web of lies unraveled under your investigation.
                  </p>
                  <p className="text-base italic">
                    Justice prevails at Wren Manor...
                  </p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-6"
                >
                  <Badge variant="secondary" className="bg-primary-foreground text-primary text-lg px-4 py-2">
                    Case Closed
                  </Badge>
                </motion.div>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Puzzle9;