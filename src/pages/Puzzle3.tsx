import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, ArrowRight, RotateCcw, UserCheck } from 'lucide-react';
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

interface Suspect {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface TimeSlot {
  time: string;
  location: string;
  assignedSuspect: Suspect | null;
}

const Puzzle3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const progress = getGameProgress();

  // Redirect if not authorized or previous puzzles incomplete
  useEffect(() => {
    if (!progress.playerName || !progress.teamId) {
      navigate('/');
      return;
    }
    if (!progress.p1 || !progress.p2) {
      navigate(progress.p1 ? '/puzzle2' : '/puzzle1');
      return;
    }
  }, [progress, navigate]);

  const suspects: Suspect[] = [
    { id: 'maid', name: 'Eleanor (Maid)', avatar: 'E', color: 'bg-blue-500' },
    { id: 'butler', name: 'Reginald (Butler)', avatar: 'R', color: 'bg-green-500' },
    { id: 'chef', name: 'Marcel (Chef)', avatar: 'M', color: 'bg-yellow-500' },
    { id: 'guest1', name: 'Victoria (Guest)', avatar: 'V', color: 'bg-purple-500' },
    { id: 'guest2', name: 'Harrison (Guest)', avatar: 'H', color: 'bg-red-500' }
  ];

  const initialTimeSlots: TimeSlot[] = [
    { time: '7:45 PM', location: 'Entrance Hall', assignedSuspect: null },
    { time: '8:00 PM', location: 'Library', assignedSuspect: null },
    { time: '8:15 PM', location: 'Garden', assignedSuspect: null },
    { time: '8:20 PM', location: 'Kitchen', assignedSuspect: null },
    { time: '8:30 PM', location: 'Parlor', assignedSuspect: null },
    { time: '8:45 PM', location: 'Study', assignedSuspect: null }
  ];

  // Correct solution: Maid at Library 8:00, Butler in Garden 8:15, Chef near Kitchen 8:20
  const correctPlacements = {
    'maid': '8:00 PM',
    'butler': '8:15 PM',
    'chef': '8:20 PM'
  };

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [draggedSuspect, setDraggedSuspect] = useState<Suspect | null>(null);
  const [clearedSuspects, setClearedSuspects] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleDragStart = (suspect: Suspect) => {
    setDraggedSuspect(suspect);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (!draggedSuspect) return;

    // Remove suspect from any existing slot
    const updatedSlots = timeSlots.map(slot => ({
      ...slot,
      assignedSuspect: slot.assignedSuspect?.id === draggedSuspect.id ? null : slot.assignedSuspect
    }));

    // Assign to new slot
    updatedSlots[slotIndex].assignedSuspect = draggedSuspect;
    
    setTimeSlots(updatedSlots);
    setDraggedSuspect(null);
  };

  const handleSuspectClick = (suspect: Suspect) => {
    // Find if suspect is already placed
    const currentSlotIndex = timeSlots.findIndex(slot => slot.assignedSuspect?.id === suspect.id);
    
    if (currentSlotIndex >= 0) {
      // Remove from current slot
      const updatedSlots = [...timeSlots];
      updatedSlots[currentSlotIndex].assignedSuspect = null;
      setTimeSlots(updatedSlots);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    // Remove suspect from slot if clicked
    if (timeSlots[slotIndex].assignedSuspect) {
      const updatedSlots = [...timeSlots];
      updatedSlots[slotIndex].assignedSuspect = null;
      setTimeSlots(updatedSlots);
    }
  };

  const resetPuzzle = () => {
    setTimeSlots(initialTimeSlots);
    setClearedSuspects([]);
  };

  const checkSolution = () => {
    setIsChecking(true);

    setTimeout(() => {
      // Check if the correct suspects are in the correct time slots
      const isCorrect = Object.entries(correctPlacements).every(([suspectId, time]) => {
        const slot = timeSlots.find(slot => slot.time === time);
        return slot?.assignedSuspect?.id === suspectId;
      });

      if (isCorrect) {
        const newProgress = {
          ...progress,
          p3: true,
          currentPage: 3,
          completionTime: Date.now() - progress.startTime
        };
        
        saveGameProgress(newProgress);
        setClearedSuspects(['maid', 'butler']);
        
        toast({
          title: "Alibis Verified!",
          description: "Eleanor and Reginald have been cleared. The remaining suspects await investigation.",
        });

        setTimeout(() => {
          navigate('/results');
        }, 3000);
      } else {
        toast({
          title: "Incorrect Placement",
          description: "The alibis don't match the witness statements. Review the clues and try again.",
          variant: "destructive",
        });
        setIsChecking(false);
      }
    }, 1000);
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  if (!progress.playerName || !progress.teamId || !progress.p1 || !progress.p2) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Puzzle Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            Puzzle 3 of 3
          </Badge>
          <h1 className="font-manor text-4xl font-bold text-foreground">
            Suspect Alibis
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            The murder occurred between 8:20 PM and 8:45 PM. Place each suspect at their 
            reported location and time to verify their alibis and identify potential innocents.
          </p>
        </motion.div>

        {progress.p3 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <ManorCard className="max-w-2xl mx-auto border-primary/20 shadow-blood">
              <ManorCardContent className="text-center p-8">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-blood" />
                <ManorCardTitle className="mb-4">Alibis Verified!</ManorCardTitle>
                <ManorCardDescription className="mb-6">
                  <strong className="text-primary">Eleanor (Maid)</strong> and{' '}
                  <strong className="text-primary">Reginald (Butler)</strong> have been{' '}
                  <span className="text-green-500 font-semibold">cleared</span> of suspicion. 
                  Their alibis place them away from the scene during the murder window.
                </ManorCardDescription>
                <ManorButton onClick={handleViewResults} size="lg">
                  View Investigation Results
                  <ArrowRight className="h-4 w-4 ml-2" />
                </ManorButton>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        ) : (
          <>
            {/* Clues Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <ManorCard className="bg-accent/5 border-accent/20">
                <ManorCardHeader>
                  <ManorCardTitle className="text-accent">Witness Statements</ManorCardTitle>
                  <ManorCardDescription>
                    Use these clues to place suspects at their reported locations and times
                  </ManorCardDescription>
                </ManorCardHeader>
                <ManorCardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="font-semibold text-foreground">📚 Library Sighting</p>
                      <p className="text-muted-foreground">Eleanor was seen organizing books at 8:00 PM</p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="font-semibold text-foreground">🌹 Garden Witness</p>
                      <p className="text-muted-foreground">Reginald was tending roses at 8:15 PM</p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="font-semibold text-foreground">🍽️ Kitchen Activity</p>
                      <p className="text-muted-foreground">Marcel was preparing dessert at 8:20 PM</p>
                    </div>
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>

            {/* Suspects Pool */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ManorCard>
                <ManorCardHeader>
                  <ManorCardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-accent" />
                    <span>Suspects</span>
                  </ManorCardTitle>
                  <ManorCardDescription>
                    Drag suspects to time slots or tap to place/remove
                  </ManorCardDescription>
                </ManorCardHeader>
                
                <ManorCardContent>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {suspects.map((suspect) => {
                      const isPlaced = timeSlots.some(slot => slot.assignedSuspect?.id === suspect.id);
                      const isCleared = clearedSuspects.includes(suspect.id);
                      
                      return (
                        <motion.div
                          key={suspect.id}
                          className={`flex items-center space-x-2 p-3 rounded-lg border cursor-move transition-manor ${
                            isCleared 
                              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                              : isPlaced 
                                ? 'bg-primary/20 border-primary/30' 
                                : 'bg-card/60 border-border hover:bg-card/80'
                          }`}
                          draggable={!isCleared}
                          onDragStart={() => !isCleared && handleDragStart(suspect)}
                          onClick={() => !isCleared && handleSuspectClick(suspect)}
                          whileHover={!isCleared ? { scale: 1.02 } : {}}
                          whileTap={!isCleared ? { scale: 0.98 } : {}}
                        >
                          <div className={`w-8 h-8 ${suspect.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {suspect.avatar}
                          </div>
                          <span className="text-sm font-medium">{suspect.name}</span>
                          {isCleared && <UserCheck className="h-4 w-4" />}
                        </motion.div>
                      );
                    })}
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>

            {/* Timeline Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ManorCard className="border-primary/20">
                <ManorCardHeader>
                  <ManorCardTitle>Timeline Placement</ManorCardTitle>
                  <ManorCardDescription>
                    Place suspects at their reported locations and times
                  </ManorCardDescription>
                </ManorCardHeader>
                
                <ManorCardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-4 border-2 border-dashed rounded-lg transition-manor ${
                          slot.time >= '8:20 PM' && slot.time <= '8:45 PM'
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-muted/30'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropToSlot(e, index)}
                        onClick={() => handleSlotClick(index)}
                      >
                        <div className="text-center space-y-2">
                          <div className="font-semibold text-primary">{slot.time}</div>
                          <div className="text-sm text-muted-foreground">{slot.location}</div>
                          
                          {slot.assignedSuspect ? (
                            <motion.div
                              className="flex items-center justify-center space-x-2 p-2 bg-card/60 rounded-lg cursor-pointer"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className={`w-6 h-6 ${slot.assignedSuspect.color} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                                {slot.assignedSuspect.avatar}
                              </div>
                              <span className="text-xs font-medium">{slot.assignedSuspect.name}</span>
                            </motion.div>
                          ) : (
                            <div className="p-2 text-xs text-muted-foreground border border-dashed border-muted/20 rounded">
                              Drop suspect here
                            </div>
                          )}
                          
                          {slot.time >= '8:20 PM' && slot.time <= '8:45 PM' && (
                            <div className="text-xs text-primary font-medium">Murder Window</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex justify-center space-x-4"
            >
              <ManorButton
                variant="secondary"
                onClick={resetPuzzle}
                disabled={isChecking}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Placement
              </ManorButton>
              
              <ManorButton
                onClick={checkSolution}
                disabled={isChecking}
                size="lg"
              >
                {isChecking ? 'Verifying Alibis...' : 'Verify Alibis'}
              </ManorButton>
            </motion.div>
          </>
        )}

        {/* Atmospheric Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-body italic">
            "Truth lies in the spaces between words, in the gaps of time unaccounted for..."
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Puzzle3;