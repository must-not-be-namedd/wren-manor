import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ManorCard, ManorCardContent, ManorCardDescription, ManorCardHeader, ManorCardTitle } from '@/components/ui/manor-card';
import { ManorButton } from '@/components/ui/manor-button';
import { Badge } from '@/components/ui/badge';
import { Clock, GripVertical, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { getGameProgress, saveGameProgress } from '@/lib/gameState';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: number;
  text: string;
  time: string;
}

const Puzzle2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        
        // Check if previous puzzle is incomplete
        if (!gameProgress.p1) {
          console.log('Previous puzzle incomplete, redirecting...');
          navigate('/puzzle-1');
          return;
        }

        // If puzzle already completed, redirect to next
        if (gameProgress.p2 && gameProgress.currentPage > 1) {
          console.log('Puzzle 2 already completed, redirecting to next puzzle...');
          navigate('/puzzle-3');
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

  const correctEvents: Event[] = [
    { id: 1, text: "Lady Wren hosts the evening gathering", time: "" },
    { id: 2, text: "Mysterious guest arrives at the manor", time: "" },
    { id: 3, text: "Lights flicker during dinner service", time: "" },
    { id: 4, text: "Loud crash heard from the library", time: "" },
    { id: 5, text: "Complete blackout engulfs the manor", time: "" }
  ];

  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<Event[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Shuffle events on component mount
  useEffect(() => {
    const shuffled = [...correctEvents].sort(() => Math.random() - 0.5);
    setAvailableEvents(shuffled);
  }, []);

  const handleDragStart = (event: Event) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToTimeline = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedEvent) return;

    // Remove from available events
    setAvailableEvents(prev => prev.filter(evt => evt.id !== draggedEvent.id));
    
    // Add to timeline at specific position
    setTimelineEvents(prev => {
      const newTimeline = [...prev];
      newTimeline.splice(index, 0, draggedEvent);
      return newTimeline;
    });
    
    setDraggedEvent(null);
  };

  const handleDropToPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedEvent) return;

    // Remove from timeline
    setTimelineEvents(prev => prev.filter(evt => evt.id !== draggedEvent.id));
    
    // Add back to available events
    setAvailableEvents(prev => [...prev, draggedEvent]);
    
    setDraggedEvent(null);
  };

  const handleEventClick = (event: Event, isFromTimeline: boolean) => {
    if (isFromTimeline) {
      // Move from timeline back to pool
      setTimelineEvents(prev => prev.filter(evt => evt.id !== event.id));
      setAvailableEvents(prev => [...prev, event]);
    } else {
      // Move from pool to end of timeline
      setAvailableEvents(prev => prev.filter(evt => evt.id !== event.id));
      setTimelineEvents(prev => [...prev, event]);
    }
  };

  const resetPuzzle = () => {
    const shuffled = [...correctEvents].sort(() => Math.random() - 0.5);
    setAvailableEvents(shuffled);
    setTimelineEvents([]);
  };

  const checkSolution = async () => {
    if (timelineEvents.length !== correctEvents.length) {
      toast({
        title: "Incomplete Timeline",
        description: "Please arrange all events in the timeline before checking.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    setTimeout(async () => {
      const isCorrect = timelineEvents.every((event, index) => 
        event.id === correctEvents[index].id
      );

      if (isCorrect) {
        const newProgress = {
          ...progress,
          p2: true,
          currentPage: 2,
        };
        
        await saveGameProgress(newProgress);
        setProgress(newProgress);
        
        toast({
          title: "📅 Timeline Reconstructed!",
          description: "Murder occurred between the crash and the blackout. Proceeding to alibi investigation...",
          duration: 3000,
        });
        
        // Ensure localStorage is updated before navigation
        const playerData = {
          playerName: newProgress.playerName,
          teamId: newProgress.teamId
        };
        localStorage.setItem('wren-manor-player', JSON.stringify(playerData));
        
        setTimeout(() => {
          navigate('/puzzle-3');
        }, 2000);
      } else {
        toast({
          title: "Incorrect Timeline",
          description: "The events are not in the correct chronological order. Review the clues and try again.",
          variant: "destructive",
        });
        setIsChecking(false);
      }
    }, 1000);
  };

  const handleNextPuzzle = () => {
    navigate('/puzzle-3');
  };

  if (loading || !progress) {
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
            Puzzle 2 of 9
          </Badge>
          <h1 className="font-manor text-4xl font-bold text-foreground">
            Reconstruct the Timeline
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            The night of the murder was filled with chaos and confusion. Arrange the events 
            in chronological order to narrow down the window of the crime.
          </p>
        </motion.div>

        {progress.p2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <ManorCard className="max-w-2xl mx-auto border-primary/20 shadow-blood">
              <ManorCardContent className="text-center p-8">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-blood" />
                <ManorCardTitle className="mb-4">Timeline Reconstructed!</ManorCardTitle>
                <ManorCardDescription className="mb-6">
                  <strong className="text-primary">Clue Revealed:</strong> The murder occurred between 
                  the loud crash from the library (8:20 PM) and the complete blackout (8:45 PM).
                </ManorCardDescription>
                <ManorButton onClick={handleNextPuzzle} size="lg">
                  Investigate Suspect Alibis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </ManorButton>
              </ManorCardContent>
            </ManorCard>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Events Pool */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ManorCard>
                <ManorCardHeader>
                  <ManorCardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-accent" />
                    <span>Events Pool</span>
                  </ManorCardTitle>
                  <ManorCardDescription>
                    Drag events to the timeline or tap to move them
                  </ManorCardDescription>
                </ManorCardHeader>
                
                <ManorCardContent>
                  <div
                    className="space-y-3 min-h-[400px] p-4 border-2 border-dashed border-muted/30 rounded-lg"
                    onDragOver={handleDragOver}
                    onDrop={handleDropToPool}
                  >
                    {availableEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        className="p-4 bg-card/60 border border-border rounded-lg cursor-move hover:bg-card/80 transition-manor"
                        draggable
                        onDragStart={() => handleDragStart(event)}
                        onClick={() => handleEventClick(event, false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{event.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ManorCard className="border-primary/20">
                <ManorCardHeader>
                  <ManorCardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <span>Timeline (Chronological Order)</span>
                  </ManorCardTitle>
                  <ManorCardDescription>
                    Arrange events from earliest to latest
                  </ManorCardDescription>
                </ManorCardHeader>
                
                <ManorCardContent>
                  <div className="space-y-2 min-h-[400px]">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className="relative"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropToTimeline(e, index)}
                      >
                        {timelineEvents[index] ? (
                          <motion.div
                            className="p-4 bg-primary/10 border border-primary/30 rounded-lg cursor-move hover:bg-primary/20 transition-manor"
                            draggable
                            onDragStart={() => handleDragStart(timelineEvents[index])}
                            onClick={() => handleEventClick(timelineEvents[index], true)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {timelineEvents[index].text}
                                </p>
                              </div>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </motion.div>
                        ) : (
                          <div className="p-4 border-2 border-dashed border-muted/30 rounded-lg text-center text-muted-foreground">
                            <div className="w-8 h-8 bg-muted/20 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                              {index + 1}
                            </div>
                            <p className="text-sm">Drop event here</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>
          </div>
        )}

        {!progress.p2 && (
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
              Reset Timeline
            </ManorButton>
            
            <ManorButton
              onClick={checkSolution}
              disabled={isChecking || timelineEvents.length !== correctEvents.length}
              size="lg"
            >
              {isChecking ? 'Analyzing Timeline...' : 'Check Timeline'}
            </ManorButton>
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
            "The shadows whisper secrets, but only the keen-eyed detective can hear their truths..."
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Puzzle2;