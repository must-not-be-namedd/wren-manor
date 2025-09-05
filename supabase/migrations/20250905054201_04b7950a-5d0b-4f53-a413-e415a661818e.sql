-- Enable real-time functionality for game tables
-- Set REPLICA IDENTITY FULL to ensure complete row data is captured during updates
ALTER TABLE public.game_progress REPLICA IDENTITY FULL;
ALTER TABLE public.leaderboard REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication to activate real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;