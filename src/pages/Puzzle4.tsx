import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ManorCard, ManorCardHeader, ManorCardTitle, ManorCardContent, ManorCardFooter } from "@/components/ui/manor-card";
import { ManorButton } from "@/components/ui/manor-button";
import { toast } from "@/hooks/use-toast";
import { getGameProgress, saveGameProgress } from "@/lib/gameState";
import { Brain, Target, CheckCircle2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';

const Puzzle4 = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKiller, setSelectedKiller] = useState<string>("");
  const [selectedWeapon, setSelectedWeapon] = useState<string>("");
  const [showHints, setShowHints] = useState(false);
  const [solved, setSolved] = useState(false);

  // Load game progress
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
        setSolved(gameProgress.p4);
        
        // Check if previous puzzles are incomplete
        if (!gameProgress.p1 || !gameProgress.p2 || !gameProgress.p3) {
          console.log('Previous puzzles incomplete, redirecting...');
          if (!gameProgress.p1) navigate('/puzzle1');
          else if (!gameProgress.p2) navigate('/puzzle2');
          else navigate('/puzzle3');
          return;
        }

        // If puzzle already completed, redirect to next
        if (gameProgress.p4 && gameProgress.currentPage > 3) {
          console.log('Puzzle 4 already completed, redirecting to next puzzle...');
          navigate('/puzzle5');
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
  }, [navigate]);

  const suspects = ["Eleanor (Maid)", "Reginald (Butler)", "Marcel (Chef)", "Victoria (Guest)", "Harrison (Guest)"];
  const weapons = ["Dagger", "Rope", "Candlestick", "Poison", "Blunt Object"];

  const clues = [
    "If the killer had access to the kitchen, the weapon was not a rope.",
    "The chef was seen near the kitchen at the time of the murder.",
    "Someone with kitchen access used a sharp object.",
    "The killer works in the manor and knows the victim's routine.",
    "The weapon found matches the one from the first puzzle."
  ];

  const hints = [
    "Think about who has regular access to the kitchen.",
    "Consider what weapon was revealed in the first puzzle.",
    "The killer must be someone who works at the manor.",
    "Connect the clues logically - if A then B, if B then C..."
  ];

  const handleSubmit = async () => {
    // Correct answer: Marcel (Chef) with Dagger
    if (selectedKiller === "Marcel (Chef)" && selectedWeapon === "Dagger") {
      const newProgress = {
        ...progress,
        p4: true,
        killer: "Marcel",
        currentPage: 4
      };
      
      setProgress(newProgress);
      await saveGameProgress(newProgress);
      setSolved(true);
      
      toast({
        title: "🔍 Deduction Complete!",
        description: "Marcel the Chef used the dagger! Proceeding to contradiction analysis...",
        duration: 3000,
      });

      // Ensure localStorage is updated before navigation
      const playerData = {
        playerName: newProgress.playerName,
        teamId: newProgress.teamId
      };
      localStorage.setItem('wren-manor-player', JSON.stringify(playerData));

      setTimeout(() => {
        navigate('/puzzle5');
      }, 2000);
    } else {
      toast({
        title: "Incorrect Deduction",
        description: "Your logic doesn't align with all the clues. Review the evidence carefully.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    navigate("/puzzle5");
  };

  if (loading || !progress) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-manor flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
              Puzzle 4 of 9
            </Badge>
            <h1 className="text-4xl font-manor font-bold text-foreground">
              The Logic Chamber
            </h1>
            <p className="text-muted-foreground font-body">
              Use deductive reasoning to identify the killer and weapon
            </p>
          </div>

          {/* Main Logic Puzzle */}
          <ManorCard className="backdrop-blur-md">
            <ManorCardHeader>
              <ManorCardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                Logical Deduction
              </ManorCardTitle>
            </ManorCardHeader>
            <ManorCardContent className="space-y-6">
              {/* Clues Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-manor font-semibold text-foreground">Evidence & Clues:</h3>
                <div className="grid gap-3">
                  {clues.map((clue, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-secondary/20 border border-border rounded-lg"
                    >
                      <p className="text-foreground font-body">{index + 1}. {clue}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Deduction Interface */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Killer Selection */}
                <div className="space-y-3">
                  <h4 className="font-manor font-semibold text-foreground">Who is the killer?</h4>
                  <div className="space-y-2">
                    {suspects.map((suspect) => (
                      <motion.label
                        key={suspect}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                      >
                        <input
                          type="radio"
                          name="killer"
                          value={suspect}
                          checked={selectedKiller === suspect}
                          onChange={(e) => setSelectedKiller(e.target.value)}
                          className="w-4 h-4 text-primary"
                          disabled={solved}
                        />
                        <span className="text-foreground font-body">{suspect}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Weapon Selection */}
                <div className="space-y-3">
                  <h4 className="font-manor font-semibold text-foreground">What weapon was used?</h4>
                  <div className="space-y-2">
                    {weapons.map((weapon) => (
                      <motion.label
                        key={weapon}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                      >
                        <input
                          type="radio"
                          name="weapon"
                          value={weapon}
                          checked={selectedWeapon === weapon}
                          onChange={(e) => setSelectedWeapon(e.target.value)}
                          className="w-4 h-4 text-primary"
                          disabled={solved}
                        />
                        <span className="text-foreground font-body">{weapon}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hints Section */}
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg"
                >
                  <h4 className="font-manor font-semibold text-accent mb-3">Hints:</h4>
                  <div className="space-y-2">
                    {hints.map((hint, index) => (
                      <p key={index} className="text-accent-foreground font-body text-sm">
                        • {hint}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </ManorCardContent>
            <ManorCardFooter className="flex justify-between">
              <ManorButton
                variant="ghost"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? "Hide Hints" : "Show Hints"}
              </ManorButton>
              
              <div className="flex gap-3">
                <ManorButton
                  variant="outline"
                  onClick={handleSubmit}
                  disabled={!selectedKiller || !selectedWeapon || solved}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Submit Deduction
                </ManorButton>
                
                {solved && (
                  <ManorButton
                    variant="primary"
                    onClick={handleNext}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Continue
                  </ManorButton>
                )}
              </div>
            </ManorCardFooter>
          </ManorCard>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Puzzle4;