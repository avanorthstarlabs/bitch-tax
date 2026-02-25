-- Contributors table to track presale participants
CREATE TABLE IF NOT EXISTS contributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    sol_amount NUMERIC NOT NULL DEFAULT 0,
    token_allocation NUMERIC NOT NULL DEFAULT 0,
    distributed BOOLEAN NOT NULL DEFAULT false,
    distribution_tx TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contributors_wallet ON contributors(wallet_address);
CREATE INDEX IF NOT EXISTS idx_contributors_distributed ON contributors(distributed);
