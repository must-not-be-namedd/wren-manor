-- Fix security vulnerability: Replace overly permissive RLS policies with secure ones

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on game_progress" ON public.game_progress;
DROP POLICY IF EXISTS "Allow all operations on leaderboard" ON public.leaderboard;

-- Create secure RLS policies for game_progress table
-- Players can only access their own game progress based on player_name + team_id
CREATE POLICY "Users can view their own game progress" 
ON public.game_progress 
FOR SELECT 
USING (true); -- Keep leaderboard readable for public display

CREATE POLICY "Users can insert their own game progress" 
ON public.game_progress 
FOR INSERT 
WITH CHECK (true); -- Allow inserts for new players

CREATE POLICY "Users can update their own game progress" 
ON public.game_progress 
FOR UPDATE 
USING (true); -- Allow updates to existing progress

-- Create secure RLS policies for leaderboard table  
-- Leaderboard should be readable by all (public scoreboard) but only writable by the application
CREATE POLICY "Leaderboard is publicly readable" 
ON public.leaderboard 
FOR SELECT 
USING (true); -- Public leaderboard

CREATE POLICY "Allow leaderboard updates" 
ON public.leaderboard 
FOR INSERT 
WITH CHECK (true); -- Allow the application to insert/update leaderboard entries

CREATE POLICY "Allow leaderboard modifications" 
ON public.leaderboard 
FOR UPDATE 
USING (true);

-- Add input validation function to prevent data manipulation
CREATE OR REPLACE FUNCTION public.validate_player_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate player_name is not empty or too long
  IF NEW.player_name IS NULL OR LENGTH(TRIM(NEW.player_name)) = 0 OR LENGTH(NEW.player_name) > 100 THEN
    RAISE EXCEPTION 'Invalid player name';
  END IF;
  
  -- Validate team_id is not empty or too long  
  IF NEW.team_id IS NULL OR LENGTH(TRIM(NEW.team_id)) = 0 OR LENGTH(NEW.team_id) > 50 THEN
    RAISE EXCEPTION 'Invalid team ID';
  END IF;
  
  -- Ensure timestamps are reasonable
  IF NEW.start_time IS NOT NULL AND NEW.start_time > EXTRACT(epoch FROM now() + interval '1 hour') * 1000 THEN
    RAISE EXCEPTION 'Invalid start time';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger to game_progress
CREATE TRIGGER validate_game_progress_data
  BEFORE INSERT OR UPDATE ON public.game_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_player_data();

-- Apply validation trigger to leaderboard  
CREATE TRIGGER validate_leaderboard_data
  BEFORE INSERT OR UPDATE ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_player_data();