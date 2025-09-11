-- Fix security warnings from linter

-- Fix search_path issue for the validation function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Now implement proper RLS policies that actually provide security
-- Since this is a non-authenticated game, we need a different approach

-- Drop the current permissive policies
DROP POLICY IF EXISTS "Users can view their own game progress" ON public.game_progress;
DROP POLICY IF EXISTS "Users can insert their own game progress" ON public.game_progress;
DROP POLICY IF EXISTS "Users can update their own game progress" ON public.game_progress;
DROP POLICY IF EXISTS "Leaderboard is publicly readable" ON public.leaderboard;
DROP POLICY IF EXISTS "Allow leaderboard updates" ON public.leaderboard;
DROP POLICY IF EXISTS "Allow leaderboard modifications" ON public.leaderboard;

-- Create a session-based access control using current_setting
-- This allows the application to set a session variable for the current player

-- Game progress policies: Users can only see their own data
CREATE POLICY "Users can view own game progress" 
ON public.game_progress 
FOR SELECT 
USING (
  player_name = current_setting('app.current_player', true) AND 
  team_id = current_setting('app.current_team', true)
);

CREATE POLICY "Users can insert own game progress" 
ON public.game_progress 
FOR INSERT 
WITH CHECK (
  player_name = current_setting('app.current_player', true) AND 
  team_id = current_setting('app.current_team', true)
);

CREATE POLICY "Users can update own game progress" 
ON public.game_progress 
FOR UPDATE 
USING (
  player_name = current_setting('app.current_player', true) AND 
  team_id = current_setting('app.current_team', true)
);

-- Leaderboard policies: Read-only access for all, controlled writes
CREATE POLICY "Public leaderboard read access" 
ON public.leaderboard 
FOR SELECT 
USING (true);

CREATE POLICY "Controlled leaderboard writes" 
ON public.leaderboard 
FOR INSERT 
WITH CHECK (
  player_name = current_setting('app.current_player', true) AND 
  team_id = current_setting('app.current_team', true)
);

CREATE POLICY "Controlled leaderboard updates" 
ON public.leaderboard 
FOR UPDATE 
USING (
  player_name = current_setting('app.current_player', true) AND 
  team_id = current_setting('app.current_team', true)
);