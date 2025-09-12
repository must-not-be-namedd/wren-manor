import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ManorCard, ManorCardHeader, ManorCardTitle, ManorCardContent, ManorCardFooter } from "@/components/ui/manor-card";
import { ManorButton } from "@/components/ui/manor-button";
import { PhoneKeypad } from "@/components/ui/phone-keypad";
import { toast } from "@/hooks/use-toast";
import { getGameProgress, saveGameProgress } from "@/lib/gameState";
import { Code, Bug, CheckCircle2, Phone } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Puzzle4 = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userCode, setUserCode] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [debugResult, setDebugResult] = useState("");

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
          if (!gameProgress.p1) navigate('/puzzle-1');
          else if (!gameProgress.p2) navigate('/puzzle-2');
          else navigate('/puzzle-3');
          return;
        }

        // If puzzle already completed, redirect to next
        if (gameProgress.p4 && gameProgress.currentPage > 3) {
          console.log('Puzzle 4 already completed, redirecting to next puzzle...');
          navigate('/puzzle-5');
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

  // The buggy Python code that needs debugging
  const buggyCode = `def find_murder_weapon():
    weapons = ["dagger", "rope", "candlestick", "poison", "blunt_object"]
    clues = [1, 2, 3, 4, 5]
    
    # The butler's testimony points to a specific weapon
    butler_clue = clues[0] + clues[1]  # Should be 3
    
    # The maid's observation narrows it down
    maid_clue = butler_clue * 2  # Should be 6
    
    # The chef's alibi reveals the final piece
    chef_clue = maid_clue - 1  # Should be 5
    
    # Calculate the weapon index
    weapon_index = chef_clue % len(weapons)  # Should be 0 (dagger)
    
    # Get the weapon name
    weapon = weapons[weapon_index]
    
    # Convert to PIN (first 4 letters as numbers)
    pin = ""
    for char in weapon[:4]:
        pin += str(ord(char) - ord('a') + 1)
    
    return pin

# Debug this function to find the 4-digit PIN
result = find_murder_weapon()
print(f"The PIN is: {result}")`;

  const hints = [
    "Look for off-by-one errors in array indexing",
    "Check if the modulo operation is working correctly",
    "Verify the character-to-number conversion",
    "The PIN should be 4 digits representing the weapon name"
  ];

  const correctPIN = "4107"; // D-A-G-G = 4-1-7-7, but we need 4 digits so 4107

  const handleCodeSubmit = () => {
    if (!userCode.trim()) {
      toast({
        title: "Enter Your Code",
        description: "Please debug the Python code and enter your corrected version.",
        variant: "destructive"
      });
      return;
    }

    // Simulate running the corrected code
    try {
      // Check if the code looks like it would produce the correct PIN
      if (userCode.includes("4107") || userCode.includes("dagger") || userCode.includes("weapon_index = 0")) {
        setDebugResult("Code debugging successful! The PIN is: 4107");
        setShowKeypad(true);
        toast({
          title: "🐍 Code Debugged!",
          description: "You found the bug! Now enter the PIN on the keypad.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Incorrect Debug",
          description: "The code still has bugs. Look more carefully at the array indexing and modulo operation.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "Please check your Python syntax and try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeypadComplete = async (pin: string) => {
    if (pin === correctPIN) {
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
        title: "🔓 PIN Correct!",
        description: "You've unlocked the chef's secret! Proceeding to contradiction analysis...",
        duration: 3000,
      });

      // Ensure localStorage is updated before navigation
      const playerData = {
        playerName: newProgress.playerName,
        teamId: newProgress.teamId
      };
      localStorage.setItem('wren-manor-player', JSON.stringify(playerData));

      setTimeout(() => {
        navigate('/puzzle-5');
      }, 2000);
    } else {
      toast({
        title: "Incorrect PIN",
        description: "That's not the right PIN. Check your debugging work.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    navigate("/puzzle-5");
  };

  if (loading || !progress) {
    return null;
  }

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
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            Puzzle 4 of 9
          </Badge>
          <h1 className="font-manor text-4xl font-bold text-foreground">
            The Chef's Secret Code
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            The chef left behind a buggy Python script that reveals a 4-digit PIN. 
            Debug the code to find the secret number that unlocks his phone.
          </p>
        </motion.div>

        {!showKeypad ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ManorCard className="border-primary/20 shadow-blood">
              <ManorCardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Code className="h-12 w-12 text-primary animate-pulse-blood" />
                </div>
                <ManorCardTitle>Debug the Python Code</ManorCardTitle>
                <p className="text-muted-foreground">
                  Find and fix the bugs in this Python script to reveal the 4-digit PIN
                </p>
              </ManorCardHeader>
              
              <ManorCardContent className="space-y-6">
                {/* Buggy Code Display */}
                <div className="space-y-3">
                  <Label className="text-foreground font-manor text-lg">
                    Buggy Python Code:
                  </Label>
                  <div className="bg-muted/20 border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap text-foreground">{buggyCode}</pre>
                  </div>
                </div>

                {/* User Code Input */}
                <div className="space-y-3">
                  <Label htmlFor="userCode" className="font-manor">
                    Your Corrected Code:
                  </Label>
                  <Textarea
                    id="userCode"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Enter your corrected Python code here..."
                    className="min-h-32 font-mono text-sm bg-input/50 border-border focus:border-primary"
                    disabled={solved}
                  />
                </div>

                {/* Debug Result */}
                {debugResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-primary/10 border border-primary/30 rounded-lg"
                  >
                    <p className="text-primary font-semibold">{debugResult}</p>
                  </motion.div>
                )}

                {/* Hints Section */}
                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-accent/10 border border-accent/20 rounded-lg"
                  >
                    <h4 className="font-manor font-semibold text-accent mb-3">Debugging Hints:</h4>
                    <div className="space-y-2">
                      {hints.map((hint, index) => (
                        <p key={index} className="text-accent-foreground font-body text-sm">
                          • {hint}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  {solved ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-center space-x-2 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">
                          Code Debugged Successfully!
                        </span>
                      </div>
                      <ManorButton onClick={handleNext} size="lg" className="w-full">
                        Continue to Next Puzzle
                      </ManorButton>
                    </motion.div>
                  ) : (
                    <div className="flex justify-between">
                      <ManorButton
                        variant="ghost"
                        onClick={() => setShowHints(!showHints)}
                      >
                        {showHints ? "Hide Hints" : "Show Hints"}
                      </ManorButton>
                      
                      <ManorButton
                        onClick={handleCodeSubmit}
                        disabled={!userCode.trim()}
                        size="lg"
                      >
                        <Bug className="w-4 h-4 mr-2" />
                        Debug Code
                      </ManorButton>
                    </div>
                  )}
                </div>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <PhoneKeypad
              onComplete={handleKeypadComplete}
              title="Enter the 4-Digit PIN"
              description="Use the keypad to enter the PIN you discovered"
            />
          </motion.div>
        )}

        {/* Atmospheric Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-detective italic">
            "The chef's phone holds the key to his alibi, but only the correct code will unlock its secrets..."
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Puzzle4;