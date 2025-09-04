import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ManorCard, ManorCardHeader, ManorCardTitle, ManorCardContent, ManorCardFooter } from "@/components/ui/manor-card";
import { ManorButton } from "@/components/ui/manor-button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getGameProgress, saveGameProgress } from "@/lib/gameState";
import { Scale, Crown, CheckCircle2, Scroll } from "lucide-react";

const Puzzle7 = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getGameProgress());
  const [finalDeduction, setFinalDeduction] = useState("");
  const [selectedMotive, setSelectedMotive] = useState("");
  const [solved, setSolved] = useState(progress.p7);

  const motives = [
    "Financial Gain - Chef needed money for gambling debts",
    "Revenge - Lady Wren discovered Marcel's theft from the kitchen budget", 
    "Jealousy - Marcel was envious of Lady Wren's wealth and status",
    "Blackmail - Lady Wren threatened to expose Marcel's criminal past",
    "Accident - Marcel never intended to kill, it happened during an argument"
  ];

  const correctMotive = "Revenge - Lady Wren discovered Marcel's theft from the kitchen budget";
  
  const evidenceSummary = [
    "Weapon: Dagger (from kitchen knife set)",
    "Timeline: Murder occurred between the crash and blackout (8:15-8:30 PM)",
    "Alibis: Marcel had access to kitchen during the murder window",
    "Logic: Chef with kitchen access used sharp weapon",
    "Secret: Hidden message revealed villain hides evidence in library",
    "Evidence: Missing knife, chef's apron, and bloody bookmark connect Marcel to the scene"
  ];

  useEffect(() => {
    // Check if all previous puzzles are completed
    if (!progress.p1 || !progress.p2 || !progress.p3 || !progress.p4 || !progress.p5 || !progress.p6) {
      navigate("/");
      return;
    }
  }, [progress, navigate]);

  const handleSubmit = () => {
    // Check if correct motive is selected and deduction mentions key elements
    const deductionLower = finalDeduction.toLowerCase();
    const hasKeyElements = [
      "marcel",
      "chef", 
      "dagger",
      "kitchen"
    ].every(element => deductionLower.includes(element));

    if (selectedMotive === correctMotive && hasKeyElements && finalDeduction.length > 100) {
      const newProgress = {
        ...progress,
        p7: true,
        currentPage: 7,
        completionTime: Date.now() - progress.startTime
      };
      
      setProgress(newProgress);
      saveGameProgress(newProgress);
      setSolved(true);
      
      toast({
        title: "Case Solved!",
        description: "You've successfully solved the murder mystery of Wren Manor!",
        variant: "default"
      });
    } else {
      let message = "Your deduction needs refinement. ";
      if (selectedMotive !== correctMotive) {
        message += "Reconsider the motive. ";
      }
      if (!hasKeyElements || finalDeduction.length < 100) {
        message += "Include more details about Marcel, the weapon, and the evidence.";
      }
      
      toast({
        title: "Incomplete Deduction",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleFinish = () => {
    navigate("/results");
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
              The Final Verdict
            </h1>
            <p className="text-muted-foreground font-body">
              Present your complete solution to the murder at Wren Manor
            </p>
          </div>

          {/* Evidence Summary */}
          <ManorCard className="backdrop-blur-md">
            <ManorCardHeader>
              <ManorCardTitle className="flex items-center gap-2">
                <Scroll className="w-6 h-6 text-primary" />
                Evidence Summary
              </ManorCardTitle>
            </ManorCardHeader>
            <ManorCardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {evidenceSummary.map((evidence, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-secondary/20 border border-border rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-body text-sm">{evidence}</span>
                  </motion.div>
                ))}
              </div>
            </ManorCardContent>
          </ManorCard>

          {/* Final Deduction */}
          <ManorCard className="backdrop-blur-md">
            <ManorCardHeader>
              <ManorCardTitle className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-primary" />
                Your Final Deduction
              </ManorCardTitle>
            </ManorCardHeader>
            <ManorCardContent className="space-y-6">
              {/* Motive Selection */}
              <div className="space-y-3">
                <h4 className="font-manor font-semibold text-foreground">What was Marcel's motive?</h4>
                <div className="space-y-2">
                  {motives.map((motive) => (
                    <motion.label
                      key={motive}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                    >
                      <input
                        type="radio"
                        name="motive"
                        value={motive}
                        checked={selectedMotive === motive}
                        onChange={(e) => setSelectedMotive(e.target.value)}
                        className="w-4 h-4 text-primary mt-1"
                        disabled={solved}
                      />
                      <span className="text-foreground font-body text-sm">{motive}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Detailed Deduction */}
              <div className="space-y-3">
                <h4 className="font-manor font-semibold text-foreground">
                  Write your complete solution (minimum 100 characters):
                </h4>
                <Textarea
                  value={finalDeduction}
                  onChange={(e) => setFinalDeduction(e.target.value)}
                  placeholder="Explain how Marcel committed the murder, using what weapon, when, and why. Connect all the evidence you've discovered..."
                  className="min-h-32 bg-background/50 font-body"
                  disabled={solved}
                />
                <p className="text-xs text-muted-foreground">
                  Characters: {finalDeduction.length}/100 minimum
                </p>
              </div>

              {/* Success Message */}
              {solved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-candlelight border border-primary/30 rounded-lg text-center"
                >
                  <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-manor font-bold text-foreground mb-2">
                    Congratulations, Detective!
                  </h3>
                  <p className="text-foreground font-body">
                    You have successfully solved the murder mystery of Wren Manor. Marcel the Chef killed Lady Wren 
                    in a fit of rage after she discovered his theft from the kitchen budget. He used his own dagger 
                    from the kitchen knife set during the chaos of the evening's events.
                  </p>
                </motion.div>
              )}
            </ManorCardContent>
            <ManorCardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground font-body">
                {solved ? "Case Closed!" : "Present your final solution"}
              </div>
              
              <div className="flex gap-3">
                {!solved && (
                  <ManorButton
                    variant="outline"
                    onClick={handleSubmit}
                    disabled={!selectedMotive || finalDeduction.length < 100}
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Submit Solution
                  </ManorButton>
                )}
                
                {solved && (
                  <ManorButton
                    variant="candlelight"
                    onClick={handleFinish}
                    className="text-lg px-8"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    View Results
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

export default Puzzle7;