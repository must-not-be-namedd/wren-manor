import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Key, CheckCircle } from 'lucide-react';
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

const Puzzle7 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const progress = getGameProgress();
  
  const [cipherAnswer, setCipherAnswer] = useState('');
  const [collectedClues, setCollectedClues] = useState('');
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showClueEntry, setShowClueEntry] = useState(false);

  const encryptedMessage = 'SFDPMMFDU BMM UIF DMVFT';
  const correctDecryption = 'RECOLLECT ALL THE CLUES';

  useEffect(() => {
    if (!progress.p6) {
      navigate('/');
      return;
    }
  }, [progress, navigate]);

  const handleCipherSubmit = () => {
    if (cipherAnswer.trim().toUpperCase() === correctDecryption) {
      setShowClueEntry(true);
      toast({
        title: "Cipher Decoded!",
        description: "Now enter all the clues from your investigation.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect Decryption",
        description: "Try Caesar cipher with shift -1.",
        variant: "destructive",
      });
    }
  };

  const handleCluesSubmit = () => {
    const userClues = collectedClues.toUpperCase();
    const expectedClues = ['DAGGER', 'MARCEL', 'CHEF', 'BONUS'];
    const matchCount = expectedClues.filter(clue => userClues.includes(clue)).length;
    
    if (matchCount >= 3) {
      const newProgress = { ...progress, p7: true };
      saveGameProgress(newProgress);
      setPuzzleSolved(true);
      
      toast({
        title: "Pattern Complete!",
        description: "All evidence points to Marcel the Chef!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incomplete Evidence",
        description: "Include key clues: DAGGER, MARCEL, CHEF, BONUS",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    navigate('/puzzle8');
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
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            Puzzle 7 of 9
          </Badge>
          <h1 className="font-manor text-4xl font-bold text-foreground">Pattern Decryption</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-detective">
            Decrypt the final cipher and combine all clues to reveal the complete truth.
          </p>
        </div>

        <ManorCard>
          <ManorCardHeader>
            <ManorCardTitle>Encrypted Message</ManorCardTitle>
          </ManorCardHeader>
          <ManorCardContent className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg font-mono text-lg text-center">
              {encryptedMessage}
            </div>
            
            <Input
              value={cipherAnswer}
              onChange={(e) => setCipherAnswer(e.target.value.toUpperCase())}
              placeholder="Enter decoded message"
              disabled={showClueEntry}
            />
            
            <ManorButton onClick={handleCipherSubmit} disabled={showClueEntry}>
              Decrypt Message
            </ManorButton>
          </ManorCardContent>
        </ManorCard>

        {showClueEntry && (
          <ManorCard>
            <ManorCardHeader>
              <ManorCardTitle>Collect All Evidence</ManorCardTitle>
            </ManorCardHeader>
            <ManorCardContent className="space-y-4">
              <Textarea
                value={collectedClues}
                onChange={(e) => setCollectedClues(e.target.value)}
                placeholder="Enter all clues: DAGGER, MARCEL, CHEF, BONUS..."
                rows={4}
              />
              
              <ManorButton onClick={handleCluesSubmit}>
                Assemble Evidence
              </ManorButton>
            </ManorCardContent>
          </ManorCard>
        )}

        {puzzleSolved && (
          <ManorCard className="bg-gradient-blood border-primary text-center">
            <ManorCardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-primary-foreground mx-auto mb-4" />
              <h3 className="font-manor text-2xl text-primary-foreground mb-2">
                Pattern Decoded!
              </h3>
              <ManorButton 
                onClick={handleNext}
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary"
              >
                Inspect the Manor
              </ManorButton>
            </ManorCardContent>
          </ManorCard>
        )}
      </motion.div>
    </Layout>
  );
};

export default Puzzle7;