import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ManorCard, ManorCardHeader, ManorCardTitle, ManorCardContent, ManorCardFooter } from "@/components/ui/manor-card";
import { ManorButton } from "@/components/ui/manor-button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getGameProgress, saveGameProgress } from "@/lib/gameState";
import { Key, Eye, CheckCircle2 } from "lucide-react";

const Puzzle5 = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getGameProgress());
  const [cipherAnswer, setCipherAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [solved, setSolved] = useState(progress.p5);

  // Caesar cipher with shift of 3: HIDDEN MESSAGE -> KLGGHQ PHVVDJH
  const encryptedMessage = "KLGGHQ PHVVDJH: WKH YLOODLQ KLGHV LQ WKH OLEUDUP";
  const correctAnswer = "HIDDEN MESSAGE: THE VILLAIN HIDES IN THE LIBRARY";

  const hints = [
    "This is a Caesar cipher - each letter is shifted by the same amount.",
    "Try shifting each letter back by 3 positions in the alphabet.",
    "A becomes X, B becomes Y, C becomes Z, D becomes A, etc.",
    "The message reveals where important evidence is hidden."
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    // Check if previous puzzles are completed
    if (!progress.p1 || !progress.p2 || !progress.p3 || !progress.p4) {
      navigate("/");
      return;
    }
  }, [progress, navigate]);

  const handleSubmit = () => {
    if (cipherAnswer.toUpperCase().trim() === correctAnswer) {
      const newProgress = {
        ...progress,
        p5: true,
        currentPage: 5
      };
      
      setProgress(newProgress);
      saveGameProgress(newProgress);
      setSolved(true);
      
      toast({
        title: "Cipher Cracked!",
        description: "The hidden message reveals the villain's secret hideout in the library.",
        variant: "default"
      });
    } else {
      toast({
        title: "Incorrect Decryption",
        description: "The cipher remains unbroken. Check your decryption method.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    navigate("/puzzle6");
  };

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
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-manor font-bold text-foreground">
              The Cipher Vault
            </h1>
            <p className="text-muted-foreground font-body">
              Decode the secret message left by the killer
            </p>
          </div>

          {/* Main Cipher Puzzle */}
          <ManorCard className="backdrop-blur-md">
            <ManorCardHeader>
              <ManorCardTitle className="flex items-center gap-2">
                <Key className="w-6 h-6 text-primary" />
                Encrypted Message
              </ManorCardTitle>
            </ManorCardHeader>
            <ManorCardContent className="space-y-6">
              {/* Encrypted Message Display */}
              <div className="space-y-4">
                <h3 className="text-lg font-manor font-semibold text-foreground">Intercepted Message:</h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-secondary/30 border border-primary/20 rounded-lg text-center"
                >
                  <p className="text-2xl font-mono text-primary tracking-widest">
                    {encryptedMessage}
                  </p>
                </motion.div>
                <p className="text-sm text-muted-foreground text-center font-body">
                  This message was found hidden in the killer's belongings. What secrets does it hold?
                </p>
              </div>

              {/* Cipher Reference */}
              <div className="space-y-3">
                <h4 className="font-manor font-semibold text-foreground">Reference Alphabet:</h4>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-center font-mono text-accent tracking-wider">
                    {alphabet}
                  </p>
                </div>
              </div>

              {/* Decryption Input */}
              <div className="space-y-4">
                <h4 className="font-manor font-semibold text-foreground">Your Decryption:</h4>
                <Input
                  value={cipherAnswer}
                  onChange={(e) => setCipherAnswer(e.target.value)}
                  placeholder="Enter the decrypted message here..."
                  className="text-lg font-mono bg-background/50"
                  disabled={solved}
                />
              </div>

              {/* Hints Section */}
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg"
                >
                  <h4 className="font-manor font-semibold text-accent mb-3">Decryption Hints:</h4>
                  <div className="space-y-2">
                    {hints.map((hint, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-accent-foreground font-body text-sm"
                      >
                        • {hint}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {solved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <p className="text-primary font-body text-center">
                    <Eye className="w-5 h-5 inline mr-2" />
                    The villain's secret is revealed! The library holds crucial evidence.
                  </p>
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
                  disabled={!cipherAnswer.trim() || solved}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Decrypt Message
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

export default Puzzle5;