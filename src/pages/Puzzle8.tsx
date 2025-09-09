import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, MousePointer, CheckCircle } from 'lucide-react';
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

const Puzzle8 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showInspectorHelp, setShowInspectorHelp] = useState(false);

  const hiddenClues = [
    {
      id: 'comment-clue',
      location: 'HTML Comment',
      hint: 'Right-click and "View Page Source" or "Inspect Element"',
      found: false
    },
    {
      id: 'invisible-text',
      location: 'Invisible Text',
      hint: 'Select all text on this page (Ctrl+A)',
      found: false
    },
    {
      id: 'hover-clue',
      location: 'Hidden Element',
      hint: 'Hover over different areas of this card',
      found: false
    }
  ];

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        // Get player data from localStorage
        const stored = localStorage.getItem('wren-manor-player');
        let playerName = '';
        let teamId = '';
        
        if (stored) {
          const playerData = JSON.parse(stored);
          playerName = playerData.playerName || '';
          teamId = playerData.teamId || '';
        }
        
        if (!playerName || !teamId) {
          console.log('No player data found, redirecting to home...');
          navigate('/');
          return;
        }
        
        console.log(`Loading progress for ${playerName} (Team: ${teamId})`);
        const gameProgress = await getGameProgress(playerName, teamId);
        setProgress(gameProgress);
        
        // Check if previous puzzles are incomplete
        if (!gameProgress.p1 || !gameProgress.p2 || !gameProgress.p3 || !gameProgress.p4 || !gameProgress.p5 || !gameProgress.p6 || !gameProgress.p7) {
          console.log('Previous puzzles incomplete, redirecting...');
          navigate('/');
          return;
        }

        // If puzzle already completed, redirect to next
        if (gameProgress.p8 && gameProgress.currentPage > 7) {
          console.log('Puzzle 8 already completed, redirecting to next puzzle...');
          navigate('/puzzle9');
          return;
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();

    // Add hidden clues to the page
    const addHiddenElements = () => {
      // Add HTML comment
      const comment = document.createComment(' The murder weapon was hidden in the wine cellar - Marcel had the key ');
      document.head.appendChild(comment);
      
      // Add invisible text
      const invisibleDiv = document.createElement('div');
      invisibleDiv.innerHTML = 'MARCEL PAID TO FRAME THE BUTLER BUT KEPT THE DAGGER AS INSURANCE';
      invisibleDiv.style.color = 'transparent';
      invisibleDiv.style.fontSize = '0px';
      invisibleDiv.style.position = 'absolute';
      invisibleDiv.style.left = '-9999px';
      invisibleDiv.id = 'invisible-evidence';
      document.body.appendChild(invisibleDiv);
    };

    addHiddenElements();

    return () => {
      // Cleanup
      const invisibleEl = document.getElementById('invisible-evidence');
      if (invisibleEl) {
        invisibleEl.remove();
      }
    };
  }, [navigate]);

  const handleClueFound = async (clueId: string) => {
    if (!foundClues.includes(clueId)) {
      const newFoundClues = [...foundClues, clueId];
      setFoundClues(newFoundClues);
      
      toast({
        title: "Hidden Clue Found!",
        description: "You've uncovered a secret piece of evidence.",
        variant: "default",
      });

      if (newFoundClues.length >= 2) {
        const newProgress = { 
          ...progress, 
          p8: true, 
          currentPage: 8 
        };
        await saveGameProgress(newProgress);
        setProgress(newProgress);
        setPuzzleSolved(true);
        
        toast({
          title: "🔍 Manor Secrets Exposed!",
          description: "The hidden evidence reveals the final pieces of the conspiracy. Proceeding to final accusation...",
          duration: 3000,
        });

        // Ensure localStorage is updated before navigation
        const playerData = {
          playerName: newProgress.playerName,
          teamId: newProgress.teamId
        };
        localStorage.setItem('wren-manor-player', JSON.stringify(playerData));

        setTimeout(() => {
          navigate('/puzzle9');
        }, 2000);
      }
    }
  };

  const handleNext = () => {
    navigate('/puzzle9');
  };

  if (loading || !progress) {
    return null;
  }

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
            Puzzle 8 of 9
          </Badge>
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Eye className="h-8 w-8 text-primary animate-pulse-blood" />
            <h1 className="font-manor text-4xl font-bold text-foreground">Inspect the Manor</h1>
            <Search className="h-8 w-8 text-accent animate-glow" />
          </div>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-detective">
            Use browser inspector tools to find hidden clues embedded in this very page. 
            The manor's secrets are closer than you think.
          </p>
        </div>

        {/* Inspector Instructions */}
        <ManorCard>
          <ManorCardHeader>
            <ManorCardTitle className="flex items-center space-x-2">
              <MousePointer className="h-5 w-5 text-primary" />
              <span>Detective Instructions</span>
            </ManorCardTitle>
            <ManorCardDescription>
              Three pieces of evidence are hidden on this page. Use browser developer tools and investigation techniques.
            </ManorCardDescription>
          </ManorCardHeader>
          <ManorCardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">1. Right-click Investigation</h4>
                <p className="text-sm text-muted-foreground">
                  Right-click on this page and select "Inspect Element" or "View Page Source" to find hidden comments.
                </p>
              </div>
              
              <div className="p-3 border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">2. Text Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Select all text on this page (Ctrl+A or Cmd+A) to reveal invisible evidence.
                </p>
              </div>
              
              <div 
                className="p-3 border border-border rounded-lg cursor-pointer hover:bg-primary/5 transition-all relative"
                onMouseEnter={() => handleClueFound('hover-clue')}
                title="Evidence found in the shadows..."
              >
                <h4 className="font-semibold text-foreground mb-2">3. Hover Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Hover your mouse over different elements to uncover hidden tooltips and clues.
                </p>
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-all bg-gradient-blood/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-manor font-bold text-sm">
                    SECRET: The butler was framed - Marcel is the real killer!
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <ManorButton 
                variant="secondary"
                onClick={() => setShowInspectorHelp(!showInspectorHelp)}
              >
                {showInspectorHelp ? 'Hide' : 'Show'} Browser Inspector Help
              </ManorButton>
            </div>
          </ManorCardContent>
        </ManorCard>

        {/* Inspector Help */}
        {showInspectorHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ManorCard className="bg-accent/5 border-accent/20">
              <ManorCardHeader>
                <ManorCardTitle className="text-accent">Browser Inspector Guide</ManorCardTitle>
              </ManorCardHeader>
              <ManorCardContent>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">How to Inspect Elements:</h4>
                    <ol className="space-y-2 text-muted-foreground">
                      <li><strong>1.</strong> Right-click anywhere on the page</li>
                      <li><strong>2.</strong> Select "Inspect Element" or "Inspect"</li>
                      <li><strong>3.</strong> Look for HTML comments that start with {`<!--`}</li>
                      <li><strong>4.</strong> Comments contain hidden evidence!</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Keyboard Shortcuts:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li><kbd className="bg-muted px-1 rounded">F12</kbd> - Open Developer Tools</li>
                      <li><kbd className="bg-muted px-1 rounded">Ctrl+A</kbd> - Select All Text</li>
                      <li><kbd className="bg-muted px-1 rounded">Ctrl+U</kbd> - View Page Source</li>
                      <li><kbd className="bg-muted px-1 rounded">Ctrl+Shift+I</kbd> - Inspect Element</li>
                    </ul>
                  </div>
                </div>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        )}

        {/* Progress Tracker */}
        <ManorCard>
          <ManorCardHeader>
            <ManorCardTitle>Evidence Discovery Progress</ManorCardTitle>
            <ManorCardDescription>
              Find {3 - foundClues.length} more hidden clue(s) to proceed
            </ManorCardDescription>
          </ManorCardHeader>
          <ManorCardContent>
            <div className="space-y-3">
              {hiddenClues.map(clue => (
                <div
                  key={clue.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    foundClues.includes(clue.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-foreground">{clue.location}</div>
                    <div className="text-sm text-muted-foreground">{clue.hint}</div>
                  </div>
                  <div>
                    {foundClues.includes(clue.id) ? (
                      <Badge variant="default" className="bg-primary">Found</Badge>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Hidden clue triggers */}
            <div className="mt-4">
              <ManorButton
                variant="outline"
                size="sm"
                onClick={() => handleClueFound('comment-clue')}
                className="mr-2"
              >
                Found HTML Comment
              </ManorButton>
              <ManorButton
                variant="outline"
                size="sm"
                onClick={() => handleClueFound('invisible-text')}
              >
                Found Invisible Text
              </ManorButton>
            </div>
          </ManorCardContent>
        </ManorCard>

        {/* Hidden text for selection - this will be invisible until selected */}
        <div 
          style={{ 
            color: 'transparent',
            userSelect: 'text',
            fontSize: '1px',
            lineHeight: '1px'
          }}
          onMouseUp={() => {
            // Check if text is selected
            const selection = window.getSelection();
            if (selection && selection.toString().includes('MARCEL PAID TO FRAME')) {
              handleClueFound('invisible-text');
            }
          }}
        >
          MARCEL PAID TO FRAME THE BUTLER BUT KEPT THE DAGGER AS INSURANCE AGAINST BLACKMAIL
        </div>

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
                  Hidden Secrets Exposed!
                </h3>
                <p className="text-primary-foreground/90 mb-6">
                  The concealed evidence reveals the full conspiracy. Marcel was paid to frame Charles, 
                  but kept the murder weapon as leverage. Time for the final confrontation!
                </p>
                <ManorButton 
                  onClick={handleNext}
                  variant="secondary"
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Final Accusation
                </ManorButton>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Puzzle8;