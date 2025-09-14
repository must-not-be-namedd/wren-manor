-- Create game_progress table to store individual player progress
CREATE TABLE public.game_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    team_id TEXT NOT NULL,
    p1 BOOLEAN NOT NULL DEFAULT false,
    p2 BOOLEAN NOT NULL DEFAULT false,
    p3 BOOLEAN NOT NULL DEFAULT false,
    p4 BOOLEAN NOT NULL DEFAULT false,
    p5 BOOLEAN NOT NULL DEFAULT false,
    p6 BOOLEAN NOT NULL DEFAULT false,
    p7 BOOLEAN NOT NULL DEFAULT false,
    p8 BOOLEAN NOT NULL DEFAULT false,
    p9 BOOLEAN NOT NULL DEFAULT false,
    weapon TEXT DEFAULT '',
    killer TEXT DEFAULT '',
    current_page INTEGER NOT NULL DEFAULT 0,
    start_time BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
    completion_time BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(player_name, team_id)
);

-- Create leaderboard table for rankings
CREATE TABLE public.leaderboard (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    team_id TEXT NOT NULL,
    completion_time BIGINT NOT NULL DEFAULT 0,
    current_progress INTEGER NOT NULL DEFAULT 0,
    timestamp BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(player_name, team_id)
);

-- Enable Row Level Security
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public game)
CREATE POLICY "Allow all operations on game_progress" 
ON public.game_progress 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on leaderboard" 
ON public.leaderboard 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_game_progress_updated_at
    BEFORE UPDATE ON public.game_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_game_progress_player_team ON public.game_progress(player_name, team_id);
CREATE INDEX idx_leaderboard_player_team ON public.leaderboard(player_name, team_id);
CREATE INDEX idx_leaderboard_progress_time ON public.leaderboard(current_progress DESC, completion_time ASC);