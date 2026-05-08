-- Migration: 20240507000000_ai_config.sql
-- Create ai_config table to store provider settings and keys

CREATE TABLE IF NOT EXISTS ai_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL CHECK (provider IN ('gemini', 'openai', 'claude')),
    model_name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    token_limit INTEGER DEFAULT 2048,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;

-- Only admins can see/modify AI config
CREATE POLICY "Admins can manage AI config" 
ON ai_config 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Function to set only one config active per provider if needed, 
-- but for now let's just allow one active config globally.
