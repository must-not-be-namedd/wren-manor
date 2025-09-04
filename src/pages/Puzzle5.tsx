import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, CheckCircle } from 'lucide-react';
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

const Puzzle5 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const progress = getGameProgress();
  
  const [selectedContradictions, setSelectedContradictions] = useState<string[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  const dialogues = [
    {
      id: 'butler-time',
      suspect: 'Charles (Butler)',
      statement: '"The lights went out at 8:10 PM sharp. I was in the pantry organizing wine bottles."',
      category: 'timing'
    },
    {
      id: 'maid-sight',
      suspect: 'Margaret (Maid)',
      statement: '"I saw the butler walking past the library at 8:15 PM. He looked quite nervous."',
      category: 'witness'
    },
    {
      id: 'chef-kitchen',
      suspect: 'Marcel (Chef)',
      statement: '"I never left the kitchen after 7:30 PM. The roast needed constant attention."',
      category: 'alibi'
    },
    {
      id: 'guest-chef',
      suspect: 'Lady Victoria (Guest)',
      statement: '"I saw Marcel in the garden around 8:20 PM. He was washing something at the fountain."',
      category: 'witness'
    }
  ];

  const correctContradictions = ['butler-time|maid-sight', 'chef-kitchen|guest-chef'];

  useEffect(() => {
    if (!progress.p4) {
      navigate('/');
      return;
    }
  }, [progress, navigate]);

  const handleContradictionToggle = (contradiction: string) => {
    setSelectedContradictions(prev => {
      if (prev.includes(contradiction)) {
        return prev.filter(c => c !== contradiction);
      } else {
        return [...prev, contradiction];
      }
    });
  };

  const handleSubmit = () => {
    const found = selectedContradictions.filter(c => correctContradictions.includes(c));
    
    if (found.length >= 2) {
      const newProgress = { ...progress, p5: true };
      saveGameProgress(newProgress);
      setPuzzleSolved(true);
      
      toast({
        title: "Contradictions Exposed!",
        description: "You've identified the web of lies. Marcel and Charles are both lying.",
        variant: "default",
      });
    } else {
      toast({
        title: "Insufficient Evidence",
        description: "You need to identify more contradictions to expose the lies.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    navigate('/puzzle6');
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
            <MessageSquare className="h-8 w-8 text-primary animate-pulse-blood" />
            <h1 className="font-manor text-4xl font-bold text-foreground">Web of Lies</h1>
            <Search className="h-8 w-8 text-accent animate-glow" />
          </div>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The suspects' statements contradict each other. Identify the lies by finding 
            contradictory statements that cannot both be true.
          </p>
        </div>

        <div className="grid gap-4">
          {dialogues.map((dialogue) => (
            <ManorCard key={dialogue.id} className="transition-manor hover:shadow-blood">
              <ManorCardHeader>
                <div className="flex items-center justify-between">
                  <ManorCardTitle className="text-lg">
                    {dialogue.suspect}
                  </ManorCardTitle>
                  <Badge variant="secondary" className="capitalize">
                    {dialogue.category}
                  </Badge>
                </div>
              </ManorCardHeader>
              <ManorCardContent>
                <p className="text-foreground italic text-lg leading-relaxed">
                  {dialogue.statement}
                </p>
              </ManorCardContent>
            </ManorCard>
          ))}
        </div>

        <ManorCard className="bg-accent/5 border-accent/20">
          <ManorCardHeader>
            <ManorCardTitle className="text-center text-accent">
              Identify Contradictions
            </ManorCardTitle>
          </ManorCardHeader>
          <ManorCardContent className="space-y-4">
            <div className="grid gap-3">
              {correctContradictions.map((contradiction, index) => (
                <div
                  key={contradiction}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedContradictions.includes(contradiction)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-accent'
                  }`}
                  onClick={() => handleContradictionToggle(contradiction)}
                >
                  <div className="text-sm text-muted-foreground">Contradiction {index + 1}:</div>
                  <div className="text-foreground">
                    {contradiction === 'butler-time|maid-sight' && 
                      "Butler claims lights out at 8:10, but maid saw him at 8:15 (impossible in darkness)"
                    }
                    {contradiction === 'chef-kitchen|guest-chef' && 
                      "Chef claims never left kitchen, but was seen in garden at 8:20"
                    }
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-4">
              <ManorButton onClick={handleSubmit} disabled={selectedContradictions.length < 2}>
                Expose the Lies
              </ManorButton>
            </div>
          </ManorCardContent>
        </ManorCard>

        {puzzleSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ManorCard className="bg-gradient-blood border-primary text-center">
              <ManorCardContent className="pt-6">
                <CheckCircle className="h-16 w-16 text-primary-foreground mx-auto mb-4" />
                <h3 className="font-manor text-2xl text-primary-foreground mb-2">
                  Deceptions Unraveled!
                </h3>
                <p className="text-primary-foreground/90 mb-6">
                  The contradictions expose Marcel the Chef and Charles the Butler as liars. 
                  Their alibis crumble under scrutiny.
                </p>
                <ManorButton 
                  onClick={handleNext}
                  variant="secondary"
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Query the Database
                </ManorButton>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Puzzle5;