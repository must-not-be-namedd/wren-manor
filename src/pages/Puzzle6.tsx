import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ManorCard, ManorCardHeader, ManorCardTitle, ManorCardContent, ManorCardFooter } from "@/components/ui/manor-card";
import { ManorButton } from "@/components/ui/manor-button";
import { toast } from "@/hooks/use-toast";
import { getGameProgress, saveGameProgress } from "@/lib/gameState";
import { Search, BookOpen, CheckCircle2, Lightbulb } from "lucide-react";

const Puzzle6 = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getGameProgress());
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [showRoom, setShowRoom] = useState<string>("");
  const [solved, setSolved] = useState(progress.p6);

  const rooms = {
    "Library": {
      description: "Dusty books line the walls. A leather journal lies open on the desk.",
      evidence: ["Torn Letter", "Bloody Bookmark", "Secret Map", "Old Key"]
    },
    "Kitchen": {
      description: "Pots and pans hang from hooks. A knife set has one missing blade.",
      evidence: ["Missing Knife", "Spilled Wine", "Chef's Apron", "Recipe Notes"]
    },
    "Garden": {
      description: "Overgrown hedges cast eerie shadows. Fresh soil suggests recent digging.",
      evidence: ["Muddy Footprints", "Garden Gloves", "Broken Shovel", "Wilted Flowers"]
    },
    "Study": {
      description: "Papers scattered everywhere. A safe stands open and empty.",
      evidence: ["Burned Documents", "Empty Safe", "Magnifying Glass", "Will Papers"]
    }
  };

  // Correct evidence: Items that directly connect to Marcel the Chef
  const correctEvidence = ["Missing Knife", "Chef's Apron", "Bloody Bookmark"];

  useEffect(() => {
    // Check if previous puzzles are completed
    if (!progress.p1 || !progress.p2 || !progress.p3 || !progress.p4 || !progress.p5) {
      navigate("/");
      return;
    }
  }, [progress, navigate]);

  const handleEvidenceToggle = (evidence: string) => {
    if (solved) return;
    
    setSelectedEvidence(prev => 
      prev.includes(evidence) 
        ? prev.filter(e => e !== evidence)
        : [...prev, evidence]
    );
  };

  const handleSubmit = () => {
    // Check if selected evidence matches the correct evidence
    const hasAllCorrect = correctEvidence.every(item => selectedEvidence.includes(item));
    const hasOnlyCorrect = selectedEvidence.every(item => correctEvidence.includes(item));
    const correctCount = selectedEvidence.length === correctEvidence.length;

    if (hasAllCorrect && hasOnlyCorrect && correctCount) {
      const newProgress = {
        ...progress,
        p6: true,
        currentPage: 6
      };
      
      setProgress(newProgress);
      saveGameProgress(newProgress);
      setSolved(true);
      
      toast({
        title: "Evidence Analyzed!",
        description: "You've identified the key evidence linking Marcel to the crime scene.",
        variant: "default"
      });
    } else {
      toast({
        title: "Incomplete Analysis",
        description: "Some evidence doesn't directly link to the killer. Review your selections.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    navigate("/puzzle7");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-manor flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-manor font-bold text-foreground">
              The Evidence Chamber
            </h1>
            <p className="text-muted-foreground font-body">
              Search each room and identify evidence that directly links to Marcel the Chef
            </p>
          </div>

          {/* Room Explorer */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(rooms).map(([roomName, roomData]) => (
              <motion.div
                key={roomName}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ManorButton
                  variant={showRoom === roomName ? "primary" : "secondary"}
                  className="w-full h-20 text-lg"
                  onClick={() => setShowRoom(showRoom === roomName ? "" : roomName)}
                >
                  <Search className="w-5 h-5 mr-2" />
                  {roomName}
                </ManorButton>
              </motion.div>
            ))}
          </div>

          {/* Room Details */}
          {showRoom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ManorCard className="backdrop-blur-md">
                <ManorCardHeader>
                  <ManorCardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    {showRoom} Investigation
                  </ManorCardTitle>
                </ManorCardHeader>
                <ManorCardContent className="space-y-4">
                  <p className="text-foreground font-body italic">
                    {rooms[showRoom as keyof typeof rooms].description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {rooms[showRoom as keyof typeof rooms].evidence.map((evidence) => (
                      <motion.div
                        key={evidence}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedEvidence.includes(evidence)
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-secondary/20 hover:bg-secondary/30'
                        }`}
                        onClick={() => handleEvidenceToggle(evidence)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedEvidence.includes(evidence)
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {selectedEvidence.includes(evidence) && (
                              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="text-foreground font-body">{evidence}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>
          )}

          {/* Evidence Analysis */}
          <ManorCard className="backdrop-blur-md">
            <ManorCardHeader>
              <ManorCardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary" />
                Evidence Analysis
              </ManorCardTitle>
            </ManorCardHeader>
            <ManorCardContent className="space-y-4">
              <p className="text-foreground font-body">
                Based on your investigation in the previous puzzles, select only the evidence that directly connects <strong>Marcel the Chef</strong> to the murder scene.
              </p>
              
              {selectedEvidence.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-manor font-semibold text-foreground">Selected Evidence:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvidence.map((evidence) => (
                      <span
                        key={evidence}
                        className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm"
                      >
                        {evidence}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {solved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <p className="text-primary font-body text-center">
                    <CheckCircle2 className="w-5 h-5 inline mr-2" />
                    Perfect analysis! The evidence clearly links Marcel to the crime through his kitchen access and the murder weapon.
                  </p>
                </motion.div>
              )}
            </ManorCardContent>
            <ManorCardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground font-body">
                Evidence selected: {selectedEvidence.length}
              </p>
              
              <div className="flex gap-3">
                <ManorButton
                  variant="outline"
                  onClick={handleSubmit}
                  disabled={selectedEvidence.length === 0 || solved}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Evidence
                </ManorButton>
                
                {solved && (
                  <ManorButton
                    variant="primary"
                    onClick={handleNext}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Final Challenge
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

export default Puzzle6;